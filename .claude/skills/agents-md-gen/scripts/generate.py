#!/usr/bin/env python3
"""Generate AGENTS.md file for codebase documentation."""
import argparse
import os
from pathlib import Path
import subprocess
import json

def detect_languages(root_dir: str) -> list:
    """Detect programming languages used."""
    lang_map = {
        ".py": "Python",
        ".ts": "TypeScript",
        ".tsx": "TypeScript",
        ".js": "JavaScript",
        ".jsx": "JavaScript",
        ".go": "Go",
        ".java": "Java",
        ".rs": "Rust",
    }

    extensions = set()
    for file in Path(root_dir).rglob("*"):
        if file.is_file():
            ext = file.suffix
            if ext in lang_map:
                extensions.add(lang_map[ext])

    return sorted(list(extensions))

def detect_frameworks(root_dir: str) -> dict:
    """Detect frameworks and tools."""
    frameworks = {
        "frontend": [],
        "backend": [],
        "infrastructure": [],
    }

    # Check for package.json
    package_json = Path(root_dir) / "package.json"
    if package_json.exists():
        data = json.loads(package_json.read_text())
        deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}

        if "next" in deps:
            frameworks["frontend"].append("Next.js")
        if "react" in deps:
            frameworks["frontend"].append("React")
        if "fastapi" in str(deps):
            frameworks["backend"].append("FastAPI")
        if "dapr" in str(deps):
            frameworks["infrastructure"].append("Dapr")

    # Check for requirements.txt
    requirements_txt = Path(root_dir) / "requirements.txt"
    if requirements_txt.exists():
        content = requirements_txt.read_text()
        if "fastapi" in content:
            frameworks["backend"].append("FastAPI")
        if "dapr" in content:
            frameworks["infrastructure"].append("Dapr")

    return frameworks

def get_directory_tree(root_dir: str, max_depth: int = 3) -> str:
    """Generate ASCII directory tree."""
    result = subprocess.run(
        f"cd {root_dir} && find . -maxdepth {max_depth} -type d | head -30",
        shell=True,
        capture_output=True,
        text=True
    )

    if result.returncode == 0:
        lines = result.stdout.strip().split("\n")
        # Format as tree
        tree = "```\n"
        for line in lines[:30]:
            depth = line.count("/") - 1
            indent = "  " * depth
            name = Path(line).name
            tree += f"{indent}{name}/\n"
        tree += "```\n"
        return tree
    return ""

def generate_agents_md(root_dir: str, output_file: str = "AGENTS.md"):
    """Generate AGENTS.md file."""
    root = Path(root_dir)

    # Detect languages and frameworks
    languages = detect_languages(root_dir)
    frameworks = detect_frameworks(root_dir)

    # Get project name from directory or git
    project_name = root.name

    # Check for existing docs
    readme = root / "README.md"
    overview = ""
    if readme.exists():
        content = readme.read_text()
        # Get first paragraph
        lines = content.split("\n")
        for i, line in enumerate(lines):
            if line.strip() and not line.startswith("#"):
                overview = line
                break

    # Generate AGENTS.md
    output = f"""# {project_name}

## Overview
{overview or f"{project_name} is a software project."}

## Technology Stack
**Languages:** {", ".join(languages) if languages else "Various"}

**Frameworks & Tools:**
"""

    for category, tools in frameworks.items():
        if tools:
            output += f"- **{category.title()}:** {", ".join(tools)}\n"

    output += f"""
## Project Structure
{get_directory_tree(root_dir)}

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
"""

    # Write output
    output_path = Path(output_file)
    output_path.write_text(output)

    print(f"✓ Generated {output_file}")
    print(f"  Languages: {', '.join(languages) if languages else 'None detected'}")

    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate AGENTS.md")
    parser.add_argument("--dir", default=".", help="Root directory")
    parser.add_argument("--output", default="AGENTS.md", help="Output file")
    args = parser.parse_args()

    if generate_agents_md(args.dir, args.output):
        exit(0)
    else:
        exit(1)
