# Implementation Plan: Phase 3 Infrastructure Deployment

**Spec**: @specs/phase-3-infrastructure/spec.md
**Phase**: III
**Estimated Complexity**: Moderate
**Timeline**: 2-3 hours

---

## Overview

Deploy core infrastructure components (Apache Kafka and PostgreSQL) to the local Minikube cluster using Helm charts. These services will form the backbone of the LearnFlow multi-agent learning platform's event-driven architecture.

**Success Criteria**:
- [ ] Kafka deployed with 4 topics (learning.*, code.*, exercise.*, struggle.*)
- [ ] PostgreSQL deployed with learnflow database
- [ ] Both services verified and healthy
- [ ] Zero manual intervention - fully autonomous via Skills

---

## Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    MINIKUBE CLUSTER                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  NAMESPACE: kafka                                       │   │
│  │                                                         │   │
│  │  ┌─────────────┐    ┌─────────────┐                    │   │
│  │  │   Kafka     │    │  Zookeeper  │                    │   │
│  │  │   Broker    │    │   Quorum    │                    │   │
│  │  │  Port: 9092 │    │  Port: 2181 │                    │   │
│  │  └─────────────┘    └─────────────┘                    │   │
│  │                                                         │   │
│  │  Topics: learning.progress, code.submission,            │   │
│  │          exercise.attempt, struggle.alert              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  NAMESPACE: postgres                                     │   │
│  │                                                         │   │
│  │  ┌─────────────┐    ┌─────────────┐                    │   │
│  │  │ PostgreSQL  │    │     PVC     │                    │   │
│  │  │   Primary   │    │   (10GB)    │                    │   │
│  │  │  Port: 5432 │    │             │                    │   │
│  │  └─────────────┘    └─────────────┘                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  NAMESPACE: learnflow (prepared for Phase 4)            │   │
│  │                                                         │   │
│  │  ┌─────────────┐    ┌─────────────┐                    │   │
│  │  │ ConfigMap  │    │   Secret    │                    │   │
│  │  │ kafka-uri  │    │  pg-creds   │                    │   │
│  │  └─────────────┘    └─────────────┘                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

**1. Apache Kafka**:
- Location: Namespace `kafka`
- Responsibility: Event streaming for agent communication
- Dependencies: Zookeeper (included in Bitnami chart)
- Key Configuration:
  - Replica count: 1 (development)
  - Zookeeper replica count: 1 (development)
  - Topics: 4 (learning.*, code.*, exercise.*, struggle.*)
- Connection: `kafka.kafka.svc.cluster.local:9092`

**2. PostgreSQL**:
- Location: Namespace `postgres`
- Responsibility: Data persistence for users, progress, code submissions
- Dependencies: PersistentVolumeClaim for storage
- Key Configuration:
  - Database: `learnflow`
  - Username: `learnflow_user`
  - Password: Auto-generated (stored in Secret)
- Connection: `postgres.postgres.svc.cluster.local:5432`

**3. learnflow Namespace** (prepared for Phase 4):
- Location: Namespace `learnflow`
- Responsibility: Configuration for microservices
- Dependencies: Kafka and PostgreSQL services
- Key Configuration:
  - ConfigMap with service URLs
  - Secret with database credentials

---

## Infrastructure Configuration

### Helm Values: Kafka

```yaml
# kafka-values.yaml
replicaCount: 1
zookeeper:
  replicaCount: 1
  persistence:
    enabled: true
    size: 10Gi

kafka:
  persistence:
    enabled: true
    size: 10Gi

topics:
  - name: learning.progress
    partitions: 1
    replicationFactor: 1
  - name: code.submission
    partitions: 1
    replicationFactor: 1
  - name: exercise.attempt
    partitions: 1
    replicationFactor: 1
  - name: struggle.alert
    partitions: 1
    replicationFactor: 1

service:
  type: ClusterIP
  port: 9092
```

### Helm Values: PostgreSQL

```yaml
# postgres-values.yaml
auth:
  username: learnflow_user
  database: learnflow
  password: ""

primary:
  persistence:
    enabled: true
    size: 5Gi

service:
  type: ClusterIP
  port: 5432
```

---

## Implementation Tasks

### Task 1: Create Kubernetes Namespaces
**Complexity**: Simple
**Dependencies**: None

**Acceptance Criteria**:
- [ ] Namespace `kafka` created
- [ ] Namespace `postgres` created
- [ ] Namespace `learnflow` created (for Phase 4 preparation)
- [ ] All namespaces labeled with `app=learnflow`

**Skill**: `k8s-foundation`
**Script**: `scripts/create-namespace.sh`

**Commands**:
```bash
./.claude/skills/k8s-foundation/scripts/create-namespace.sh kafka
./.claude/skills/k8s-foundation/scripts/create-namespace.sh postgres
./.claude/skills/k8s-foundation/scripts/create-namespace.sh learnflow
```

---

### Task 2: Deploy Apache Kafka
**Complexity**: Moderate
**Dependencies**: Task 1

**Acceptance Criteria**:
- [ ] Helm chart `bitnami/kafka` deployed to namespace `kafka`
- [ ] Kafka broker pod in Running state
- [ ] Zookeeper pod in Running state
- [ ] Service `kafka` accessible on port 9092
- [ ] PVC created and bound

**Skill**: `kafka-k8s-setup`
**Script**: `scripts/deploy.sh`

**Commands**:
```bash
./.claude/skills/kafka-k8s-setup/scripts/deploy.sh
```

**Verification**:
```bash
kubectl get pods -n kafka
kubectl get svc -n kafka
kubectl get pvc -n kafka
```

---

### Task 3: Create Kafka Topics
**Complexity**: Simple
**Dependencies**: Task 2

**Acceptance Criteria**:
- [ ] Topic `learning.progress` created
- [ ] Topic `code.submission` created
- [ ] Topic `exercise.attempt` created
- [ ] Topic `struggle.alert` created
- [ ] All topics verified with `kafka-topics.sh --list`

**Skill**: `kafka-k8s-setup`
**Script**: `scripts/create-topic.py`

**Commands**:
```bash
python3 .claude/skills/kafka-k8s-setup/scripts/create-topic.py learning.progress
python3 .claude/skills/kafka-k8s-setup/scripts/create-topic.py code.submission
python3 .claude/skills/kafka-k8s-setup/scripts/create-topic.py exercise.attempt
python3 .claude/skills/kafka-k8s-setup/scripts/create-topic.py struggle.alert
```

**Verification**:
```bash
kubectl exec -n kafka kafka-0 -- kafka-topics.sh --list \
  --bootstrap-server localhost:9092
```

---

### Task 4: Verify Kafka Deployment
**Complexity**: Simple
**Dependencies**: Task 3

**Acceptance Criteria**:
- [ ] All pods in Running state
- [ ] All 4 topics exist
- [ ] Can produce test message to `learning.progress`
- [ ] Can consume test message from `learning.progress`

**Skill**: `kafka-k8s-setup`
**Script**: `scripts/verify.py`

**Commands**:
```bash
python3 .claude/skills/kafka-k8s-setup/scripts/verify.py
```

**Expected Output**:
```
✓ All Kafka pods running (2/2)
✓ All topics created (4/4)
✓ Test message produced and consumed
```

---

### Task 5: Deploy PostgreSQL
**Complexity**: Moderate
**Dependencies**: Task 1

**Acceptance Criteria**:
- [ ] Helm chart `bitnami/postgresql` deployed to namespace `postgres`
- [ ] PostgreSQL pod in Running state
- [ ] Service `postgres` accessible on port 5432
- [ ] Database `learnflow` created
- [ ] PVC created and bound
- [ ] Credentials stored in Secret `postgres-credentials`

**Skill**: `postgres-k8s-setup`
**Script**: `scripts/deploy.sh`

**Commands**:
```bash
./.claude/skills/postgres-k8s-setup/scripts/deploy.sh
```

**Verification**:
```bash
kubectl get pods -n postgres
kubectl get svc -n postgres
kubectl get secret -n postgres postgres-credentials
```

---

### Task 6: Verify PostgreSQL Deployment
**Complexity**: Simple
**Dependencies**: Task 5

**Acceptance Criteria**:
- [ ] Pod in Running state
- [ ] Can connect to database
- [ ] Can execute test query: `SELECT 1;`
- [ ] Connection string documented

**Skill**: `postgres-k8s-setup`
**Script**: `scripts/verify.py`

**Commands**:
```bash
python3 .claude/skills/postgres-k8s-setup/scripts/verify.py
```

**Expected Output**:
```
✓ PostgreSQL pod running
✓ Database 'learnflow' accessible
✓ Test query successful
```

---

### Task 7: Store Connection Configuration
**Complexity**: Simple
**Dependencies**: Task 4, Task 6

**Acceptance Criteria**:
- [ ] ConfigMap `kafka-config` created in `learnflow` namespace
- [ ] ConfigMap `postgres-config` created in `learnflow` namespace
- [ ] PostgreSQL credentials stored in Secret `postgres-credentials`
- [ ] Connection strings documented in project README

**Skill**: `k8s-foundation`
**Scripts**: `scripts/create-configmap.sh`, `scripts/create-secret.sh`

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
  database=learnflow

# PostgreSQL Secret (copy from postgres namespace)
kubectl get secret -n postgres postgres-postgresql \
  -o yaml | sed 's/namespace: postgres/namespace: learnflow/' | \
  kubectl apply -n learnflow -f -
```

---

### Task 8: Run Comprehensive Health Check
**Complexity**: Simple
**Dependencies**: All previous tasks

**Acceptance Criteria**:
- [ ] All pods Running across all namespaces
- [ ] All services accessible
- [ ] All PVCs bound
- [ ] Kafka topics verified
- [ ] PostgreSQL connection verified
- [ ] Summary report generated

**Script**: Custom verification script for Phase 3

**Commands**:
```bash
# Run all health checks
kubectl get pods -n kafka -n postgres -n learnflow
kubectl get svc -n kafka -n postgres -n learnflow
kubectl get pvc -n kafka -n postgres

# Document results
echo "Phase 3 Infrastructure Deployment Complete" > phase3-status.txt
date >> phase3-status.txt
```

---

### Task 9: Document and Commit
**Complexity**: Simple
**Dependencies**: Task 8

**Acceptance Criteria**:
- [ ] Connection strings documented in `learnflow-app/docs/infrastructure.md`
- [ ] Credentials management documented
- [ ] Phase 3 completion verified
- [ ] Git commit created with conventional commit format

**Documentation**:

**Kafka Connection**:
- Bootstrap servers: `kafka.kafka.svc.cluster.local:9092`
- Topics: `learning.progress`, `code.submission`, `exercise.attempt`, `struggle.alert`

**PostgreSQL Connection**:
- Host: `postgres.postgres.svc.cluster.local:5432`
- Database: `learnflow`
- Username: `learnflow_user`
- Password: Stored in Secret `postgres-postgresql` in `postgres` namespace

**Git Commit**:
```bash
git add specs/phase-3-infrastructure/
git commit -m "feat: add Phase 3 infrastructure specification and plan

- Add spec.md with Kafka and PostgreSQL deployment requirements
- Add plan.md with 9-task implementation breakdown
- Define acceptance criteria for all infrastructure components
- Configure Helm values for Kafka (4 topics) and PostgreSQL
- Prepare for autonomous deployment via Skills

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Testing Strategy

### Smoke Tests
- Verify all pods are Running
- Verify all services are accessible
- Verify PVCs are bound

### Integration Tests
- Produce/consume test message on Kafka
- Execute test query on PostgreSQL
- Verify cross-namespace service resolution

### Health Check Tests
- Kafka broker health check
- Zookeeper health check
- PostgreSQL health check

---

## Risks & Mitigations

### Risk 1: Minikube Resource Exhaustion
**Probability**: Medium
**Impact**: High
**Mitigation**:
- Start Minikube with adequate resources: `--cpus=4 --memory=8192`
- Monitor resource usage: `kubectl top nodes`
- Delete unused resources if needed

### Risk 2: Helm Chart Installation Timeout
**Probability**: Low
**Impact**: Medium
**Mitigation**:
- Use `--timeout 15m` for Helm installs
- Check pod status: `kubectl describe pod <pod-name>`
- Check Minikube logs: `minikube logs`

### Risk 3: PVC Provisioning Failure
**Probability**: Low
**Impact**: High
**Mitigation**:
- Verify default storage class: `kubectl get storageclass`
- Use standard storage class in Minikube
- Check PV/PVC binding: `kubectl get pv,pvc`

### Risk 4: Port Conflicts
**Probability**: Low
**Impact**: Medium
**Mitigation**:
- Use ClusterIP services (not NodePort)
- Verify port availability before deployment
- Use standard ports (9092 for Kafka, 5432 for PostgreSQL)

---

## Dependencies

**External**:
- Minikube running (from Phase 1)
- Helm installed (from Phase 1)

**Internal**:
- k8s-foundation skill (from Phase 2)
- kafka-k8s-setup skill (from Phase 2)
- postgres-k8s-setup skill (from Phase 2)

**Blocking**:
- None - can proceed after Phase 2 completion

---

## Success Metrics

**Functional**:
- [ ] All 9 tasks completed successfully
- [ ] All pods Running (6 total: kafka, zookeeper, postgres)
- [ ] All 4 Kafka topics created
- [ ] PostgreSQL database accessible
- [ ] All health checks passing

**Non-Functional**:
- [ ] Deployment time < 10 minutes
- [ ] Zero manual intervention
- [ ] Documentation complete
- [ ] Git commit created

---

## Rollback Plan

If deployment fails:

1. **Kafka Rollback**:
   ```bash
   helm uninstall kafka -n kafka
   kubectl delete namespace kafka
   ```

2. **PostgreSQL Rollback**:
   ```bash
   helm uninstall postgres -n postgres
   kubectl delete namespace postgres
   ```

3. **Clean Slate**:
   ```bash
   kubectl delete namespace kafka postgres learnflow
   # Restart from Task 1
   ```

**Safe Rollback Window**: Until Phase 4 begins

---

## Post-Implementation

After completing all tasks:
1. **Verify Deployment**: Run comprehensive health check
2. **Document**: Update project README with connection info
3. **Test Connectivity**: Verify services reachable from learnflow namespace
4. **Create Commit**: Conventional commit format for Phase 3
5. **Prepare for Phase 4**: Backend microservices ready to consume infrastructure

---

## Phase Transition

**Next Phase**: Phase 4 - Backend Microservices
- FastAPI services with Dapr sidecars
- Connect to Kafka and PostgreSQL
- Implement multi-agent architecture
- Deploy first microservice (Triage Agent)

**Prerequisites for Phase 4**:
- All Phase 3 tasks complete
- Kafka topics accessible
- PostgreSQL database accessible
- Connection configuration stored in ConfigMaps/Secrets
