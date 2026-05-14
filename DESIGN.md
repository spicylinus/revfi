# Design System — Linus-Boscovitch

> This file is exported by Google Stitch and read by Claude Code via the Stitch MCP server.
> Do not edit manually while Stitch sync is active. To override, disconnect Stitch and edit directly.

## Active Design Style

- **Style**: `minimalism`
- **Scope**: `site-wide`
- **Override notes**: none

> To switch styles, change the `Style` value above to one of:
> `minimalism` | `brutalism` | `neobrutalism` | `constructivism` | `swiss` |
> `editorial` | `hand-drawn` | `retro` | `flat` | `bento`
>
> Then tell Claude Code: *"Apply the active design style from DESIGN.md"*

---

## Project Identity

- **Design Style**: [e.g. "Minimal SaaS", "Bold Consumer", "Enterprise Dashboard"]
- **Brand Voice**: [e.g. "Professional, approachable, modern"]
- **Target Audience**: [e.g. "B2B developers, 25–45"]

---

## Color Palette

### Primary Colors

| Token               | Hex       | Usage                      |
|---------------------|-----------|----------------------------|
| `--color-primary`   | `#3b82f6` | CTAs, links, active states |
| `--color-secondary` | `#64748b` | Supporting actions         |
| `--color-accent`    | `#f59e0b` | Highlights, badges         |

### Neutral Scale

| Token                   | Hex       | Usage           |
|-------------------------|-----------|-----------------|
| `--color-background`    | `#ffffff` | Page background |
| `--color-surface`       | `#f8fafc` | Cards, panels   |
| `--color-surface-muted` | `#f1f5f9` | Inputs, wells   |
| `--color-border`        | `#e2e8f0` | Dividers, rings |
| `--color-text`          | `#0f172a` | Body text       |
| `--color-text-muted`    | `#64748b` | Captions, hints |

### Dark Mode Overrides

| Token                | Dark Value |
|----------------------|------------|
| `--color-background` | `#0f172a`  |
| `--color-surface`    | `#1e293b`  |
| `--color-surface-muted` | `#334155` |
| `--color-border`     | `#475569`  |
| `--color-text`       | `#f8fafc`  |
| `--color-text-muted` | `#94a3b8`  |

---

## Typography

### Font Stack

| Role    | Family         | Weights        | Usage             |
|---------|----------------|----------------|-------------------|
| Sans    | Inter          | 400, 500, 600, 700 | Body, UI      |
| Display | Cal Sans       | 700            | Headings, hero    |
| Mono    | JetBrains Mono | 400, 500       | Code, data        |

### Type Scale

Base size: **16px** | Scale ratio: **1.25** (Major Third)

| Step | Size   | Tailwind Class | Usage            |
|------|--------|----------------|------------------|
| -1   | 12.8px | `text-xs`      | Labels, captions |
| 0    | 16px   | `text-base`    | Body text        |
| 1    | 20px   | `text-xl`      | Lead text        |
| 2    | 25px   | `text-2xl`     | H3               |
| 3    | 31px   | `text-3xl`     | H2               |
| 4    | 39px   | `text-4xl`     | H1               |
| 5    | 49px   | `text-5xl`     | Display          |

### Line Heights

- Body: 1.5
- Headings: 1.2
- Monospace: 1.4

---

## Spacing System

Base unit: **4px**

| Token | Value   | px  |
|-------|---------|-----|
| 1     | 0.25rem | 4   |
| 2     | 0.5rem  | 8   |
| 3     | 0.75rem | 12  |
| 4     | 1rem    | 16  |
| 6     | 1.5rem  | 24  |
| 8     | 2rem    | 32  |
| 12    | 3rem    | 48  |
| 16    | 4rem    | 64  |
| 24    | 6rem    | 96  |

---

## Border Radius

| Token         | Value  | Usage                        |
|---------------|--------|------------------------------|
| `--radius-sm` | 4px    | Inputs, small chips          |
| `--radius`    | 8px    | Cards, buttons (default)     |
| `--radius-lg` | 12px   | Modals, dropdowns            |
| `--radius-xl` | 16px   | Hero sections, feature cards |
| full          | 9999px | Pills, avatars               |

---

## Shadow Scale

| Token | Value                                          | Usage            |
|-------|------------------------------------------------|------------------|
| sm    | `0 1px 2px 0 rgb(0 0 0 / 0.05)`               | Subtle elevation |
| base  | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` | Cards |
| lg    | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | Modals, popovers |

---

## Component Patterns

### Buttons

```
Primary:     bg-[--color-primary] text-white rounded-[--radius] px-4 py-2 font-medium
Secondary:   border border-[--color-border] bg-[--color-surface] rounded-[--radius] px-4 py-2
Ghost:       bg-transparent hover:bg-[--color-surface-muted] rounded-[--radius] px-4 py-2
Destructive: bg-red-600 text-white rounded-[--radius] px-4 py-2
```

### Cards

```
rounded-[--radius-lg] bg-[--color-surface] border border-[--color-border]
shadow-sm p-6 space-y-4
```

### Form Inputs

```
border border-[--color-border] bg-[--color-background] rounded-[--radius-sm]
px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]
```

### Navigation

- Background: `--color-background` with bottom border `--color-border`
- Height: 64px
- Padding: 0 24px

---

## Accessibility Standards (WCAG 2.1 AA)

- Minimum contrast ratio: **4.5:1** for normal text, **3:1** for large text
- Focus rings: 2px solid `--color-primary`, offset 2px
- Touch targets: minimum 44×44px
- No information conveyed by color alone
- All interactive elements keyboard accessible

---

## Stitch Export Metadata

- **Stitch Project ID**: <!-- populated by Stitch MCP -->
- **Last synced**: <!-- populated by Stitch MCP -->
- **Export format**: HTML/CSS + React components
- **Figma source**: <!-- link if applicable -->
