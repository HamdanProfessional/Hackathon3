# Phase 9: Cloud Deployment Specification

**Status**: Draft
**Phase**: 9
**Focus**: Deploy LearnFlow on a public cloud provider (Azure, GCP, or Oracle Cloud)

---

## Overview

Deploy the complete LearnFlow application to a production Kubernetes cluster on a public cloud provider. This demonstrates that the Skills and application work beyond local Minikube development.

**Cloud Provider Options**:
- **Azure Kubernetes Service (AKS)**
- **Google Kubernetes Engine (GKE)**
- **Oracle Container Engine for Kubernetes (OKE)**

---

## Success Criteria

- [ ] Kubernetes cluster created on cloud provider
- [ ] All services deployed and running
- [ ] Ingress configured with TLS/SSL
- [ ] Domain name configured
- [ ] Database backups enabled
- [ ] Monitoring and logging configured
- [ ] Zero downtime deployment
- [ ] Deployment automated via Skills

---

## Architecture: Cloud

### Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                         CLOUD PROVIDER                                 │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                    KUBERNETES CLUSTER                             │ │
│  │                                                                  │ │
│  │  ┌────────────────────────────────────────────────────────────┐  │ │
│  │  │  NAMESPACE: ingress                                        │  │ │
│  │  │                                                            │  │ │
│  │  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │  │ │
│  │  │  │  Nginx/Cert  │    │   External   │    │     DNS      │ │  │ │
│  │  │  │    Manager   │    │    Load      │    │   (Cloud)    │ │  │ │
│  │  │  │              │    │   Balancer   │    │              │ │  │ │
│  │  │  └──────────────┘    └──────────────┘    └──────────────┘ │  │ │
│  │  └────────────────────────────────────────────────────────────┘  │ │
│  │                          ▼                                       │ │
│  │  ┌────────────────────────────────────────────────────────────┐  │ │
│  │  │  NAMESPACE: learnflow                                      │  │ │
│  │  │                                                            │  │ │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │ │
│  │  │  │   Next.js    │  │   FastAPI    │  │   MCP Srv    │    │  │ │
│  │  │  │   Frontend   │  │  Services    │  │              │    │  │ │
│  │  │  │              │  │  (x5)        │  │   (x4)        │    │  │ │
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │ │
│  │  │                                                            │  │ │
│  │  │  ┌──────────────┐  ┌──────────────┐                      │  │ │
│  │  │  │   Kafka      │  │ PostgreSQL   │                      │  │ │
│  │  │  │ (Managed)    │  │  (Managed)   │                      │  │ │
│  │  │  └──────────────┘  └──────────────┘                      │  │ │
│  │  └────────────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                      MANAGED SERVICES                             │ │
│  │                                                                  │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │ │
│  │  │   Database   │  │    Object    │  │   Secret     │          │ │
│  │  │   (Cloud)    │  │   Storage    │  │  Manager     │          │ │
│  │  │              │  │              │  │              │          │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                           learnflow.example.com
```

---

## Cloud Provider Comparison

| Feature | Azure (AKS) | Google (GKE) | Oracle (OKE) |
|---------|-------------|--------------|---------------|
| Free Tier | $200 credit (12 months) | $300 credit (90 days) | Always Free tier |
| Cluster Creation | Portal, CLI, Terraform | Console, CLI, Terraform | Console, CLI, Terraform |
| Managed Kafka | Azure Event Hubs | Cloud Pub/Sub | Oracle Streaming |
| Managed PostgreSQL | Azure Database | Cloud SQL | Autonomous Database |
| Load Balancer | Azure LB | Cloud LB | Network LB |
| Ingress | Azure App Gateway | Cloud Load Balancing | Network Load Balancer |
| Container Registry | Azure Container Registry | Artifact Registry | Oracle Container Registry |
| Monitoring | Azure Monitor | Cloud Monitoring | Application Monitoring |

---

## Azure Kubernetes Service (AKS)

### Prerequisites

```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login
az login

# Install kubectl
az aks install-cli

# Verify
az --version
kubectl version --client
```

### Cluster Creation

```bash
# Create resource group
az group create \
  --name learnflow-rg \
  --location eastus

# Create AKS cluster
az aks create \
  --resource-group learnflow-rg \
  --name learnflow-aks \
  --node-count 3 \
  --node-vm-size Standard_DS2_v2 \
  --enable-managed-identity \
  --enable-msi-auth-for-monitoring \
  --generate-ssh-keys

# Get credentials
az aks get-credentials \
  --resource-group learnflow-rg \
  --name learnflow-aks

# Verify cluster
kubectl get nodes
```

### Azure Services

| Service | Purpose | Command |
|---------|---------|---------|
| Azure Container Registry | Docker images | `az acr create` |
| Azure Database for PostgreSQL | Managed database | `az postgres server create` |
| Azure Event Hubs | Managed Kafka | `az eventhubs namespace create` |
| Azure Key Vault | Secrets management | `az keyvault create` |
| Azure Monitor | Monitoring | `az monitor account create` |

---

## Google Kubernetes Engine (GKE)

### Prerequisites

```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Install kubectl
gcloud components install kubectl

# Verify
gcloud version
kubectl version --client
```

### Cluster Creation

```bash
# Create GKE cluster
gcloud container clusters create learnflow-gke \
  --zone=us-central1-a \
  --num-nodes=3 \
  --machine-type=e2-medium \
  --enable-autoscaling \
  --min-nodes=1 \
  --max-nodes=5 \
  --enable-autorepair \
  --enable-autoupgrade

# Get credentials
gcloud container clusters get-credentials learnflow-gke \
  --zone=us-central1-a

# Verify cluster
kubectl get nodes
```

### GCP Services

| Service | Purpose | Command |
|---------|---------|---------|
| Artifact Registry | Docker images | `gcloud artifacts repositories create` |
| Cloud SQL | Managed PostgreSQL | `gcloud sql instances create` |
| Cloud Pub/Sub | Managed Kafka | `gcloud pubsub topics create` |
| Secret Manager | Secrets management | `gcloud secrets create` |
| Cloud Monitoring | Monitoring | `gcloud monitoring dashboards create` |

---

## Oracle Cloud Infrastructure (OKE)

### Prerequisites

```bash
# Install OCI CLI
curl --location https://github.com/oracle/oci-cli/releases/download/v3.0.0/oci-cli-installer.sh -o oci-cli-installer.sh
chmod +x oci-cli-installer.sh
./oci-cli-installer.sh --accept-default-values

# Configure
oci setup config

# Install kubectl
oci ce cluster install-kubectl

# Verify
oci --version
kubectl version --client
```

### Cluster Creation

```bash
# Create OKE cluster
oci ce cluster create \
  --name learnflow-oke \
  --compartment-id $COMPARTMENT_ID \
  --kubernetes-version 1.27.0 \
  --node-shape VM.Standard.E4.Flex \
  --node-pool-subnet-ids $SUBNET_ID

# Get credentials
oci ce cluster create-kubeconfig \
  --cluster-id $CLUSTER_ID \
  --file $HOME/.kube/config \
  --region us-ashburn-1

# Verify cluster
kubectl get nodes
```

### OCI Services

| Service | Purpose | Command |
|---------|---------|---------|
| Oracle Container Registry | Docker images | `oci artifact container repository create` |
| Autonomous Database | Managed PostgreSQL | `oci db autonomous-database create` |
| Streaming | Managed Kafka | `oci streaming stream create` |
| Vault | Secrets management | `oci vault management vault create` |
| Application Monitoring | Monitoring | `oci apm-synthetics monitor create` |

---

## Deployment Configuration

### Namespace and Resource Management

```yaml
# namespaces.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: learnflow
  labels:
    name: learnflow
    environment: production

---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-resources
  namespace: learnflow
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi

---
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
  namespace: learnflow
spec:
  limits:
  - default:
      cpu: 500m
      memory: 512Mi
    defaultRequest:
      cpu: 100m
      memory: 128Mi
    type: Container
```

### Ingress with TLS

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: learnflow-ingress
  namespace: learnflow
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - learnflow.example.com
    secretName: learnflow-tls
  rules:
  - host: learnflow.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: learnflow-frontend
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: kong-api-gateway
            port:
              number: 8000
```

### Persistent Storage

```yaml
# pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: kafka-pvc
  namespace: kafka
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: standard
  resources:
    requests:
      storage: 50Gi

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: postgres
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: standard
  resources:
    requests:
      storage: 20Gi
```

---

## Managed Services Integration

### Azure Database for PostgreSQL

```bash
# Create Azure PostgreSQL
az postgres server create \
  --name learnflow-postgres \
  --resource-group learnflow-rg \
  --location eastus \
  --admin-user postgres \
  --admin-password $PASSWORD \
  --sku-name GP_Gen5_2 \
  --version 14

# Configure firewall
az postgres server firewall-rule create \
  --name allow-all \
  --resource-group learnflow-rg \
  --server learnflow-postgres \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 255.255.255.255

# Get connection string
az postgres server show-connection-string \
  --server-name learnflow-postgres \
  --database-name learnflow \
  --client psql
```

### Azure Event Hubs (Kafka Alternative)

```bash
# Create Event Hubs namespace
az eventhubs namespace create \
  --name learnflow-events \
  --resource-group learnflow-rg \
  --location eastus \
  --sku Standard

# Create Event Hub
az eventhubs eventhub create \
  --name learning-events \
  --namespace-name learnflow-events \
  --resource-group learnflow-rg \
  --message-retention 7 \
  --partition-count 2
```

---

## Monitoring and Logging

### Azure Monitor

```bash
# Create Log Analytics workspace
az monitor log-analytics workspace create \
  --name learnflow-logs \
  --resource-group learnflow-rg \
  --location eastus

# Enable Container Insights
az aks enable-addons \
  --resource-group learnflow-rg \
  --name learnflow-aks \
  --addons monitoring \
  --workspace-resource-id $WORKSPACE_ID
```

### GCP Cloud Monitoring

```bash
# Enable Cloud Monitoring
gcloud monitoring app create learnflow

# Install Ops Agent
kubectl apply -f https://raw.githubusercontent.com/GoogleCloudPlatform/opentelemetry-operations-kubernetes/main/config/otel.yaml
```

---

## Deployment Automation

### Using cloud-deployer Skill

```bash
claude
> Deploy LearnFlow to Azure AKS using cloud-deployer skill
> Configure ingress with TLS
> Enable Azure Database for PostgreSQL
> Set up Azure Monitor

# AI will:
# 1. Read cloud-deployer SKILL.md
# 2. Execute cloud-specific deployment scripts
# 3. Configure managed services
# 4. Set up ingress and DNS
# 5. Enable monitoring
```

---

## Domain Configuration

### DNS Setup

```bash
# Get external IP
kubectl get svc ingress-controller -n ingress

# Add A record in your DNS provider
# learnflow.example.com → A → <EXTERNAL_IP>
```

### SSL/TLS with Let's Encrypt

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create cluster issuer
cat > cluster-issuer.yaml << 'EOF'
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

kubectl apply -f cluster-issuer.yaml
```

---

## Validation

### Health Check

```bash
# Check all pods
kubectl get pods -A

# Check services
kubectl get svc -A

# Check ingress
kubectl get ingress -n learnflow

# Test application
curl -I https://learnflow.example.com
```

### Load Test

```bash
# Install kubectl plugin for load testing
kubectl krew install load

# Run load test
kubectl load test \
  --url https://learnflow.example.com \
  --requests 1000 \
  --concurrency 50
```

---

## Backup and Disaster Recovery

### Azure Backup

```bash
# Create Recovery Services vault
az backup vault create \
  --name learnflow-backup \
  --resource-group learnflow-rg \
  --location eastus

# Enable backup for PostgreSQL
az backup protection enable-for-azurel_database \
  --vault-name learnflow-backup \
  --resource-group learnflow-rg \
  --server learnflow-postgres \
  --database learnflow
```

### Snapshot Storage

```bash
# Create storage account
az storage account create \
  --name learnflowbackup \
  --resource-group learnflow-rg \
  --location eastus \
  --sku Standard_LRS

# Create snapshot schedule
kubectl create -f snapshot-schedule.yaml
```

---

## Cost Optimization

### Azure Cost Management

```bash
# Set budget alerts
az consumption budget create \
  --name monthly-budget \
  --resource-group learnflow-rg \
  --amount 100 \
  --timegrain Monthly \
  --category Actual
```

### Right-Sizing Recommendations

```bash
# Azure Advisor
az advisor recommendation list

# GCP Recommender
gcloud recommender recommendations list
```

---

## Bonus Skills

The following bonus skills can be implemented to enhance the cloud deployment:

### prometheus-grafana-setup

**Purpose**: Deploy Prometheus and Grafana for monitoring and alerting.

**Use When**:
- Setting up comprehensive monitoring
- Creating dashboards for metrics visualization
- Configuring alerting rules

**Key Features**:
- Prometheus for metrics collection
- Grafana for visualization
- AlertManager for notifications
- Pre-configured dashboards for LearnFlow services

### pg-data-backup-restore

**Purpose**: Implement automated backup and recovery for PostgreSQL on Kubernetes.

**Use When**:
- Setting up data protection
- Implementing disaster recovery
- Scheduled backups required

**Key Features**:
- Automated backup scheduling
- Point-in-time recovery
- Backup retention policies
- Cross-region replication (optional)

---

## Deliverables

1. **Cloud Deployment**
   - Kubernetes cluster running
   - All services deployed
   - Ingress with TLS configured
   - Domain name accessible

2. **Managed Services**
   - Managed database configured
   - Managed Kafka or alternative
   - Monitoring enabled
   - Backups configured

3. **Documentation**
   - Cloud deployment guide
   - Cost analysis
   - Disaster recovery plan

---

## Next Phase

After Phase 9 completion, proceed to **Phase 10: Continuous Deployment** where Argo CD and GitHub Actions will be set up for GitOps-based continuous deployment.
