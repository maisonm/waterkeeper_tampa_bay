from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db

from app.schemas.weather_daily_record import WeatherDailyRecordResponse
from app.services.weather_service import get_weather_record

router = APIRouter(prefix="/weather", tags=["Weather"])

@router.get("/", response_model=list[WeatherDailyRecordResponse])
async def get_site_weather(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    return await get_weather_record(db, start_date, end_date)