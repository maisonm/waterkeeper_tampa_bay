class SiteNotFoundError(Exception):
    def __init__(self, site_id: int):
        self.site_id = site_id
        super().__init__(f"Site with id {site_id} not found")


class WeatherFetchError(Exception):
    def __init__(self, reason: str):
        super().__init__(f"Failed to fetch weather data: {reason}")