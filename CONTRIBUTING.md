# Contributing to LearnFlow

Thank you for your interest in contributing to LearnFlow! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code Review](#code-review)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 20+
- Docker & Docker Compose
- kubectl and Helm (for Kubernetes deployment)
- Git

### Initial Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/learnflow.git
   cd learnflow
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/original-org/learnflow.git
   ```

4. Install backend dependencies:
   ```bash
   cd learnflow-app/backend
   pip install -e ".[dev]"
   ```

5. Install frontend dependencies:
   ```bash
   cd learnflow-app/frontend
   npm install
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names:
- `feature/your-feature-name`
- `fix/issue-description`
- `docs/your-documentation-change`
- `refactor/your-refactor`

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Making Changes

1. Write clear, descriptive commit messages:
   ```
   feat: add user authentication

   - Add JWT token generation
   - Implement login/logout endpoints
   - Add session management

   Closes #123
   ```

2. Follow the commit convention:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

3. Keep commits small and focused

## Coding Standards

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints for all functions
- Write docstrings for all modules, classes, and functions
- Maximum line length: 100 characters
- Use `ruff` for linting:
  ```bash
  cd backend
  ruff check .
  ```

- Use `mypy` for type checking:
  ```bash
  cd backend
  mypy .
  ```

### TypeScript/React (Frontend)

- Follow TypeScript best practices
- Use functional components with hooks
- Prefer composition over inheritance
- Use descriptive variable and function names
- Run ESLint:
  ```bash
  cd frontend
  npm run lint
  ```

- Run TypeScript compiler:
  ```bash
  cd frontend
  npx tsc --noEmit
  ```

### General Guidelines

- Write self-documenting code
- Avoid premature optimization
- Keep functions small and focused
- Don't repeat yourself (DRY)
- Use meaningful names for variables and functions

## Testing

### Backend Tests

Run all tests:
```bash
cd backend
pytest
```

Run with coverage:
```bash
cd backend
pytest --cov=. --cov-report=html
```

Run specific test:
```bash
cd backend
pytest tests/test_services/test_triage.py
```

### Frontend Tests

Run all tests:
```bash
cd frontend
npm test
```

Run with coverage:
```bash
cd frontend
npm run test:coverage
```

### Testing Guidelines

- Write tests for all new features
- Maintain test coverage above 70%
- Write unit tests for individual functions
- Write integration tests for API endpoints
- Use descriptive test names

### Before Submitting

1. Run all tests locally:
   ```bash
   # Backend
   cd backend && pytest

   # Frontend
   cd frontend && npm test
   ```

2. Run linting:
   ```bash
   # Backend
   cd backend && ruff check .

   # Frontend
   cd frontend && npm run lint
   ```

3. Build locally:
   ```bash
   # Backend
   cd backend && docker build -t test .

   # Frontend
   cd frontend && npm run build
   ```

## Submitting Changes

### Pull Request Process

1. Update your branch with the latest main:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Push your changes:
   ```bash
   git push origin feature/your-feature-name
   ```

3. Create a pull request on GitHub

### Pull Request Checklist

- [ ] Title follows conventional commit format
- [ ] Description explains what and why
- [ ] Links to related issues
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] All tests pass
- [ ] No linting errors
- [ ] Code follows style guidelines

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed

## Checklist
- [ ] Tests pass locally
- [ ] Linting passes
- [ ] Documentation updated
- [ ] No breaking changes (or documented)

## Related Issues
Closes #issue-number
```

## Code Review

### As a Reviewer

- Be constructive and respectful
- Ask questions for clarification
- Suggest improvements
- Approve when satisfied

### As the Author

- Respond to all feedback
- Make requested changes
- Push updates to the same branch
- Ask for clarification if needed

## Getting Help

- Create an issue for bugs or feature requests
- Start a discussion for questions
- Check existing documentation
- Join our community chat (if available)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to LearnFlow!
