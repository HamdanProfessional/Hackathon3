# Phase 9: Cloud Deployment - Implementation Plan

**Phase**: 9
**Focus**: Deploy LearnFlow on a public cloud provider (Azure, GCP, or Oracle Cloud)
**Status**: Draft

---

## Overview

Deploy the complete LearnFlow application to a production Kubernetes cluster on a public cloud provider.

**Cloud Provider Options**:
- Azure Kubernetes Service (AKS)
- Google Kubernetes Engine (GKE)
- Oracle Container Engine for Kubernetes (OKE)

---

## Implementation Strategy

### Cloud Provider Selection

**Choose one based on**:
- Free tier availability
- Existing account
- Familiarity
- Region preference

**Default**: Azure AKS (recommended for free credits)

---

## Step-by-Step Implementation

### Step 1: Cloud Provider Setup

**Azure (AKS)**:
```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login
az login

# Install kubectl
az aks install-cli

# Create resource group
az group create --name learnflow-rg --location eastus
```

**Google (GKE)**:
```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
gcloud init

# Install kubectl
gcloud components install kubectl
```

**Oracle (OKE)**:
```bash
# Install OCI CLI
curl --location https://github.com/oracle/oci-cli/releases/download/v3.0.0/oci-cli-installer.sh -o oci-cli-installer.sh
chmod +x oci-cli-installer.sh
./oci-cli-installer.sh
oci setup config
```

---

### Step 2: Cluster Creation

**Azure (AKS)**:
```bash
az aks create \
  --resource-group learnflow-rg \
  --name learnflow-aks \
  --node-count 3 \
  --node-vm-size Standard_DS2_v2 \
  --enable-managed-identity \
  --generate-ssh-keys

# Get credentials
az aks get-credentials \
  --resource-group learnflow-rg \
  --name learnflow-aks
```

**Google (GKE)**:
```bash
gcloud container clusters create learnflow-gke \
  --zone=us-central1-a \
  --num-nodes=3 \
  --machine-type=e2-medium

gcloud container clusters get-credentials learnflow-gke \
  --zone=us-central1-a
```

**Oracle (OKE)**:
```bash
oci ce cluster create \
  --name learnflow-oke \
  --compartment-id $COMPARTMENT_ID \
  --node-shape VM.Standard.E4.Flex

oci ce cluster create-kubeconfig \
  --cluster-id $CLUSTER_ID \
  --file $HOME/.kube/config
```

---

### Step 3: Managed Services

**Azure Database for PostgreSQL**:
```bash
az postgres server create \
  --name learnflow-postgres \
  --resource-group learnflow-rg \
  --admin-user postgres \
  --sku-name GP_Gen5_2

# Configure firewall
az postgres server firewall-rule create \
  --name allow-all \
  --resource-group learnflow-rg \
  --server learnflow-postgres \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 255.255.255.255
```

**Azure Event Hubs (Kafka alternative)**:
```bash
az eventhubs namespace create \
  --name learnflow-events \
  --resource-group learnflow-rg

az eventhubs eventhub create \
  --name learning-events \
  --namespace-name learnflow-events \
  --resource-group learnflow-rg
```

---

### Step 4: Application Deployment

**Using cloud-deployer Skill**:
```bash
claude
> Deploy LearnFlow to Azure AKS using cloud-deployer skill
> Configure ingress with TLS
> Enable Azure Database for PostgreSQL
> Set up Azure Monitor
```

---

### Step 5: Ingress Configuration

**TLS with Let's Encrypt**:
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

### Step 6: Domain Configuration

**DNS Setup**:
```bash
# Get external IP
kubectl get svc ingress-controller -n ingress

# Add A record in your DNS provider
# learnflow.example.com → A → <EXTERNAL_IP>
```

---

### Step 7: Monitoring Setup

**Azure Monitor**:
```bash
# Create Log Analytics workspace
az monitor log-analytics workspace create \
  --name learnflow-logs \
  --resource-group learnflow-rg

# Enable Container Insights
az aks enable-addons \
  --resource-group learnflow-rg \
  --name learnflow-aks \
  --addons monitoring
```

---

## Success Criteria Validation

- [ ] Kubernetes cluster created
- [ ] All services deployed
- [ ] Ingress configured with TLS
- [ ] Domain name accessible
- [ ] Database backups enabled
- [ ] Monitoring configured
- [ ] Zero downtime deployment

---

## Deliverables

1. **Cloud Deployment**
   - Cluster running
   - Services deployed
   - TLS configured

2. **Managed Services**
   - Database configured
   - Monitoring enabled
   - Backups configured

3. **Documentation**
   - Deployment guide
   - Cost analysis
   - Disaster recovery plan

---

## Dependencies

**Required**:
- Phase 7 complete (app built)
- Cloud account with credits
- Domain name (optional)

**Blocking**:
- Phase 7 must be complete
- Cloud account required
