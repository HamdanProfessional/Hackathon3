# 

## Overview
 is a software project.

## Technology Stack
**Languages:** Python

**Frameworks & Tools:**

## Project Structure
```
/
scripts/
```


## Conventions

### Code Style
- Follow language-specific style guides (PEP 8 for Python, ESLint for JS/TS)
- Write meaningful commit messages
- Include tests for new features

### Architecture
- Services are designed to be stateless where applicable
- Use dependency injection for loose coupling
- Follow SOLID principles

## How AI Agents Should Work

### Before Making Changes
1. Read the existing code and tests
2. Understand the current architecture
3. Check for existing patterns and conventions

### Implementation Guidelines
1. Write tests before implementing (TDD)
2. Run tests after changes
3. Update documentation as needed
4. Follow the existing code structure

### Common Tasks
- Use `./scripts/format.sh` to format code
- Use `./scripts/test.sh` to run tests
- Use `./scripts/lint.sh` to check code quality

## Key Files
- `README.md` - Project overview and setup
- `CLAUDE.md` - AI agent instructions
- `.github/` - CI/CD configurations
