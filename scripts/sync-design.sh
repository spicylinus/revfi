#!/usr/bin/env bash
# Validate DESIGN.md and list files that reference design tokens.
# Run this after a Google Stitch export to see what needs updating.
# Usage: bash scripts/sync-design.sh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "=== Design Token Sync ==="
echo ""

# Show when DESIGN.md was last modified
if [ -f "$REPO_ROOT/DESIGN.md" ]; then
  echo "DESIGN.md last modified: $(date -r "$REPO_ROOT/DESIGN.md" 2>/dev/null || stat -c '%y' "$REPO_ROOT/DESIGN.md" 2>/dev/null)"
else
  echo "ERROR: DESIGN.md not found at $REPO_ROOT/DESIGN.md"
  exit 1
fi

echo ""
echo "Files referencing design tokens:"
grep -rl "color-primary\|font-sans\|font-display\|--radius\|--color\|--font" \
  "$REPO_ROOT/src" 2>/dev/null | sort | sed 's|'"$REPO_ROOT"'/||'

echo ""
echo "Checking DESIGN.md for required sections..."
required_sections=("Color Palette" "Typography" "Spacing System" "Border Radius" "Component Patterns" "Accessibility Standards")
all_ok=true
for section in "${required_sections[@]}"; do
  if grep -q "$section" "$REPO_ROOT/DESIGN.md"; then
    echo "  [OK]      $section"
  else
    echo "  [MISSING] $section"
    all_ok=false
  fi
done

echo ""
if [ "$all_ok" = true ]; then
  echo "DESIGN.md looks complete."
else
  echo "WARNING: Some sections are missing from DESIGN.md."
fi

echo ""
echo "To propagate token changes, tell Claude Code:"
echo '  "Read DESIGN.md and update src/app/globals.css, tailwind.config.ts,'
echo '   and src/lib/design-tokens.ts to match the current design tokens"'
