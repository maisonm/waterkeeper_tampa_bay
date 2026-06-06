import logging
import os

from contextlib import asynccontextmanager

from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from asyncio import create_task
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.api.routes import sites, weather_records, dashboard
from app.core.database import SYNC_DATABASE_URL, engine
from app.core.logging import configure_logging
from app.exceptions.exceptions import SiteNotFoundError
from app.jobs.sync_samples import run_sync
from app.jobs.sync_weather import run_weather_sync

configure_logging()
logger = logging.getLogger(__name__)

_REQUIRED_ENV_VARS = [
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_DB",
    "SPREADSHEET_ID",
    "SHEET_GID",
]

_missing = [v for v in _REQUIRED_ENV_VARS if not os.getenv(v)]
if _missing:
    raise RuntimeError(f"Missing required environment variables: {', '.join(_missing)}")

scheduler = AsyncIOScheduler(
    jobstores={"default": SQLAlchemyJobStore(url=SYNC_DATABASE_URL)},
    job_defaults={"coalesce": True, "max_instances": 1},
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Verifying database connectivity...")
    async with engine.connect() as conn:
        await conn.execute(text("SELECT 1"))
    logger.info("Database connection verified.")

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

_LOCAL_ORIGIN = "http://localhost:5173"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("DEPLOYED_ORIGIN", _LOCAL_ORIGIN)],
    allow_methods=["GET"],
    allow_headers=["*"],
)

API_V1 = "/api/v1"

app.include_router(sites.router, prefix=API_V1)
app.include_router(weather_records.router, prefix=API_V1)
app.include_router(dashboard.router, prefix=API_V1)


@app.exception_handler(SiteNotFoundError)
async def site_not_found_handler(request: Request, exc: SiteNotFoundError) -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": str(exc)})


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error("Unhandled exception on %s %s", request.method, request.url.path, exc_info=exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again later."},
    )


@app.get("/health", tags=["Health"])
async def health() -> dict:
    return {"status": "ok"}


@app.get("/")
def root() -> dict:
    return {"message": "Welcome to the Tampa Bay Water Quality API"}
