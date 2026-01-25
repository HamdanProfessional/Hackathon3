#!/bin/bash
set -e

NAMESPACE=${KAFKA_NAMESPACE:-kafka}
REPLICAS=${KAFKA_REPLICAS:-1}
CHART_VERSION=${KAFKA_CHART_VERSION:-29.3.14}

echo "Deploying Kafka to namespace '$NAMESPACE'..."

# Add Bitnami Helm repository
helm repo add bitnami https://charts.bitnami.com/bitnami 2>/dev/null || true
helm repo update > /dev/null 2>&1

# Create namespace if not exists
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

# Deploy Kafka using Bitnami chart (version 29.x with Zookeeper)
# Using minimal resource settings for development
helm upgrade --install kafka bitnami/kafka \
  --namespace "$NAMESPACE" \
  --version "$CHART_VERSION" \
  --set replicaCount="$REPLICAS" \
  --set zookeeper.replicaCount=1 \
  --set zookeeper.resources.requests.memory=128Mi \
  --set zookeeper.resources.requests.cpu=50m \
  --set zookeeper.persistence.enabled=false \
  --set resources.requests.memory=256Mi \
  --set resources.requests.cpu=100m \
  --set persistence.enabled=false \
  --set allowContainerResourceQuotaOverride=true \
  --wait \
  --timeout 10m

echo "Kafka deployed successfully to namespace '$NAMESPACE'"
