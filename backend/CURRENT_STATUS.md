# LearnFlow Backend - Current Deployment Status

**Date**: 2025-01-22
**Status**: Phase 4 - Blocked on GHCR Authentication

---

## Current State

### Kubernetes Pods Status

| Service | Status | Issue | Age |
|---------|--------|-------|-----|
| triage-service | CrashLoopBackOff | ImagePullBackOff - GHCR 403 | 13m |
| concepts-service | ImagePullBackOff | ImagePullBackOff - GHCR 403 | 13m |
| debug-service | CrashLoopBackOff | ImagePullBackOff - GHCR 403 | 13m |
| exercise-service | CrashLoopBackOff | ImagePullBackOff - GHCR 403 | 13m |
| progress-service | CrashLoopBackOff | ImagePullBackOff - GHCR 403 | 13m |
| code-review-service | ImagePullBackOff | ImagePullBackOff - GHCR 403 | 13m |

**Note**: All Dapr sidecars are running (1/2 containers ready per pod). Only the application containers are failing.

### Infrastructure Status

| Component | Status | Details |
|-----------|--------|---------|
| PostgreSQL | Running | `postgres.learnflow` service, 10 tables created |
| Kafka (Redpanda) | Running | From Phase 3, dapr pubsub configured |
| Dapr Components | Applied | pubsub.yaml, statestore.yaml, secretstore.yaml |
| Kubernetes Services | Running | All 6 services + dapr sidecars created |

### Docker Images Status

All images built and pushed to GHCR:
```
ghcr.io/hamdanprofessional/learnflow-triage-service:v1        ✅
ghcr.io/hamdanprofessional/learnflow-concepts-service:v1      ✅
ghcr.io/hamdanprofessional/learnflow-debug-service:v1        ✅
ghcr.io/hamdanprofessional/learnflow-exercise-service:v1     ✅
ghcr.io/haprofessional/learnflow-progress-service:v1         ⚠️ (typo: haprofessional)
ghcr.io/hamdanprofessional/learnflow-code-review-service:v1   ✅
```

---

## The Problem

### Error Message
```
failed to authorize: failed to fetch anonymous token: unexpected status from GET request
to https://ghcr.io/token?scope=repository%3Ahamdanprofessional%2Flearnflow-triage-service%3Apull&service=ghcr.io:
403 Forbidden
```

### Root Cause
The `ghcr-registry` secret in Kubernetes contains a placeholder token:
- Current secret value: `PLACEHOLDER_GITHUB_TOKEN`
- Required: Valid GitHub Personal Access Token with `read:packages`, `write:packages` scopes

### Secret Details
```yaml
# Current (broken)
kubectl get secret ghcr-registry -n learnflow -o yaml
.apiVersion: v1
.data:
  .docker-password: UExBQ0VIT0xERVJfR0lUSUVCX1RPS0VO # PLACEHOLDER_GITHUB_TOKEN
```

---

## Solution Options

### Option 1: Update Secret with Real Token (Recommended)

1. Create GitHub Personal Access Token:
   - Go to: https://github.com/settings/tokens
   - Generate new token (classic)
   - Scopes: `read:packages`, `write:packages`, `delete:packages`

2. Update Kubernetes secret:
```bash
kubectl delete secret ghcr-registry -n learnflow

kubectl create secret docker-registry ghcr-registry \
  --docker-server=ghcr.io \
  --docker-username=hamdanprofessional \
  --docker-password=YOUR_ACTUAL_GITHUB_TOKEN \
  --namespace=learnflow
```

3. Restart deployments:
```bash
kubectl rollout restart deployment/triage-service -n learnflow
kubectl rollout restart deployment/concepts-service -n learnflow
kubectl rollout restart deployment/debug-service -n learnflow
kubectl rollout restart deployment/exercise-service -n learnflow
kubectl rollout restart deployment/progress-service -n learnflow
kubectl rollout restart deployment/code-review-service -n learnflow
```

### Option 2: Make GHCR Images Public

Change image visibility from private to public on GitHub:
1. Go to: https://github.com/hamdanprofessional?tab=packages
2. Select each `learnflow-*-service` package
3. Settings → Package visibility → Change to Public

### Option 3: Fix progress-service Image Typo

The `progress-service` image was pushed to `ghcr.io/haprofessional` (missing 'd' in username).

```bash
# Re-tag and push with correct username
docker tag ghcr.io/haprofessional/learnflow-progress-service:v1 ghcr.io/hamdanprofessional/learnflow-progress-service:v1
docker push ghcr.io/hamdanprofessional/learnflow-progress-service:v1
```

---

## What's Ready (Once Auth Fixed)

### Code Structure
```
backend/
├── common/
│   ├── models.py          # Pydantic models (StudentProgress, etc.)
│   ├── database.py        # Async PostgreSQL connection
│   ├── dapr_client.py     # Dapr client wrapper
│   └── agent_base.py      # Base agent class
├── migrations/
│   └── 001_initial_schema.up.sql  # 10 tables created
├── dapr/components/
│   ├── pubsub.yaml        # Kafka pubsub
│   ├── statestore.yaml    # PostgreSQL state
│   └── secretstore.yaml   # K8s secrets
├── k8s/
│   ├── namespace.yaml
│   ├── configmap.yaml     # ✅ Updated with LLM_PROVIDER=glm
│   ├── all-services.yaml  # ✅ Updated with LLM env vars
│   └── triage-service.yaml # ✅ Updated with LLM env vars
├── triage-service/        # Port 8001
├── concepts-service/      # Port 8002
├── debug-service/         # Port 8003
├── exercise-service/      # Port 8004
├── progress-service/      # Port 8005
└── code-review-service/   # Port 8006
```

### LLM Provider Support (NEW!)

**✅ GLM 4.7 Integration Complete**

The backend now supports BOTH OpenAI and GLM 4.7 (Z.ai):

| Feature | GLM 4.7 (Z.ai) | OpenAI |
|---------|----------------|--------|
| Configured | ✅ Yes (default) | ✅ Yes |
| Base URL | `https://open.bigmodel.cn/api/paas/v4/` | OpenAI default |
| Model | `glm-4.7` | `gpt-4o-mini` |
| Pricing | ~$3/month | Pay-per-use |
| API Key | `GLM_API_KEY` | `OPENAI_API_KEY` |

**Files Updated:**
- `backend/common/llm_client.py` - New configurable LLM client
- `backend/common/agent_base.py` - Uses LLMProvider enum
- `backend/k8s/configmap.yaml` - LLM_PROVIDER=glm set
- `backend/k8s/*.yaml` - Environment variables updated

**To use GLM 4.7:**
```bash
kubectl create secret generic llm-secret \
  --from-literal=GLM_API_KEY=your-z.ai-key \
  --namespace=learnflow
```

**To use OpenAI instead:**
```bash
kubectl create secret generic llm-secret \
  --from-literal=OPENAI_API_KEY=sk-your-key \
  --namespace=learnflow
kubectl edit configmap learnflow-config -n learnflow
# Change: LLM_PROVIDER: "openai"
```

See `backend/GLM_INTEGRATION.md` for details.

### Next Steps (After Services Running)

1. Implement Agent Logic:
   - TriageAgent.route_query() with OpenAI function calling
   - ConceptsAgent.explain() with curriculum data
   - DebugAgent.analyze() with progressive hints
   - ExerciseAgent.generate() with exercise bank
   - ProgressAgent.calculate_mastery() with weighted formula
   - CodeReviewAgent.analyze() with quality checks

2. Add API Endpoints:
   - POST /api/v1/triage
   - POST /api/v1/concepts/explain
   - POST /api/v1/debug/analyze
   - POST /api/v1/exercise/generate
   - GET /api/v1/progress/{student_id}
   - POST /api/v1/review/analyze

3. Write Tests:
   - Unit tests for each agent
   - Integration tests for API endpoints
   - End-to-end tests

---

## Dependencies Met

- ✅ Infrastructure deployed (Kafka, PostgreSQL, Dapr)
- ✅ 6 service scaffolds generated
- ✅ Database schema created
- ✅ Common code modules created
- ✅ Kubernetes manifests created
- ✅ Docker images built
- ✅ GLM 4.7 integration complete (configurable LLM provider)
- ⏳ GHCR secret updated (BLOCKING)
- ⏳ LLM secret created (GLM_API_KEY or OPENAI_API_KEY)
- ⏳ Services pulling images (BLOCKING)
- ⏳ Agent logic implemented (PENDING)

---

**Last Updated**: 2025-01-22 15:00 UTC
**Blockers**:
1. GHCR authentication (needs GitHub token)
2. LLM API key (needs GLM or OpenAI key)
**Estimated Time to UnBlock**: 5 minutes (with both tokens)
