#!/usr/bin/env bash
# ============================================================
# deploy.sh — Auto-Commit → Merge main → Push → GitHub Actions deploy
# Usage: ./scripts/deploy.sh "Optional commit message"
# Kurzform: ./scripts/deploy.sh
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
CUSTOM_MSG="${1:-}"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Deploy: ristorantestoria.de${NC}"
echo -e "${BLUE}  Branch: $CURRENT_BRANCH → main → IONOS (via GH Actions)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ──── 1. Uncommitted changes committen ────────────────────
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo -e "${YELLOW}▸ Uncommitted changes gefunden — committe...${NC}"

  # Staged + unstaged changes
  git add -A

  # Commit-Message: custom > auto-generiert
  if [[ -n "$CUSTOM_MSG" ]]; then
    COMMIT_MSG="$CUSTOM_MSG"
  else
    # Auto-Message aus geänderten Dateien ableiten
    CHANGED=$(git diff --cached --name-only | head -5 | tr '\n' ', ' | sed 's/,$//')
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
    COMMIT_MSG="chore: Deploy $TIMESTAMP — $CHANGED"
  fi

  git commit -m "$COMMIT_MSG

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
  echo -e "${GREEN}✓ Commit: $COMMIT_MSG${NC}"
else
  echo -e "${GREEN}✓ Kein uncommitted changes${NC}"
fi

# ──── 2. Auf main mergen (falls auf Feature-Branch) ───────
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo ""
  echo -e "${YELLOW}▸ Merge $CURRENT_BRANCH → main...${NC}"

  # Worktree-Check: main ist evtl. schon im Haupt-Repo ausgecheckt
  GIT_DIR_PATH=$(git rev-parse --git-dir)
  IS_WORKTREE=false
  if [[ -f "$GIT_DIR_PATH" ]]; then
    IS_WORKTREE=true
    # Haupt-Repo-Pfad aus git worktree list ermitteln
    MAIN_REPO=$(git worktree list | head -1 | awk '{print $1}')
  fi

  if [[ "$IS_WORKTREE" == "true" ]]; then
    # Im Haupt-Repo mergen
    git -C "$MAIN_REPO" merge "$CURRENT_BRANCH" --no-edit
    echo -e "${GREEN}✓ Merge im Haupt-Repo ($MAIN_REPO) erfolgreich${NC}"
    cd "$MAIN_REPO"
  else
    git checkout main
    git merge "$CURRENT_BRANCH" --no-edit
    echo -e "${GREEN}✓ Merge erfolgreich${NC}"
  fi
else
  echo -e "${GREEN}✓ Bereits auf main${NC}"
fi

# ──── 3. main pushen → triggert GitHub Actions ────────────
echo ""
echo -e "${YELLOW}▸ Push main → GitHub...${NC}"
git push origin main
echo -e "${GREEN}✓ Push erfolgreich — GitHub Actions startet${NC}"

# ──── 4. Status anzeigen ──────────────────────────────────
echo ""
REPO_URL=$(git remote get-url origin | sed 's/git@github.com:/https:\/\/github.com\//; s/\.git$//')
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Deploy gestartet!${NC}"
echo -e "  Build-Log: ${REPO_URL}/actions"
echo -e "  Live nach ca. 3-5 Min: https://www.ristorantestoria.de"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
