#!/usr/bin/env python3
"""Generate test report for all Skills."""
import sys
import subprocess
from datetime import datetime
from pathlib import Path

SKILLS_DIR = ".claude/skills"
OUTPUT_FILE = "docs/PHASE_2_TEST_RESULTS.md"

def generate_report():
    """Generate comprehensive test report."""
    # Run test-skill.py
    test_result = subprocess.run(
        ["python3", ".claude/skills/test-skill/scripts/test-skill.py"],
        capture_output=True,
        text=True
    )

    # Run measure-tokens.py
    token_result = subprocess.run(
        ["python3", ".claude/skills/test-skill/scripts/measure-tokens.py"],
        capture_output=True,
        text=True
    )

    # Count Skills
    skills_path = Path(SKILLS_DIR)
    skill_count = len([d for d in skills_path.iterdir() if d.is_dir()])

    # Generate report
    report = []
    report.append("# Phase 2: Test Results Report")
    report.append("")
    report.append(f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report.append("")

    # Summary
    report.append("## Summary")
    report.append("")
    report.append(f"- **Total Skills**: {skill_count}")
    report.append(f"- **Required Skills**: 7")
    report.append(f"- **New Skills (Phase 2)**: 3")
    report.append("")

    # Required Skills List
    report.append("## Required Hackathon 3 Skills")
    report.append("")
    required = [
        "agents-md-gen", "kafka-k8s-setup", "postgres-k8s-setup",
        "fastapi-dapr-agent", "mcp-code-execution", "nextjs-k8s-deploy",
        "docusaurus-deploy"
    ]
    for skill in required:
        report.append(f"- [ ] {skill}")
    report.append("")

    # New Skills List
    report.append("## New Phase 2 Skills")
    report.append("")
    new_skills = ["k8s-foundation", "skill-registry", "test-skill"]
    for skill in new_skills:
        report.append(f"- [ ] {skill}")
    report.append("")

    # Test Results
    report.append("## Skill Structure Tests")
    report.append("```")
    report.append(test_result.stdout)
    report.append("```")
    report.append("")

    # Token Usage
    report.append("## Token Usage Analysis")
    report.append("```")
    report.append(token_result.stdout)
    report.append("```")
    report.append("")

    # Compatibility Matrix
    report.append("## Cross-Agent Compatibility")
    report.append("")
    report.append("| Skill | Claude Code | Goose | Notes |")
    report.append("|-------|-------------|-------|-------|")

    all_skills = required + new_skills
    for skill in all_skills:
        report.append(f"| {skill} | ⬜ | ⬜ | |")
    report.append("")

    # Write report
    output_path = Path(OUTPUT_FILE)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(report))

    print(f"✓ Report generated: {OUTPUT_FILE}")

    return 0

if __name__ == "__main__":
    sys.exit(generate_report())
