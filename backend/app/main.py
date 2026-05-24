import logging
from contextlib import asynccontextmanager

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI

from app.api.routes import sites
from app.jobs.sync_samples import run_sync

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)
scheduler = AsyncIOScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Running initial sync on startup...")
    run_sync()

    scheduler.add_job(run_sync, "cron", day_of_week="mon", hour=7, minute=0)
    scheduler.add_job(run_sync, "cron", day_of_week="fri", hour=7, minute=0)
    scheduler.start()

    yield

    scheduler.shutdown()


app = FastAPI(title="Tampa Bay Water Quality API", lifespan=lifespan)

app.include_router(sites.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Welcome to the Tampa Bay Water Quality API"}