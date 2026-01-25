# PowerShell Build and Deploy Script for LearnFlow Frontend
# This script builds the Docker image and deploys to Kubernetes

$ErrorActionPreference = "Stop"

# Configuration
$IMAGE_NAME = "ghcr.io/hamdanprofessional/learnflow-frontend"
$IMAGE_TAG = "v1"
$NAMESPACE = "learnflow"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "LearnFlow Frontend Build & Deploy" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build the Next.js application
Write-Host "Step 1: Building Next.js application..." -ForegroundColor Yellow
Set-Location $PSScriptRoot
npm run build

# Step 2: Build Docker image
Write-Host ""
Write-Host "Step 2: Building Docker image..." -ForegroundColor Yellow
docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" .
docker tag "${IMAGE_NAME}:${IMAGE_TAG}" "${IMAGE_NAME}:latest"

# Step 3: Push to registry (uncomment if using GHCR)
Write-Host ""
Write-Host "Step 3: Pushing Docker image to registry..." -ForegroundColor Yellow
# docker push "${IMAGE_NAME}:${IMAGE_TAG}"
# docker push "${IMAGE_NAME}:latest"

# Step 4: Apply Kubernetes manifests
Write-Host ""
Write-Host "Step 4: Applying Kubernetes manifests..." -ForegroundColor Yellow
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Step 5: Wait for deployment to be ready
Write-Host ""
Write-Host "Step 5: Waiting for deployment to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=available --timeout=300s `
  deployment/learnflow-frontend -n $NAMESPACE

# Step 6: Show status
Write-Host ""
Write-Host "Step 6: Deployment status..." -ForegroundColor Yellow
kubectl get pods -n $NAMESPACE -l app=learnflow-frontend
kubectl get svc -n $NAMESPACE -l app=learnflow-frontend
kubectl get ingress -n $NAMESPACE -l app=learnflow-frontend

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "To access the application:" -ForegroundColor Cyan
$ingress = kubectl get ingress learnflow-frontend-ingress -n $NAMESPACE -o json 2>$null
if ($ingress) {
  $host = (kubectl get ingress learnflow-frontend-ingress -n $NAMESPACE -o jsonpath='{.spec.rules[0].host}')
  Write-Host "  http://${host}" -ForegroundColor Green
} else {
  $port = (kubectl get svc learnflow-frontend -n $NAMESPACE -o jsonpath='{.spec.ports[0].port}')
  Write-Host "  Port forward: kubectl port-forward -n ${NAMESPACE} svc/learnflow-frontend 3000:${port}" -ForegroundColor White
  Write-Host "  Then open: http://localhost:3000" -ForegroundColor White
}
Write-Host ""
