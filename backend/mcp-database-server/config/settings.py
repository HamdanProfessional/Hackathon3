"""
Configuration for MCP Database Server
"""
import os
from dataclasses import dataclass
from typing import Optional

@dataclass
class DatabaseSettings:
    """Database connection settings."""
    host: str = os.getenv("DB_HOST", "postgres-postgresql.postgres.svc.cluster.local")
    port: int = int(os.getenv("DB_PORT", "5432"))
    database: str = os.getenv("DB_NAME", "learnflow")
    user: str = os.getenv("DB_USER", "postgres")
    password: str = os.getenv("DB_PASSWORD", "postgres")
    pool_size: int = int(os.getenv("DB_POOL_SIZE", "10"))
    max_overflow: int = int(os.getenv("DB_MAX_OVERFLOW", "2"))

    @property
    def connection_string(self) -> str:
        """Build async PostgreSQL connection string."""
        return f"postgresql+asyncpg://{self.user}:{self.password}@{self.host}:{self.port}/{self.database}"

@dataclass
class ServerSettings:
    """Server configuration."""
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    query_timeout: float = float(os.getenv("QUERY_TIMEOUT", "5.0"))

# Global settings instance
settings_db = DatabaseSettings()
settings_server = ServerSettings()

__all__ = ["settings_db", "settings_server"]
