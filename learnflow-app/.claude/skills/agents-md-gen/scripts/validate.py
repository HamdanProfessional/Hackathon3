#!/usr/bin/env python3
"""Validate generated AGENTS.md file."""
import argparse
import re
from pathlib import Path

def validate_agents_md(file_path: str = "AGENTS.md") -> bool:
    """Validate AGENTS.md has required sections."""
    path = Path(file_path)

    if not path.exists():
        print(f"✗ {file_path} does not exist")
        return False

    content = path.read_text()

    # Required sections
    required_sections = [
        "Overview",
        "Technology Stack",
        "Project Structure",
        "Conventions",
        "How AI Agents Should Work",
    ]

    missing = []
    for section in required_sections:
        pattern = f"## {section}"
        if pattern not in content:
            missing.append(section)

    if missing:
        print(f"✗ Missing sections: {', '.join(missing)}")
        return False

    print(f"✓ {file_path} is valid")
    print(f"  Required sections present: {len(required_sections)}")

    # Optional checks
    if "```" in content:
        print("  ✓ Contains code blocks")

    if content.count("##") >= 5:
        print("  ✓ Has multiple sections")

    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Validate AGENTS.md")
    parser.add_argument("--file", default="AGENTS.md", help="AGENTS.md file path")
    args = parser.parse_args()

    if validate_agents_md(args.file):
        exit(0)
    else:
        exit(1)
