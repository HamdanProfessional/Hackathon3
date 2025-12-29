#!/bin/bash
# Phase 1 Verification Script
# This script verifies that all Phase 1 setup tasks are complete

echo "=========================================="
echo "   Phase 1 Setup Verification"
echo "=========================================="
echo ""

PASS=0
FAIL=0

# Function to check and report
check() {
    local name="$1"
    local command="$2"
    echo -n "Checking $name... "
    if eval "$command" > /dev/null 2>&1; then
        echo "✓ PASS"
        ((PASS++))
        return 0
    else
        echo "✗ FAIL"
        ((FAIL++))
        return 1
    fi
}

echo "=== 1. Prerequisites ==="
check "Docker" "docker --version"
check "Kubernetes cluster" "kubectl cluster-info"
check "Helm" "helm version"
check "Claude Code" "claude --version"
echo ""

echo "=== 2. Repository Structure ==="
check "skills-library/.claude exists" "test -d .claude"
check "learnflow-app exists" "test -d ../learnflow-app"
check "specs directory exists" "test -d specs"
echo ""

echo "=== 3. Required Skills (7 total) ==="
REQUIRED_SKILLS=("agents-md-gen" "kafka-k8s-setup" "postgres-k8s-setup" "fastapi-dapr-agent" "mcp-code-execution" "nextjs-k8s-deploy" "docusaurus-deploy")

for skill in "${REQUIRED_SKILLS[@]}"; do
    check "Skill: $skill" "test -f .claude/skills/$skill/SKILL.md && test -f .claude/skills/$skill/REFERENCE.md && test -d .claude/skills/$skill/scripts"
done
echo ""

echo "=== 4. Documentation ==="
check "CLAUDE.md exists" "test -f CLAUDE.md"
check "AGENTS.md exists" "test -f AGENTS.md"
check "requirements.md exists" "test -f requirements.md"
check "specs/phase-1-setup exists" "test -f specs/phase-1-setup/spec.md"
echo ""

echo "=== 5. Kubernetes Cluster Info ==="
echo "Cluster nodes:"
kubectl get nodes 2>/dev/null || echo "  (Cannot connect)"
echo ""
echo "Namespaces:"
kubectl get namespaces 2>/dev/null | head -5 || echo "  (Cannot connect)"
echo ""

echo "=========================================="
echo "   Results: $PASS passed, $FAIL failed"
echo "=========================================="
echo ""

if [ $FAIL -eq 0 ]; then
    echo "✓ Phase 1 verification PASSED"
    echo ""
    echo "You can proceed to Phase 2: Foundation Skills"
    exit 0
else
    echo "✗ Phase 1 verification FAILED"
    echo ""
    echo "Please fix the failed checks above before proceeding."
    exit 1
fi
