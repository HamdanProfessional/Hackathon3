#!/bin/bash
set -e

NAMESPACE=${POSTGRES_NAMESPACE:-postgres}
DB_NAME=${DB_NAME:-learnflow}
DB_USER=${DB_USER:-learnflow}

echo "Running database migrations..."

# Get migrations directory
MIGRATIONS_DIR=${1:-"./migrations"}

if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "No migrations directory found"
    exit 0
fi

# Run each migration file
for migration in "$MIGRATIONS_DIR"/*.sql; do
    if [ -f "$migration" ]; then
        echo "Applying: $(basename $migration)"
        kubectl exec -n "$NAMESPACE" postgres-0 -- psql -U "$DB_USER" -d "$DB_NAME" -f - < "$migration"
    fi
done

echo "✓ Migrations applied"
