#!/usr/bin/env python3
"""Verify PostgreSQL deployment on Kubernetes."""
import subprocess
import json
import sys

NAMESPACE = "postgres"

def run_kubectl(cmd):
    result = subprocess.run(
        f"kubectl {cmd}",
        shell=True,
        capture_output=True,
        text=True
    )
    return result

# Check pod status
result = run_kubectl(f"get pods -n {NAMESPACE} -o json")
if result.returncode != 0:
    print(f"Error: {result.stderr}")
    sys.exit(1)

pods = json.loads(result.stdout)["items"]
if not pods:
    print("✗ No PostgreSQL pods found")
    sys.exit(1)

pod = pods[0]
phase = pod["status"]["phase"]

if phase == "Running":
    print(f"✓ PostgreSQL pod running: {pod['metadata']['name']}")
    sys.exit(0)
else:
    print(f"✗ PostgreSQL pod status: {phase}")
    sys.exit(1)
