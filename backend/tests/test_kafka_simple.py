#!/usr/bin/env python3
"""Test Kafka connection to Redpanda - simple version"""
import subprocess
import sys

# Configure UTF-8 for Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Run Kafka connection test
result = subprocess.run([
    "kubectl", "run", "-i", "--rm", "--restart=Never",
    "kafka-test", "--image=python:3.11-slim", "-n", "learnflow", "--",
    "sh", "-c",
    "pip install confluent-kafka 2>&1 | tail -3 && " +
    "python -c \"" +
    "from confluent_kafka import Producer; " +
    "p = Producer({'bootstrap.servers': 'redpanda.redpanda-system.svc.cluster.local:9093'}); " +
    "p.produce('learning.progress', b'test', b'{\\\"test\\\": true}'); " +
    "p.flush(5); " +
    "print('Kafka connection: SUCCESS')\""
], capture_output=True, text=True, timeout=120)

print(result.stdout)
if result.stderr:
    print("Errors:", result.stderr)

if "Kafka connection: SUCCESS" in result.stdout:
    print("\n[Kafka Direct Client] Test PASSED")
    sys.exit(0)
else:
    print("\n[Kafka Direct Client] Test FAILED")
    sys.exit(1)
