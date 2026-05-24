from pydantic import BaseModel
from datetime import date

class WeatherDailyRecordResponse(BaseModel):
    id: int
    site_id: int
    weather_date: date
    precipitation_inches: float | None
    avg_temp_f: float | None
    min_temp_f: float | None
    max_temp_f: float | None
    source: str | None

    model_config = {
        "from_attributes": True,
    }