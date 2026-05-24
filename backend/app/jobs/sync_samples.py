import hashlib
import logging
import os

from dotenv import load_dotenv
from sqlalchemy.dialects.postgresql import insert


from app.core.database import SessionLocal
from app.models.site import Site
from app.models.water_quality_sample import WaterQualitySample
from app.services.sheet_service import get_sheet_data

load_dotenv()

logger = logging.getLogger(__name__)

SHEET_URL = (
    f"https://docs.google.com/spreadsheets/d/"
    f"{os.getenv('SPREADSHEET_ID')}/export?format=csv&gid={os.getenv('SHEET_GID')}"
)

def upsert_sites(db, rows: list[dict]) -> dict[str, int]:

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
        site = db.query(Site).filter(Site.name == name).first()

        if site is None:
            site = Site(
                name=name,
                latitude=coords["latitude"],
                longitude=coords["longitude"],
                is_active=True,
            )
            db.add(site)
            db.flush()
            logger.info(f"Created new site: {name}")

        site_map[name] = site.id
    
    return site_map


def build_source_hash(site_id: int, sample_date, enterococci: int, quality_code: str) -> str:
    raw = f"{site_id}|{sample_date}|{enterococci}|{quality_code}"
    return hashlib.sha256(raw.encode()).hexdigest()


def insert_samples(db, rows: list[dict], site_map: dict[str, int]) -> int:
    records = []
    for row in rows:
        site_id = site_map.get(row["name"])
        if site_id is None:
            logger.warning(f"Site not found for {row['name']}")
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

    # On conflict, only update if the source hash is different
    # This could be due to minor updates to inaccuracies in the reported water sample and quality code
    stmt = (
        insert(WaterQualitySample)
        .values(records)
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
    
    result = db.execute(stmt)
    return result.rowcount   


def run_sync():
    logger.info("Starting water quality sample sync...")
    db = SessionLocal()

    try:
        rows = get_sheet_data(SHEET_URL)
        logger.info(f"Fetched {len(rows)} rows from spreadsheet.")

        site_map = upsert_sites(db, rows)
        inserted = insert_samples(db, rows, site_map)

        db.commit()
        logger.info(f"Sync completed. {inserted} new samples inserted. Skipped {len(rows) - inserted} duplicates.")

    except Exception as e:
        db.rollback()
        logger.error(f"Error during sync: {e}")
        raise    
    finally:
        db.close()