#!/usr/bin/env python3
"""Measure token usage for all Skills."""
import sys
from pathlib import Path

SKILLS_DIR = ".claude/skills"

def measure_tokens():
    """Measure token usage for all Skills."""
    skills_path = Path(SKILLS_DIR)

    if not skills_path.exists():
        print(f"✗ Skills directory not found: {SKILLS_DIR}")
        return 1

    results = []
    total_tokens = 0

    for skill_dir in sorted(skills_path.iterdir()):
        if skill_dir.is_dir():
            skill_md = skill_dir / "SKILL.md"
            if skill_md.exists():
                char_count = skill_md.stat().st_size
                token_count = char_count // 4

                status = "✓" if token_count <= 250 else "✗"
                if token_count > 150:
                    status = "⚠️" if token_count <= 250 else "✗"

                results.append({
                    "name": skill_dir.name,
                    "chars": char_count,
                    "tokens": token_count,
                    "status": status
                })
                total_tokens += token_count

    # Print results
    print(f"📏 Token Usage Report ({len(results)} Skills)\n")
    print(f"{'Skill':<30} {'Tokens':<10} {'Status'}")
    print("-" * 60)

    excellent = 0
    good = 0
    acceptable = 0
    poor = 0

    for r in results:
        print(f"{r['name']:<30} ~{r['tokens']:<9} {r['status']}")

        if r["tokens"] < 150:
            excellent += 1
        elif r["tokens"] < 200:
            good += 1
        elif r["tokens"] <= 250:
            acceptable += 1
        else:
            poor += 1

    print("-" * 60)
    print(f"\nSummary:")
    print(f"  Excellent (<150): {excellent}")
    print(f"  Good (150-200): {good}")
    print(f"  Acceptable (200-250): {acceptable}")
    print(f"  Poor (>250): {poor}")
    print(f"\n  Total Tokens: ~{total_tokens}")
    print(f"  Average: ~{total_tokens // len(results)} tokens/Skill")

    return 0

if __name__ == "__main__":
    sys.exit(measure_tokens())
