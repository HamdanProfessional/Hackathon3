# Kubernetes Foundation - Reference Guide

## Namespace Patterns

### Project Namespace
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: myproject
  labels:
    app: myproject
    environment: production
```

### Resource Quotas
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: myproject
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
```

## ConfigMap Patterns

### From File
```bash
kubectl create configmap my-config \
  --from-file=config.properties \
  --namespace=myproject
```

### From Literals
```bash
kubectl create configmap my-config \
  --from-literal=KEY1=value1 \
  --from-literal=KEY2=value2 \
  --namespace=myproject
```

### From Env File
```bash
kubectl create configmap my-config \
  --from-env-file=.env \
  --namespace=myproject
```

## Secret Patterns

### Opaque Secret
```bash
kubectl create secret generic my-secret \
  --from-literal=password=mypassword \
  --namespace=myproject
```

### TLS Secret
```bash
kubectl create secret tls my-tls \
  --cert=path/to/cert.crt \
  --key=path/to/cert.key \
  --namespace=myproject
```

### Docker Registry Secret
```bash
kubectl create secret docker-registry regcred \
  --docker-server=<registry-url> \
  --docker-username=<username> \
  --docker-password=<password> \
  --namespace=myproject
```

## Cluster Validation

### Health Checks
```bash
# Check cluster info
kubectl cluster-info

# Check nodes
kubectl get nodes

# Check all namespaces
kubectl get namespaces

# Check pods in namespace
kubectl get pods -n myproject
```

### Connectivity Test
```bash
# Test API server connectivity
kubectl get --raw=/healthz

# Test cluster DNS
kubectl run test --image=busybox --rm -it -- nslookup kubernetes.default
```

## Common Patterns

### Multi-Environment Setup
```bash
# Development
kubectl create namespace dev
kubectl label namespace dev environment=dev

# Staging
kubectl create namespace staging
kubectl label namespace staging environment=staging

# Production
kubectl create namespace prod
kubectl label namespace prod environment=prod
```

### ConfigMap Volume Mount
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mycontainer
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
  volumes:
  - name: config-volume
    configMap:
      name: my-config
```

### Secret Volume Mount
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mycontainer
    volumeMounts:
    - name: secret-volume
      mountPath: /etc/secrets
  volumes:
  - name: secret-volume
    secret:
      secretName: my-secret
```

## Best Practices

1. **Namespaces**: Use separate namespaces per environment/team
2. **ConfigMaps**: Store non-sensitive configuration
3. **Secrets**: Never commit to git, use Sealed Secrets for production
4. **Labels**: Always label resources for organization
5. **Validation**: Always validate cluster access before operations

## Troubleshooting

### Namespace Issues
```bash
# Check if namespace exists
kubectl get namespace myproject

# Describe namespace
kubectl describe namespace myproject

# Check namespace quotas
kubectl get resourcequota -n myproject
```

### ConfigMap Issues
```bash
# List ConfigMaps
kubectl get configmaps -n myproject

# Describe ConfigMap
kubectl describe configmap my-config -n myproject

# Get ConfigMap YAML
kubectl get configmap my-config -n myproject -o yaml
```

### Secret Issues
```bash
# List Secrets
kubectl get secrets -n myproject

# Describe Secret (values not shown)
kubectl describe secret my-secret -n myproject

# Decode Secret value
kubectl get secret my-secret -n myproject -o jsonpath='{.data.password}' | base64 -d
```
