#!/bin/bash
# LearnFlow DigitalOcean Deployment Script
# This script deploys LearnFlow to DigitalOcean Kubernetes (DOKS)
#
# Prerequisites:
# - doctl CLI installed and authenticated
# - kubectl configured for DOKS cluster
# - Docker running (for building images)
# - DigitalOcean Container Registry (DOCR) created

set -e  # Exit on error

# Configuration
REGISTRY="registry.digitalocean.com/learnflow-registry"
CLUSTER_NAME="learnflow-prod"
NAMESPACE="learnflow"
DOMAIN="hackathon3.testservers.online"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_step() {
    echo -e "${GREEN}==>${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}WARNING:${NC} $1"
}

check_prereqs() {
    print_step "Checking prerequisites..."

    # Check doctl
    if ! command -v doctl &> /dev/null; then
        echo "Error: doctl not found. Install from: https://github.com/digitalocean/doctl/releases"
        exit 1
    fi

    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        echo "Error: kubectl not found. Install from: https://kubernetes.io/docs/tasks/tools/"
        exit 1
    fi

    # Check docker
    if ! command -v docker &> /dev/null; then
        echo "Error: docker not found. Please install Docker Desktop"
        exit 1
    fi

    # Check doctl authentication
    if ! doctl account get &> /dev/null; then
        echo "Error: doctl not authenticated. Run: doctl auth init"
        exit 1
    fi

    echo "✓ All prerequisites met"
}

build_and_push_images() {
    print_step "Building and pushing container images..."

    COMMIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "latest")
    FRONTEND_DIR="../frontend"
    BACKEND_DIR="../backend"

    # Build frontend image
    print_step "Building frontend image..."
    cd "$FRONTEND_DIR"
    docker build -t learnflow-frontend:$COMMIT_SHA .
    docker tag learnflow-frontend:$COMMIT_SHA $REGISTRY/learnflow-frontend:$COMMIT_SHA
    docker tag learnflow-frontend:$COMMIT_SHA $REGISTRY/learnflow-frontend:latest
    docker push $REGISTRY/learnflow-frontend:$COMMIT_SHA
    docker push $REGISTRY/learnflow-frontend:latest

    # Build backend image
    print_step "Building backend image..."
    cd "$BACKEND_DIR"
    docker build -f Dockerfile.services -t learnflow-backend:$COMMIT_SHA .
    docker tag learnflow-backend:$COMMIT_SHA $REGISTRY/learnflow-backend:$COMMIT_SHA
    docker tag learnflow-backend:$COMMIT_SHA $REGISTRY/learnflow-backend:latest
    docker push $REGISTRY/learnflow-backend:$COMMIT_SHA
    docker push $REGISTRY/learnflow-backend:latest

    # Build MCP server images
    print_step "Building MCP server images..."

    # MCP Code Execution Server
    cd "$BACKEND_DIR/mcp-servers/code-execution-mcp"
    docker build -t mcp-code-exec-server:$COMMIT_SHA .
    docker tag mcp-code-exec-server:$COMMIT_SHA $REGISTRY/mcp-code-exec-server:$COMMIT_SHA
    docker tag mcp-code-exec-server:$COMMIT_SHA $REGISTRY/mcp-code-exec-server:latest
    docker push $REGISTRY/mcp-code-exec-server:$COMMIT_SHA
    docker push $REGISTRY/mcp-code-exec-server:latest

    # MCP Database Server
    cd "$BACKEND_DIR/mcp-servers/database-mcp"
    docker build -t mcp-database-server:$COMMIT_SHA .
    docker tag mcp-database-server:$COMMIT_SHA $REGISTRY/mcp-database-server:$COMMIT_SHA
    docker tag mcp-database-server:$COMMIT_SHA $REGISTRY/mcp-database-server:latest
    docker push $REGISTRY/mcp-database-server:$COMMIT_SHA
    docker push $REGISTRY/mcp-database-server:latest

    # MCP Kafka Server
    cd "$BACKEND_DIR/mcp-servers/kafka-mcp"
    docker build -t mcp-kafka-server:$COMMIT_SHA .
    docker tag mcp-kafka-server:$COMMIT_SHA $REGISTRY/mcp-kafka-server:$COMMIT_SHA
    docker tag mcp-kafka-server:$COMMIT_SHA $REGISTRY/mcp-kafka-server:latest
    docker push $REGISTRY/mcp-kafka-server:$COMMIT_SHA
    docker push $REGISTRY/mcp-kafka-server:latest

    # MCP Kubernetes Server
    cd "$BACKEND_DIR/mcp-servers/kubernetes-mcp"
    docker build -t mcp-k8s-server:$COMMIT_SHA .
    docker tag mcp-k8s-server:$COMMIT_SHA $REGISTRY/mcp-k8s-server:$COMMIT_SHA
    docker tag mcp-k8s-server:$COMMIT_SHA $REGISTRY/mcp-k8s-server:latest
    docker push $REGISTRY/mcp-k8s-server:$COMMIT_SHA
    docker push $REGISTRY/mcp-k8s-server:latest

    echo "✓ All images built and pushed"
}

setup_kubernetes_namespace() {
    print_step "Setting up Kubernetes namespace..."

    # Create namespace if it doesn't exist
    kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

    echo "✓ Namespace $NAMESPACE ready"
}

create_docr_secret() {
    print_step "Creating DOCR pull secret..."

    # Get DOCR endpoint and token
    DOCR_ENDPOINT=$(doctl registry get | grep -oP 'Endpoint: \K[^ ]+' || echo "registry.digitalocean.com")
    DO_TOKEN=$(doctl auth token 2>/dev/null || echo "")

    if [ -z "$DO_TOKEN" ]; then
        print_warning "Could not get DO token automatically. Please enter it manually:"
        read -s -p "DigitalOcean API Token: " DO_TOKEN
        echo
    fi

    # Create or update the secret
    kubectl create secret docker-registry docr-secret \
        --namespace=$NAMESPACE \
        --docker-server=$REGISTRY \
        --docker-username=$DO_TOKEN \
        --docker-password=$DO_TOKEN \
        --dry-run=client -o yaml | kubectl apply -f -

    echo "✓ DOCR secret created"
}

deploy_infrastructure() {
    print_step "Deploying infrastructure components..."

    # Deploy PostgreSQL via Helm
    print_step "Deploying PostgreSQL..."
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm repo update

    helm upgrade --install postgres bitnami/postgresql \
        --namespace postgres --create-namespace \
        --set auth.database=learnflow \
        --set auth.username=learnflow \
        --set auth.password=$(openssl rand -base64 32) \
        --set persistence.enabled=true \
        --set persistence.size=20Gi \
        --set primary.service.ports.postgresql=5432

    # Deploy Kafka/Redpanda
    print_step "Deploying Kafka (Redpanda)..."
    helm repo add redpanda https://charts.redpanda.com
    helm repo update

    helm upgrade --install redpanda redpanda/redpanda \
        --namespace redpanda-system --create-namespace \
        --set replicas=1 \
        --set resources.limits.cpu=2 \
        --set resources.limits.memory=4Gi \
        --set persistence.enabled=true \
        --set persistence.size=50Gi

    echo "✓ Infrastructure deployed"
}

deploy_backend_services() {
    print_step "Deploying backend microservices..."

    kubectl apply -f ../backend/k8s/backend-services.yaml

    # Wait for deployments to be ready
    kubectl wait --for=condition=available --timeout=300s \
        deployment/triage-service \
        deployment/concepts-service \
        deployment/debug-service \
        deployment/exercise-service \
        deployment/progress-service \
        deployment/code-review-service \
        -n $NAMESPACE

    echo "✓ Backend services deployed"
}

deploy_mcp_servers() {
    print_step "Deploying MCP servers..."

    kubectl apply -f ../backend/mcp-servers/k8s/mcp-code-exec-server.yaml
    kubectl apply -f ../backend/mcp-servers/k8s/mcp-database-server.yaml
    kubectl apply -f ../backend/mcp-servers/k8s/mcp-kafka-server.yaml
    kubectl apply -f ../backend/mcp-servers/k8s/mcp-k8s-server.yaml

    # Wait for MCP servers
    kubectl wait --for=condition=available --timeout=180s \
        deployment/mcp-code-exec-server \
        deployment/mcp-database-server \
        deployment/mcp-kafka-server \
        deployment/mcp-k8s-server \
        -n $NAMESPACE

    echo "✓ MCP servers deployed"
}

deploy_frontend() {
    print_step "Deploying frontend..."

    kubectl apply -f ../frontend/k8s/deployment.yaml
    kubectl apply -f ../frontend/k8s/service.yaml
    kubectl apply -f ../frontend/k8s/ingress.yaml

    # Wait for frontend
    kubectl wait --for=condition=available --timeout=180s \
        deployment/learnflow-frontend \
        -n $NAMESPACE

    echo "✓ Frontend deployed"
}

setup_tls() {
    print_step "Setting up TLS with cert-manager..."

    # Install cert-manager
    kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

    # Wait for cert-manager to be ready
    kubectl wait --for=condition=available --timeout=180s \
        deployment/cert-manager \
        deployment/cert-manager-cainjector \
        deployment/cert-manager-webhook \
        -n cert-manager

    # Create ClusterIssuer for Let's Encrypt
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

    echo "✓ cert-manager installed and configured"
}

verify_deployment() {
    print_step "Verifying deployment..."

    echo "Pods in $NAMESPACE namespace:"
    kubectl get pods -n $NAMESPACE

    echo ""
    echo "Services in $NAMESPACE namespace:"
    kubectl get svc -n $NAMESPACE

    echo ""
    echo "Ingress:"
    kubectl get ingress -n $NAMESPACE

    print_step "Deployment complete!"
    echo "Application should be accessible at: https://$DOMAIN"
    echo ""
    echo "To check logs:"
    echo "  kubectl logs -f deployment/learnflow-frontend -n $NAMESPACE"
    echo ""
    echo "To get LoadBalancer IP for DNS:"
    echo "  kubectl get svc -n ingress-nginx"
}

# Main execution
main() {
    echo "=================================="
    echo "LearnFlow DigitalOcean Deployment"
    echo "=================================="
    echo ""

    # Parse command line arguments
    SKIP_BUILD=false
    SKIP_INFRA=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            --skip-infra)
                SKIP_INFRA=true
                shift
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo "Options:"
                echo "  --skip-build    Skip building and pushing images"
                echo "  --skip-infra    Skip deploying infrastructure (PostgreSQL, Kafka)"
                echo "  --help          Show this help message"
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                exit 1
                ;;
        esac
    done

    # Run deployment steps
    check_prereqs

    if [ "$SKIP_BUILD" = false ]; then
        build_and_push_images
    else
        print_warning "Skipping image build"
    fi

    setup_kubernetes_namespace
    create_docr_secret

    if [ "$SKIP_INFRA" = false ]; then
        deploy_infrastructure
    else
        print_warning "Skipping infrastructure deployment"
    fi

    deploy_backend_services
    deploy_mcp_servers
    deploy_frontend
    setup_tls
    verify_deployment
}

# Change to script directory
cd "$(dirname "$0")"

# Run main function
main "$@"
