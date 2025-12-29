#!/bin/bash
set -e

DOCS_DIR=${1:-.}
NAMESPACE=${NAMESPACE:-docs}

echo "Deploying Docusaurus docs..."

cd $DOCS_DIR

# Build documentation
npm run build

# Build Docker image
docker build -t learnflow-docs:latest -f Dockerfile.docs .

# Tag for registry
REGISTRY=${REGISTRY:-localhost:5001}
docker tag learnflow-docs:latest $REGISTRY/learnflow-docs:latest
docker push $REGISTRY/learnflow-docs:latest

# Deploy to Kubernetes
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: learnflow-docs
  namespace: $NAMESPACE
spec:
  replicas: 1
  selector:
    matchLabels:
      app: learnflow-docs
  template:
    metadata:
      labels:
        app: learnflow-docs
    spec:
      containers:
      - name: docs
        image: $REGISTRY/learnflow-docs:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: learnflow-docs
  namespace: $NAMESPACE
spec:
  selector:
    app: learnflow-docs
  ports:
  - port: 80
    targetPort: 80
EOF

echo "✓ Documentation deployed"
echo "  Build: ./build/"
