from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.site import Site
from app.schemas.site import SiteResponse, SiteDetailResponse


from app.schemas.water_quality_sample import WaterQualitySampleResponse
from app.schemas.weather_daily_record import WeatherDailyRecordResponse

from app.services.sample_service import get_samples_for_site
from app.services.weather_service import get_weather_for_site
from app.exceptions.exceptions import SiteNotFoundError


router = APIRouter(prefix="/sites", tags=["Sites"])

@router.get("/", response_model=list[SiteResponse])
def get_sites(db: Session = Depends(get_db)):
    return db.query(Site).order_by(Site.name).all()


@router.get("/{site_id}", response_model=SiteDetailResponse)
def get_site(site_id: int, db: Session = Depends(get_db)):
    site = db.query(Site).filter(Site.id == site_id).first()

    if site is None:
        raise HTTPException(status_code=404, detail="Site not found")

    return site


@router.get("/{site_id}/samples", response_model=list[WaterQualitySampleResponse])
def get_site_samples(
    site_id: int,
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    quality_code: str | None = Query(default=None),
    db: Session = Depends(get_db),

):
    try:
        return get_samples_for_site(db, site_id, start_date, end_date, quality_code)
    except SiteNotFoundError:
        raise HTTPException(status_code=404, detail="Site not found")

@router.get("/{site_id}/weather", response_model=list[WeatherDailyRecordResponse])
def get_site_weather(
    site_id: int,
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    try:
        return get_weather_for_site(db, site_id, start_date, end_date)
    except SiteNotFoundError:
        raise HTTPException(status_code=404, detail="Site not found")
        
        
