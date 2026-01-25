# Manual Tasks - What I Cannot Do (You Must Complete)

**Last Updated**: 2025-01-22

> **Why this exists**: Some actions require your personal credentials, API keys, or browser access. I cannot perform these tasks for you. Complete the tasks below, then tell me when you're done so I can continue.

---

## 🔴 CRITICAL - Blocking Current Work

### 1. GitHub Container Registry Authentication

**Status**: All backend pods are stuck (ImagePullBackOff)

**What you need to do**:

1. **Create a GitHub Personal Access Token**:
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Token name: `GHCR for LearnFlow`
   - Expiration: 90 days (or your preference)
   - **Required Scopes** (check these boxes):
     - `read:packages`
     - `write:packages`
     - `delete:packages`
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

2. **Update the Kubernetes Secret**:
   ```bash
   # Replace YOUR_GITHUB_TOKEN with the token you just copied
   kubectl delete secret ghcr-registry -n learnflow

   kubectl create secret docker-registry ghcr-registry \
     --docker-server=ghcr.io \
     --docker-username=hamdanprofessional \
     --docker-password=YOUR_GITHUB_TOKEN \
     --namespace=learnflow
   ```

3. **Verify Secret Created**:
   ```bash
   kubectl get secret ghcr-registry -n learnflow
   ```

4. **Restart All Services**:
   ```bash
   kubectl rollout restart deployment/triage-service -n learnflow
   kubectl rollout restart deployment/concepts-service -n learnflow
   kubectl rollout restart deployment/debug-service -n learnflow
   kubectl rollout restart deployment/exercise-service -n learnflow
   kubectl rollout restart deployment/progress-service -n learnflow
   kubectl rollout restart deployment/code-review-service -n learnflow
   ```

5. **Verify Pods are Running**:
   ```bash
   kubectl get pods -n learnflow
   ```

**Expected Result**: All pods should show `2/2 Running` (app container + dapr sidecar)

---

## 🟡 HIGH PRIORITY - Needed Soon

### 2. LLM API Key for Agent Logic

**Status**: Services are scaffolded but agent logic requires LLM API

**Choose Your LLM Provider**:

---

#### Option A: GLM 4.7 (Z.ai / Zhipu AI) - RECOMMENDED

**Why**: More affordable ($3/month starting), excellent coding performance, fully OpenAI-compatible

**What you need to do**:

1. **Get Z.ai API Key**:
   - Go to: https://open.bigmodel.cn/
   - Register/login to your account
   - Go to API Keys management
   - Copy your API Key

2. **Create Kubernetes Secret**:
   ```bash
   kubectl create secret generic llm-secret \
     --from-literal=GLM_API_KEY=your-z.ai-api-key-here \
     --namespace=learnflow
   ```

3. **Verify Secret Created**:
   ```bash
   kubectl get secret llm-secret -n learnflow
   ```

4. **ConfigMap is Already Set**:
   - `LLM_PROVIDER=glm` is already configured in `k8s/configmap.yaml`
   - `LLM_MODEL=glm-4.7` is the default model

---

#### Option B: OpenAI (GPT-4)

**Why**: Industry standard, excellent performance

**What you need to do**:

1. **Get OpenAI API Key**:
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Name it: `LearnFlow Development`
   - Copy the key

2. **Create Kubernetes Secret**:
   ```bash
   kubectl create secret generic llm-secret \
     --from-literal=OPENAI_API_KEY=sk-your-actual-key-here \
     --namespace=learnflow
   ```

3. **Update ConfigMap** (change `LLM_PROVIDER` to `openai`):
   ```bash
   kubectl edit configmap learnflow-config -n learnflow
   # Change LLM_PROVIDER from "glm" to "openai"
   ```

4. **Verify Secret Created**:
   ```bash
   kubectl get secret llm-secret -n learnflow
   ```

---

### 3. Database Connection String

**Status**: PostgreSQL is running but connection string needs confirmation

**What you need to do**:

1. **Get Neon PostgreSQL Connection String**:
   - Go to: https://neon.tech
   - Copy the connection string (PostgreSQL URL)
   - Format: `postgresql://user:password@host/database`

2. **Verify Connection Works**:
   ```bash
   # Test connection (optional)
   kubectl run -it --rm psql-test --image=postgres:16 --restart=Never -n learnflow -- psql YOUR_CONNECTION_STRING
   ```

---

## 🟢 NICE TO HAVE - For Full Deployment

### 4. Cloud Provider Access (Phase 9)

**When needed**: Cloud deployment phase

**What you need**:

**Option A: DigitalOcean**:
- Create account: https://digitalocean.com
- Get API Token: https://cloud.digitalocean.com/settings/api/tokens
- Scopes: Read & Write

**Option B: Google Cloud (GKE)**:
- Create account: https://cloud.google.com
- Enable Kubernetes Engine API
- Install gcloud CLI
- Run: `gcloud auth application-default login`

**Option C: Azure (AKS)**:
- Create account: https://azure.microsoft.com
- Install az CLI
- Run: `az login`

**Option D: Oracle Cloud**:
- Create account: https://www.oracle.com/cloud/
- Get API Key from OCI console

---

### 5. Domain Name (Optional)

**When needed**: Public deployment with custom domain

**What you need**:
- Buy domain from any registrar (Namecheap, GoDaddy, Cloudflare, etc.)
- Point DNS to your cloud provider's load balancer IP

---

### 6. GitHub Actions Secrets

**When needed**: CI/CD automation (Phase 10)

**What you need**:

1. Go to: https://github.com/hamdanprofessional/learnflow-app/settings/secrets/actions
2. Add these secrets:
   - `GLM_API_KEY` OR `OPENAI_API_KEY`: Your LLM API key (depending on provider)
   - `DATABASE_URL`: Your Neon connection string
   - `GHCR_TOKEN`: Your GitHub Personal Access Token
   - `CLOUD_API_KEY`: Your cloud provider API key

---

## 📋 Checklist - Track Your Progress

Use this checklist to track what you've completed:

```
[ ] 1. GitHub Personal Access Token created
[ ] 2. GHCR secret updated in Kubernetes
[ ] 3. Backend pods restarted
[ ] 4. All pods showing 2/2 Running
[ ] 5. LLM API key created (GLM 4.7 recommended, or OpenAI)
[ ] 6. llm-secret created in Kubernetes
[ ] 7. Database connection string verified
[ ] 8. Cloud provider account created (when ready)
[ ] 9. Domain name configured (optional)
[ ] 10. GitHub Actions secrets configured (when ready)
```

---

## 🚀 After You Complete Tasks

**Tell me when you've completed:**

1. **GHCR Auth**: Say "GHCR updated" and I'll verify pods are running
2. **LLM Key**: Say "LLM added" (GLM or OpenAI) and I'll implement agent logic
3. **Any Task Completed**: Let me know and I'll continue from where I left off

---

## ❓ Need Help?

If you're stuck on any manual task:
1. Check the exact error message
2. Run: `kubectl get events -n learnflow --sort-by='.lastTimestamp'` (for K8s issues)
3. Check logs: `kubectl logs <pod-name> -n learnflow`
4. Share the error with me and I'll help debug

---

**Current Blocker**: Task #1 (GHCR Auth) - Complete this to unblock backend services
