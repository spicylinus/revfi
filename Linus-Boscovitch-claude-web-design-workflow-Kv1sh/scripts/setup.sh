#!/usr/bin/env bash
# One-time environment setup for the Linus-Boscovitch design workflow.
# Usage: bash scripts/setup.sh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "=== Linus-Boscovitch: Design Workflow Setup ==="
echo ""

# 1. Install project dependencies
echo "[1/5] Installing npm dependencies..."
npm install

# 2. Warm npx cache for Stitch MCP
echo "[2/5] Warming stitch-mcp cache..."
npx --yes stitch-mcp --version 2>/dev/null || true

# 3. Warm npx cache for UI Expert MCP
echo "[3/5] Warming ui-expert-mcp cache..."
npx --yes @johndoe20012/ui-expert-mcp --version 2>/dev/null || true

# 4. Initialize shadcn/ui (skipped if already configured)
echo "[4/5] Initializing shadcn/ui..."
if [ ! -f "$REPO_ROOT/components.json" ]; then
  npx shadcn init --yes --defaults
else
  echo "    shadcn already initialized (components.json exists), skipping."
fi

# 5. Add base shadcn components
echo "[5/5] Adding base shadcn/ui components..."
npx shadcn add button card badge input label separator --yes 2>/dev/null || \
  echo "    Warning: some shadcn components could not be added automatically. Run 'npx shadcn add <name>' manually."

echo ""
echo "=== Setup complete ==="
echo ""
echo "Next steps:"
echo "  1. Run 'npm run dev' to start the dev server at localhost:3000"
echo "  2. Open a Claude Code session — MCP servers start automatically"
echo "  3. See CLAUDE.md for the full 5-step workflow"
echo ""
echo "Tool versions:"
node --version
npm --version
