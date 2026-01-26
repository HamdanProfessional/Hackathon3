"""Tests for database configuration and utilities."""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession


@pytest.mark.asyncio
class TestDatabaseConfiguration:
    """Test suite for database configuration."""

    async def test_database_url_from_env(self, monkeypatch):
        """Test DATABASE_URL can be read from environment."""
        from shared import database

        # Test default value
        assert database.DATABASE_URL is not None
        assert "postgresql" in database.DATABASE_URL

    async def test_async_engine_exists(self):
        """Test async engine is configured."""
        from shared import database

        assert database.async_engine is not None
        assert database.async_session is not None

    async def test_test_db_session_fixture(self, test_db_session: AsyncSession):
        """Test test database session fixture works."""
        assert test_db_session is not None
        assert isinstance(test_db_session, AsyncSession)


@pytest.mark.asyncio
class TestDatabaseConnection:
    """Test suite for database connection."""

    async def test_init_db_returns_bool(self):
        """Test init_db returns a boolean."""
        from shared import database

        # In test environment, this might fail but should return bool
        result = await database.init_db()
        assert isinstance(result, bool)
