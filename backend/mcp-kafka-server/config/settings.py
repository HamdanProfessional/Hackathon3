"""
Configuration for MCP Kafka Server
"""
import os
from dataclasses import dataclass

@dataclass
class KafkaSettings:
    """Kafka connection settings."""
    bootstrap_servers: str = os.getenv(
        "KAFKA_BOOTSTRAP_SERVERS",
        "redpanda.redpanda-system.svc.cluster.local:9092"
    )
    consumer_group: str = os.getenv("KAFKA_CONSUMER_GROUP", "mcp-kafka-server")
    auto_offset_reset: str = os.getenv("KAFKA_AUTO_OFFSET_RESET", "latest")

@dataclass
class ServerSettings:
    """Server configuration."""
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    default_timeout: int = int(os.getenv("DEFAULT_TIMEOUT", "5"))

# Topic patterns
LEARNING_TOPICS = [
    "learning.exercise.completed",
    "learning.exercise.failed",
    "learning.quiz.passed",
    "learning.quiz.failed",
    "learning.concept.mastered",
]

STRUGGLE_TOPICS = [
    "struggle.repeated_error",
    "struggle.time_exceeded",
    "struggle.help_requested",
    "struggle.low_score",
]

settings_kafka = KafkaSettings()
settings_server = ServerSettings()

__all__ = ["settings_kafka", "settings_server", "LEARNING_TOPICS", "STRUGGLE_TOPICS"]
