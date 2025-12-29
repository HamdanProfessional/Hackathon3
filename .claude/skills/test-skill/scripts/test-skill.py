#!/usr/bin/env python3
"""Test a specific Skill by validation and execution."""
import os
import sys
import subprocess
import argparse
from pathlib import Path

SKILLS_DIR = ".claude/skills"

def test_skill_structure(skill_path):
    """Test Skill structure."""
    errors = []

    skill_md = skill_path / "SKILL.md"
    ref_md = skill_path / "REFERENCE.md"
    scripts_dir = skill_path / "scripts"

    if not skill_md.exists():
        errors.append("Missing SKILL.md")
    if not ref_md.exists():
        errors.append("Missing REFERENCE.md")
    if not scripts_dir.exists():
        errors.append("Missing scripts/ directory")
    else:
        scripts = list(scripts_dir.glob("*"))
        scripts = [s for s in scripts if s.is_file()]
        if not scripts:
            errors.append("No scripts found")

    return errors

def test_skill_scripts(skill_path):
    """Test Skill scripts for syntax."""
    errors = []
    scripts_dir = skill_path / "scripts"

    if not scripts_dir.exists():
        return errors

    # Test bash scripts
    for script in scripts_dir.glob("*.sh"):
        result = subprocess.run(
            ["bash", "-n", str(script)],
            capture_output=True
        )
        if result.returncode != 0:
            errors.append(f"Script syntax error: {script.name}")

    # Test python scripts
    for script in scripts_dir.glob("*.py"):
        result = subprocess.run(
            ["python3", "-m", "py_compile", str(script)],
            capture_output=True
        )
        if result.returncode != 0:
            errors.append(f"Python syntax error: {script.name}")

    return errors

def test_single_skill(skill_name):
    """Test a single Skill."""
    skill_path = Path(SKILLS_DIR) / skill_name

    if not skill_path.exists():
        print(f"✗ Skill not found: {skill_name}")
        return 1

    print(f"Testing Skill: {skill_name}")
    print("-" * 40)

    # Test structure
    structure_errors = test_skill_structure(skill_path)
    if structure_errors:
        print("✗ Structure errors:")
        for error in structure_errors:
            print(f"  - {error}")
    else:
        print("✓ Structure valid")

    # Test scripts
    script_errors = test_skill_scripts(skill_path)
    if script_errors:
        print("✗ Script errors:")
        for error in script_errors:
            print(f"  - {error}")
    else:
        print("✓ Scripts valid")

    # Check token budget
    skill_md = skill_path / "SKILL.md"
    if skill_md.exists():
        char_count = skill_md.stat().st_size
        token_count = char_count // 4

        if token_count > 250:
            print(f"✗ Token budget exceeded: ~{token_count} tokens (max 250)")
        elif token_count > 200:
            print(f"⚠️  Token budget high: ~{token_count} tokens")
        else:
            print(f"✓ Token budget OK: ~{token_count} tokens")

    # Overall result
    if structure_errors or script_errors:
        print(f"\n✗ {skill_name} FAILED")
        return 1
    else:
        print(f"\n✓ {skill_name} PASSED")
        return 0

def test_all_skills():
    """Test all Skills."""
    skills_path = Path(SKILLS_DIR)

    if not skills_path.exists():
        print(f"✗ Skills directory not found: {SKILLS_DIR}")
        return 1

    passed = 0
    failed = 0

    for skill_dir in sorted(skills_path.iterdir()):
        if skill_dir.is_dir():
            result = test_single_skill(skill_dir.name)
            if result == 0:
                passed += 1
            else:
                failed += 1
            print()

    print("=" * 40)
    print(f"Test Summary: {passed} passed, {failed} failed")

    return 0 if failed == 0 else 1

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Test Skills")
    parser.add_argument("--skill", help="Skill name to test (omit to test all)")
    args = parser.parse_args()

    if args.skill:
        sys.exit(test_single_skill(args.skill))
    else:
        sys.exit(test_all_skills())
