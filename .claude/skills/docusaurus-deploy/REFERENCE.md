# Docusaurus Documentation Deployment - Reference Guide

## Content Generation from Specs

### Auto-Generate API Docs
```python
# scripts/generate_api_docs.py
import json
from pathlib import Path

def generate_from_specs(specs_dir: str):
    """Generate documentation from spec files."""
    specs = Path(specs_dir).glob("specs/**/*.md")

    for spec in specs:
        # Parse spec frontmatter
        # Generate Docusaurus markdown
        # Output to docs/api/
        pass
```

### Generate from OpenAPI
```bash
# Convert OpenAPI to Docusaurus
npx @redocly/cli build-docs openapi.yaml -o docs/api/reference.md
```

## Docusaurus Configuration

### docusaurus.config.js
```javascript
module.exports = {
  title: 'LearnFlow Documentation',
  tagline: 'AI-Powered Python Learning Platform',
  url: 'https://docs.learnflow.dev',
  baseUrl: '/',

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/your-repo/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en'],
      },
    ],
  ],
};
```

## Content Structure

```
docs/
├── intro.md
├── getting-started/
│   ├── installation.md
│   ├── quickstart.md
│   └── architecture.md
├── api/
│   ├── authentication.md
│   ├── triage-service.md
│   └── concepts-service.md
├── agents/
│   ├── triage.md
│   ├── concepts.md
│   └── debug.md
├── contributing.md
└── deployment.md
```

## Auto-Generation Scripts

### From Python Docstrings
```bash
# Generate API docs from docstrings
sphinx-apidoc -o docs/api/ ../backend/
```

### From OpenAPI Spec
```bash
# Generate from FastAPI auto-generated OpenAPI
curl http://localhost:8000/openapi.json | \
  npx @redocly/cli build-docs -o docs/api/reference.md
```

## Deployment Options

### Static Hosting (Vercel/Netlify)
```bash
npm run build
# Deploy _build/ directory
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: docs
spec:
  template:
    spec:
      containers:
      - name: docs
        image: docs:latest
        ports:
        - containerPort: 80
```

## Search Configuration

### Local Search
```javascript
// docusaurus.config.js
themes: [
  [
    '@easyops-cn/docusaurus-search-local',
    {
      indexDocs: true,
      indexBlog: false,
      indexPages: true,
      language: ['en'],
    },
  ],
];
```

### Algolia Search
```javascript
themes: [
  [
    '@docusaurus/theme-search-algolia',
    {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_API_KEY',
      indexName: 'learnflow',
    },
  ],
];
```
