# Build and deploy script for LearnFlow backend services (PowerShell)

$ErrorActionPreference = "Stop"

# Configuration
$Registry = if ($env:REGISTRY) { $env:REGISTRY } else { "localhost:5000" }
$Version = if ($env:VERSION) { $env:VERSION } else { "v1" }

$Services = @(
    @{ Name = "triage-service"; Port = 8001 },
    @{ Name = "concepts-service"; Port = 8002 },
    @{ Name = "debug-service"; Port = 8003 },
    @{ Name = "exercise-service"; Port = 8004 },
    @{ Name = "progress-service"; Port = 8005 },
    @{ Name = "code-review-service"; Port = 8006 }
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "LearnFlow Backend Build & Deploy Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Registry: $Registry"
Write-Host "Version: $Version"
Write-Host ""

# Function to build a service
function Build-Service {
    param(
        [string]$ServiceName,
        [int]$Port
    )

    Write-Host "Building $ServiceName (port $Port)..." -ForegroundColor Yellow

    # Create Dockerfile
    $Dockerfile = @"
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy service code
COPY main.py .
COPY schemas/ ./schemas/ 2>/dev/null || true
COPY agents/ ./agents/ 2>/dev/null || true

# Copy common module
COPY common/ /app/common/

# Create logs directory
RUN mkdir -p /app/logs

EXPOSE $Port

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "$Port"]
"@

    $Dockerfile | Out-File -FilePath "backend\$ServiceName\Dockerfile" -Encoding UTF8

    # Build image
    $ImageTag = "${Registry}/learnflow-${ServiceName}:${Version}"
    docker build -t $ImageTag -f "backend\$ServiceName\Dockerfile" backend\

    Write-Host "Built $ServiceName -> $ImageTag" -ForegroundColor Green
}

# Build all services
foreach ($Service in $Services) {
    Build-Service -ServiceName $Service.Name -Port $Service.Port
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "All images built successfully!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Images:" -ForegroundColor Cyan
foreach ($Service in $Services) {
    Write-Host "  - ${Registry}/learnflow-$($Service.Name):${Version}"
}

Write-Host ""
Write-Host "To deploy to Kubernetes, update the image references in:"
Write-Host "  backend\k8s\deploy-all-services.yaml"
