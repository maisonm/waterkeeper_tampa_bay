class SiteNotFoundError(Exception):
    def __init__(self, site_id: int):
        self.site_id = site_id
        super().__init__(f"Site with id {site_id} not found")