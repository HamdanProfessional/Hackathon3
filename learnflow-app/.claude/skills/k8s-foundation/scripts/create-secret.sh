#!/bin/bash
set -e

NAME=""
NAMESPACE="default"
LITERALS=()

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --name)
      NAME="$2"
      shift 2
      ;;
    --namespace)
      NAMESPACE="$2"
      shift 2
      ;;
    --literal)
      LITERALS+=("$2")
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

if [ -z "$NAME" ]; then
  echo "Usage: create-secret.sh --name <name> [--namespace <ns>] --literal KEY=value"
  exit 1
fi

if [ ${#LITERALS[@]} -eq 0 ]; then
  echo "✗ At least one --literal required"
  exit 1
fi

echo "Creating Secret '$NAME' in namespace '$NAMESPACE'..."

# Build command
CMD="kubectl create secret generic $NAME --namespace=$NAMESPACE"

for literal in "${LITERALS[@]}"; do
  CMD="$CMD --from-literal=$literal"
done

# Execute
eval $CMD

echo "✓ Secret '$NAME' created"
