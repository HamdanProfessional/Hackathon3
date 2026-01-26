---
title: Contributing
sidebar_position: 1
---

# Development Guide

Guide for contributing to LearnFlow.

## Development Environment

### Prerequisites

- Node.js 18+ or 20+
- Python 3.10+
- Git

### Fork and Clone

```bash
git clone https://github.com/YOUR_USERNAME/learnflow.git
cd learnflow
git remote add upstream https://github.com/learnflow/learnflow.git
```

## Frontend Development

```bash
cd learnflow-app/frontend
npm install
npm run dev
```

### Adding a Page

Create file: `app/new-page/page.tsx`

```typescript
export default function NewPage() {
  return <div>New Page</div>;
}
```

## Backend Development

```bash
cd learnflow-app/backend
pip install -r requirements.txt
python services/triage/main.py
```

### Adding a Service

Create directory: `services/new-service/`

Create `main.py`:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"service": "new-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8007)
```

## Documentation

```bash
cd docs-site
npm install
npm run start
```

## Testing

```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
pytest
```

## Code Style

- **Frontend**: TypeScript, Prettier, Tailwind CSS
- **Backend**: PEP 8, Black, type hints

## Commit Guidelines

```bash
git commit -m "type(scope): description"

# Types:
feat     - New feature
fix      - Bug fix
docs     - Documentation
style    - Code style
refactor - Refactoring
test     - Tests
chore     - Maintenance
```

## Pull Requests

1. Create branch from `main`
2. Make changes
3. Test
4. Commit with conventional commits
5. Push and create PR

## Support

- GitHub Issues
- [Documentation](http://localhost:3003)
- [API Reference](../api-reference)
