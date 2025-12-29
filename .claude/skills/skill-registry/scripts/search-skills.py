#!/usr/bin/env python3
"""Search Skills by keyword."""
import os
import sys
import argparse
from pathlib import Path

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

def search_skills(keyword):
    """Search Skills by keyword in name or description."""
    keyword_lower = keyword.lower()
    skills_path = Path(SKILLS_DIR)

    if not skills_path.exists():
        print(f"✗ Skills directory not found: {SKILLS_DIR}")
        return 1

    results = []
    for skill_dir in sorted(skills_path.iterdir()):
        if skill_dir.is_dir():
            skill_md = skill_dir / "SKILL.md"
            if skill_md.exists():
                frontmatter = parse_frontmatter(skill_md)
                if frontmatter:
                    name = frontmatter.get("name", skill_dir.name)
                    description = frontmatter.get("description", "")

                    # Search in name and description
                    if (keyword_lower in name.lower() or
                        keyword_lower in description.lower()):
                        char_count = skill_md.stat().st_size
                        tokens = char_count // 4

                        results.append({
                            "name": name,
                            "description": description,
                            "tokens": tokens,
                            "path": str(skill_dir)
                        })

    # Print results
    if results:
        print(f"🔍 Search results for '{keyword}' ({len(results)} found)\n")
        print(f"{'Name':<30} {'Tokens':<10} {'Description'}")
        print("-" * 80)

        for skill in results:
            token_indicator = "✓" if skill["tokens"] <= 250 else "⚠️"
            print(f"{skill['name']:<30} {token_indicator} ~{skill['tokens']:<8} {skill['description'][:40]}")

        return 0
    else:
        print(f"🔍 No Skills found matching '{keyword}'")
        return 1

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Search Skills by keyword")
    parser.add_argument("--keyword", required=True, help="Keyword to search for")
    args = parser.parse_args()

    sys.exit(search_skills(args.keyword))
