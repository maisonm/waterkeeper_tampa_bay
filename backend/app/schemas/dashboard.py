from pydantic import BaseModel

from app.schemas.water_quality_sample import WaterQualitySampleResponse
from app.schemas.weather_daily_record import WeatherDailyRecordResponse


class DashboardSamples(BaseModel):
    items: list[WaterQualitySampleResponse]
    total: int


class DashboardResponse(BaseModel):
    sample_sites: DashboardSamples
    weather_records: list[WeatherDailyRecordResponse]
