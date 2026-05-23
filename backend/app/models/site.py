from sqlalchemy import Boolean, Float, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

class Site(Base):
    __tablename__ = "sites"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=True)

    samples = relationship("WaterQualitySample", back_populates="site")
    weather_records = relationship("WeatherDailyRecord", back_populates="site")