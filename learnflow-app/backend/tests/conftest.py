"""Pytest configuration and shared fixtures."""

import os
import asyncio
from typing import AsyncGenerator, Generator
from uuid import uuid4
import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

# Set test environment before importing services
os.environ["DATABASE_URL"] = "postgresql+asyncpg://test:test@localhost:5433/test_learnflow"
os.environ["ENVIRONMENT"] = "test"


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def async_client() -> AsyncGenerator:
    """Create async HTTP client for testing services."""
    # Import here to avoid issues with test environment
    from services.triage.main import app as triage_app
    from services.concepts.main import app as concepts_app
    from services.debug.main import app as debug_app
    from services.exercise.main import app as exercise_app
    from services.progress.main import app as progress_app
    from services.code_review.main import app as code_review_app

    # Yield clients for each service
    async with AsyncClient(transport=ASGITransport(app=triage_app), base_url="http://test") as client:
        yield client


@pytest.fixture
async def triage_client() -> AsyncGenerator:
    """Create async HTTP client for triage service."""
    from services.triage.main import app as triage_app

    async with AsyncClient(transport=ASGITransport(app=triage_app), base_url="http://test") as client:
        yield client


@pytest.fixture
async def concepts_client() -> AsyncGenerator:
    """Create async HTTP client for concepts service."""
    from services.concepts.main import app as concepts_app

    async with AsyncClient(transport=ASGITransport(app=concepts_app), base_url="http://test") as client:
        yield client


@pytest.fixture
async def debug_client() -> AsyncGenerator:
    """Create async HTTP client for debug service."""
    from services.debug.main import app as debug_app

    async with AsyncClient(transport=ASGITransport(app=debug_app), base_url="http://test") as client:
        yield client


@pytest.fixture
async def exercise_client() -> AsyncGenerator:
    """Create async HTTP client for exercise service."""
    from services.exercise.main import app as exercise_app

    async with AsyncClient(transport=ASGITransport(app=exercise_app), base_url="http://test") as client:
        yield client


@pytest.fixture
async def progress_client() -> AsyncGenerator:
    """Create async HTTP client for progress service."""
    from services.progress.main import app as progress_app

    async with AsyncClient(transport=ASGITransport(app=progress_app), base_url="http://test") as client:
        yield client


@pytest.fixture
async def code_review_client() -> AsyncGenerator:
    """Create async HTTP client for code review service."""
    from services.code_review.main import app as code_review_app

    async with AsyncClient(transport=ASGITransport(app=code_review_app), base_url="http://test") as client:
        yield client


@pytest.fixture
def sample_student_id() -> str:
    """Generate a sample student ID."""
    return str(uuid4())


@pytest.fixture
def sample_message() -> str:
    """Generate a sample message."""
    return "What is a variable in Python?"


@pytest.fixture
def sample_code() -> str:
    """Generate sample Python code."""
    return """
def greet(name):
    return "Hello, " + name

print(greet("World"))
"""


# Test database session fixture (optional, for integration tests)
@pytest.fixture
async def test_db_session() -> AsyncGenerator:
    """Create test database session."""
    from sqlmodel import SQLModel

    TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async_session_maker = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    async with async_session_maker() as session:
        yield session

    await engine.dispose()
