"""
Direct Kafka Client for LearnFlow Services
Works with Redpanda (Kafka-compatible) bypassing Dapr pubsub limitations

Usage:
    from common.kafka_client import get_kafka_producer, publish_event
    from common.kafka_client import get_kafka_consumer, consume_events

    # Publish event
    publish_event("learning.progress", {"student_id": "123", "mastery": 75})

    # Consume events
    for event in consume_events("learning.progress", group_id="learnflow-group"):
        print(event)
"""
import json
import logging
import os
from typing import Dict, Any, Callable, Optional, AsyncIterator
from confluent_kafka import Producer, Consumer, KafkaError, KafkaException
import asyncio
from threading import Thread

logger = logging.getLogger(__name__)

# Kafka configuration
KAFKA_BROKERS = os.getenv(
    "KAFKA_BROKERS",
    "redpanda.redpanda-system.svc.cluster.local:9093"
)


def get_kafka_producer() -> Producer:
    """
    Get a configured Kafka producer.

    Returns:
        confluent_kafka.Producer: Configured producer instance
    """
    config = {
        'bootstrap.servers': KAFKA_BROKERS,
        'client.id': 'learnflow-producer',
        'acks': 'all',  # Wait for all replicas to acknowledge
        'compression.type': 'snappy',
        'linger.ms': '10',
        'enable.idempotence': 'true',
        'delivery.timeout.ms': '30000',
    }

    logger.info(f"Creating Kafka producer for {KAFKA_BROKERS}")
    return Producer(config)


def get_kafka_consumer(
    group_id: str = "learnflow-group",
    auto_offset_reset: str = "latest"
) -> Consumer:
    """
    Get a configured Kafka consumer.

    Args:
        group_id: Consumer group ID
        auto_offset_reset: Where to start reading ('earliest' or 'latest')

    Returns:
        confluent_kafka.Consumer: Configured consumer instance
    """
    config = {
        'bootstrap.servers': KAFKA_BROKERS,
        'group.id': group_id,
        'auto.offset.reset': auto_offset_reset,
        'enable.auto.commit': 'true',
        'session.timeout.ms': '30000',
        'heartbeat.interval.ms': '3000',
        'max.poll.interval.ms': '300000',
    }

    logger.info(f"Creating Kafka consumer for {KAFKA_BROKERS}, group: {group_id}")
    return Consumer(config)


def publish_event(topic: str, event_data: Dict[str, Any], key: Optional[str] = None) -> bool:
    """
    Publish an event to Kafka topic.

    Args:
        topic: Kafka topic name
        event_data: Event data as dictionary
        key: Optional partition key

    Returns:
        bool: True if published successfully, False otherwise
    """
    try:
        producer = get_kafka_producer()

        # Convert event to JSON bytes
        value = json.dumps(event_data).encode('utf-8')

        # Callback for delivery reports
        def delivery_report(err, msg):
            if err is not None:
                logger.error(f"Failed to deliver message to {msg.topic()}: {err}")
            else:
                logger.info(f"Event published to {msg.topic()} [partition {msg.partition()} @ offset {msg.offset()}]")

        # Produce message
        key_bytes = key.encode('utf-8') if key else None
        producer.produce(
            topic=topic,
            key=key_bytes,
            value=value,
            on_delivery=delivery_report
        )

        # Flush to ensure delivery
        producer.flush(timeout=10)
        logger.info(f"Published event to {topic}: {event_data}")
        return True

    except KafkaException as e:
        logger.error(f"Kafka error publishing to {topic}: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error publishing to {topic}: {e}")
        return False
    finally:
        # Producer is automatically cleaned up
        pass


def publish_event_async(topic: str, event_data: Dict[str, Any]) -> bool:
    """
    Publish an event asynchronously (non-blocking).
    Useful for fire-and-forget scenarios.

    Args:
        topic: Kafka topic name
        event_data: Event data as dictionary

    Returns:
        bool: True if initiated successfully
    """
    try:
        # Run in background thread to avoid blocking
        def publish_in_background():
            publish_event(topic, event_data)

        thread = Thread(target=publish_in_background, daemon=True)
        thread.start()
        return True

    except Exception as e:
        logger.error(f"Error in async publish to {topic}: {e}")
        return False


def consume_events(
    topic: str,
    group_id: str = "learnflow-group",
    auto_offset_reset: str = "latest",
    timeout: float = 1.0
) -> Callable[[Callable[[Dict[str, Any]], None]], None]:
    """
    Generator function that yields callback for processing consumed events.
    This is a synchronous consumer meant for background processing.

    Args:
        topic: Kafka topic to consume from
        group_id: Consumer group ID
        auto_offset_reset: Where to start reading ('earliest' or 'lastest')
        timeout: Poll timeout in seconds

    Yields:
        Callable[[Callable], None]: Function to register message handler

    Example:
        for handler in consume_events("learning.progress"):
            @handler
            def handle_event(event):
                print(event)

    Usage:
        # Start consumption in background thread
        def start_consumer():
            for handler in consume_events("learning.progress"):
                @handler
                def process_event(event):
                    print(f"Got event: {event}")
        thread = Thread(target=start_consumer, daemon=True)
        thread.start()
    """
    def consumer_wrapper(callback: Callable[[Dict[str, Any]], None]) -> None:
        consumer = None
        try:
            consumer = get_kafka_consumer(group_id, auto_offset_reset)
            consumer.subscribe([topic])

            logger.info(f"Starting to consume from {topic}, group: {group_id}")

            while True:
                msg = consumer.poll(timeout=timeout)

                if msg is None:
                    continue

                if msg.error():
                    logger.error(f"Consumer error: {msg.error()}")
                    continue

                try:
                    # Parse JSON value
                    event_data = json.loads(msg.value().decode('utf-8'))
                    # Add metadata
                    event_data['_kafka_metadata'] = {
                        'topic': msg.topic(),
                        'partition': msg.partition(),
                        'offset': msg.offset(),
                        'key': msg.key().decode('utf-8') if msg.key() else None
                    }
                    callback(event_data)
                except json.JSONDecodeError as e:
                    logger.error(f"Failed to parse event JSON: {e}, value: {msg.value()}")
                except Exception as e:
                    logger.error(f"Error processing event: {e}")

        except KafkaException as e:
            logger.error(f"Kafka consumer error: {e}")
        finally:
            if consumer:
                consumer.close()

    return consumer_wrapper


def create_event_consumer(
    topics: list[str],
    group_id: str = "learnflow-group",
    callback: Callable[[Dict[str, Any]], None],
    auto_offset_reset: str = "latest"
) -> Thread:
    """
    Create a background thread that consumes events from multiple topics.

    Args:
        topics: List of topics to consume
        group_id: Consumer group ID
        callback: Function to call for each event
        auto_offset_reset: Where to start reading

    Returns:
        Thread: Background consumer thread
    """
    def consume():
        consumer = None
        try:
            consumer = get_kafka_consumer(group_id, auto_offset_reset)
            consumer.subscribe(topics)

            logger.info(f"Background consumer started for topics: {topics}, group: {group_id}")

            while True:
                msg = consumer.poll(timeout=1.0)

                if msg is None:
                    continue

                if msg.error():
                    logger.error(f"Consumer error: {msg.error()}")
                    continue

                try:
                    event_data = json.loads(msg.value().decode('utf-8'))
                    event_data['_kafka_metadata'] = {
                        'topic': msg.topic(),
                        'partition': msg.partition(),
                        'offset': msg.offset(),
                        'key': msg.key().decode('utf-8') if msg.key() else None
                    }
                    callback(event_data)
                except Exception as e:
                    logger.error(f"Error in background consumer: {e}")

        except Exception as e:
            logger.error(f"Background consumer error: {e}")
        finally:
            if consumer:
                consumer.close()

    thread = Thread(target=consume, daemon=True)
    thread.start()
    logger.info(f"Background consumer thread started for topics: {topics}")
    return thread


# Async version for FastAPI endpoints
async def publish_event_async(topic: str, event_data: Dict[str, Any]) -> bool:
    """
    Async wrapper for publishing events (for use in FastAPI endpoints).

    Args:
        topic: Kafka topic name
        event_data: Event data as dictionary

    Returns:
        bool: True if published successfully
    """
    # Run in thread pool to avoid blocking
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, publish_event, topic, event_data)


# Async consumer generator
async def consume_events_async(
    topics: list[str],
    group_id: str = "learnflow-group",
    timeout: float = 1.0
) -> AsyncIterator[Dict[str, Any]]:
    """
    Async generator that yields events from Kafka.
    Useful for async service integration.

    Args:
        topics: List of topics to consume
        group_id: Consumer group ID
        timeout: Poll timeout in seconds

    Yields:
        Dict[str, Any]: Event data with metadata

    Example:
        async for event in consume_events_async(["learning.progress"]):
            print(event)
    """
    # This would require aiokafka for true async consumption
    # For now, use a thread-based approach
    queue = asyncio.Queue()

    def callback(event):
        queue.put_nowait(event)

    create_event_consumer(topics, group_id, callback)

    while True:
        try:
            event = queue.get()
            yield event
        except asyncio.CancelledError:
            logger.info("Async consumer cancelled")
            break


# Topic definitions
class Topics:
    """Kafka topic names used across LearnFlow"""
    LEARNING_PROGRESS = "learning.progress"
    CODE_SUBMISSION = "code.submission"
    EXERCISE_ATTEMPT = "exercise.attempt"
    STRUGGLE_ALERT = "struggle.alert"
    LEARNING_TRIAGE = "learning.triage"
    LEARNING_CONCEPT = "learning.concept"
    CODE_DEBUG = "code.debug"
    CODE_REVIEW = "code.review"

    ALL_TOPICS = [
        LEARNING_PROGRESS,
        CODE_SUBMISSION,
        EXERCISE_ATTEMPT,
        STRUGGLE_ALERT,
        LEARNING_TRIAGE,
        LEARNING_CONCEPT,
        CODE_DEBUG,
        CODE_REVIEW,
    ]


# Convenience functions
def publish_progress_event(student_id: str, mastery_data: Dict[str, Any]) -> bool:
    """Publish student progress event"""
    return publish_event(Topics.LEARNING_PROGRESS, {
        "student_id": student_id,
        **mastery_data
    })


def publish_code_submission(submission_id: str, student_id: str, code: str) -> bool:
    """Publish code submission event"""
    return publish_event(Topics.CODE_SUBMISSION, {
        "submission_id": submission_id,
        "student_id": student_id,
        "code_length": len(code),
        "submitted_at": asyncio.get_event_loop().time() if asyncio else None
    })


def publish_exercise_attempt(exercise_id: str, student_id: str, passed: bool) -> bool:
    """Publish exercise attempt event"""
    return publish_event(Topics.EXERCISE_ATTEMPT, {
        "exercise_id": exercise_id,
        "student_id": student_id,
        "passed": passed,
        "timestamp": asyncio.get_event_loop().time() if asyncio else None
    })


def publish_struggle_alert(student_id: str, alert_type: str, details: Dict[str, Any]) -> bool:
    """Publish struggle detection alert"""
    return publish_event(Topics.STRUGGLE_ALERT, {
        "student_id": student_id,
        "alert_type": alert_type,
        "severity": details.get("severity", "medium"),
        "details": details
    })
