# PostgreSQL Kubernetes Setup - Reference Guide

## Configuration

### Connection Details
- Host: `postgres.postgres.svc.cluster.local`
- Port: `5432`
- Database: `learnflow`
- User: `learnflow` (default)

### LearnFlow Database Schema
- `users` - Student and teacher accounts
- `conversations` - AI chat history
- `exercises` - Coding challenges
- `submissions` - Code submissions
- `progress` - Learning progress tracking

## Migration Scripts

### Alembic Setup
```bash
alembic init alembic
alembic revision --autogenerate -m "Initial schema"
alembic upgrade head
```

### Running Migrations in Kubernetes
```bash
kubectl exec -it -n postgres postgres-0 -- psql -U learnflow -d learnflow -f /migrations/001_initial.sql
```

## Backup and Restore

### Backup
```bash
kubectl exec -n postgres postgres-0 -- pg_dump -U learnflow learnflow > backup.sql
```

### Restore
```bash
cat backup.sql | kubectl exec -i -n postgres postgres-0 -- psql -U learnflow -d learnflow
```

## Dapr State Store Configuration

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: postgres-statestore
spec:
  type: state.postgresql
  version: v1
  metadata:
  - name: connectionString
    value: "host=postgres.postgres.svc.cluster.local user=learnflow password=learnflow123 port=5432 database=learnflow"
```
