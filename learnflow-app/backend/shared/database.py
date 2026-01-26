"""Database configuration and utilities."""

import os
from typing import AsyncGenerator
import asyncpg
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker


DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://learnflow:learnflow123@localhost:5432/learnflow"
)

# Async engine
async_engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

async_session = async_sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Get async database session."""
    async with async_session() as session:
        yield session


async def init_db():
    """Initialize database connection."""
    try:
        conn = await asyncpg.connect(DATABASE_URL.replace("+asyncpg", "").replace("postgresql+", "postgresql"))
        await conn.close()
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False
