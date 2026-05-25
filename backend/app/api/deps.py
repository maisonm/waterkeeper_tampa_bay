from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator
from app.core.database import SessionLocal


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session