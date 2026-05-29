from datetime import date, timedelta

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions.exceptions import SiteNotFoundError
from app.schemas.dashboard import DashboardResponse, PaginatedSamples
from app.schemas.weather_daily_record import WeatherDailyRecordResponse
from app.services.sample_service import get_samples_paginated
from app.services.weather_service import get_weather_record

MAX_DATE_RANGE_DAYS = 366


def _resolve_date_range(
    start_date: date | None,
    end_date: date | None,
) -> tuple[date, date]:
    today = date.today()
    resolved_end = end_date or today
    resolved_start = start_date or (resolved_end - timedelta(days=30))
    return resolved_start, resolved_end


def _validate_date_range(start: date, end: date) -> None:
    if (end - start).days > MAX_DATE_RANGE_DAYS:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Date range exceeds {MAX_DATE_RANGE_DAYS} days. "
                "Use the chart endpoints for multi-year views."
            ),
        )


async def get_dashboard(
    db: AsyncSession,
    site_id: int | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    quality_code: str | None = None,
    limit: int = 100,
    offset: int = 0,
) -> DashboardResponse:
    start, end = _resolve_date_range(start_date, end_date)
    _validate_date_range(start, end)

    try:
        items, total = await get_samples_paginated(
            db,
            site_id=site_id,
            start_date=start,
            end_date=end,
            quality_code=quality_code,
            limit=limit,
            offset=offset,
        )
        weather = await get_weather_record(db, start_date=start, end_date=end)
    except SiteNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))

    return DashboardResponse(
        sample_sites=PaginatedSamples(
            items=items,
            total=total,
            limit=limit,
            offset=offset,
        ),
        weather_records=[WeatherDailyRecordResponse.model_validate(w) for w in weather],
    )
