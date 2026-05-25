import logging
import os

from dotenv import load_dotenv
from sqlalchemy.dialects.postgresql import insert

from app.core.database import SessionLocal
from app.models.weather_daily_record import WeatherDailyRecord
# get_weather_data 


load_dotenv()

logger = logging.getLogger(__name__)

