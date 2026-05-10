# CLAUDE.md — Linus-Boscovitch Web Design Workflow

## Tool Overview

This project uses four tools in a coordinated design-to-code pipeline:

| Tool             | Role                                          | Access Method                        |
|------------------|-----------------------------------------------|--------------------------------------|
| Google Stitch    | Generate UI designs from prompts              | MCP server (`stitch`)                |
| Claude Code      | Apply design tokens, write & review components| Active (you are this)                |
| v0.dev / 21st.dev| Generate shadcn/ui React components via AI    | `npm run v0` or 21st.dev Magic MCP   |
| UI/UX Pro Max    | Enforce WCAG 2.1, design consistency audits   | Claude Code skill (see install below)|

---

## Design Style System

Ten pre-built style presets live in `src/styles/design-styles.css`. Each overrides the CSS
custom properties from `globals.css` for any element that carries a `data-style` attribute.

### Switch the site-wide style

1. Edit `DESIGN.md` → `## Active Design Style` → change the `Style` value (one word)
2. Tell Claude Code: *"Apply the active design style from DESIGN.md"*
   Claude Code will set `data-style="<style>"` on `<html>` in `src/app/layout.tsx`

### Per-section style

```tsx
import { StyleWrapper } from '@/components/design-system/StyleWrapper'

<StyleWrapper style="bento">
  <FeatureGrid />
</StyleWrapper>
```

`StyleWrapper` accepts any of the 10 style keys and sets `data-style` on its root element,
scoping the theme to that subtree only.

### Dev preview

Add `<StyleSwitcher />` to any page to get a floating panel that lets you click through all
10 styles live. It only renders in `NODE_ENV=development`.

```tsx
import { StyleSwitcher } from '@/components/design-system/StyleSwitcher'
// Inside your page or layout:
<StyleSwitcher />
```

### Valid style keys

```
minimalism | brutalism | neobrutalism | constructivism | swiss |
editorial  | hand-drawn | retro       | flat           | bento
```

### Token reference

`src/lib/style-presets.ts` exports `STYLE_PRESETS` — fully-typed token objects for all 10
styles — and `DESIGN_STYLE_DESCRIPTIONS` for documentation or style-picker UIs.

---

## Installing UI/UX Pro Max Skill

The UI/UX Pro Max skill is a Claude Code plugin by `nextlevelbuilder`. Install it in your
local Claude Code session before using this workflow:

```bash
# In your terminal (not in Claude Code):
claude mcp add magic --scope user \
  -- npx -y @21st-dev/magic@latest
```

Or via the Claude Code marketplace:
```
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

Once installed, invoke it inside Claude Code with:
```
/ui-ux-pro-max audit src/components/
```

---

## Standard Workflow (5 Steps)

### Step 1 — Design in Google Stitch

1. Open [labs.google/stitch](https://labs.google/stitch)
2. Enter a design prompt:
   > *"A SaaS dashboard with a sidebar nav, dark mode support, and a data table"*
3. Iterate until satisfied
4. Sync to this repo via the Stitch MCP:
   ```
   Read the current Stitch design and update DESIGN.md with the latest tokens
   ```

The Stitch MCP server (configured in `.claude/settings.json`) writes color tokens,
typography, spacing, and component patterns directly to `DESIGN.md`.

---

### Step 2 — Apply Design Tokens

After `DESIGN.md` is updated, tell Claude Code:

```
Read DESIGN.md and update src/app/globals.css and tailwind.config.ts
to match the new design tokens
```

Claude Code will:
- Write CSS custom properties to `globals.css`
- Update font families, radii, and spacing extensions in `tailwind.config.ts`
- Keep light and dark mode in sync
- Update `src/lib/design-tokens.ts` if new token categories appear

---

### Step 3 — Generate Components (v0.dev or 21st.dev)

**Option A — v0.dev CLI:**
```bash
npm run v0
# Enter prompt: "a pricing table with 3 tiers using shadcn/ui Card"
```

**Option B — 21st.dev Magic MCP:**
```
Use the Magic MCP to generate a pricing table component with 3 tiers
```

Place generated components in:
- `src/components/ui/` — generic, reusable shadcn/ui components
- `src/components/design-system/` — project-specific wrapper components

After adding any generated component, tell Claude Code:
```
Update src/components/ui/PricingTable.tsx to use CSS custom properties
from globals.css instead of any hardcoded Tailwind color classes
```

---

### Step 4 — Enforce Design Consistency (UI/UX Pro Max)

After adding or modifying components, run the design audit:

```
/ui-ux-pro-max audit src/components/
```

Or prompt Claude Code directly:
```
Using UI/UX Pro Max, check all components in src/components/ for:
- WCAG 2.1 AA contrast violations
- Missing focus states
- Hardcoded colors that should use CSS custom properties from DESIGN.md
- Touch target sizes below 44×44px
```

The UI Expert MCP (configured in `.claude/settings.json`) also runs passively to
flag consistency issues as you work.

---

### Step 5 — Review and Ship

```bash
npm run typecheck   # TypeScript validation
npm run lint        # ESLint
npm run build       # Production build check
npm run dev         # Dev server at localhost:3000 (Turbopack)
```

---

## MCP Servers

Both are configured in `.claude/settings.json` and start automatically in every Claude Code session.

### Stitch MCP (`stitch-mcp`)
Connects Claude Code to your Google Stitch workspace.

| Prompt | What it does |
|--------|-------------|
| `"List my Stitch projects"` | Shows all your Stitch designs |
| `"Read the design tokens from project [name]"` | Displays color/type/spacing tokens |
| `"Sync current Stitch design to DESIGN.md"` | Writes tokens to DESIGN.md |

### UI Expert MCP (`@johndoe20012/ui-expert-mcp`)
Passively enforces WCAG 2.1 AA and design consistency.

| Prompt | What it does |
|--------|-------------|
| `"Audit src/components/ui/Button.tsx for accessibility"` | Checks ARIA, contrast, focus |
| `"Suggest design improvements for the homepage"` | Style and layout recommendations |
| `"Check contrast ratios for all tokens in DESIGN.md"` | WCAG contrast audit |

---

## Project Structure

```
linus-boscovitch/
├── .claude/
│   └── settings.json          # MCP configs (Stitch + UI Expert)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home placeholder
│   │   └── globals.css         # CSS custom properties (token source of truth)
│   ├── components/
│   │   ├── ui/                 # shadcn/ui base components
│   │   └── design-system/      # Project-specific wrappers
│   └── lib/
│       ├── utils.ts            # cn() helper
│       └── design-tokens.ts    # TypeScript interface for DESIGN.md tokens
├── DESIGN.md                   # Design token contract (Stitch → here → CSS)
├── CLAUDE.md                   # This file
├── tailwind.config.ts          # Token extensions referencing CSS variables
├── package.json
└── scripts/
    ├── setup.sh                # One-time environment setup
    └── sync-design.sh          # Validate DESIGN.md and list token references
```

---

## Adding Components

### Complex UI → v0.dev or 21st.dev (recommended)
```bash
npm run v0
# or: use Magic MCP prompt in Claude Code
```

### Base components → shadcn/ui directly
```bash
npx shadcn add button card dialog table badge input
```

### Simple components → Claude Code from scratch
```
Create a Hero component in src/components/design-system/Hero.tsx
using DESIGN.md tokens: headline, subtext, and a CTA button
```

---

## Environment Variables

Create `.env.local` for API keys (never commit this file):

```bash
# Google Stitch authenticated API access (optional)
STITCH_API_KEY=your_key_here

# Vercel v0.dev CLI authentication (optional)
VERCEL_TOKEN=your_token_here
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| MCP server not starting | Run `npm run setup` to re-warm the npx cache |
| DESIGN.md out of sync | Run `npm run sync-design` or ask Claude Code to re-read DESIGN.md |
| v0 component uses wrong colors | After adding, prompt: *"Replace hardcoded Tailwind colors with CSS variables from globals.css"* |
| TypeScript errors on CSS vars | Update `src/lib/design-tokens.ts` interface to match new token categories |
| `/plugin` command not available | Install the skill via terminal: `claude mcp add magic --scope user -- npx -y @21st-dev/magic@latest` |
