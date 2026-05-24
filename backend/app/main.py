from fastapi import FastAPI

from app.api.routes import sites

app = FastAPI(title="Tampa Bay Water Quality API")

app.include_router(sites.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Welcome to the Tampa Bay Water Quality API"}