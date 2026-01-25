# Next.js Kubernetes Deployment - Reference Guide

## Deployment Options

### Standalone Deployment
```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### Static Export
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm run export
FROM nginx:alpine
COPY --from=0 /app/out /usr/share/nginx/html
EXPOSE 80
```

## Ingress Configuration

### Basic Ingress
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: learnflow-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: learnflow.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: learnflow-frontend
            port:
              number: 3000
```

### With TLS
```yaml
spec:
  tls:
  - hosts:
    - learnflow.yourdomain.com
    secretName: learnflow-tls
```

## Performance Optimization

### Build Optimization
```javascript
// next.config.js
module.exports = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.yourdomain.com'],
  },
  compress: true,
}
```

### Resource Limits
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

## Monaco Editor Integration

### Component Setup
```typescript
"use client";
import Editor from "@monaco-editor/react";

export function CodeEditor({ value, onChange }) {
  return (
    <Editor
      height="400px"
      defaultLanguage="python"
      value={value}
      onChange={(val) => onChange(val)}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
      }}
    />
  );
}
```

## Environment Variables

```yaml
env:
  - name: NEXT_PUBLIC_API_URL
    value: "https://api.testservers.online"
  - name: NEXT_PUBLIC_WS_URL
    value: "wss://api.testservers.online/ws"
```
