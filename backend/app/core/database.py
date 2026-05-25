import os

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import DeclarativeBase

load_dotenv()

_user = os.getenv("POSTGRES_USER")
_password = os.getenv("POSTGRES_PASSWORD")
_host = os.getenv("DB_HOST", "localhost")
_db = os.getenv("POSTGRES_DB")

DATABASE_URL = f"postgresql+asyncpg://{_user}:{_password}@{_host}:5432/{_db}"

# Synchronous URL used by APScheduler's job store (psycopg2, not asyncpg)
SYNC_DATABASE_URL = f"postgresql+psycopg2://{_user}:{_password}@{_host}:5432/{_db}"

engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=40,
    pool_timeout=30,
    pool_recycle=1800,
    pool_pre_ping=True,
)

SessionLocal = async_sessionmaker[AsyncSession](engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass