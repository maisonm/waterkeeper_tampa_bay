import logging

from contextlib import asynccontextmanager

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from asyncio import create_task
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import sites, weather_records, dashboard
from app.jobs.sync_samples import run_sync
from app.jobs.sync_weather import run_weather_sync

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)
scheduler = AsyncIOScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Running initial sync on startup...")
    create_task(run_sync())
    create_task(run_weather_sync())

    scheduler.add_job(run_sync, "cron", day_of_week="mon", hour=7, minute=0)
    scheduler.add_job(run_sync, "cron", day_of_week="fri", hour=7, minute=0)
    scheduler.add_job(run_weather_sync, "cron", day_of_week="mon", hour=7, minute=30)
    scheduler.add_job(run_weather_sync, "cron", day_of_week="fri", hour=7, minute=30)
    scheduler.start()

    yield

    scheduler.shutdown()


app = FastAPI(title="Tampa Bay Water Quality API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(sites.router, prefix="/api")
app.include_router(weather_records.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Welcome to the Tampa Bay Water Quality API"}