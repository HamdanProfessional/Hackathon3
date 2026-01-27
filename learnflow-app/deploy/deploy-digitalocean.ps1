# LearnFlow DigitalOcean Deployment Script (PowerShell)
# This script deploys LearnFlow to DigitalOcean Kubernetes (DOKS)
#
# Prerequisites:
# - doctl CLI installed and authenticated
# - kubectl configured for DOKS cluster
# - Docker running (for building images)
# - DigitalOcean Container Registry (DOCR) created

param(
    [switch]$SkipBuild,
    [switch]$SkipInfra,
    [switch]$Help
)

# Configuration
$REGISTRY = "registry.digitalocean.com/learnflow-registry"
$NAMESPACE = "learnflow"
$DOMAIN = "hackathon3.testservers.online"

# Functions
function Print-Step {
    param([string]$Message)
    Write-Host "==> $Message" -ForegroundColor Green
}

function Print-Warning {
    param([string]$Message)
    Write-Host "WARNING: $Message" -ForegroundColor Yellow
}

function Test-Prerequisites {
    Print-Step "Checking prerequisites..."

    # Check doctl
    if (-not (Get-Command doctl -ErrorAction SilentlyContinue)) {
        Write-Error "doctl not found. Install from: https://github.com/digitalocean/doctl/releases"
        exit 1
    }

    # Check kubectl
    if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
        Write-Error "kubectl not found. Install from: https://kubernetes.io/docs/tasks/tools/"
        exit 1
    }

    # Check docker
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Error "docker not found. Please install Docker Desktop"
        exit 1
    }

    # Check doctl authentication
    $null = doctl account get 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "doctl not authenticated. Run: doctl auth init"
        exit 1
    }

    Write-Host "✓ All prerequisites met" -ForegroundColor Green
}

function Build-And-Push-Images {
    Print-Step "Building and pushing container images..."

    $COMMIT_SHA = $(git rev-parse --short HEAD 2>$null) -join ""
    if (-not $COMMIT_SHA) { $COMMIT_SHA = "latest" }

    $FRONTEND_DIR = "../frontend"
    $BACKEND_DIR = "../backend"

    # Build frontend image
    Print-Step "Building frontend image..."
    Push-Location $FRONTEND_DIR
    docker build -t "learnflow-frontend:$COMMIT_SHA" .
    docker tag "learnflow-frontend:$COMMIT_SHA" "$REGISTRY/learnflow-frontend:$COMMIT_SHA"
    docker tag "learnflow-frontend:$COMMIT_SHA" "$REGISTRY/learnflow-frontend:latest"
    docker push "$REGISTRY/learnflow-frontend:$COMMIT_SHA"
    docker push "$REGISTRY/learnflow-frontend:latest"
    Pop-Location

    # Build backend image
    Print-Step "Building backend image..."
    Push-Location $BACKEND_DIR
    docker build -f Dockerfile.services -t "learnflow-backend:$COMMIT_SHA" .
    docker tag "learnflow-backend:$COMMIT_SHA" "$REGISTRY/learnflow-backend:$COMMIT_SHA"
    docker tag "learnflow-backend:$COMMIT_SHA" "$REGISTRY/learnflow-backend:latest"
    docker push "$REGISTRY/learnflow-backend:$COMMIT_SHA"
    docker push "$REGISTRY/learnflow-backend:latest"
    Pop-Location

    # Build MCP server images
    Print-Step "Building MCP server images..."

    # MCP Code Execution Server
    Push-Location "$BACKEND_DIR/mcp-servers/code-execution-mcp"
    docker build -t "mcp-code-exec-server:$COMMIT_SHA" .
    docker tag "mcp-code-exec-server:$COMMIT_SHA" "$REGISTRY/mcp-code-exec-server:$COMMIT_SHA"
    docker tag "mcp-code-exec-server:$COMMIT_SHA" "$REGISTRY/mcp-code-exec-server:latest"
    docker push "$REGISTRY/mcp-code-exec-server:$COMMIT_SHA"
    docker push "$REGISTRY/mcp-code-exec-server:latest"
    Pop-Location

    # MCP Database Server
    Push-Location "$BACKEND_DIR/mcp-servers/database-mcp"
    docker build -t "mcp-database-server:$COMMIT_SHA" .
    docker tag "mcp-database-server:$COMMIT_SHA" "$REGISTRY/mcp-database-server:$COMMIT_SHA"
    docker tag "mcp-database-server:$COMMIT_SHA" "$REGISTRY/mcp-database-server:latest"
    docker push "$REGISTRY/mcp-database-server:$COMMIT_SHA"
    docker push "$REGISTRY/mcp-database-server:latest"
    Pop-Location

    # MCP Kafka Server
    Push-Location "$BACKEND_DIR/mcp-servers/kafka-mcp"
    docker build -t "mcp-kafka-server:$COMMIT_SHA" .
    docker tag "mcp-kafka-server:$COMMIT_SHA" "$REGISTRY/mcp-kafka-server:$COMMIT_SHA"
    docker tag "mcp-kafka-server:$COMMIT_SHA" "$REGISTRY/mcp-kafka-server:latest"
    docker push "$REGISTRY/mcp-kafka-server:$COMMIT_SHA"
    docker push "$REGISTRY/mcp-kafka-server:latest"
    Pop-Location

    # MCP Kubernetes Server
    Push-Location "$BACKEND_DIR/mcp-servers/kubernetes-mcp"
    docker build -t "mcp-k8s-server:$COMMIT_SHA" .
    docker tag "mcp-k8s-server:$COMMIT_SHA" "$REGISTRY/mcp-k8s-server:$COMMIT_SHA"
    docker tag "mcp-k8s-server:$COMMIT_SHA" "$REGISTRY/mcp-k8s-server:latest"
    docker push "$REGISTRY/mcp-k8s-server:$COMMIT_SHA"
    docker push "$REGISTRY/mcp-k8s-server:latest"
    Pop-Location

    Write-Host "✓ All images built and pushed" -ForegroundColor Green
}

function Setup-Kubernetes-Namespace {
    Print-Step "Setting up Kubernetes namespace..."

    kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

    Write-Host "✓ Namespace $NAMESPACE ready" -ForegroundColor Green
}

function Create-DOCR-Secret {
    Print-Step "Creating DOCR pull secret..."

    $DO_TOKEN = (doctl auth token 2>$null) -join ""
    if (-not $DO_TOKEN) {
        Print-Warning "Could not get DO token automatically. Please enter it manually:"
        $DO_TOKEN = Read-Host "DigitalOcean API Token" -AsSecureString
        $DO_TOKEN = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($DO_TOKEN))
    }

    kubectl create secret docker-registry docr-secret `
        --namespace=$NAMESPACE `
        --docker-server=$REGISTRY `
        --docker-username=$DO_TOKEN `
        --docker-password=$DO_TOKEN `
        --dry-run=client -o yaml | kubectl apply -f -

    Write-Host "✓ DOCR secret created" -ForegroundColor Green
}

function Deploy-Infrastructure {
    Print-Step "Deploying infrastructure components..."

    # Deploy PostgreSQL via Helm
    Print-Step "Deploying PostgreSQL..."
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm repo update

    $DB_PASSWORD = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

    helm upgrade --install postgres bitnami/postgresql `
        --namespace postgres --create-namespace `
        --set auth.database=learnflow `
        --set auth.username=learnflow `
        --set "auth.password=$DB_PASSWORD" `
        --set persistence.enabled=true `
        --set persistence.size=20Gi `
        --set primary.service.ports.postgresql=5432

    # Deploy Kafka/Redpanda
    Print-Step "Deploying Kafka (Redpanda)..."
    helm repo add redpanda https://charts.redpanda.com
    helm repo update

    helm upgrade --install redpanda redpanda/redpanda `
        --namespace redpanda-system --create-namespace `
        --set replicas=1 `
        --set resources.limits.cpu=2 `
        --set resources.limits.memory=4Gi `
        --set persistence.enabled=true `
        --set persistence.size=50Gi

    Write-Host "✓ Infrastructure deployed" -ForegroundColor Green
}

function Deploy-Backend-Services {
    Print-Step "Deploying backend microservices..."

    kubectl apply -f ../backend/k8s/backend-services.yaml

    # Wait for deployments
    $services = @("triage-service", "concepts-service", "debug-service", "exercise-service", "progress-service", "code-review-service")
    foreach ($svc in $services) {
        kubectl wait --for=condition=available --timeout=300s deployment/$svc -n $NAMESPACE
    }

    Write-Host "✓ Backend services deployed" -ForegroundColor Green
}

function Deploy-MCP-Servers {
    Print-Step "Deploying MCP servers..."

    kubectl apply -f ../backend/mcp-servers/k8s/mcp-code-exec-server.yaml
    kubectl apply -f ../backend/mcp-servers/k8s/mcp-database-server.yaml
    kubectl apply -f ../backend/mcp-servers/k8s/mcp-kafka-server.yaml
    kubectl apply -f ../backend/mcp-servers/k8s/mcp-k8s-server.yaml

    # Wait for MCP servers
    $mcpServers = @("mcp-code-exec-server", "mcp-database-server", "mcp-kafka-server", "mcp-k8s-server")
    foreach ($srv in $mcpServers) {
        kubectl wait --for=condition=available --timeout=180s deployment/$srv -n $NAMESPACE
    }

    Write-Host "✓ MCP servers deployed" -ForegroundColor Green
}

function Deploy-Frontend {
    Print-Step "Deploying frontend..."

    kubectl apply -f ../frontend/k8s/deployment.yaml
    kubectl apply -f ../frontend/k8s/service.yaml
    kubectl apply -f ../frontend/k8s/ingress.yaml

    kubectl wait --for=condition=available --timeout=180s deployment/learnflow-frontend -n $NAMESPACE

    Write-Host "✓ Frontend deployed" -ForegroundColor Green
}

function Setup-TLS {
    Print-Step "Setting up TLS with cert-manager..."

    # Install cert-manager
    kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

    # Wait for cert-manager
    kubectl wait --for=condition=available --timeout=180s deployment/cert-manager -n cert-manager
    kubectl wait --for=condition=available --timeout=180s deployment/cert-manager-cainjector -n cert-manager
    kubectl wait --for=condition=available --timeout=180s deployment/cert-manager-webhook -n cert-manager

    # Create ClusterIssuer
    $clusterIssuer = @"
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
"@

    $clusterIssuer | kubectl apply -f -

    Write-Host "✓ cert-manager installed and configured" -ForegroundColor Green
}

function Verify-Deployment {
    Print-Step "Verifying deployment..."

    Write-Host "`nPods in $NAMESPACE namespace:"
    kubectl get pods -n $NAMESPACE

    Write-Host "`nServices in $NAMESPACE namespace:"
    kubectl get svc -n $NAMESPACE

    Write-Host "`nIngress:"
    kubectl get ingress -n $NAMESPACE

    Print-Step "Deployment complete!"
    Write-Host "Application should be accessible at: https://$DOMAIN"
    Write-Host "`nTo check logs:"
    Write-Host "  kubectl logs -f deployment/learnflow-frontend -n $NAMESPACE"
    Write-Host "`nTo get LoadBalancer IP for DNS:"
    Write-Host "  kubectl get svc -n ingress-nginx"
}

# Main execution
function Main {
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "LearnFlow DigitalOcean Deployment" -ForegroundColor Cyan
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""

    if ($Help) {
        Write-Host "Usage: .\deploy-digitalocean.ps1 [OPTIONS]"
        Write-Host "Options:"
        Write-Host "  -SkipBuild    Skip building and pushing images"
        Write-Host "  -SkipInfra    Skip deploying infrastructure (PostgreSQL, Kafka)"
        Write-Host "  -Help         Show this help message"
        exit 0
    }

    # Change to script directory
    $scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
    Set-Location $scriptPath

    # Run deployment steps
    Test-Prerequisites

    if (-not $SkipBuild) {
        Build-And-Push-Images
    } else {
        Print-Warning "Skipping image build"
    }

    Setup-Kubernetes-Namespace
    Create-DOCR-Secret

    if (-not $SkipInfra) {
        Deploy-Infrastructure
    } else {
        Print-Warning "Skipping infrastructure deployment"
    }

    Deploy-Backend-Services
    Deploy-MCP-Servers
    Deploy-Frontend
    Setup-TLS
    Verify-Deployment
}

# Run main function
Main
