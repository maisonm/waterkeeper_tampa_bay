import asyncio
import logging
from datetime import date

import httpx
from dotenv import load_dotenv
from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert

from app.core.database import SessionLocal
from app.models.water_quality_sample import WaterQualitySample
from app.models.weather_daily_record import WeatherDailyRecord

load_dotenv()

logger = logging.getLogger(__name__)

# Hard coded TB lat/lon for now
TAMPA_BAY_LAT = 27.95
TAMPA_BAY_LON = -82.46


async def get_sample_date_range() -> tuple[date | None, date | None]:
    async with SessionLocal() as db:
        stmt = select(
            func.min(WaterQualitySample.sample_date).label("min_date"),
            func.max(WaterQualitySample.sample_date).label("max_date"),
        )
        result = (await db.execute(stmt)).first()
        if result is None or result.min_date is None:
            return None, None
        return result.min_date, result.max_date


def fetch_weather(start_date: date, end_date: date) -> list[dict]:
    url = "https://archive-api.open-meteo.com/v1/archive"
    params = {
        "latitude": TAMPA_BAY_LAT,
        "longitude": TAMPA_BAY_LON,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "daily": "precipitation_sum,temperature_2m_mean,temperature_2m_min,temperature_2m_max",
        "temperature_unit": "fahrenheit",
        "precipitation_unit": "inch",
        "timezone": "America/New_York",
    }
    response = httpx.get(url, params=params, timeout=30)
    response.raise_for_status()
    data = response.json()

    daily = data["daily"]
    records = []
    for i, day in enumerate(daily["time"]):
        records.append({
            "weather_date": date.fromisoformat(day),
            "precipitation_inches": daily["precipitation_sum"][i],
            "avg_temp_f": daily["temperature_2m_mean"][i],
            "min_temp_f": daily["temperature_2m_min"][i],
            "max_temp_f": daily["temperature_2m_max"][i],
            "source": "open-meteo",
        })
    return records


async def insert_weather(db, records: list[dict]) -> int:
    if not records:
        return 0

    BATCH_SIZE = 500
    total_inserted = 0

    for i in range(0, len(records), BATCH_SIZE):
        batch = records[i : i + BATCH_SIZE]
        stmt = insert(WeatherDailyRecord).values(batch).on_conflict_do_nothing(
            index_elements=["weather_date"]
        )
        result = await db.execute(stmt)
        total_inserted += result.rowcount
        logger.info(f"Inserted weather batch {i // BATCH_SIZE + 1}: {result.rowcount} rows")

    return total_inserted


async def run_weather_sync():
    logger.info("Starting weather sync...")

    min_date, max_date = await get_sample_date_range()
    if min_date is None or max_date is None:
        logger.info("No sample dates found — skipping weather sync.")
        return

    logger.info(f"Fetching weather from {min_date} to {max_date}...")
    records = await asyncio.to_thread(fetch_weather, min_date, max_date)
    logger.info(f"Fetched {len(records)} weather records from Open-Meteo.")

    async with SessionLocal() as db:
        try:
            inserted = await insert_weather(db, records)
            await db.commit()
            logger.info(f"Weather sync complete. {inserted} new records inserted.")
        except Exception:
            await db.rollback()
            logger.exception("Weather sync failed")
            raise
