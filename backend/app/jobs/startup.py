import logging

from app.jobs.sync_samples import run_sync
from app.jobs.sync_weather import run_weather_sync

logger = logging.getLogger(__name__)


async def run_startup_sync() -> None:
    """Run sample sync first, then weather sync (which depends on sample dates)."""
    try:
        await run_sync()
    except Exception:
        logger.exception("Initial sample sync failed")
        return

    try:
        await run_weather_sync()
    except Exception:
        logger.exception("Initial weather sync failed")
