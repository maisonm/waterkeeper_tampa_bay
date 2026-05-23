from datetime import date 

from sqlalchemy import Date, Float, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base 

class WeatherDailyRecord(Base):
    __tablename__ = "weather_daily_record"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    site_id: Mapped[int] = mapped_column(ForeignKey("sites.id"), nullable=False)

    weather_date: Mapped[date] = mapped_column(Date, nullable=False)
    precipitation_inches: Mapped[float | None] = mapped_column(Float, nullable=True)
    avg_temp_f: Mapped[float | None] = mapped_column(Float, nullable=True)
    min_temp_f: Mapped[float | None] = mapped_column(Float, nullable=True)
    max_temp_f: Mapped[float | None] = mapped_column(Float, nullable=True)
    source: Mapped[str | None] = mapped_column(String, nullable=True)

    site = relationship('Site', back_populates="weather_records")

    __table_args__ = (
        UniqueConstraint("site_id", "weather_date", name="uq_weather_site_date"),
    )