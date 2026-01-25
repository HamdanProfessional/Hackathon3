#!/usr/bin/env python3
"""Test MCP server for token efficiency."""
import subprocess
import sys

def test_server(server_dir: str = "."):
    """Test MCP server."""
    print("Testing MCP server...")

    # Check if main.py exists
    result = subprocess.run(
        f"ls {server_dir}/main.py",
        shell=True,
        capture_output=True
    )

    if result.returncode != 0:
        print("✗ main.py not found")
        return False

    # Count tokens in main.py (rough estimate: ~4 chars per token)
    result = subprocess.run(
        f"wc -c {server_dir}/main.py",
        shell=True,
        capture_output=True,
        text=True
    )
    char_count = int(result.stdout.split()[0])
    estimated_tokens = char_count // 4

    print(f"  Main.py: {char_count} chars ≈ {estimated_tokens} tokens")

    if estimated_tokens > 200:
        print("⚠ Warning: SKILL.md should be ~100 tokens")
        print("  Move documentation to REFERENCE.md")
    else:
        print("✓ Token efficient")

    # Check for scripts directory
    result = subprocess.run(
        f"ls {server_dir}/scripts/*.py 2>/dev/null | wc -l",
        shell=True,
        capture_output=True,
        text=True
    )
    script_count = int(result.stdout.strip())
    print(f"  Scripts: {script_count} files (0 tokens - executed)")

    return True

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Test MCP server")
    parser.add_argument("--dir", default=".", help="Server directory")
    args = parser.parse_args()

    if test_server(args.dir):
        sys.exit(0)
    else:
        sys.exit(1)
