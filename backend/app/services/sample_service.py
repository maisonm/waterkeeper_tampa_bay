from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.water_quality_sample import WaterQualitySample
from app.models.site import Site
from app.exceptions.exceptions import SiteNotFoundError


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
