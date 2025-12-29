#!/bin/bash
set -e

NAMESPACE=${1:?Usage: create-namespace.sh --name <namespace>}
shift 2>/dev/null || true

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --name)
      NAMESPACE="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

echo "Creating namespace '$NAMESPACE'..."

# Check if namespace exists
if kubectl get namespace "$NAMESPACE" &>/dev/null; then
  echo "✓ Namespace '$NAMESPACE' already exists"
  exit 0
fi

# Create namespace
kubectl create namespace "$NAMESPACE"

# Add labels
kubectl label namespace "$NAMESPACE" app=learnflow --overwrite

echo "✓ Namespace '$NAMESPACE' created"
