# Phase 3: Infrastructure Deployment Specification

**Status**: Draft
**Phase**: 3
**Focus**: Deploy Apache Kafka and PostgreSQL to Kubernetes using Helm charts

---

## Overview

Deploy core infrastructure components required for the LearnFlow multi-agent learning platform:
- **Apache Kafka**: Event streaming platform for asynchronous agent communication
- **PostgreSQL**: Relational database for user data, progress tracking, and code submissions

Both services will be deployed to the local Minikube cluster using Helm charts, following the MCP Code Execution pattern with Skills.

---

## Success Criteria

- [ ] Apache Kafka deployed and running on Minikube
- [ ] PostgreSQL deployed and running on Minikube
- [ ] Kafka topics created for agent communication (learning.*, code.*, exercise.*, struggle.*)
- [ ] PostgreSQL database initialized with connection credentials stored in Kubernetes secrets
- [ ] Both deployments verified via health check scripts
- [ ] Zero manual intervention - autonomous deployment via Skills

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
│  │  │  Broker     │    │   (Quorum)  │                    │   │
│  │  │  (Bitnami)  │    │  (Bitnami)  │                    │   │
│  │  └─────────────┘    └─────────────┘                    │   │
│  │                                                         │   │
│  │  Topics: learning.* | code.* | exercise.* | struggle.* │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  NAMESPACE: postgres                                     │   │
│  │                                                         │   │
│  │  ┌─────────────┐    ┌─────────────┐                    │   │
│  │  │ PostgreSQL  │    │    PVC      │                    │   │
│  │  │  Primary    │    │  (Storage)  │                    │   │
│  │  │  (Bitnami)  │    │             │                    │   │
│  │  └─────────────┘    └─────────────┘                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  NAMESPACE: learnflow                                   │   │
│  │                                                         │   │
│  │  ┌─────────────┐    ┌─────────────┐                    │   │
│  │  │     SVC     │    │     SVC     │                    │   │
│  │  │ kafka:9092  │    │  pg:5432    │                    │   │
│  │  └─────────────┘    └─────────────┘                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component | Chart | Version | Namespace |
|-----------|-------|---------|-----------|
| Kafka | bitnami/kafka | Latest stable | kafka |
| Zookeeper | bitnami/kafka (included) | Latest stable | kafka |
| PostgreSQL | bitnami/postgresql | Latest stable | postgres |

---

## Requirements

### Kafka Deployment

**Minimum Configuration**:
- Replica count: 1 (development)
- Zookeeper replica count: 1 (development)
- Persistence: Enabled (PVC)
- Topics to create:
  - `learning.progress` - Student learning progress events
  - `code.submission` - Code submission events
  - `exercise.attempt` - Exercise attempt events
  - `struggle.alert` - Struggle detection alerts

**Acceptance Criteria**:
- [ ] Kafka broker pods in Running state
- [ ] Zookeeper pods in Running state
- [ ] Service `kafka.kafka.svc.cluster.local:9092` accessible
- [ ] All 4 topics created and verified
- [ ] Can produce/consume test message

### PostgreSQL Deployment

**Minimum Configuration**:
- Replica count: 1 (development)
- Database name: `learnflow`
- Username: `learnflow_user`
- Password: Auto-generated, stored in Kubernetes Secret
- Persistence: Enabled (PVC)

**Acceptance Criteria**:
- [ ] PostgreSQL pod in Running state
- [ ] Service `postgres.postgres.svc.cluster.local:5432` accessible
- [ ] Database `learnflow` created
- [ ] Connection credentials stored in Secret `postgres-credentials`
- [ ] Can connect and execute test query

---

## Skills Used

### kafka-k8s-setup
**Location**: `.claude/skills/kafka-k8s-setup/`

**Scripts**:
- `scripts/deploy.sh` - Deploys Kafka using Helm
- `scripts/verify.py` - Verifies Kafka deployment status
- `scripts/create-topic.py` - Creates Kafka topics

### postgres-k8s-setup
**Location**: `.claude/skills/postgres-k8s-setup/`

**Scripts**:
- `scripts/deploy.sh` - Deploys PostgreSQL using Helm
- `scripts/verify.py` - Verifies PostgreSQL deployment status
- `scripts/migrate.sh` - Runs database migrations

---

## Validation

### Health Check Scripts

**Kafka Health Check**:
```bash
# Verify all pods running
kubectl get pods -n kafka

# Verify service exists
kubectl get svc -n kafka

# Verify topics created
kubectl exec -n kafka kafka-0 -- kafka-topics.sh --list --bootstrap-server localhost:9092
```

**PostgreSQL Health Check**:
```bash
# Verify pod running
kubectl get pods -n postgres

# Verify service exists
kubectl get svc -n postgres

# Test database connection
kubectl exec -n postgres postgres-0 -- psql -U learnflow_user -d learnflow -c "SELECT 1;"
```

---

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Deployment time | < 5 minutes |
| Availability | 99% (dev environment) |
| Storage | 10GB Kafka, 5GB PostgreSQL |
| Resource limits | 1CPU, 1GB RAM per pod |

---

## Dependencies

**Required**:
- Minikube running (from Phase 1)
- Helm installed (from Phase 1)
- k8s-foundation skill (from Phase 2)

**Blocking**:
- None - this phase can begin after Phase 2 completion

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Insufficient Minikube resources | Medium | High | Increase memory to 8GB, CPUs to 4 |
| Helm chart version conflicts | Low | Medium | Use explicit chart versions in values |
| PVC provisioning failure | Low | High | Verify storage class available in Minikube |
| Port conflicts | Low | Medium | Use standard ports, verify no conflicts |

---

## Deliverables

1. **Kafka Deployment**
   - Namespace: `kafka`
   - Helm release: `kafka`
   - 4 topics created

2. **PostgreSQL Deployment**
   - Namespace: `postgres`
   - Helm release: `postgres`
   - Database: `learnflow`

3. **Documentation**
   - Connection strings documented
   - Credentials stored securely
   - Verification scripts passing

---

## Next Phase

After Phase 3 completion, proceed to **Phase 4: Backend Microservices** where FastAPI services with Dapr sidecars will be deployed to consume these infrastructure resources.
