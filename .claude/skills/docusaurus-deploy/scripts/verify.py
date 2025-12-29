#!/usr/bin/env python3
"""Verify Docusaurus documentation deployment."""
import subprocess
import sys

NAMESPACE = "docs"

def verify_deployment():
    """Verify docs deployment."""
    print("Verifying documentation deployment...")

    # Check deployment
    result = subprocess.run(
        f"kubectl get deployment learnflow-docs -n {NAMESPACE}",
        shell=True,
        capture_output=True
    )

    if result.returncode == 0:
        print("✓ Docs deployment exists")

        # Check if ready
        result = subprocess.run(
            f"kubectl get deployment learnflow-docs -n {NAMESPACE} -o json",
            shell=True,
            capture_output=True,
            text=True
        )
        import json
        deployment = json.loads(result.stdout)
        ready = deployment["status"].get("readyReplicas", 0)
        if ready > 0:
            print(f"✓ {ready} pod(s) ready")
        else:
            print("⚠ Waiting for pods to be ready")
        return True
    else:
        print("✗ Docs deployment not found")
        return False

if __name__ == "__main__":
    if verify_deployment():
        sys.exit(0)
    else:
        sys.exit(1)
