#!/usr/bin/env python3
"""Verify Kafka deployment on Kubernetes."""
import subprocess
import json
import sys

NAMESPACE = "kafka"

def run_kubectl(cmd):
    result = subprocess.run(
        f"kubectl {cmd}",
        shell=True,
        capture_output=True,
        text=True
    )
    return result

# Check pods
result = run_kubectl(f"get pods -n {NAMESPACE} -o json")
if result.returncode != 0:
    print(f"Error: {result.stderr}")
    sys.exit(1)

pods = json.loads(result.stdout)["items"]
running = sum(1 for p in pods if p["status"]["phase"] == "Running")
total = len(pods)

if running == total:
    print(f"✓ All {total} Kafka pods running")
    sys.exit(0)
else:
    print(f"✗ {running}/{total} pods running")
    for pod in pods:
        name = pod["metadata"]["name"]
        phase = pod["status"]["phase"]
        print(f"  {name}: {phase}")
    sys.exit(1)
