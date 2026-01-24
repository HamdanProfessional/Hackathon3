#!/usr/bin/env python3
"""
Test Kafka connectivity to Redpanda from learnflow namespace
"""
import subprocess
import sys
import json

# Test Kafka connectivity by producing an event
test_code = """
import sys
sys.path.insert(0, "/app")

# Test 1: Import confluent_kafka
try:
    from confluent_kafka import Producer
    print("✓ confluent-kafka package imported")
except ImportError as e:
    print(f"✗ confluent-kafka not installed: {e}")
    sys.exit(1)

# Test 2: Create producer
config = {
    'bootstrap.servers': 'redpanda.redpanda-system.svc.cluster.local:9093',
    'client.id': 'kafka-test',
    'acks': 'all',
    'message.timeout.ms': '5000',
}
producer = Producer(config)
print("✓ Kafka producer created")

# Test 3: Publish test event
topic = "learning.progress"
event = {
    "student_id": "test-student",
    "action": "test_event",
    "mastery": 75,
    "timestamp": "2026-01-24T17:30:00Z"
}

def delivery_report(err, msg):
    if err:
        print(f"✗ Delivery failed: {err}")
    else:
        print(f"✓ Event delivered to {msg.topic()} [{msg.partition()} @ offset {msg.offset()}]")

try:
    producer.produce(
        topic=topic,
        key=b"test-student",
        value=json.dumps(event).encode('utf-8'),
        on_delivery=delivery_report
    )
    producer.flush(timeout=10)
    print(f"✓ Test event published to {topic}")
    print(f"  Event: {event}")
except Exception as e:
    print(f"✗ Publish failed: {e}")
    sys.exit(1)

print("\\n=== Kafka Connectivity Test: PASSED ===")
"""

# Run test in learnflow namespace
result = subprocess.run([
    "kubectl", "run", "-i", "--rm", "--restart=Never",
    "--image=confluentinc/cp-kafka:latest",
    "-n", "learnflow",
    "--", "python3", "-c", test_code
], capture_output=True, text=True, timeout=60)

print(result.stdout)
if result.stderr:
    print(result.stderr)

if result.returncode == 0:
    print("\n✓ Kafka client integration is working!")
else:
    print(f"\n✗ Kafka test failed with exit code {result.returncode}")
    sys.exit(1)
