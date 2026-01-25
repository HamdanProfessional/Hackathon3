"""
publish_struggle_alert: Publish struggle alert events to Kafka
High-priority alerts for teacher intervention.
"""
import json
import time
from typing import Dict, Any
from config import settings_kafka, STRUGGLE_TOPICS

def publish_struggle_alert(student_id: str, alert_type: str, severity: str, message: str) -> Dict[str, Any]:
    """
    Publish a struggle alert event to Kafka.

    Args:
        student_id: Student identifier
        alert_type: Type of alert (e.g., 'repeated_error', 'time_exceeded', 'help_requested')
        severity: Severity level ('low', 'medium', 'high')
        message: Human-readable alert message

    Returns:
    - status: success/error
    - topic: str
    - alert_id: str

    Topics follow pattern: struggle.{alert_type}
    """
    try:
        # Build topic name
        topic = f"struggle.{alert_type}"

        # Validate severity
        if severity not in ['low', 'medium', 'high']:
            severity = 'medium'

        # Build alert event
        alert = {
            "alert_id": f"{student_id}-{alert_type}-{int(time.time())}",
            "alert_type": alert_type,
            "student_id": student_id,
            "severity": severity,
            "message": message[:500],  # Limit message length
            "timestamp": int(time.time()),
            "resolved": False,
        }

        try:
            from kafka import KafkaProducer

            producer = KafkaProducer(
                bootstrap_servers=settings_kafka.bootstrap_servers,
                value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                request_timeout_ms=5000,
                retries=2,
            )

            future = producer.send(topic, value=alert)
            record_metadata = future.get(timeout=5)

            producer.close()

            return {
                "status": "success",
                "topic": record_metadata.topic,
                "offset": record_metadata.offset,
                "alert_id": alert["alert_id"],
            }

        except ImportError:
            # Mock response for development
            return {
                "status": "success",
                "topic": topic,
                "alert_id": alert["alert_id"],
                "message": "Alert published (mock mode - install kafka-python for production)",
            }

    except Exception as e:
        return {
            "status": "error",
            "error": str(e)[:100],
        }

__all__ = ["publish_struggle_alert"]
