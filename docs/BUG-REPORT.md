# LearnFlow Bug Report

**Date**: 2026-01-31
**Status**: 6 Critical Bugs Found

---

## Executive Summary

Argo CD synchronization created new deployments that are failing due to:
1. **Image tag mismatch** - Helm chart uses `:latest` but actual images have specific tags
2. **Resource exhaustion** - Cluster at 99% CPU capacity
3. **Duplicate deployments** - Old and new deployments running simultaneously

---

## Critical Bugs

### Bug #1: ImagePullBackOff - Missing `:latest` Tags

**Severity**: 🔴 CRITICAL
**Affected Pods**: 5 pods

| Pod | Status | Missing Image |
|-----|--------|---------------|
| learnflow-codereview-service-5f85896d8c | ImagePullBackOff | `learnflow-code-review-service:latest` |
| learnflow-debug-service-88dbd644d | ImagePullBackOff | `learnflow-debug-service:latest` |
| learnflow-progress-service-754f997d98 | ImagePullBackOff | `learnflow-progress-service:latest` |
| learnflow-concepts-service-c4dbcd6f9 | Pending | `learnflow-concepts-service:latest` |
| learnflow-triage-service-7c8885dd98 | Pending | `learnflow-triage-service:latest` |

**Root Cause**:
```yaml
# values.yaml specifies:
tag: latest

# But actual images in registry:
- learnflow-exercise-service:v3  # ✅ exists
- learnflow-code-review-service:latest  # ❌ doesn't exist
```

**Error Message**:
```
Failed to pull image "registry.digitalocean.com/todo-chatbot-reg/learnflow-code-review-service:latest"
rpc error: code = NotFound desc = failed to resolve reference
```

**Impact**: Argo CD deployments are failing, manual deployments still work

---

### Bug #2: Resource Exhaustion

**Severity**: 🔴 CRITICAL

**Cluster Resources**:
```
CPU: 3890m / 4000m (97.5% used)
Memory: 6.4GB / 8GB (80% used)
```

**Affected Pods** (Pending due to insufficient CPU):
- learnflow-concepts-service (0/2 Pending)
- learnflow-exercise-service (0/2 Pending)
- learnflow-triage-service (0/2 Pending)

**Error Message**:
```
Warning FailedScheduling: 0/1 nodes are available: 1 Insufficient cpu
```

**Impact**: New deployments cannot be scheduled

---

### Bug #3: Duplicate Deployments Running

**Severity**: 🟡 MEDIUM

| Service | Old Deployment (Working) | New Deployment (Failing) |
|---------|--------------------------|---------------------------|
| Exercise | exercise-service-6c6fddd476 ✅ | learnflow-exercise-service-76858c7749 ❌ |
| Progress | progress-service-86994f69df ✅ | learnflow-progress-service-754f997d98 ❌ |
| Triage | triage-service-85f9b5769b ✅ | learnflow-triage-service-7c8885dd98 ❌ |

**Naming Inconsistency**:
- Manual deployments: `exercise-service`
- Helm deployments: `learnflow-exercise-service`

**Impact**: Resource waste, potential port conflicts

---

### Bug #4: Kafka Configuration Job Error

**Severity**: 🟢 LOW

**Pod**: `learnflow-kafka-configuration-wnrrf`
**Status**: Error (0/1)
**Age**: 3d19h

**Issue**: Kafka configuration job failed, but Kafka is still working

**Impact**: Low - Kafka cluster is functional

---

### Bug #5: Dapr Readiness Probe Failing

**Severity**: 🟡 MEDIUM

**Pod**: learnflow-codereview-service
**Error**:
```
Warning Unhealthy: Readiness probe failed: HTTP probe failed with statuscode: 500
```

**Impact**: Dapr sidecar not ready, service not accessible

---

### Bug #6: Argo CD Sync Status

**Severity**: 🟡 MEDIUM

**Application**: learnflow
**Sync Status**: OutOfSync
**Health Status**: Progressing

**Failed Resources**:
- learnflow-mcp-code-exec (SyncFailed - selector immutable)
- learnflow-mcp-database (SyncFailed - selector immutable)
- learnflow-frontend (SyncFailed - selector immutable)

**Root Cause**: Manually deployed resources have different selectors than Helm chart

---

## Detailed Analysis

### Image Tags Actually Built

| Service | Actual Tag | Latest Tag Exists? |
|---------|-----------|-------------------|
| frontend | learnflow-v2 | ❌ No |
| mcp-code-exec-server | v2 | ❌ No |
| mcp-database-server | v2 | ❌ No |
| mcp-k8s-operations-server | v2 | ❌ No |
| learnflow-exercise-service | v3 | ❌ No |
| learnflow-triage-service | latest | ✅ Yes |
| learnflow-concepts-service | latest | ❌ No |
| learnflow-debug-service | latest | ❌ No |
| learnflow-progress-service | latest | ❌ No |
| learnflow-code-review-service | latest | ❌ No |

Only 1 of 10 services has `:latest` tag!

---

## Recommendations

### Immediate Fixes (Priority 1)

1. **Update Helm values.yaml with correct image tags**:
```yaml
exercise:
  image:
    tag: v3  # Was: latest
frontend:
  image:
    tag: learnflow-v2  # Was: latest
# MCP servers need to be updated too
```

2. **Build and push `:latest` tags** (alternative):
```bash
docker tag registry.../learnflow-concepts-service:v1 registry.../learnflow-concepts-service:latest
docker push registry.../learnflow-concepts-service:latest
# Repeat for all services
```

3. **Scale down or delete failing Argo CD deployments**:
```bash
kubectl delete deployment learnflow-concepts-service -n learnflow
kubectl delete deployment learnflow-debug-service -n learnflow
kubectl delete deployment learnflow-codereview-service -n learnflow
kubectl delete deployment learnflow-progress-service -n learnflow
kubectl delete deployment learnflow-triage-service -n learnflow
```

### Short-term Fixes (Priority 2)

4. **Reduce resource requests** in values.yaml to fit cluster:
```yaml
resources:
  requests:
    cpu: 100m  # Reduce from 250m
    memory: 128Mi  # Reduce from 256Mi
```

5. **Disable auto-sync in Argo CD temporarily**:
```yaml
syncPolicy:
  automated:
    prune: true
    selfHeal: true
    allowEmpty: false
```
Change to:
```yaml
syncPolicy:
  automated: {}  # Disabled
```

### Long-term Fixes (Priority 3)

6. **Upgrade cluster** to add more CPU/memory
7. **Implement image tag strategy** (semantic versioning)
8. **Unify deployment names** between manual and Helm

---

## Workaround

**Current Working Services** (ignore Argo CD deployments):
- exercise-service-6c6fddd476 ✅
- progress-service-86994f69df ✅
- triage-service-85f9b5769b ✅
- learnflow-frontend ✅ (both pods)
- All MCP servers ✅

**Disable Argo CD** until images are fixed:
```bash
kubectl patch application learnflow -n argocd --type=merge -p '{"spec":{"syncPolicy":{"automated":null}}}'
```

---

## Verification Commands

```bash
# Check all pods
kubectl get pods -n learnflow

# Check image pull errors
kubectl describe pod -n learnflow <pod-name> | grep -A 5 "Failed"

# Check resource usage
kubectl top nodes
kubectl top pods -n learnflow

# Check Argo CD status
kubectl get applications -n argocd
argocd app get learnflow

# Find duplicate deployments
kubectl get deployments -n learnflow -o custom-columns=NAME:.metadata-name,REPLICAS:.spec.replicas
```

---

## Summary

| Bug | Severity | Fix Complexity | Status |
|-----|----------|----------------|--------|
| #1 ImagePullBackOff | 🔴 Critical | Medium | Needs fix |
| #2 Resource Exhaustion | 🔴 Critical | High | Needs fix |
| #3 Duplicate Deployments | 🟡 Medium | Low | Needs cleanup |
| #4 Kafka Config Error | 🟢 Low | N/A | Working anyway |
| #5 Dapr Probe Failing | 🟡 Medium | Medium | Depends on #1 |
| #6 Argo CD Sync Issues | 🟡 Medium | Medium | Needs fix |

**Recommended Action**: Fix image tags in Helm chart, delete Argo CD deployments, keep using manual deployments

---

**Report Generated**: 2026-01-31
**Cluster**: DigitalOcean hackathon3 (blr1)
**Total Issues**: 6 (3 Critical, 3 Medium/Low)
