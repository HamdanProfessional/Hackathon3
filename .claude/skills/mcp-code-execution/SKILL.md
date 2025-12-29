---
name: mcp-code-execution
description: Create MCP servers using Code Execution pattern for efficient AI agent integration. Use when user asks to create MCP server, implement MCP tools, or build context providers for AI agents.
---

# MCP Code Execution Pattern

Create MCP servers following the Code Execution pattern for optimal token efficiency.

## When to Use
- User asks to "create MCP server" or "implement MCP tools"
- Building context providers for LearnFlow AI agents
- Optimizing AI agent token usage

## Quick Start
```bash
# Generate MCP server
python scripts/generate.py --name learnflow-context

# Test the server
python scripts/test.py

# Deploy
./scripts/deploy.sh
```

## Instructions
1. Generate server: `python scripts/generate.py --name <server-name>`
2. Implement tools in generated template
3. Test: `python scripts/test.py`

## Validation
- [ ] MCP server scaffolded
- [ ] Tools follow code execution pattern
- [ ] Minimal token usage confirmed

See [REFERENCE.md](./REFERENCE.md) for MCP patterns and best practices.
