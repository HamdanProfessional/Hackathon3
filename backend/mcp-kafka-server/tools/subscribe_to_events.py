"""
subscribe_to_events: Subscribe to Kafka events and return messages
Non-blocking subscription with timeout.
"""
import json
from typing import Dict, Any, List
from config import settings_kafka

def subscribe_to_events(topic: str, student_id: str = None, timeout: int = 5) -> Dict[str, Any]:
    """
    Subscribe to Kafka topic and return recent messages.

    Args:
        topic: Kafka topic to subscribe to (e.g., 'learning.exercise.completed')
        student_id: Optional filter for specific student
        timeout: Seconds to wait for messages (default 5)

    Returns:
    - status: success/error
    - message_count: int
    - messages: list of event dicts

    Token-efficient: Limited messages, filtered by student_id if provided.
    """
    try:
        messages = []

        try:
            from kafka import KafkaConsumer
            import kafka.errors as Errors

            consumer = KafkaConsumer(
                topic,
                bootstrap_servers=settings_kafka.bootstrap_servers,
                group_id=settings_kafka.consumer_group,
                auto_offset_reset='latest',
                enable_auto_commit=True,
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                consumer_timeout_ms=timeout * 1000,
            )

            for message in consumer:
                event = message.value

                # Filter by student_id if provided
                if student_id is None or event.get('student_id') == student_id:
                    messages.append({
                        "topic": message.topic,
                        "partition": message.partition,
                        "offset": message.offset,
                        "timestamp": event.get('timestamp'),
                        "event_type": event.get('event_type'),
                        "student_id": event.get('student_id'),
                        "data": event.get('data', {}),
                    })

                # Limit for token efficiency
                if len(messages) >= 10:
                    break

            consumer.close()

        except ImportError:
            # Mock response for development
            return {
                "status": "success",
                "topic": topic,
                "message_count": 0,
                "messages": [],
                "note": "No messages - install kafka-python for production",
            }

        return {
            "status": "success",
            "topic": topic,
            "message_count": len(messages),
            "messages": messages[:10],  # Limit to 10
        }

    except Exception as e:
        return {
            "status": "error",
            "topic": topic,
            "error": str(e)[:100],
        }

__all__ = ["subscribe_to_events"]
