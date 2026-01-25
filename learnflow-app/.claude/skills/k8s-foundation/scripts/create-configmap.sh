#!/bin/bash
set -e

NAME=""
NAMESPACE="default"
FILE=""
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
    --file)
      FILE="$2"
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
  echo "Usage: create-configmap.sh --name <name> [--namespace <ns>] [--file <file>] [--literal KEY=value]"
  exit 1
fi

echo "Creating ConfigMap '$NAME' in namespace '$NAMESPACE'..."

# Build command
CMD="kubectl create configmap $NAME --namespace=$NAMESPACE"

if [ -n "$FILE" ]; then
  if [ ! -f "$FILE" ]; then
    echo "✗ File not found: $FILE"
    exit 1
  fi
  CMD="$CMD --from-file=$FILE"
fi

for literal in "${LITERALS[@]}"; do
  CMD="$CMD --from-literal=$literal"
done

# Execute
eval $CMD

echo "✓ ConfigMap '$NAME' created"
