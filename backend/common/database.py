"""Database connection and utilities for LearnFlow services."""
import os
import asyncpg
from contextlib import asynccontextmanager
from typing import Optional
from functools import lru_cache


class DatabaseConfig:
    """Database configuration."""

    def __init__(self):
        self.host = os.getenv("DB_HOST", "postgres-postgresql.postgres.svc.cluster.local")
        self.port = int(os.getenv("DB_PORT", "5432"))
        self.database = os.getenv("DB_NAME", "learnflow")
        self.user = os.getenv("DB_USER", "learnflow")
        self.password = os.getenv("DB_PASSWORD", "learnflow123")

    @property
    def dsn(self) -> str:
        """Get database connection string."""
        return f"postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.database}"


@lru_cache()
def get_config() -> DatabaseConfig:
    """Get cached database configuration."""
    return DatabaseConfig()


class Database:
    """Database connection manager."""

    def __init__(self, config: Optional[DatabaseConfig] = None):
        self.config = config or get_config()
        self._pool: Optional[asyncpg.Pool] = None

    async def connect(self):
        """Create connection pool."""
        if self._pool is None:
            self._pool = await asyncpg.create_pool(
                host=self.config.host,
                port=self.config.port,
                database=self.config.database,
                user=self.config.user,
                password=self.config.password,
                min_size=2,
                max_size=10,
            )

    async def disconnect(self):
        """Close connection pool."""
        if self._pool:
            await self._pool.close()
            self._pool = None

    @asynccontextmanager
    async def acquire(self):
        """Acquire a connection from the pool."""
        if self._pool is None:
            await self.connect()
        async with self._pool.acquire() as connection:
            yield connection

    async def execute(self, query: str, *args):
        """Execute a query."""
        async with self.acquire() as conn:
            return await conn.execute(query, *args)

    async def fetch(self, query: str, *args):
        """Fetch rows from a query."""
        async with self.acquire() as conn:
            return await conn.fetch(query, *args)

    async def fetchrow(self, query: str, *args):
        """Fetch a single row from a query."""
        async with self.acquire() as conn:
            return await conn.fetchrow(query, *args)

    async def fetchval(self, query: str, *args):
        """Fetch a single value from a query."""
        async with self.acquire() as conn:
            return await conn.fetchval(query, *args)


# Global database instance
db = Database()


async def get_db() -> Database:
    """Get database instance."""
    return db
