# LearnFlow DigitalOcean Deployment Guide

This guide covers deploying LearnFlow to DigitalOcean Kubernetes (DOKS).

## Prerequisites

1. **DigitalOcean Account** - Sign up at https://digitalocean.com
2. **doctl CLI** - Install from https://github.com/digitalocean/doctl/releases
3. **kubectl** - Install from https://kubernetes.io/docs/tasks/tools/
4. **Docker Desktop** - For building container images
5. **Helm** - Install from https://helm.sh/docs/intro/install/

## Quick Start

### Step 1: Install doctl and Authenticate

```bash
# Windows (PowerShell)
winget install doctl

# Linux/Mac
curl -sL https://github.com/digitalocean/doctl/releases/download/v1.105.0/doctl-1.105.0-linux-amd64.tar.gz | tar xz
sudo mv doctl /usr/local/bin/

# Authenticate
doctl auth init
```

### Step 2: Create Container Registry (DOCR)

```bash
# Create registry
doctl registry create learnflow-registry

# Login to registry
doctl registry login
```

### Step 3: Create Kubernetes Cluster

```bash
# Create DOKS cluster (3 nodes, 2 vCPU, 4GB RAM each)
doctl kubernetes cluster create learnflow-prod \
  --region nyc1 \
  --node-pool "name=default-pool;size=s-2vcpu-4gb;count=3" \
  --tag learnflow

# Save kubeconfig
doctl kubernetes cluster kubeconfig save learnflow-prod

# Verify connection
kubectl cluster-info
```

### Step 4: Build and Push Images

```bash
# From the learnflow-app directory
cd deploy

# Windows PowerShell
.\deploy-digitalocean.ps1 -SkipInfra

# Linux/Mac
chmod +x deploy-digitalocean.sh
./deploy-digitalocean.sh --skip-infra
```

### Step 5: Deploy Application

```bash
# Full deployment (includes PostgreSQL, Kafka, TLS)
.\deploy-digitalocean.ps1

# Or skip image build if already done
.\deploy-digitalocean.ps1 -SkipBuild
```

### Step 6: Configure DNS

1. Get the LoadBalancer IP:
```bash
kubectl get svc -n ingress-nginx
```

2. Add DNS record in Cloudflare:
   - Type: A
   - Name: hackathon3
   - Content: <LoadBalancer IP>
   - Proxy: Off (for TLS)

### Step 7: Verify Deployment

```bash
# Check all pods
kubectl get pods -n learnflow

# Check services
kubectl get svc -n learnflow

# Check ingress
kubectl get ingress -n learnflow

# Test application
curl https://hackathon3.testservers.online
```

## Manual Deployment Steps

If you prefer to deploy manually instead of using the script:

### 1. Create Namespace
```bash
kubectl create namespace learnflow
```

### 2. Create DOCR Pull Secret
```bash
kubectl create secret docker-registry docr-secret \
  --namespace=learnflow \
  --docker-server=registry.digitalocean.com \
  --docker-username=<YOUR_TOKEN> \
  --docker-password=<YOUR_TOKEN>
```

### 3. Deploy PostgreSQL
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm upgrade --install postgres bitnami/postgresql \
  --namespace postgres --create-namespace \
  --set auth.database=learnflow \
  --set auth.username=learnflow \
  --set auth.password=<generate-password> \
  --set persistence.enabled=true \
  --set persistence.size=20Gi
```

### 4. Deploy Kafka (Redpanda)
```bash
helm repo add redpanda https://charts.redpanda.com
helm upgrade --install redpanda redpanda/redpanda \
  --namespace redpanda-system --create-namespace \
  --set replicas=1 \
  --set persistence.enabled=true \
  --set persistence.size=50Gi
```

### 5. Deploy Backend Services
```bash
kubectl apply -f ../backend/k8s/backend-services.yaml
```

### 6. Deploy MCP Servers
```bash
kubectl apply -f ../backend/mcp-servers/k8s/mcp-code-exec-server.yaml
kubectl apply -f ../backend/mcp-servers/k8s/mcp-database-server.yaml
kubectl apply -f ../backend/mcp-servers/k8s/mcp-kafka-server.yaml
kubectl apply -f ../backend/mcp-servers/k8s/mcp-k8s-server.yaml
```

### 7. Deploy Frontend
```bash
kubectl apply -f ../frontend/k8s/deployment.yaml
kubectl apply -f ../frontend/k8s/service.yaml
kubectl apply -f ../frontend/k8s/ingress.yaml
```

### 8. Install NGINX Ingress Controller
```bash
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

### 9. Install cert-manager for TLS
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: n00bi2761@gmail.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

## Troubleshooting

### Pods Not Starting
```bash
# Check pod status
kubectl describe pod <pod-name> -n learnflow

# Check logs
kubectl logs <pod-name> -n learnflow
```

### Image Pull Errors
- Verify DOCR secret exists: `kubectl get secret docr-secret -n learnflow`
- Verify images exist: `doctl repository list`
- Check imagePullSecrets in deployments

### TLS Certificate Issues
```bash
# Check certificate status
kubectl get certificate -n learnflow

# Check cert-manager logs
kubectl logs -n cert-manager deployment/cert-manager
```

### Service Connectivity
```bash
# Test service from within cluster
kubectl run -it --rm debug --image=busybox --restart=Never -- sh
# Then: wget -O- http://service-name:port
```

## Cost Estimate

Based on DigitalOcean pricing (as of 2025):

| Resource | Cost/Month |
|----------|-----------|
| DOKS Cluster (3 nodes: s-2vcpu-4gb) | $120 |
| Load Balancer | $12 |
| Block Storage (70GB) | $28 |
| Container Registry | $0-5 |
| Bandwidth | ~$10-20 |
| **Total** | **~$170-185/month** |

## Scaling

### Horizontal Pod Autoscaler
Frontend is configured with HPA:
- Min: 2 replicas
- Max: 10 replicas
- Scale on CPU > 70% or Memory > 80%

### Manual Scaling
```bash
# Scale frontend
kubectl scale deployment/learnflow-frontend --replicas=5 -n learnflow

# Scale backend service
kubectl scale deployment/triage-service --replicas=3 -n learnflow
```

## Monitoring

To add monitoring (Prometheus + Grafana):

```bash
# Install Prometheus
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm upgrade --install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace

# Access Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
# Default credentials: admin / prom-operator
```

## Rollback

### Rollback Deployment
```bash
# Rollback to previous version
kubectl rollout undo deployment/learnflow-frontend -n learnflow

# Rollback to specific revision
kubectl rollout undo deployment/learnflow-frontend --to-revision=2 -n learnflow
```

### Delete Everything
```bash
# Delete namespace and all resources
kubectl delete namespace learnflow
kubectl delete namespace postgres
kubectl delete namespace redpanda-system

# Delete cluster
doctl kubernetes cluster delete learnflow-prod
```

## Security Notes

1. **Secrets Management**: Use external secrets manager (e.g., Vault) for production
2. **Network Policies**: Implement network policies to restrict pod communication
3. **RBAC**: Review and restrict service account permissions
4. **Image Scanning**: Scan images for vulnerabilities before deploying
5. **Pod Security**: Enable Pod Security Standards

## Support

For issues or questions:
- DigitalOcean Docs: https://docs.digitalocean.com
- Kubernetes Docs: https://kubernetes.io/docs
- DOKS Support: https://cloud.digitalocean.com/support
