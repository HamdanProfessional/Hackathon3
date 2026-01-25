#!/bin/bash
set -e

APP_NAME=${1:?Usage: ingress.sh <app-name> [host]}
HOST=${2:-learnflow.local}
NAMESPACE=${NAMESPACE:-learnflow}

echo "Setting up ingress for $APP_NAME..."

kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: $APP_NAME-ingress
  namespace: $NAMESPACE
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: $HOST
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: $APP_NAME
            port:
              number: 3000
EOF

echo "✓ Ingress configured"
echo "  Host: $HOST"
echo "  To access locally, add to /etc/hosts:"
echo "    $(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}') $HOST"
