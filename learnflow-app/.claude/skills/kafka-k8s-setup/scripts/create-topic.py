#!/usr/bin/env python3
"""Create a Kafka topic for LearnFlow."""
import argparse
import subprocess

def create_topic(name, partitions=3, replication_factor=1):
    """Create topic in Kafka."""
    cmd = [
        "kubectl", "exec", "-it", "-n", "kafka", "kafka-0", "--",
        "kafka-topics.sh", "--create",
        "--bootstrap-server", "localhost:9092",
        "--topic", name,
        "--partitions", str(partitions),
        "--replication-factor", str(replication_factor)
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    print(result.stdout)
    return result.returncode == 0

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create Kafka topic")
    parser.add_argument("--name", required=True, help="Topic name")
    parser.add_argument("--partitions", type=int, default=3)
    parser.add_argument("--replication-factor", type=int, default=1)
    args = parser.parse_args()

    if create_topic(args.name, args.partitions, args.replication_factor):
        print(f"✓ Topic '{args.name}' created")
    else:
        print(f"✗ Failed to create topic '{args.name}'")
