# AGENTS.md Generator - Reference Guide

## AGENTS.md Format

### Required Sections

```markdown
# Project Name

## Overview
Brief description of the project and its purpose.

## Project Structure
Directory tree showing the codebase organization.

## Conventions
Coding standards, patterns, and conventions used.

## Key Components
Description of main components and their responsibilities.

## How AI Agents Should Work
Instructions for AI agents working on this codebase.
```

### Example AGENTS.md

```markdown
# LearnFlow

## Overview
LearnFlow is an AI-powered Python learning platform built with FastAPI, Next.js, and Kafka.

## Project Structure
```
learnflow/
├── backend/           # FastAPI microservices
│   ├── triage/        # Query routing service
│   ├── concepts/      # Python concepts service
│   └── debug/         # Error debugging service
├── frontend/          # Next.js web app
└── infrastructure/    # Kubernetes and Dapr configs
```

## Conventions
- All microservices are stateless
- Use Dapr for state management and pub/sub
- Follow the MCP Code Execution pattern for AI tools
- Tests required before any implementation

## How AI Agents Should Work
1. Always read existing specs before implementing
2. Generate tests before writing code
3. Use the provided Skills for common tasks
4. Follow the branching strategy in git workflow
```

## Generation Sources

### From File Analysis
```python
def analyze_codebase(root_dir: str) -> dict:
    """Analyze codebase structure."""
    return {
        "languages": detect_languages(root_dir),
        "frameworks": detect_frameworks(root_dir),
        "structure": get_directory_tree(root_dir),
        "patterns": detect_design_patterns(root_dir),
    }
```

### From Package Files
- `package.json` → Frontend dependencies, scripts
- `requirements.txt` → Python dependencies
- `pyproject.toml` → Project metadata
- `go.mod` → Go dependencies

### From Existing Documentation
- `README.md` → Project overview
- `CLAUDE.md` → Agent instructions
- `CONTRIBUTING.md` → Contribution guidelines

## Validation Rules

### Required Checks
- [ ] Overview section exists
- [ ] Project structure documented
- [ ] Conventions defined
- [ ] AI agent instructions included

### Quality Checks
- Structure is accurate
- Conventions are clear
- Examples provided where helpful

## Auto-Discovery

### Language Detection
```python
def detect_languages(root_dir: str) -> list:
    extensions = {
        "Python": [".py"],
        "TypeScript": [".ts", ".tsx"],
        "Go": [".go"],
    }
    # Scan files and return detected languages
```

### Framework Detection
```python
def detect_frameworks(root_dir: str) -> list:
    indicators = {
        "FastAPI": ["fastapi", "uvicorn"],
        "Next.js": ["next", "react"],
        "Dapr": ["dapr"],
    }
    # Check dependencies for indicators
```
