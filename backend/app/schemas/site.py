from pydantic import BaseModel

class SiteResponse(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float
    is_active: bool

    model_config = {
        "from_attributes": True,
    }


class SiteDetailResponse(SiteResponse):
    pass