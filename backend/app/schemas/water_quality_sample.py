from pydantic import BaseModel
from datetime import date

class WaterQualitySampleResponse(BaseModel):
    id: int
    site_id: int
    sample_date: date
    enterococci_per_100ml: int
    quality_code: str
    source_hash: str | None

    model_config = {
        "from_attributes": True,
    }
