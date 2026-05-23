from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship 

from app.core.database import Base


class WaterQualitySample(Base):
    __tablename__ = "water_quality_samples"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    site_id: Mapped[int] = mapped_column(ForeignKey("sites.id"), nullable=False)
    sample_date: Mapped[date] = mapped_column(Date, nullable=False)
    enterococci_per_100ml: Mapped[int] = mapped_column(Integer, nullable=False)
    quality_code: Mapped[str] = mapped_column(String, nullable=False)
    source_hash: Mapped[str | None] = mapped_column(String, nullable=True)

    site = relationship("Site", back_populates="samples")

    __table_args__ = (
        UniqueConstraint("site_id", "sample_date", name="uq_sample_site_date"),
    )

