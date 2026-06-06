import asyncio
import hashlib
import logging
import os

from dotenv import load_dotenv
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert

from app.core.database import SessionLocal
from app.models.site import Site
from app.models.water_quality_sample import WaterQualitySample
from app.services.sheet_service import get_sheet_data

load_dotenv()

logger = logging.getLogger(__name__)

def _sheet_url() -> str:
    spreadsheet_id = os.getenv("SPREADSHEET_ID")
    sheet_gid = os.getenv("SHEET_GID")
    return (
        f"https://docs.google.com/spreadsheets/d/"
        f"{spreadsheet_id}/export?format=csv&gid={sheet_gid}"
    )


async def upsert_sites(db, rows: list[dict]) -> dict[str, int]:
    unique_sites: dict[str, dict] = {}
    for row in rows:
        name = row["name"]
        if name not in unique_sites:
            unique_sites[name] = {
                "latitude": row["latitude"],
                "longitude": row["longitude"],
            }

    site_map: dict[str, int] = {}

    for name, coords in unique_sites.items():
        result = await db.execute(select(Site).filter(Site.name == name))
        site = result.scalar_one_or_none()

        if site is None:
            site = Site(
                name=name,
                latitude=coords["latitude"],
                longitude=coords["longitude"],
                is_active=True,
            )
            db.add(site)
            await db.flush()
            logger.info(f"Created new site: {name}")

        site_map[name] = site.id

    return site_map


def build_source_hash(site_id: int, sample_date, enterococci: int, quality_code: str) -> str:
    raw = f"{site_id}|{sample_date}|{enterococci}|{quality_code}"
    return hashlib.sha256(raw.encode()).hexdigest()


async def insert_samples(db, rows: list[dict], site_map: dict[str, int]) -> int:
    records = []
    for row in rows:
        site_id = site_map.get(row["name"])
        if site_id is None:
            logger.warning(f"Site not found for {row['name']}")
            continue

        raw_count = row["enterococci_per_100ml"]
        if str(raw_count).strip() in ("-", "", "N/A", "n/a", "nan"):
            logger.warning(f"Skipping row for {row['name']} on {row['sample_date']} — no enterococci value")
            continue

        records.append({
            "site_id": site_id,
            "sample_date": row["sample_date"],
            "enterococci_per_100ml": int(row["enterococci_per_100ml"]),
            "quality_code": row["quality_code"],
            "source_hash": build_source_hash(site_id, row["sample_date"], int(row["enterococci_per_100ml"]), row["quality_code"]),
        })

    if not records:
        logger.info("No new samples to insert.")
        return 0

    # Deduplicate by (site_id, sample_date) — keep last occurrence in case the
    # sheet has repeated rows for the same site/date
    seen: dict[tuple, dict] = {}
    for record in records:
        key = (record["site_id"], record["sample_date"])
        seen[key] = record
    records = list(seen.values())
    logger.info(f"After deduplication: {len(records)} unique records to process.")

    BATCH_SIZE = 500
    total_inserted = 0

    for i in range(0, len(records), BATCH_SIZE):
        batch = records[i : i + BATCH_SIZE]
        stmt = (
            insert(WaterQualitySample)
            .values(batch)
            .on_conflict_do_update(
                index_elements=["site_id", "sample_date"],
                set_={
                    "enterococci_per_100ml": insert(WaterQualitySample).excluded.enterococci_per_100ml,
                    "quality_code": insert(WaterQualitySample).excluded.quality_code,
                    "source_hash": insert(WaterQualitySample).excluded.source_hash,
                },
                where=WaterQualitySample.source_hash != insert(WaterQualitySample).excluded.source_hash,
            )
        )
        result = await db.execute(stmt)
        total_inserted += result.rowcount
        logger.info(f"Inserted batch {i // BATCH_SIZE + 1}: {result.rowcount} rows")

    return total_inserted


async def run_sync():
    logger.info("Starting water quality sample sync...")
    async with SessionLocal() as db:
        try:
            rows = await asyncio.to_thread(get_sheet_data, _sheet_url())
            logger.info(f"Fetched {len(rows)} rows from spreadsheet.")

            site_map = await upsert_sites(db, rows)
            inserted = await insert_samples(db, rows, site_map)

            await db.commit()
            logger.info(f"Sync completed. {inserted} new samples inserted. Skipped {len(rows) - inserted} duplicates.")

        except Exception:
            await db.rollback()
            logger.exception("Error during sample sync")
            raise
