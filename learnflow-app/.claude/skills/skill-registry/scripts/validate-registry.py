#!/usr/bin/env python3
"""Validate all Skills in the registry."""
import os
import sys
import re
from pathlib import Path

SKILLS_DIR = ".claude/skills"

def validate_skill(skill_path):
    """Validate a single Skill."""
    errors = []
    warnings = []

    # Check SKILL.md
    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        errors.append("Missing SKILL.md")
        return errors, warnings

    # Check REFERENCE.md
    ref_md = skill_path / "REFERENCE.md"
    if not ref_md.exists():
        errors.append("Missing REFERENCE.md")

    # Check scripts directory
    scripts_dir = skill_path / "scripts"
    if not scripts_dir.exists():
        errors.append("Missing scripts/ directory")
    else:
        # Check for at least one script
        scripts = list(scripts_dir.glob("*"))
        scripts = [s for s in scripts if s.is_file()]
        if not scripts:
            warnings.append("No scripts in scripts/ directory")

    # Check token budget
    with open(skill_md) as f:
        content = f.read()
    char_count = len(content)
    token_count = char_count // 4

    if token_count > 250:
        errors.append(f"SKILL.md is ~{token_count} tokens (exceeds 250 limit)")
    elif token_count > 150:
        warnings.append(f"SKILL.md is ~{token_count} tokens (above target)")

    # Check YAML frontmatter
    if not content.startswith("---"):
        errors.append("SKILL.md missing YAML frontmatter delimiter")
    else:
        parts = content.split("---", 2)
        if len(parts) >= 2:
            frontmatter = parts[1]
            if "name:" not in frontmatter:
                errors.append("SKILL.md missing 'name' in frontmatter")
            if "description:" not in frontmatter:
                warnings.append("SKILL.md missing 'description' in frontmatter")

    return errors, warnings

def validate_registry():
    """Validate all Skills in the registry."""
    skills_path = Path(SKILLS_DIR)

    if not skills_path.exists():
        print(f"✗ Skills directory not found: {SKILLS_DIR}")
        return 1

    total_skills = 0
    total_errors = 0
    total_warnings = 0
    failed_skills = []

    for skill_dir in sorted(skills_path.iterdir()):
        if skill_dir.is_dir():
            errors, warnings = validate_skill(skill_dir)

            if errors:
                failed_skills.append(skill_dir.name)
                total_errors += len(errors)

            total_warnings += len(warnings)
            total_skills += 1

            # Print results for this skill
            if errors or warnings:
                status = "✗" if errors else "⚠️"
                print(f"{status} {skill_dir.name}/")

                for error in errors:
                    print(f"  ✗ {error}")

                for warning in warnings:
                    print(f"  ⚠️  {warning}")

    # Print summary
    print(f"\n{'='*60}")
    print(f"Validation Summary")
    print(f"{'='*60}")
    print(f"Total Skills: {total_skills}")
    print(f"Passed: {total_skills - len(failed_skills)}")
    print(f"Failed: {len(failed_skills)}")
    print(f"Total Errors: {total_errors}")
    print(f"Total Warnings: {total_warnings}")

    if failed_skills:
        print(f"\nFailed Skills: {', '.join(failed_skills)}")
        return 1
    else:
        print(f"\n✓ All {total_skills} Skills validated successfully")
        return 0

if __name__ == "__main__":
    sys.exit(validate_registry())
