# Phase 3 Infrastructure: Task Breakdown

**Interactive Checklist**: Use this to track progress during implementation
**Total Tasks**: 9
**Estimated Duration**: 2-3 hours

---

## Task Overview

| # | Task | Complexity | Dependencies | Status |
|---|------|------------|--------------|--------|
| 1 | Create Kubernetes Namespaces | Simple | None | ✅ |
| 2 | Deploy Apache Kafka | Moderate | 1 | ✅ |
| 3 | Create Kafka Topics | Simple | 2 | ✅ |
| 4 | Verify Kafka Deployment | Simple | 3 | ✅ |
| 5 | Deploy PostgreSQL | Moderate | 1 | ✅ |
| 6 | Verify PostgreSQL Deployment | Simple | 5 | ✅ |
| 7 | Store Connection Configuration | Simple | 4, 6 | ✅ |
| 8 | Run Comprehensive Health Check | Simple | All | ✅ |
| 9 | Document and Commit | Simple | 8 | 🔄 |

---

## Task Details

### Task 1: Create Kubernetes Namespaces

**Status**: ⬜ Not Started

**Description**: Create three namespaces for organizing infrastructure components.

**Skill Used**: `k8s-foundation`

**Commands**:
```bash
# Create kafka namespace
./.claude/skills/k8s-foundation/scripts/create-namespace.sh kafka

# Create postgres namespace
./.claude/skills/k8s-foundation/scripts/create-namespace.sh postgres

# Create learnflow namespace (for Phase 4)
./.claude/skills/k8s-foundation/scripts/create-namespace.sh learnflow
```

**Verification**:
```bash
kubectl get namespaces
# Expected output: kafka, postgres, learnflow listed
```

**Acceptance Criteria**:
- [ ] Namespace `kafka` created and labeled
- [ ] Namespace `postgres` created and labeled
- [ ] Namespace `learnflow` created and labeled

**Notes**:
- These namespaces isolate infrastructure components
- Labels enable resource discovery and management

---

### Task 2: Deploy Apache Kafka

**Status**: ⬜ Not Started (depends on Task 1)

**Description**: Deploy Apache Kafka and Zookeeper using Bitnami Helm chart.

**Skill Used**: `kafka-k8s-setup`

**Commands**:
```bash
./.claude/skills/kafka-k8s-setup/scripts/deploy.sh
```

**What the script does**:
1. Adds Bitnami Helm repository
2. Updates Helm repository
3. Deploys Kafka with Zookeeper to `kafka` namespace
4. Configures PVCs for persistent storage
5. Creates ClusterIP service

**Verification**:
```bash
# Check pods
kubectl get pods -n kafka
# Expected: kafka-0 and zookeeper-0 in Running state

# Check service
kubectl get svc -n kafka
# Expected: kafka service on port 9092

# Check PVC
kubectl get pvc -n kafka
# Expected: PVCs in Bound state
```

**Acceptance Criteria**:
- [ ] Kafka pod (kafka-0) in Running state
- [ ] Zookeeper pod (zookeeper-0) in Running state
- [ ] Service `kafka` created on port 9092
- [ ] PVCs created and bound
- [ ] Helm release `kafka` deployed successfully

**Troubleshooting**:
- If pods stuck in Pending: Check Minikube resources
- If pods crash: Check logs with `kubectl logs -n kafka <pod-name>`
- If PVC not binding: Verify storage class with `kubectl get storageclass`

---

### Task 3: Create Kafka Topics

**Status**: ⬜ Not Started (depends on Task 2)

**Description**: Create 4 Kafka topics for agent communication.

**Skill Used**: `kafka-k8s-setup`

**Commands**:
```bash
# Create learning progress topic
python3 .claude/skills/kafka-k8s-setup/scripts/create-topic.py learning.progress

# Create code submission topic
python3 .claude/skills/kafka-k8s-setup/scripts/create-topic.py code.submission

# Create exercise attempt topic
python3 .claude/skills/kafka-k8s-setup/scripts/create-topic.py exercise.attempt

# Create struggle alert topic
python3 .claude/skills/kafka-k8s-setup/scripts/create-topic.py struggle.alert
```

**Alternative (manual)**:
```bash
kubectl exec -n kafka kafka-0 -- kafka-topics.sh \
  --create --topic learning.progress \
  --bootstrap-server localhost:9092 \
  --partitions 1 --replication-factor 1
```

**Verification**:
```bash
kubectl exec -n kafka kafka-0 -- kafka-topics.sh \
  --list --bootstrap-server localhost:9092
# Expected: All 4 topics listed
```

**Acceptance Criteria**:
- [ ] Topic `learning.progress` created
- [ ] Topic `code.submission` created
- [ ] Topic `exercise.attempt` created
- [ ] Topic `struggle.alert` created
- [ ] All topics have 1 partition and replication factor 1

**Notes**:
- Topics use dot notation for hierarchical organization
- Wildcard subscriptions possible (e.g., `learning.*`)

---

### Task 4: Verify Kafka Deployment

**Status**: ⬜ Not Started (depends on Task 3)

**Description**: Run comprehensive verification of Kafka deployment.

**Skill Used**: `kafka-k8s-setup`

**Commands**:
```bash
python3 .claude/skills/kafka-k8s-setup/scripts/verify.py
```

**What the script checks**:
- Pod status (Running)
- Service accessibility
- Topic existence
- Produce/consume test message

**Expected Output**:
```
✓ All Kafka pods running (2/2)
✓ All topics created (4/4)
✓ Test message produced and consumed
✓ Kafka deployment verified successfully
```

**Acceptance Criteria**:
- [ ] All pods Running
- [ ] All topics accessible
- [ ] Test message produced successfully
- [ ] Test message consumed successfully
- [ ] Verification script exits with code 0

---

### Task 5: Deploy PostgreSQL

**Status**: ⬜ Not Started (depends on Task 1)

**Description**: Deploy PostgreSQL using Bitnami Helm chart.

**Skill Used**: `postgres-k8s-setup`

**Commands**:
```bash
./.claude/skills/postgres-k8s-setup/scripts/deploy.sh
```

**What the script does**:
1. Adds Bitnami Helm repository (if not exists)
2. Deploys PostgreSQL to `postgres` namespace
3. Creates database `learnflow`
4. Creates user `learnflow_user` with auto-generated password
5. Configures PVC for persistent storage
6. Creates Secret with credentials

**Verification**:
```bash
# Check pod
kubectl get pods -n postgres
# Expected: postgres-postgresql-0 in Running state

# Check service
kubectl get svc -n postgres
# Expected: postgres-postgresql service on port 5432

# Check secret
kubectl get secret -n postgres
# Expected: postgres-postgresql secret
```

**Acceptance Criteria**:
- [ ] PostgreSQL pod in Running state
- [ ] Service `postgres-postgresql` on port 5432
- [ ] Database `learnflow` created
- [ ] User `learnflow_user` created
- [ ] Secret `postgres-postgresql` contains credentials
- [ ] PVC created and bound

**Notes**:
- Password is auto-generated and stored in Secret
- Retrieve password with: `kubectl get secret -n postgres postgres-postgresql -o jsonpath="{.data.password}" | base64 -d`

---

### Task 6: Verify PostgreSQL Deployment

**Status**: ⬜ Not Started (depends on Task 5)

**Description**: Run comprehensive verification of PostgreSQL deployment.

**Skill Used**: `postgres-k8s-setup`

**Commands**:
```bash
python3 .claude/skills/postgres-k8s-setup/scripts/verify.py
```

**What the script checks**:
- Pod status (Running)
- Database connectivity
- Query execution

**Expected Output**:
```
✓ PostgreSQL pod running
✓ Database 'learnflow' accessible
✓ Test query successful: SELECT 1;
✓ PostgreSQL deployment verified successfully
```

**Acceptance Criteria**:
- [ ] Pod in Running state
- [ ] Database connection successful
- [ ] Test query executes and returns expected result
- [ ] Verification script exits with code 0

---

### Task 7: Store Connection Configuration

**Status**: ⬜ Not Started (depends on Tasks 4, 6)

**Description**: Create ConfigMaps and Secrets in `learnflow` namespace for microservice access.

**Skills Used**: `k8s-foundation`

**Commands**:
```bash
# Kafka ConfigMap
./.claude/skills/k8s-foundation/scripts/create-configmap.sh \
  learnflow kafka-config \
  bootstrap.servers=kafka.kafka.svc.cluster.local:9092

# PostgreSQL ConfigMap
./.claude/skills/k8s-foundation/scripts/create-configmap.sh \
  learnflow postgres-config \
  host=postgres.postgres.svc.cluster.local:5432 \
  database=learnflow \
  username=learnflow_user

# Copy PostgreSQL Secret to learnflow namespace
kubectl get secret -n postgres postgres-postgresql \
  -o yaml | sed 's/namespace: postgres/namespace: learnflow/' | \
  kubectl apply -n learnflow -f -
```

**Verification**:
```bash
# Check ConfigMaps
kubectl get configmap -n learnflow
# Expected: kafka-config, postgres-config

# Check Secret
kubectl get secret -n learnflow
# Expected: postgres-postgresql
```

**Acceptance Criteria**:
- [ ] ConfigMap `kafka-config` created in `learnflow` namespace
- [ ] ConfigMap `postgres-config` created in `learnflow` namespace
- [ ] Secret `postgres-postgresql` copied to `learnflow` namespace
- [ ] Configuration accessible from `learnflow` namespace

**Notes**:
- These ConfigMaps/Secrets enable microservices to discover infrastructure
- Connection strings follow Kubernetes DNS convention: `<service>.<namespace>.svc.cluster.local:<port>`

---

### Task 8: Run Comprehensive Health Check

**Status**: ⬜ Not Started (depends on all previous)

**Description**: Verify all infrastructure components are healthy and ready for Phase 4.

**Commands**:
```bash
# Check all pods across infrastructure namespaces
kubectl get pods -n kafka -n postgres -n learnflow

# Check all services
kubectl get svc -n kafka -n postgres -n learnflow

# Check all PVCs
kubectl get pvc -n kafka -n postgres

# Check all ConfigMaps/Secrets
kubectl get configmap,secret -n learnflow

# Generate status report
cat > phase3-status.txt << EOF
# Phase 3 Infrastructure Status

## Deployment Date
$(date)

## Kafka Status
$(kubectl get pods -n kafka)
$(kubectl get svc -n kafka)
Topics: $(kubectl exec -n kafka kafka-0 -- kafka-topics.sh --list --bootstrap-server localhost:9092)

## PostgreSQL Status
$(kubectl get pods -n postgres)
$(kubectl get svc -n postgres)

## LearnFlow Configuration
$(kubectl get configmap,secret -n learnflow)
EOF

cat phase3-status.txt
```

**Expected Output**:
```
NAME    STATUS    AGE
kafka   Active    30m
postgres Active   25m
learnflow Active  20m

# All pods Running
# All services ClusterIP
# All PVCs Bound
# All ConfigMaps/Secrets present
```

**Acceptance Criteria**:
- [ ] All pods in Running state (3 total: kafka, zookeeper, postgres)
- [ ] All services accessible
- [ ] All PVCs bound
- [ ] All ConfigMaps/Secrets present
- [ ] Status report generated
- [ ] Zero errors in any namespace

---

### Task 9: Document and Commit

**Status**: ⬜ Not Started (depends on Task 8)

**Description**: Document infrastructure deployment and create git commit.

**Documentation**: Create `learnflow-app/docs/infrastructure.md`

```markdown
# Infrastructure Documentation

## Deployment Status
Phase 3 infrastructure deployed: $(date)

## Kafka

### Connection
- Bootstrap Servers: `kafka.kafka.svc.cluster.local:9092`
- Namespace: `kafka`

### Topics
- `learning.progress` - Student learning progress events
- `code.submission` - Code submission events
- `exercise.attempt` - Exercise attempt events
- `struggle.alert` - Struggle detection alerts

## PostgreSQL

### Connection
- Host: `postgres.postgres.svc.cluster.local:5432`
- Database: `learnflow`
- Username: `learnflow_user`
- Password: Stored in Secret `postgres-postgresql` in `postgres` namespace
- Namespace: `postgres`

### Accessing Credentials
\`\`\`bash
# Get password
kubectl get secret -n postgres postgres-postgresql \
  -o jsonpath="{.data.password}" | base64 -d

# Connect
kubectl exec -n postgres postgres-postgresql-0 -- psql \
  -U learnflow_user -d learnflow
\`\`\`

## Configuration

### learnflow Namespace
- ConfigMap `kafka-config`: Kafka connection settings
- ConfigMap `postgres-config`: PostgreSQL connection settings
- Secret `postgres-postgresql`: Database credentials

## Verification
All health checks passed. Infrastructure ready for Phase 4 microservices.
\`EOF\`
```

**Git Commit**:
```bash
# Add all changes
git add specs/phase-3-infrastructure/
git add learnflow-app/docs/infrastructure.md

# Create commit
git commit -m "feat(infra): deploy Phase 3 infrastructure (Kafka + PostgreSQL)

- Deploy Apache Kafka with 4 topics (learning.*, code.*, exercise.*, struggle.*)
- Deploy PostgreSQL with learnflow database
- Create k8s namespaces: kafka, postgres, learnflow
- Configure ConfigMaps and Secrets for microservice access
- Verify all deployments healthy and accessible
- Document connection strings and credential access

Infrastructure ready for Phase 4 backend microservices.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Acceptance Criteria**:
- [ ] Infrastructure documentation created
- [ ] Connection strings documented
- [ ] Credential access instructions documented
- [ ] Git commit created with conventional format
- [ ] All changes staged and committed

---

## Completion Summary

When all tasks are complete:

- [x] 3 namespaces created (kafka, postgres, learnflow)
- [x] Apache Kafka deployed with Zookeeper
- [x] 4 Kafka topics created
- [x] PostgreSQL deployed with learnflow database
- [x] Connection configuration stored in ConfigMaps/Secrets
- [x] All health checks passing
- [x] Documentation complete
- [x] Git commit created

**Next Phase**: Phase 4 - Backend Microservices
- Deploy FastAPI services with Dapr sidecars
- Connect to Kafka and PostgreSQL
- Implement multi-agent architecture

---

## Troubleshooting Guide

### Common Issues

**Pods stuck in Pending**:
```bash
# Check Minikube resources
minikube status

# Describe pod for events
kubectl describe pod -n kafka <pod-name>

# Common solution: Increase Minikube memory
minikube config set memory 8192
minikube config set cpus 4
minikube start
```

**Helm install fails**:
```bash
# Update Helm repositories
helm repo update

# Check chart version
helm search repo bitnami/kafka

# Install with explicit version
helm install kafka bitnami/kafka --version X.Y.Z -n kafka
```

**PVC not binding**:
```bash
# Check storage class
kubectl get storageclass

# Verify default storage class
kubectl get sc -o jsonpath='{.items[?(@.metadata.annotations.storageclass\.kubernetes\.io/is-default-class=="true")].metadata.name}'

# List PVCs
kubectl get pvc -A
```

**Cannot connect to Kafka**:
```bash
# Verify service exists
kubectl get svc -n kafka

# Port-forward to local machine for testing
kubectl port-forward -n kafka svc/kafka 9092:9092

# Test connection
telnet localhost 9092
```

**Cannot connect to PostgreSQL**:
```bash
# Get password
kubectl get secret -n postgres postgres-postgresql \
  -o jsonpath="{.data.password}" | base64 -d

# Port-forward for testing
kubectl port-forward -n postgres svc/postgres-postgresql 5432:5432

# Test connection
psql -h localhost -p 5432 -U learnflow_user -d learnflow
```

---

## Quick Reference

### Useful Commands

```bash
# Watch pod status
watch kubectl get pods -A

# Get all resources in namespace
kubectl get all -n kafka

# View logs
kubectl logs -n kafka <pod-name> -f

# Execute command in pod
kubectl exec -n kafka kafka-0 -- /bin/bash

# Delete everything and restart
kubectl delete namespace kafka postgres learnflow
# Re-run from Task 1
```

### Connection Strings

**Kafka**:
- Bootstrap: `kafka.kafka.svc.cluster.local:9092`
- Topics: `learning.progress`, `code.submission`, `exercise.attempt`, `struggle.alert`

**PostgreSQL**:
- Host: `postgres.postgres.svc.cluster.local:5432`
- Database: `learnflow`
- User: `learnflow_user`
- Password: In Secret `postgres-postgresql` in `postgres` namespace

---

**Phase 3 Complete! 🚀**
