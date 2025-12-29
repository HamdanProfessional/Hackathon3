#!/usr/bin/env python3
"""Verify Next.js deployment on Kubernetes."""
import subprocess
import json
import sys
import time

NAMESPACE = "learnflow"

def run_kubectl(cmd):
    result = subprocess.run(
        f"kubectl {cmd}",
        shell=True,
        capture_output=True,
        text=True
    )
    return result

def verify_deployment(app_name: str):
    """Verify Next.js deployment."""
    print(f"Verifying {app_name}...")

    # Check deployment
    result = run_kubectl(f"get deployment {app_name} -n {NAMESPACE} -o json")
    if result.returncode != 0:
        print(f"✗ Deployment not found")
        return False

    deployment = json.loads(result.stdout)
    ready = deployment["status"]["readyReplicas"]
    desired = deployment["spec"]["replicas"]

    if ready == desired:
        print(f"✓ All {ready} pods ready")
    else:
        print(f"⚠ {ready}/{desired} pods ready")

    # Check service
    result = run_kubectl(f"get svc {app_name} -n {NAMESPACE}")
    if result.returncode == 0:
        print(f"✓ Service exists")
    else:
        print(f"✗ Service not found")
        return False

    return True

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Verify Next.js deployment")
    parser.add_argument("--name", required=True, help="App name")
    args = parser.parse_args()

    if verify_deployment(args.name):
        sys.exit(0)
    else:
        sys.exit(1)
