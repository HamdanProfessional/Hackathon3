"""Shared Dapr client wrapper for LearnFlow services.

Provides a unified interface for:
- Event publishing to Kafka topics via Dapr pub/sub
- State management via Dapr state store
- Service invocation between microservices
- Secret access via Dapr secret store
"""

import json
import logging
from typing import Any, Optional
from functools import lru_cache

from dapr.client import DaprClient
from dapr.clients.grpc._state import StateItem
from dapr.clients.grpc._response import GetSecretResponse

logger = logging.getLogger(__name__)

# Dapr component names (from k8s/dapr-components/)
PUBSUB_COMPONENT_NAME = "learnflow-pubsub"
STATE_STORE_NAME = "learnflow-statestore"
SECRET_STORE_NAME = "learnflow-secretstore"


class LearnFlowDaprClient:
    """Wrapper around Dapr client for LearnFlow-specific operations."""

    def __init__(self) -> None:
        """Initialize the Dapr client."""
        self._client: Optional[DaprClient] = None

    @property
    def client(self) -> DaprClient:
        """Get or create the Dapr client instance (lazy initialization)."""
        if self._client is None:
            self._client = DaprClient()
            logger.info("Dapr client initialized")
        return self._client

    # ==================== Pub/Sub (Event Publishing) ====================

    async def publish_event(
        self,
        topic: str,
        data: dict[str, Any],
        pubsub_name: str = PUBSUB_COMPONENT_NAME,
    ) -> bool:
        """Publish an event to a Kafka topic via Dapr pub/sub.

        Args:
            topic: The topic name (e.g., "learning.progress", "code.submission")
            data: The event data (will be JSON serialized)
            pubsub_name: The Dapr pub/sub component name

        Returns:
            True if published successfully, False otherwise

        Example:
            await dapr.publish_event(
                topic="learning.progress",
                data={"student_id": "123", "concept": "variables", "mastery": 0.8}
            )
        """
        try:
            self.client.publish_event(
                pubsub_name=pubsub_name,
                topic_name=topic,
                data=json.dumps(data),
                data_content_type="application/json",
            )
            logger.info(f"Published event to topic '{topic}': {data}")
            return True
        except Exception as e:
            logger.error(f"Failed to publish event to topic '{topic}': {e}")
            return False

    # ==================== State Management ====================

    async def save_state(
        self,
        key: str,
        value: Any,
        store_name: str = STATE_STORE_NAME,
        etag: Optional[str] = None,
        ttl_seconds: Optional[int] = None,
    ) -> bool:
        """Save a state value.

        Args:
            key: The state key
            value: The value to store (will be JSON serialized)
            store_name: The Dapr state store name
            etag: Optional entity tag for optimistic concurrency
            ttl_seconds: Optional time-to-live in seconds

        Returns:
            True if saved successfully, False otherwise
        """
        try:
            state_item = StateItem(
                key=key,
                value=json.dumps(value),
                etag=etag,
                metadata={"ttlInSeconds": str(ttl_seconds)} if ttl_seconds else None,
            )
            self.client.save_state(store_name=store_name, states=[state_item])
            logger.debug(f"Saved state: key='{key}'")
            return True
        except Exception as e:
            logger.error(f"Failed to save state (key='{key}'): {e}")
            return False

    async def get_state(
        self,
        key: str,
        store_name: str = STATE_STORE_NAME,
    ) -> Optional[Any]:
        """Get a state value.

        Args:
            key: The state key
            store_name: The Dapr state store name

        Returns:
            The deserialized value, or None if not found
        """
        try:
            response = self.client.get_state(store_name=store_name, key=key)
            if response.data:
                return json.loads(response.data)
            return None
        except Exception as e:
            logger.error(f"Failed to get state (key='{key}'): {e}")
            return None

    async def delete_state(
        self,
        key: str,
        store_name: str = STATE_STORE_NAME,
        etag: Optional[str] = None,
    ) -> bool:
        """Delete a state value.

        Args:
            key: The state key
            store_name: The Dapr state store name
            etag: Optional entity tag for optimistic concurrency

        Returns:
            True if deleted successfully, False otherwise
        """
        try:
            self.client.delete_state(store_name=store_name, key=key, etag=etag)
            logger.debug(f"Deleted state: key='{key}'")
            return True
        except Exception as e:
            logger.error(f"Failed to delete state (key='{key}'): {e}")
            return False

    # ==================== Service Invocation ====================

    async def invoke_service(
        self,
        app_id: str,
        method: str,
        data: Optional[dict[str, Any]] = None,
        http_verb: str = "POST",
    ) -> Optional[dict[str, Any]]:
        """Invoke a method on another Dapr-enabled service.

        Args:
            app_id: The target service's Dapr app ID (e.g., "concepts-service")
            method: The method path (e.g., "/chat", "/explain")
            data: Optional request body
            http_verb: HTTP method (GET, POST, PUT, DELETE)

        Returns:
            The JSON response, or None if invocation failed

        Example:
            response = await dapr.invoke_service(
                app_id="concepts-service",
                method="/explain",
                data={"concept": "variables", "student_id": "123"}
            )
        """
        try:
            response = self.client.invoke_method(
                app_id=app_id,
                method_name=method,
                data=json.dumps(data) if data else "",
                http_verb=http_verb,
            )
            if response.data:
                return json.loads(response.data)
            return None
        except Exception as e:
            logger.error(f"Failed to invoke service '{app_id}{method}': {e}")
            return None

    # ==================== Secrets ====================

    async def get_secret(
        self,
        secret_name: str,
        key: str,
        secret_store_name: str = SECRET_STORE_NAME,
    ) -> Optional[str]:
        """Get a secret value from the secret store.

        Args:
            secret_name: The secret resource name (e.g., "learnflow-api-secret")
            key: The key within the secret (e.g., "openai-api-key")
            secret_store_name: The Dapr secret store name

        Returns:
            The secret value, or None if not found

        Example:
            api_key = await dapr.get_secret(
                secret_name="learnflow-api-secret",
                key="openai-api-key"
            )
        """
        try:
            response: GetSecretResponse = self.client.get_secret(
                store_name=secret_store_name,
                key=key,
                metadata={"secret_name": secret_name},
            )
            if response.secret:
                # Response may be a dict with secret_name as key
                if isinstance(response.secret, dict):
                    return response.secret.get(key) or response.secret.get(secret_name)
                return response.secret
            return None
        except Exception as e:
            logger.error(f"Failed to get secret '{secret_name}/{key}': {e}")
            return None

    def close(self) -> None:
        """Close the Dapr client connection."""
        if self._client:
            self._client.close()
            self._client = None
            logger.info("Dapr client closed")

    def __enter__(self) -> "LearnFlowDaprClient":
        """Context manager entry."""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:  # type: ignore
        """Context manager exit."""
        self.close()


# Singleton instance for convenient access
@lru_cache
def get_dapr_client() -> LearnFlowDaprClient:
    """Get a singleton Dapr client instance."""
    return LearnFlowDaprClient()


# ==================== Event Topic Constants ====================

class EventTopics:
    """Kafka topic names used across LearnFlow services."""

    LEARNING_PROGRESS = "learning.progress"
    """Topic for concept learning and progress updates"""

    CODE_SUBMISSION = "code.submission"
    """Topic for code analysis and review events"""

    EXERCISE_ATTEMPT = "exercise.attempt"
    """Topic for exercise submission events"""

    STRUGGLE_ALERT = "struggle.alert"
    """Topic for repeated error/difficulty alerts"""


# ==================== Service App IDs ====================

class ServiceAppIds:
    """Dapr app IDs for LearnFlow services."""

    TRIAGE = "triage-service"
    CONCEPTS = "concepts-service"
    DEBUG = "debug-service"
    EXERCISE = "exercise-service"
    PROGRESS = "progress-service"
    CODE_REVIEW = "code-review-service"
