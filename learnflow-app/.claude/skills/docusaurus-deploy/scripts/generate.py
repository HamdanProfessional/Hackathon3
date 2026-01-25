#!/usr/bin/env python3
"""Generate Docusaurus documentation from specs and code."""
import argparse
import os
import json
from pathlib import Path
import subprocess

def generate_from_specs(specs_dir: str, output_dir: str):
    """Generate docs from spec files."""
    specs_path = Path(specs_dir)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    for spec_file in specs_path.rglob("*.md"):
        # Read spec file
        content = spec_file.read_text()

        # Extract frontmatter
        if content.startswith("---"):
            parts = content.split("---", 2)
            if len(parts) >= 3:
                frontmatter = parts[1]
                body = parts[2]

                # Parse metadata
                metadata = {}
                for line in frontmatter.strip().split("\n"):
                    if ":" in line:
                        key, value = line.split(":", 1)
                        metadata[key.strip()] = value.strip()

                # Generate output file
                title = metadata.get("title", spec_file.stem)
                category = metadata.get("category", "general")

                # Create category directory
                category_dir = output_path / category
                category_dir.mkdir(exist_ok=True)

                # Write markdown with Docusaurus frontmatter
                output_file = category_dir / f"{spec_file.stem}.md"
                output_content = f"""---
title: {title}
sidebar_label: {title}
---

{body}
"""
                output_file.write_text(output_content)
                print(f"✓ Generated: {output_file}")

def generate_from_openapi(api_url: str, output_file: str):
    """Generate API reference from OpenAPI spec."""
    # Fetch OpenAPI spec
    result = subprocess.run(
        f"curl -s {api_url}/openapi.json",
        shell=True,
        capture_output=True,
        text=True
    )

    if result.returncode == 0:
        openapi_spec = json.loads(result.stdout)

        # Generate markdown
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        content = "# API Reference\n\n"
        for path, methods in openapi_spec.get("paths", {}).items():
            content += f"## {path}\n\n"
            for method, details in methods.items():
                content += f"### {method.upper()}\n\n"
                content += f"{details.get('summary', '')}\n\n"
                content += "**Request:**\n\n"
                # Add request details...

        output_path.write_text(content)
        print(f"✓ Generated API reference: {output_file}")

def generate_index(output_dir: str):
    """Generate index page."""
    output_path = Path(output_dir) / "intro.md"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    content = """---
title: Welcome
slug: /
---

# Welcome to LearnFlow Documentation

LearnFlow is an AI-powered learning platform for Python programming.

## Features

- **AI Tutors**: Conversational agents for personalized learning
- **Code Editor**: Built-in Monaco editor with live execution
- **Progress Tracking**: Mastery-based learning paths
- **Exercise Generator**: Adaptive coding challenges

## Get Started

- [Installation](./getting-started/installation.md)
- [Quick Start](./getting-started/quickstart.md)
- [Architecture](./getting-started/architecture.md)
"""
    output_path.write_text(content)
    print(f"✓ Generated index: {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate Docusaurus docs")
    parser.add_argument("--specs", default="../specs", help="Specs directory")
    parser.add_argument("--output", default="./docs", help="Output directory")
    parser.add_argument("--api-url", help="API URL for OpenAPI spec")
    args = parser.parse_args()

    generate_index(args.output)
    generate_from_specs(args.specs, args.output)

    if args.api_url:
        generate_from_openapi(args.api_url, f"{args.output}/api/reference.md")
