---
name: k8s-foundation
description: Kubernetes foundation operations - namespaces, ConfigMaps, Secrets, cluster validation
---

# Kubernetes Foundation

Manage Kubernetes foundational resources.

## Quick Start
```bash
# Create namespace
./scripts/create-namespace.sh --name myproject

# Create ConfigMap
./scripts/create-configmap.sh --name myconfig --file env.txt

# Create Secret
./scripts/create-secret.sh --name mysecret --literal KEY=value

# Validate cluster
./scripts/validate-cluster.sh
```

## Instructions
1. Use `create-namespace.sh` to create project namespace
2. Use `create-configmap.sh` for application configuration
3. Use `create-secret.sh` for sensitive data
4. Use `validate-cluster.sh` to verify cluster access

## Validation
- [ ] Namespace created
- [ ] ConfigMap/Secret created
- [ ] Cluster accessible

See [REFERENCE.md](./REFERENCE.md) for K8s patterns.
