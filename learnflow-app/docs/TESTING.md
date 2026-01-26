# Testing Guide

This guide covers testing practices and tools used in LearnFlow.

## Table of Contents

- [Backend Testing](#backend-testing)
- [Frontend Testing](#frontend-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Test Coverage](#test-coverage)
- [Continuous Integration](#continuous-integration)

## Backend Testing

### Framework

We use **pytest** as our testing framework with the following extensions:
- `pytest-asyncio` - Async support
- `pytest-cov` - Coverage reporting
- `httpx` - HTTP client testing
- `testcontainers` - Container-based integration tests

### Running Tests

```bash
# Run all tests
cd learnflow-app/backend
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_services/test_triage.py

# Run specific test
pytest tests/test_services/test_triage.py::TestTriageService::test_health_endpoint

# Run with verbose output
pytest -v

# Run only failed tests from last run
pytest --lf
```

### Test Structure

```
backend/
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Shared fixtures
│   ├── test_services/       # Service tests
│   │   ├── test_triage.py
│   │   ├── test_concepts.py
│   │   └── ...
│   └── test_shared/         # Shared module tests
│       ├── test_models.py
│       └── test_database.py
```

### Writing Tests

```python
"""Tests for Triage Service."""

import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
class TestTriageService:
    """Test suite for Triage Service."""

    async def test_health_endpoint(self, triage_client: AsyncClient):
        """Test health check endpoint."""
        response = await triage_client.get("/health")
        assert response.status_code == 200

        data = response.json()
        assert data["status"] == "healthy"

    async def test_triage_concept_query(
        self,
        triage_client: AsyncClient,
        sample_student_id: str
    ):
        """Test triage routes concept queries correctly."""
        response = await triage_client.post(
            "/triage",
            json={
                "student_id": sample_student_id,
                "message": "What is a variable?"
            }
        )
        assert response.status_code == 200
        assert response.json()["agent_type"] == "concepts"
```

### Fixtures

Common fixtures are defined in `conftest.py`:

```python
@pytest.fixture
async def triage_client() -> AsyncGenerator:
    """Create async HTTP client for triage service."""
    from services.triage.main import app as triage_app

    async with AsyncClient(
        transport=ASGITransport(app=triage_app),
        base_url="http://test"
    ) as client:
        yield client

@pytest.fixture
def sample_student_id() -> str:
    """Generate a sample student ID."""
    return str(uuid4())
```

## Frontend Testing

### Framework

We use **Vitest** with:
- `@testing-library/react` - Component testing
- `@testing-library/jest-dom` - Custom matchers
- `@testing-library/user-event` - User interaction simulation

### Running Tests

```bash
# Run all tests
cd learnflow-app/frontend
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm test -- --watch

# Run with UI
npm run test:ui

# Run once (CI mode)
npm run test:run
```

### Test Structure

```
frontend/
└── src/
    └── __tests__/
        ├── components/       # Component tests
        │   ├── test_ui_card.test.tsx
        │   ├── test_ModuleCard.test.tsx
        │   └── ...
        ├── test_utils.test.ts
        └── test_types.test.ts
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test-utils';

describe('ModuleCard Component', () => {
  it('should render module information', () => {
    const mockModule = {
      id: 1,
      name: 'Python Basics',
      description: 'Learn Python fundamentals',
    };

    render(<ModuleCard module={mockModule} />);

    expect(screen.getByText('Python Basics')).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<ModuleCard module={mockModule} onClick={onClick} />);

    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

## Integration Testing

### Local Integration Tests

```bash
# Start services with Docker Compose
cd learnflow-app
docker-compose -f docker-compose.dev.yml up -d

# Run integration tests
cd backend
pytest tests/integration/
```

### API Integration Tests

```python
@pytest.mark.asyncio
async def test_full_chat_flow():
    """Test complete chat flow through triage to service."""
    # Create user
    user = await create_test_user()

    # Send message to triage
    response = await triage_client.post("/triage", {
        "student_id": user.id,
        "message": "What is a variable?"
    })

    # Verify routing
    assert response.json()["agent_type"] == "concepts"

    # Call concepts service
    concepts_response = await concepts_client.post("/chat", {
        "student_id": user.id,
        "message": "What is a variable?"
    })

    assert concepts_response.status_code == 200
    assert "explanation" in concepts_response.json()
```

## End-to-End Testing

For E2E testing, we recommend using Playwright (not yet implemented):

```bash
# Install Playwright
npm install -D @playwright/test

# Run E2E tests
npx playwright test
```

## Test Coverage

### Minimum Requirements

- Overall coverage: **70%**
- Backend services: **75%**
- Frontend components: **65%**

### Viewing Coverage Reports

```bash
# Backend - Generate HTML report
cd backend
pytest --cov=. --cov-report=html
open htmlcov/index.html

# Frontend - Generate coverage report
cd frontend
npm run test:coverage
open coverage/index.html
```

## Continuous Integration

All tests run automatically on:
- Every push to `main` or `develop`
- Every pull request

### CI Pipeline Stages

1. **Lint** - Code style checking
2. **Type Check** - TypeScript/MyPy validation
3. **Test** - Run all tests with coverage
4. **Build** - Build Docker images
5. **Security Scan** - Vulnerability scanning

### Pre-commit Hooks (Recommended)

Install pre-commit hooks:

```bash
# Backend
cd backend
pip install pre-commit
pre-commit install

# Frontend
cd frontend
npm install -D husky lint-staged
npx husky install
```

## Best Practices

### General

1. **Test behavior, not implementation**
2. **One assertion per test** (when possible)
3. **Use descriptive test names**
4. **Follow AAA pattern**: Arrange, Act, Assert
5. **Keep tests independent** - no shared state
6. **Mock external dependencies**

### Backend

```python
# Good: Clear, descriptive name
async def test_triage_routes_debug_queries_correctly():
    pass

# Bad: Vague name
async def test_triage():
    pass

# Good: Single assertion
async def test_health_returns_200():
    response = await client.get("/health")
    assert response.status_code == 200

# Bad: Multiple assertions testing different things
async def test_health():
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert response.headers["content-type"] == "application/json"
```

### Frontend

```typescript
// Good: Testing user behavior
it('should submit form when user clicks submit', async () => {
  render(<MyForm />);

  await user.type(screen.getByLabelText('Email'), 'test@example.com');
  await user.click(screen.getByRole('button', { name: 'Submit' }));

  expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
});

// Bad: Testing implementation details
it('should call handleSubmit function', () => {
  const handleSubmit = vi.fn();
  render(<MyForm onSubmit={handleSubmit} />);

  // Testing internal method, not user behavior
  expect(handleSubmit).toHaveBeenCalled();
});
```

## Troubleshooting

### Common Issues

**Tests fail in CI but pass locally**
- Check environment variables
- Verify all dependencies are installed
- Ensure database/container is available

**Flaky tests**
- Add proper cleanup in fixtures
- Use proper async/await patterns
- Avoid shared state between tests

**Slow tests**
- Mock external services
- Use test databases with rollback
- Run tests in parallel (pytest-xdist)

---

For more information, see:
- [pytest documentation](https://docs.pytest.org/)
- [Vitest documentation](https://vitest.dev/)
- [Testing Library documentation](https://testing-library.com/)
