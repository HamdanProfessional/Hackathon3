# LearnFlow Issues Report

**Date**: 2026-01-31
**Cluster**: hackathon3 (blr1)
**Status**: Critical Issues Found

---

## Summary

This document identifies and describes all issues found in the LearnFlow application deployment.

---

## Issue 1: Critical Resource Constraints (HIGH PRIORITY)

### Description
The Kubernetes cluster is severely resource constrained, causing multiple pods to remain in `Pending` state.

### Current Resource Usage
```
Allocated resources:
  Resource           Requests      Limits
  --------           --------      ------
  cpu                3862m (99%)   5700m (146%)
  memory             6191Mi (96%)  7474Mi (116%)
```

### Affected Pods (Pending)
| Pod Name | Status | Issue |
|----------|--------|-------|
| learnflow-codereview-service | 0/2 Pending | Insufficient CPU |
| learnflow-concepts-service | 0/2 Pending | Insufficient CPU |
| learnflow-debug-service | 0/2 Pending | Insufficient CPU |
| learnflow-frontend | 0/1 Pending | Insufficient CPU |
| learnflow-mcp-database | 0/1 Pending | Insufficient CPU |
| learnflow-mcp-k8s-operations | 0/1 Pending | Insufficient CPU |
| learnflow-progress-service | 0/2 Pending | Insufficient CPU |

### Solutions
1. **Immediate**: Scale down non-essential deployments
   ```bash
   kubectl scale deployment learnflow-frontend --replicas=1 -n learnflow
   kubectl scale deployment learnflow-codereview-service --replicas=0 -n learnflow
   ```

2. **Short-term**: Upgrade cluster node size (add CPU/memory)

3. **Long-term**: Implement horizontal pod autoscaling with cluster autoscaler

---

## Issue 2: Frontend API Route Mismatch (MEDIUM PRIORITY)

### Description
The frontend code is calling API endpoints that don't exist on the backend services.

### Mismatch: `/api/v1/execute` vs `/submit`

**Frontend call** (`learnflow-app/frontend/lib/api.ts`):
```typescript
async function executeCode(code: string, exerciseId?: string) {
  return apiRequest(`${SERVICES.exercise}/api/v1/execute`, {
    method: 'POST',
    body: JSON.stringify({ code, exerciseId }),
  });
}
```

**Backend actual routes** (`learnflow-app/backend/services/exercise/main.py`):
- `POST /submit` - Exercise submission endpoint
- `POST /generate` - Generate exercise
- `GET /exercise/{exercise_id}` - Get exercise by ID
- `GET /exercises/all` - Get all exercises
- `GET /modules` - Get all modules

**No `/api/v1/execute` endpoint exists!**

### Impact
- Code execution feature fails with 404 errors
- Exercise submission may also be affected

### Solutions
1. **Option A**: Update frontend to use correct endpoint:
   ```typescript
   // Change from /api/v1/execute to /submit
   async function executeCode(code: string, exerciseId?: string) {
     return apiRequest(`${SERVICES.exercise}/submit`, {
       method: 'POST',
       body: JSON.stringify({ code, exercise_id: exerciseId }),
     });
   }
   ```

2. **Option B**: Add the missing endpoint to backend:
   ```python
   @app.post("/api/v1/execute")
   async def execute_code_api(request: ExecutionRequest):
       return await execute_code(request)
   ```

### Other Potential Mismatches
| Frontend Call | Backend Endpoint | Status |
|---------------|------------------|--------|
| `/api/v1/execute` | `/submit` | ❌ Mismatch |
| `/api/v1/teacher/generate-assignment` | Unknown | ⚠️ Needs verification |
| `/api/v1/teacher/save-assignment` | Unknown | ⚠️ Needs verification |

---

## Issue 3: Missing Environment Variables (LOW PRIORITY)

### Description
Some services may not have all required environment variables configured.

### Required Variables (from backend code)
- `NEXT_PUBLIC_EXERCISE_URL` - Required by frontend proxy
- `NEXT_PUBLIC_PROGRESS_URL` - Required by frontend proxy
- `NEXT_PUBLIC_CHAT_URL` - Required by frontend proxy
- `KAFKA_BROKER` - Required by all backend services
- `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` - Required by services

### Verification Needed
Check if ConfigMaps and Secrets are properly created:
```bash
kubectl get configmap,secret -n learnflow
```

---

## Issue 4: Multiple Unused/Ingress Resources (LOW PRIORITY)

### Description
Multiple ingress resources exist, some duplicating the same routes.

### Current Ingresses
| Name | Host | Address |
|------|------|---------|
| learnflow-frontend-ingress | hackathon3.testservers.online | 68.183.246.207 |
| learnflow-ingress-domain | hackathon4.testservers.online | 68.183.246.207 |
| learnflow-ingress-https | learnflow.68.183.246.207.nip.io | 68.183.246.207 |
| learnflow-ingress-nipio | learnflow.144.126.252.229.nip.io | 68.183.246.207 |

### Recommendation
Consolidate to a single ingress using the custom domain `hackathon4.testservers.online`.

---

## Issue 5: Helm Deployment Issues (RESOLVED)

### Description
The Helm chart had several issues that prevented proper deployment.

### Issues Fixed
1. ✅ Fixed `imagePullSecrets` reference from `.Values.backend` to `.Values.global`
2. ✅ Fixed service naming to use lowercase (codeReview -> codereview)
3. ✅ Added PostgreSQL auth values for MCP database server
4. ✅ Reduced MCP resource requests to fit cluster constraints

### Status
Helm deployment issues were resolved. MCP servers deployed via kubectl manifest instead.

---

## Recommended Actions

### Immediate (Today)
1. **Scale down deployments** to free up CPU:
   ```bash
   kubectl scale deployment learnflow-codereview-service --replicas=0 -n learnflow
   kubectl scale deployment learnflow-concepts-service --replicas=0 -n learnflow
   kubectl scale deployment learnflow-debug-service --replicas=0 -n learnflow
   ```

2. **Fix API route mismatch** in frontend:
   - Update `/api/v1/execute` to `/submit`
   - Rebuild and redeploy frontend

### Short-term (This Week)
1. **Upgrade cluster** to add more CPU/memory
2. **Fix all API route mismatches** between frontend and backend
3. **Test end-to-end** functionality

### Long-term
1. **Implement cluster autoscaler** for automatic scaling
2. **Add resource quotas** to prevent overcommitment
3. **Set up monitoring** with Prometheus/Grafana
4. **Implement proper CI/CD** with Argo CD

---

## Status Summary

| Category | Status | Priority |
|----------|--------|----------|
| Resource Constraints | 🔴 Critical | HIGH |
| API Route Mismatches | 🟡 Warning | MEDIUM |
| Environment Variables | 🟢 OK | LOW |
| Ingress Cleanup | 🟢 OK | LOW |
| Helm Deployment | ✅ Resolved | - |

---

**Report Generated**: 2026-01-31
**Next Review**: After fixes are applied
