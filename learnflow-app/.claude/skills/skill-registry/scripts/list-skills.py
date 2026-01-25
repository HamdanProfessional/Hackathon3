#!/usr/bin/env python3
"""List all available Skills in the registry."""
import os
import sys
from pathlib import Path
import re

SKILLS_DIR = ".claude/skills"

def parse_frontmatter(file_path):
    """Parse YAML frontmatter from SKILL.md."""
    with open(file_path) as f:
        content = f.read()

    if not content.startswith("---"):
        return None

    parts = content.split("---", 2)
    if len(parts) < 3:
        return None

    frontmatter = {}
    for line in parts[1].strip().split("\n"):
        if ":" in line:
            key, value = line.split(":", 1)
            frontmatter[key.strip()] = value.strip()

    return frontmatter

def list_skills():
    """List all Skills with metadata."""
    skills_path = Path(SKILLS_DIR)
    if not skills_path.exists():
        print(f"✗ Skills directory not found: {SKILLS_DIR}")
        return 1

    skills = []
    for skill_dir in sorted(skills_path.iterdir()):
        if skill_dir.is_dir():
            skill_md = skill_dir / "SKILL.md"
            if skill_md.exists():
                frontmatter = parse_frontmatter(skill_md)
                if frontmatter and "name" in frontmatter:
                    name = frontmatter.get("name", skill_dir.name)
                    description = frontmatter.get("description", "No description")
                    char_count = skill_md.stat().st_size
                    tokens = char_count // 4

                    skills.append({
                        "name": name,
                        "description": description,
                        "tokens": tokens,
                        "path": str(skill_dir)
                    })

    # Print results
    print(f"📋 Skills Registry ({len(skills)} total)\n")
    print(f"{'Name':<30} {'Tokens':<10} {'Description'}")
    print("-" * 80)

    for skill in skills:
        token_indicator = "✓" if skill["tokens"] <= 250 else "⚠️"
        print(f"{skill['name']:<30} {token_indicator} ~{skill['tokens']:<8} {skill['description'][:40]}")

    return 0

if __name__ == "__main__":
    sys.exit(list_skills())
