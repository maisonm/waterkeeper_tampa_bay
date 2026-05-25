from datetime import date 

from sqlalchemy import Date, Float, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base 

class WeatherDailyRecord(Base):
    __tablename__ = "weather_daily_record"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    weather_date: Mapped[date] = mapped_column(Date, nullable=False)
    precipitation_inches: Mapped[float | None] = mapped_column(Float, nullable=True)
    avg_temp_f: Mapped[float | None] = mapped_column(Float, nullable=True)
    min_temp_f: Mapped[float | None] = mapped_column(Float, nullable=True)
    max_temp_f: Mapped[float | None] = mapped_column(Float, nullable=True)
    source: Mapped[str | None] = mapped_column(String, nullable=True)

    __table_args__ = (
        UniqueConstraint("weather_date", name="uq_weather_site_date"),
    )