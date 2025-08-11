#!/usr/bin/env bash
# BLONG helper: push-b
# Create a new branch from current HEAD, auto-commit any changes, and push to origin
# Usage:
#   bash scripts/push-b.sh [branch-name] [commit message...]
#   npm run push-b -- [branch-name] [commit message...]
# Behavior:
#   - If branch-name is provided, spaces will be converted to '-' and lowercased.
#   - If branch-name is omitted, it will generate the next incremental phase-N name
#     (scans local and remote branches 'phase-*' to pick the next free number).

set -euo pipefail

# Ensure we're inside a git repo
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: This is not a git repository. Run this from the project root." >&2
  exit 1
fi

# Ensure origin remote exists
if ! git config --get remote.origin.url >/dev/null 2>&1; then
  echo "Error: No 'origin' remote found. Please add it, e.g.:" >&2
  echo "  git remote add origin <git@github.com:owner/repo.git or https://github.com/owner/repo.git>" >&2
  exit 1
fi

# Inputs
RAW_BRANCH_NAME="${1:-}"
shift || true
COMMIT_MSG="${*:-chore: update via push-b}" # default commit message

# Sanitize provided branch name (allow slashes, replace spaces with dashes, lowercase)
sanitize_branch() {
  local name="$1"
  name="${name// /-}"
  name="${name,,}"
  # Remove surrounding quotes if any
  name="${name%\'}"; name="${name#\'}"
  name="${name%\"}"; name="${name#\"}"
  echo "$name"
}

# Determine next incremental phase-N if no name provided
next_phase_branch() {
  local max=0
  # Local branches
  while IFS= read -r ref; do
    local n
    n=$(sed -nE 's/^phase-([0-9]+)$/\1/p' <<<"$ref" || true)
    if [[ -n "$n" && $n -gt $max ]]; then max=$n; fi
  done < <(git for-each-ref --format='%(refname:short)' refs/heads/phase-* 2>/dev/null || true)
  # Remote branches
  while IFS= read -r ref; do
    ref="${ref#refs/heads/}"
    local n
    n=$(sed -nE 's/^phase-([0-9]+)$/\1/p' <<<"$ref" || true)
    if [[ -n "$n" && $n -gt $max ]]; then max=$n; fi
  done < <(git ls-remote --heads origin 'phase-*' | awk '{print $2}' 2>/dev/null || true)
  echo "phase-$((max+1))"
}

if [[ -n "$RAW_BRANCH_NAME" ]]; then
  BRANCH_NAME="$(sanitize_branch "$RAW_BRANCH_NAME")"
else
  BRANCH_NAME="$(next_phase_branch)"
fi

# Show status
echo "--- git status (before) ---"
git status --porcelain

# Stage and commit changes if any
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Staging and committing changes..."
  git add -A
  git commit -m "$COMMIT_MSG" || echo "No changes to commit (commit step skipped)."
else
  echo "No local changes detected; will proceed to branch operations."
fi

# Create or switch to branch
if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
  echo "Branch $BRANCH_NAME already exists locally. Switching to it..."
  git checkout "$BRANCH_NAME"
else
  echo "Creating new branch $BRANCH_NAME..."
  git checkout -b "$BRANCH_NAME"
fi

# Push to origin and set upstream
echo "Pushing to origin/$BRANCH_NAME..."
if git push -u origin "$BRANCH_NAME"; then
  echo "Push successful."
else
  echo "Push failed. Please check your credentials/permissions." >&2
  exit 1
fi

# Build PR URL if remote is GitHub
REMOTE_URL="$(git config --get remote.origin.url)"
OWNER_REPO=""
if [[ "$REMOTE_URL" =~ ^git@github.com:(.*)\.git$ ]]; then
  OWNER_REPO="${BASH_REMATCH[1]}"
elif [[ "$REMOTE_URL" =~ ^https://github.com/(.*)\.git$ ]]; then
  OWNER_REPO="${BASH_REMATCH[1]}"
fi

if [[ -n "$OWNER_REPO" ]]; then
  echo "You can open a PR here: https://github.com/$OWNER_REPO/pull/new/$BRANCH_NAME"
else
  echo "Remote origin is not a standard GitHub URL; skipping PR link. Remote: $REMOTE_URL"
fi

# Final status
echo "--- git status (after) ---"
git status -sb

echo "Done: branch $BRANCH_NAME is tracking origin/$BRANCH_NAME."
