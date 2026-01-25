"""
get_event_history: Query event history from event store
Returns summarized history for token efficiency.
"""
import json
from typing import Dict, Any, List, Optional
from config import settings_kafka

def get_event_history(student_id: str = None, topic: str = None, limit: int = 10) -> Dict[str, Any]:
    """
    Get event history from event store.

    Args:
        student_id: Optional filter for specific student
        topic: Optional filter for specific topic
        limit: Maximum events to return (default 10)

    Returns:
    - status: success/error
    - total_events: int
    - events: list of event summaries

    Token-efficient: Returns summary only, not full event data.
    """
    try:
        events = []

        try:
            from kafka import KafkaConsumer

            # Build topics list
            topics = [topic] if topic else [
                "learning.exercise.completed",
                "learning.exercise.failed",
                "learning.quiz.passed",
                "struggle.repeated_error",
                "struggle.time_exceeded",
            ]

            consumer = KafkaConsumer(
                *topics,
                bootstrap_servers=settings_kafka.bootstrap_servers,
                group_id=f"{settings_kafka.consumer_group}-history",
                auto_offset_reset='earliest',
                enable_auto_commit=False,
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                consumer_timeout_ms=2000,
            )

            for message in consumer:
                event = message.value

                # Filter by student_id if provided
                if student_id is None or event.get('student_id') == student_id:
                    events.append({
                        "timestamp": event.get('timestamp'),
                        "topic": message.topic,
                        "event_type": event.get('event_type'),
                        "student_id": event.get('student_id'),
                    })

                if len(events) >= limit:
                    break

            consumer.close()

        except ImportError:
            # Mock response for development
            return {
                "status": "success",
                "student_id": student_id,
                "topic": topic,
                "total_events": 0,
                "events": [],
                "note": "No history - install kafka-python for production",
            }

        # Sort by timestamp (newest first)
        events.sort(key=lambda e: e.get('timestamp', 0), reverse=True)

        return {
            "status": "success",
            "student_id": student_id,
            "topic": topic,
            "total_events": len(events),
            "events": events[:limit],
        }

    except Exception as e:
        return {
            "status": "error",
            "error": str(e)[:100],
        }

__all__ = ["get_event_history"]
