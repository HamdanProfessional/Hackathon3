#!/usr/bin/env python3
"""Generate Skills catalog from registry."""
import os
import sys
from datetime import datetime
from pathlib import Path

SKILLS_DIR = ".claude/skills"
OUTPUT_FILE = "docs/SKILLS_CATALOG.md"

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

def categorize_skill(skill_name):
    """Categorize a skill by name patterns."""
    categories = {
        "Infrastructure": ["k8s", "kubernetes", "helm", "deploy", "cloud", "infrastructure"],
        "Backend": ["fastapi", "backend", "crud", "sqlmodel", "migration", "endpoint"],
        "Frontend": ["frontend", "nextjs", "react", "monaco", "ui"],
        "AI & Agents": ["agent", "mcp", "ai", "chatbot", "conversation", "stateless"],
        "Event-Driven": ["dapr", "kafka", "event", "pubsub"],
        "Documentation": ["doc", "docusaurus", "adr", "readme"],
        "Testing": ["test", "e2e", "integration", "validate"],
        "Architecture": ["architect", "plan", "spec", "phase"],
    }

    skill_lower = skill_name.lower()
    for category, keywords in categories.items():
        for keyword in keywords:
            if keyword in skill_lower:
                return category

    return "Other"

def generate_catalog():
    """Generate Skills catalog markdown."""
    skills_path = Path(SKILLS_DIR)

    if not skills_path.exists():
        print(f"✗ Skills directory not found: {SKILLS_DIR}")
        return 1

    # Collect all skills
    skills = []
    for skill_dir in sorted(skills_path.iterdir()):
        if skill_dir.is_dir():
            skill_md = skill_dir / "SKILL.md"
            if skill_md.exists():
                frontmatter = parse_frontmatter(skill_md)
                if frontmatter and "name" in frontmatter:
                    name = frontmatter.get("name")
                    description = frontmatter.get("description", "No description")
                    char_count = skill_md.stat().st_size
                    tokens = char_count // 4
                    category = categorize_skill(name)

                    skills.append({
                        "name": name,
                        "description": description,
                        "tokens": tokens,
                        "category": category
                    })

    # Group by category
    by_category = {}
    for skill in skills:
        cat = skill["category"]
        if cat not in by_category:
            by_category[cat] = []
        by_category[cat].append(skill)

    # Generate markdown
    output = []
    output.append("# Skills Catalog")
    output.append("")
    output.append(f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    output.append(f"**Total Skills**: {len(skills)}")
    output.append("")
    output.append("---")
    output.append("")

    # Sort categories
    for category in sorted(by_category.keys()):
        output.append(f"## {category}")
        output.append("")

        for skill in sorted(by_category[category], key=lambda x: x["name"]):
            token_indicator = "✓" if skill["tokens"] <= 250 else "⚠️"
            output.append(f"### {skill['name']}")
            output.append("")
            output.append(f"{token_indicator} ~{skill['tokens']} tokens")
            output.append("")
            output.append(f"{skill['description']}")
            output.append("")

    # Write to file
    output_path = Path(OUTPUT_FILE)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(output))

    print(f"✓ Catalog generated: {OUTPUT_FILE}")
    print(f"  Total Skills: {len(skills)}")
    print(f"  Categories: {len(by_category)}")

    return 0

if __name__ == "__main__":
    sys.exit(generate_catalog())
