"""Dapr client wrapper for LearnFlow services."""
import json
from typing import Optional, Dict, Any, List
from dapr.clients import DaprClient
from dapr.clients.grpc._state import StateItem
import logging

logger = logging.getLogger(__name__)


class DaprClientWrapper:
    """Wrapper around Dapr client with common operations."""

    def __init__(
        self,
        pubsub_name: str = "kafka-pubsub",
        state_store_name: str = "postgres-state",
        secret_store_name: str = "kubernetes-secret-store",
    ):
        self.pubsub_name = pubsub_name
        self.state_store_name = state_store_name
        self.secret_store_name = secret_store_name

    async def publish_event(self, topic: str, data: Dict[str, Any]):
        """Publish event to Kafka topic."""
        try:
            with DaprClient() as dapr:
                dapr.publish_event(
                    pubsub_name=self.pubsub_name,
                    topic_name=topic,
                    data=json.dumps(data),
                )
                logger.info(f"Published event to {topic}: {data}")
        except Exception as e:
            logger.error(f"Failed to publish event to {topic}: {e}")
            raise

    async def get_state(self, key: str) -> Optional[Dict]:
        """Get state from Dapr state store."""
        try:
            with DaprClient() as dapr:
                state = dapr.get_state(store_name=self.state_store_name, key=key)
                if state.data:
                    return json.loads(state.data)
                return None
        except Exception as e:
            logger.error(f"Failed to get state for key {key}: {e}")
            return None

    async def save_state(self, key: str, data: Dict[str, Any]):
        """Save state to Dapr state store."""
        try:
            with DaprClient() as dapr:
                dapr.save_state(
                    store_name=self.state_store_name,
                    key=key,
                    value=json.dumps(data),
                )
                logger.info(f"Saved state for key {key}")
        except Exception as e:
            logger.error(f"Failed to save state for key {key}: {e}")
            raise

    async def delete_state(self, key: str):
        """Delete state from Dapr state store."""
        try:
            with DaprClient() as dapr:
                dapr.delete_state(store_name=self.state_store_name, key=key)
                logger.info(f"Deleted state for key {key}")
        except Exception as e:
            logger.error(f"Failed to delete state for key {key}: {e}")
            raise

    async def get_states(self, keys: List[str]) -> Dict[str, Optional[Dict]]:
        """Bulk get states from Dapr state store."""
        try:
            with DaprClient() as dapr:
                states = dapr.get_bulk_state(store_name=self.state_store_name, keys=keys)
                result = {}
                for item in states.items:
                    if item.data:
                        result[item.key] = json.loads(item.data)
                    else:
                        result[item.key] = None
                return result
        except Exception as e:
            logger.error(f"Failed to get bulk states: {e}")
            return {k: None for k in keys}

    async def invoke_service(
        self, app_id: str, method_name: str, data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Invoke another service via Dapr service invocation."""
        try:
            with DaprClient() as dapr:
                response = dapr.invoke_method(
                    app_id=app_id,
                    method_name=method_name,
                    data=json.dumps(data),
                )
                return json.loads(response.data)
        except Exception as e:
            logger.error(f"Failed to invoke service {app_id}.{method_name}: {e}")
            raise

    async def get_secret(self, key: str) -> Optional[str]:
        """Get secret from Dapr secret store."""
        try:
            with DaprClient() as dapr:
                secret = dapr.get_secret(
                    store_name=self.secret_store_name,
                    key=key,
                )
                return secret.secret.get(key) if secret.secret else None
        except Exception as e:
            logger.error(f"Failed to get secret {key}: {e}")
            return None


# Global Dapr client instance
dapr_client = DaprClientWrapper()


async def get_dapr() -> DaprClientWrapper:
    """Get Dapr client instance."""
    return dapr_client
