import os
from collections.abc import AsyncGenerator
from datetime import date

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

# Required by app.main at import; tests use an isolated SQLite DB instead.
os.environ.setdefault("POSTGRES_USER", "test")
os.environ.setdefault("POSTGRES_PASSWORD", "test")
os.environ.setdefault("POSTGRES_DB", "test")
os.environ.setdefault("SPREADSHEET_ID", "test-sheet")
os.environ.setdefault("SHEET_GID", "0")

from fastapi import FastAPI

from app.api.deps import get_db
from app.api.routes import dashboard, sites, weather_records
from app.core.database import Base
from app.models import Site, WaterQualitySample, WeatherDailyRecord


@pytest_asyncio.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    engine = create_async_engine(
        "sqlite+aiosqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(engine, expire_on_commit=False)
    async with session_factory() as session:
        yield session

    await engine.dispose()


@pytest_asyncio.fixture
async def seeded_session(db_session: AsyncSession) -> AsyncSession:
    site = Site(
        id=1,
        name="Test Beach",
        latitude=27.95,
        longitude=-82.45,
        is_active=True,
    )
    other_site = Site(
        id=2,
        name="Other Cove",
        latitude=27.85,
        longitude=-82.55,
        is_active=True,
    )
    db_session.add_all([site, other_site])
    await db_session.flush()

    db_session.add_all(
        [
            WaterQualitySample(
                site_id=1,
                sample_date=date(2024, 1, 10),
                enterococci_per_100ml=35,
                quality_code="good",
                source_hash="hash-a",
            ),
            WaterQualitySample(
                site_id=1,
                sample_date=date(2024, 2, 1),
                enterococci_per_100ml=500,
                quality_code="poor",
                source_hash="hash-b",
            ),
            WaterQualitySample(
                site_id=2,
                sample_date=date(2024, 1, 20),
                enterococci_per_100ml=120,
                quality_code="moderate",
                source_hash="hash-c",
            ),
            WeatherDailyRecord(
                weather_date=date(2024, 1, 10),
                precipitation_inches=0.25,
                avg_temp_f=72.0,
                min_temp_f=65.0,
                max_temp_f=78.0,
                source="test",
            ),
            WeatherDailyRecord(
                weather_date=date(2024, 2, 1),
                precipitation_inches=1.5,
                avg_temp_f=68.0,
                min_temp_f=60.0,
                max_temp_f=74.0,
                source="test",
            ),
        ]
    )
    await db_session.commit()
    return db_session


def _build_test_app(session: AsyncSession) -> FastAPI:
    async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
        yield session

    test_app = FastAPI()
    test_app.include_router(sites.router, prefix="/api/v1")
    test_app.include_router(dashboard.router, prefix="/api/v1")
    test_app.include_router(weather_records.router, prefix="/api/v1")
    test_app.dependency_overrides[get_db] = override_get_db
    return test_app


@pytest_asyncio.fixture
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    test_app = _build_test_app(db_session)
    transport = ASGITransport(app=test_app)
    async with AsyncClient(transport=transport, base_url="http://test") as http_client:
        yield http_client


@pytest_asyncio.fixture
async def seeded_client(seeded_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    test_app = _build_test_app(seeded_session)
    transport = ASGITransport(app=test_app)
    async with AsyncClient(transport=transport, base_url="http://test") as http_client:
        yield http_client
