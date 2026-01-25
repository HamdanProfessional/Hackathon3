#!/bin/bash
# Remove non-Hackathon 3 skills

cd .claude/skills

# Skills to KEEP (Hackathon 3 required + foundation)
KEEP_SKILLS=(
  "agents-md-gen"
  "kafka-k8s-setup"
  "postgres-k8s-setup"
  "fastapi-dapr-agent"
  "mcp-code-execution"
  "nextjs-k8s-deploy"
  "docusaurus-deploy"
  "k8s-foundation"
  "skill-registry"
  "test-skill"
)

# Function to check if skill should be kept
keep_skill() {
  local skill="$1"
  for keep in "${KEEP_SKILLS[@]}"; do
    if [ "$skill" = "$keep" ]; then
      return 0
    fi
  done
  return 1
}

# Count removed
removed=0
kept=0

# List all directories except README.md
for dir in */; do
  dir_name="${dir%/}"

  # Skip if it's a file, not directory
  [ ! -d "$dir_name" ] && continue

  if keep_skill "$dir_name"; then
    echo "KEEP: $dir_name"
    ((kept++))
  else
    echo "REMOVE: $dir_name"
    rm -rf "$dir_name"
    ((removed++))
  fi
done

echo ""
echo "Summary:"
echo "  Kept: $kept skills"
echo "  Removed: $removed skills"
echo ""
echo "Remaining skills:"
ls -1d */
