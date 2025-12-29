#!/bin/bash
set -e

NAMESPACE=${KAFKA_NAMESPACE:-kafka}
REPLICAS=${KAFKA_REPLICAS:-1}

echo "Deploying Kafka to namespace '$NAMESPACE'..."

# Add Bitnami Helm repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Create namespace if not exists
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

# Deploy Kafka using Bitnami chart
helm upgrade --install kafka bitnami/kafka \
  --namespace "$NAMESPACE" \
  --set replicaCount="$REPLICAS" \
  --set zookeeper.replicaCount=1 \
  --set persistence.enabled=false \
  --wait \
  --timeout 5m

echo "Kafka deployed successfully to namespace '$NAMESPACE'"
