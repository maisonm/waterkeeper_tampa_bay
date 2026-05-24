from app.models.weather_daily_record import WeatherDailyRecord
from app.models.site import Site
from app.exceptions.exceptions import SiteNotFoundError


def get_weather_for_site(db, site_id, start_date=None, end_date=None):
    site = db.query(Site).filter(Site.id == site_id).first()

    if site is None:
        raise SiteNotFoundError(site_id)

    query = db.query(WeatherDailyRecord).filter(WeatherDailyRecord.site_id == site_id)

    if start_date is not None:
        query = query.filter(WeatherDailyRecord.weather_date >= start_date)

    if end_date is not None:
        query = query.filter(WeatherDailyRecord.weather_date <= end_date)

    return query.order_by(WeatherDailyRecord.weather_date.desc()).all()