from app.models.water_quality_sample import WaterQualitySample
from app.models.site import Site
from app.exceptions.exceptions import SiteNotFoundError

def get_samples_for_site(db, site_id, start_date=None, end_date=None, quality_code=None):
    site = db.query(Site).filter(Site.id == site_id).first()

    if site is None:
        raise SiteNotFoundError(site_id)

    query = db.query(WaterQualitySample).filter(WaterQualitySample.site_id == site_id)

    if start_date is not None:
        query = query.filter(WaterQualitySample.sample_date >= start_date)

    if end_date is not None:
        query = query.filter(WaterQualitySample.sample_date <= end_date)

    if quality_code is not None:
        query = query.filter(WaterQualitySample.quality_code == quality_code)

    return query.order_by(WaterQualitySample.sample_date.desc()).all()



