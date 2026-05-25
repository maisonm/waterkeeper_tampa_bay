from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.water_quality_sample import WaterQualitySample
from app.models.site import Site
from app.exceptions.exceptions import SiteNotFoundError


async def get_samples_paginated(
    db: AsyncSession,
    site_id: int | None = None,
    start_date=None,
    end_date=None,
    quality_code: str | None = None,
    limit: int = 100,
    offset: int = 0,
) -> tuple[list, int]:
    if site_id is not None:
        result = await db.execute(select(Site).filter(Site.id == site_id))
        if result.scalar_one_or_none() is None:
            raise SiteNotFoundError(site_id)

    base = select(WaterQualitySample)

    if site_id is not None:
        base = base.filter(WaterQualitySample.site_id == site_id)
    if start_date is not None:
        base = base.filter(WaterQualitySample.sample_date >= start_date)
    if end_date is not None:
        base = base.filter(WaterQualitySample.sample_date <= end_date)
    if quality_code is not None:
        base = base.filter(WaterQualitySample.quality_code == quality_code)

    count_result = await db.execute(select(func.count()).select_from(base.subquery()))
    total = count_result.scalar_one()

    items_result = await db.execute(
        base.order_by(WaterQualitySample.sample_date.desc()).limit(limit).offset(offset)
    )
    items = list(items_result.scalars().all())

    return items, total


async def get_samples_for_site(
    db: AsyncSession,
    site_id: int,
    start_date=None,
    end_date=None,
    quality_code=None,
):
    result = await db.execute(select(Site).filter(Site.id == site_id))
    site = result.scalar_one_or_none()

    if site is None:
        raise SiteNotFoundError(site_id)

    stmt = select(WaterQualitySample).filter(WaterQualitySample.site_id == site_id)

    if start_date is not None:
        stmt = stmt.filter(WaterQualitySample.sample_date >= start_date)

    if end_date is not None:
        stmt = stmt.filter(WaterQualitySample.sample_date <= end_date)

    if quality_code is not None:
        stmt = stmt.filter(WaterQualitySample.quality_code == quality_code)

    result = await db.execute(stmt.order_by(WaterQualitySample.sample_date.desc()))
    return result.scalars().all()
