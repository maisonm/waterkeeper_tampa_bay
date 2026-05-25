from pydantic import BaseModel

from app.schemas.water_quality_sample import WaterQualitySampleResponse
from app.schemas.weather_daily_record import WeatherDailyRecordResponse


class PaginatedSamples(BaseModel):
    items: list[WaterQualitySampleResponse]
    total: int
    limit: int
    offset: int


class DashboardResponse(BaseModel):
    sample_sites: PaginatedSamples
    weather_records: list[WeatherDailyRecordResponse]
