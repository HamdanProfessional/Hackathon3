# Kafka Kubernetes Setup - Reference Guide

## Configuration Options

### Namespace
Default: `kafka`
Override: `KAFKA_NAMESPACE` environment variable

### Replicas
- Kafka brokers: 1 (dev), 3 (prod)
- Zookeeper: 1 (dev), 3 (prod)

### Persistence
- StorageClass: `standard` (Minikube), `do-block-storage` (DOKS)
- Size: 8GB per broker

### Topics for LearnFlow
| Topic | Partitions | Replication Factor |
|-------|------------|-------------------|
| learning.progress | 3 | 1 |
| code.submission | 3 | 1 |
| exercise.generated | 3 | 1 |
| struggle.detected | 1 | 1 |

## Helm Values Reference

### Minimal (Development)
```yaml
replicaCount: 1
zookeeper:
  replicaCount: 1
persistence:
  enabled: false
```

### Production
```yaml
replicaCount: 3
zookeeper:
  replicaCount: 3
persistence:
  enabled: true
  size: 50Gi
```

## Troubleshooting

### Pod Status
```bash
kubectl get pods -n kafka
kubectl logs -n kafka <pod-name>
```

### Service Access
```bash
kubectl get svc -n kafka
# Internal: kafka.kafka.svc.cluster.local:9092
# External: Use NodePort or LoadBalancer
```

### Topic Management
```bash
kubectl exec -it -n kafka kafka-0 -- kafka-topics.sh --list --bootstrap-server localhost:9092
```

## Dapr Integration

### Component YAML
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kafka-pubsub
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: kafka.kafka.svc.cluster.local:9092
  - name: consumerGroup
    value: learnflow-group
```
