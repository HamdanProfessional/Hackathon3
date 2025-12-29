#!/bin/bash
set -e

NAMESPACE=${POSTGRES_NAMESPACE:-postgres}
DB_NAME=${DB_NAME:-learnflow}
DB_USER=${DB_USER:-learnflow}
DB_PASSWORD=${DB_PASSWORD:-learnflow123}

echo "Deploying PostgreSQL to namespace '$NAMESPACE'..."

helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

helm upgrade --install postgres bitnami/postgresql \
  --namespace "$NAMESPACE" \
  --set auth.database="$DB_NAME" \
  --set auth.username="$DB_USER" \
  --set auth.password="$DB_PASSWORD" \
  --set persistence.enabled=false \
  --wait \
  --timeout 5m

echo "✓ PostgreSQL deployed to namespace '$NAMESPACE'"
echo "  Connection: postgres.$NAMESPACE.svc.cluster.local:5432"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
