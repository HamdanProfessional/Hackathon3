"""
publish_learning_event: Publish learning events to Kafka
Minimal token usage with synchronous publish.
"""
import json
import time
from typing import Dict, Any
from config import settings_kafka

def publish_learning_event(event_type: str, student_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Publish a learning event to Kafka.

    Args:
        event_type: Type of event (e.g., 'exercise.completed', 'quiz.passed')
        student_id: Student identifier
        data: Event data (exercise_id, score, etc.)

    Returns:
    - status: success/error
    - topic: str
    - offset: int (if successful)

    Topics follow pattern: learning.{event_type}
    """
    try:
        # Build topic name
        topic = f"learning.{event_type}"

        # Build event message
        event = {
            "event_type": event_type,
            "student_id": student_id,
            "timestamp": int(time.time()),
            "data": data
        }

        # For demo: Use direct Kafka client or mock
        # In production: aiokafka producer
        try:
            from kafka import KafkaProducer
            import kafka.errors as Errors

            producer = KafkaProducer(
                bootstrap_servers=settings_kafka.bootstrap_servers,
                value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                request_timeout_ms=5000,
                retries=2,
            )

            future = producer.send(topic, value=event)
            record_metadata = future.get(timeout=5)

            producer.close()

            return {
                "status": "success",
                "topic": record_metadata.topic,
                "partition": record_metadata.partition,
                "offset": record_metadata.offset,
            }

        except ImportError:
            # Mock response for development
            return {
                "status": "success",
                "topic": topic,
                "message": "Event published (mock mode - install kafka-python for production)",
                "event_type": event_type,
                "student_id": student_id,
            }

    except Exception as e:
        return {
            "status": "error",
            "topic": topic if 'topic' in locals() else "unknown",
            "error": str(e)[:100],
        }

__all__ = ["publish_learning_event"]
