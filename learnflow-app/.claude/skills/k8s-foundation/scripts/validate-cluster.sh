#!/bin/bash
set -e

echo "Validating Kubernetes cluster..."

# Check cluster info
if kubectl cluster-info &>/dev/null; then
  echo "✓ Cluster is accessible"
else
  echo "✗ Cluster is not accessible"
  exit 1
fi

# Check nodes
NODES=$(kubectl get nodes --no-headers 2>/dev/null | wc -l)
if [ "$NODES" -gt 0 ]; then
  echo "✓ $NODES node(s) available"
else
  echo "✗ No nodes available"
  exit 1
fi

# Check namespaces
NS_COUNT=$(kubectl get namespaces --no-headers 2>/dev/null | wc -l)
echo "✓ $NS_COUNT namespace(s) available"

# Check system pods
SYSTEM_PODS=$(kubectl get pods -n kube-system --no-headers 2>/dev/null | wc -l)
echo "✓ $SYSTEM_PODS system pod(s) running"

echo ""
echo "Cluster validation complete"
