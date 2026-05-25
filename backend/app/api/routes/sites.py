from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.site import Site
from app.schemas.site import SiteResponse, SiteDetailResponse
from app.schemas.water_quality_sample import WaterQualitySampleResponse

from app.services.sample_service import get_samples_for_site
from app.exceptions.exceptions import SiteNotFoundError


router = APIRouter(prefix="/sites", tags=["Sites"])


@router.get("/", response_model=list[SiteResponse])
async def get_sites(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Site).order_by(Site.name))
    return result.scalars().all()


@router.get("/{site_id}", response_model=SiteDetailResponse)
async def get_site(site_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Site).filter(Site.id == site_id))
    site = result.scalar_one_or_none()

    if site is None:
        raise HTTPException(status_code=404, detail="Site not found")

    return site


@router.get("/{site_id}/samples", response_model=list[WaterQualitySampleResponse])
async def get_site_samples(
    site_id: int,
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    quality_code: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    try:
        return await get_samples_for_site(db, site_id, start_date, end_date, quality_code)
    except SiteNotFoundError:
        raise HTTPException(status_code=404, detail="Site not found")

