from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.weather_daily_record import WeatherDailyRecord
from app.models.site import Site
from app.exceptions.exceptions import SiteNotFoundError


async def get_weather_for_site(
    db: AsyncSession,
    start_date=None,
    end_date=None,
):
    stmt = select(WeatherDailyRecord)

    if start_date is not None:
        stmt = stmt.filter(WeatherDailyRecord.weather_date >= start_date)

    if end_date is not None:
        stmt = stmt.filter(WeatherDailyRecord.weather_date <= end_date)

    result = await db.execute(stmt.order_by(WeatherDailyRecord.weather_date.desc()))
    return result.scalars().all()
