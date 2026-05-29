from datetime import date

from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard_service import get_dashboard

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

_CACHE_HEADER = "public, max-age=3600, stale-while-revalidate=600"


@router.get("/sites/samples", response_model=DashboardResponse)
async def get_all_site_samples(
    response: Response,
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    quality_code: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    response.headers["Cache-Control"] = _CACHE_HEADER
    return await get_dashboard(
        db,
        start_date=start_date,
        end_date=end_date,
        quality_code=quality_code,
        limit=limit,
        offset=offset,
    )


@router.get("/sites/{site_id}/samples", response_model=DashboardResponse)
async def get_site_samples(
    site_id: int,
    response: Response,
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    quality_code: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    response.headers["Cache-Control"] = _CACHE_HEADER
    return await get_dashboard(
        db,
        site_id=site_id,
        start_date=start_date,
        end_date=end_date,
        quality_code=quality_code,
        limit=limit,
        offset=offset,
    )
