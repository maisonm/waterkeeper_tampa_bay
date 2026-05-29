from pydantic import BaseModel, model_validator
from datetime import date


class WaterQualitySampleResponse(BaseModel):
    id: int
    site_id: int
    site_name: str
    sample_date: date
    enterococci_per_100ml: int
    quality_code: str
    source_hash: str | None

    model_config = {
        "from_attributes": True,
    }

    @model_validator(mode="before")
    @classmethod
    def extract_site_name(cls, obj):
        if isinstance(obj, dict):
            return obj
        return {
            "id": obj.id,
            "site_id": obj.site_id,
            "site_name": obj.site.name if obj.site else f"Site {obj.site_id}",
            "sample_date": obj.sample_date,
            "enterococci_per_100ml": obj.enterococci_per_100ml,
            "quality_code": obj.quality_code,
            "source_hash": obj.source_hash,
        }
