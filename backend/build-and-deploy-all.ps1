# Autonomous Build and Deploy Script for LearnFlow Backend Services
# PowerShell version for Windows
# Part of Hackathon 3 Skills Autonomy demonstration

param(
    [string]$Registry = "learnflow",
    [string]$Version = "v1",
    [string]$Namespace = "learnflow",
    [switch]$SkipPush = $false
)

$ErrorActionPreference = "Stop"

$Services = @(
    "triage-service",
    "concepts-service",
    "debug-service",
    "exercise-service",
    "progress-service",
    "code-review-service"
)

function Log-Info([string]$message) {
    Write-Host "✓ $message" -ForegroundColor Green
}

function Log-Warn([string]$message) {
    Write-Host "⚠ $message" -ForegroundColor Yellow
}

function Log-Error([string]$message) {
    Write-Host "✗ $message" -ForegroundColor Red
}

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "LearnFlow Backend - Build & Deploy" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Registry: $Registry"
Write-Host "Version: $Version"
Write-Host "Namespace: $Namespace"
Write-Host ""

# Check Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Log-Error "Docker not found. Please install Docker Desktop."
    exit 1
}

# Check kubectl
if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
    Log-Error "kubectl not found. Please install kubectl."
    exit 1
}

# ============================================
# Phase 1: Build Images
# ============================================
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Phase 1: Building Container Images" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

foreach ($Service in $Services) {
    $ServicePath = "backend\$Service"

    if (-not (Test-Path $ServicePath)) {
        Log-Error "Directory not found: $ServicePath"
        continue
    }

    Write-Host "Building $Service..."

    $ImageTag = "${Registry}/${Service}:${Version}"

    # Build image
    docker build -t $ImageTag $ServicePath

    if ($LASTEXITCODE -eq 0) {
        Log-Info "$Service built successfully"
    } else {
        Log-Error "$Service build failed"
        exit 1
    }
}

Write-Host ""
Log-Info "All images built successfully"
Write-Host ""

# ============================================
# Phase 2: Push Images
# ============================================
if (-not $SkipPush) {
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "Phase 2: Pushing Images to Registry" -ForegroundColor Cyan
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""

    $Push = Read-Host "Push images to registry? (y/N)"

    if ($Push -eq 'y' -or $Push -eq 'Y') {
        # Login to registry
        Write-Host "Logging in to $Registry..."
        docker login $Registry

        foreach ($Service in $Services) {
            $ImageTag = "${Registry}/${Service}:${Version}"
            Write-Host "Pushing $Service..."
            docker push $ImageTag
            Log-Info "$Service pushed successfully"
        }
    } else {
        Log-Warn "Skipping push. Images will only be available locally."
        Log-Warn "For Minikube, load images with:"
        foreach ($Service in $Services) {
            $ImageTag = "${Registry}/${Service}:${Version}"
            Write-Host "  minikube image load $ImageTag"
        }
    }
} else {
    Log-Warn "Skipping push (SkipPush specified)"
}

Write-Host ""

# ============================================
# Phase 3: Deploy to Kubernetes
# ============================================
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Phase 3: Deploying to Kubernetes" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Create namespace
kubectl create namespace $Namespace --dry-run=client -o yaml | kubectl apply -f -
Log-Info "Namespace '$Namespace' ready"

# Deploy all services from consolidated YAML
$DeployFile = "backend\k8s\deploy-all-services.yaml"

if (Test-Path $DeployFile) {
    Write-Host "Deploying all services from $DeployFile..."
    kubectl apply -f $DeployFile

    foreach ($Service in $Services) {
        # Update image to our built version
        kubectl set image deployment/$Service $Service=${Registry}/${Service}:${Version} -n $Namespace
        Log-Info "$Service deployed"
    }
} else {
    Log-Warn "Deployment file not found: $DeployFile"
    Log-Warn "Deploying individual service YAMLs..."

    foreach ($Service in $Services) {
        $DeploymentFile = "backend\$Service\deployment.yaml"

        if (Test-Path $DeploymentFile) {
            Write-Host "Deploying $Service..."
            kubectl apply -f $DeploymentFile -n $Namespace
            kubectl set image deployment/$Service $Service=${Registry}/${Service}:${Version} -n $Namespace
            Log-Info "$Service deployed"
        } else {
            Log-Warn "Deployment file not found: $DeploymentFile"
        }
    }
}

Write-Host ""

# ============================================
# Phase 4: Verify Deployment
# ============================================
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Phase 4: Verifying Deployment" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Waiting for pods to be ready..."
$Timeout = 60
$ServicesToCheck = $Services | ForEach-Object { $_.Replace("-service", "") }

foreach ($Service in $ServicesToCheck) {
    $FullService = "${Service}-service"
    try {
        kubectl wait --for=condition=ready pod -l app=$FullService -n $Namespace --timeout=${Timeout}s `
            -ErrorAction SilentlyContinue
        if ($LASTEXITCODE -eq 0) {
            Log-Info "$FullService is ready"
        } else {
            Log-Warn "$FullService not ready after ${Timeout}s"
        }
    } catch {
        Log-Warn "$FullService check failed"
    }
}

Write-Host ""
Write-Host "Current pod status:"
kubectl get pods -n $Namespace

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Services deployed:"
kubectl get services -n $Namespace

Write-Host ""
Write-Host "To access services (use separate terminals):"
Write-Host "  kubectl port-forward -n $Namespace svc/triage-service 8000:8000"
Write-Host "  kubectl port-forward -n $Namespace svc/concepts-service 8001:8000"
Write-Host "  kubectl port-forward -n $Namespace svc/debug-service 8002:8000"
Write-Host "  kubectl port-forward -n $Namespace svc/exercise-service 8003:8000"
Write-Host "  kubectl port-forward -n $Namespace svc/progress-service 8004:8000"
Write-Host "  kubectl port-forward -n $Namespace svc/code-review-service 8005:8000"

Write-Host ""
Log-Info "Skills Autonomy: Single command deployed entire backend"
