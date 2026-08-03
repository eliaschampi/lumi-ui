# Upgrade

Consumer migration for **0.1.5 → 0.2.x** and later. Use **pnpm** only. Source remains authoritative.

## 0.1.5 → 0.2.x (required)

**API (compat aliases still work — migrate anyway)**

| Component            | Use                       | Drop                          |
| -------------------- | ------------------------- | ----------------------------- |
| Button               | `variant` + native `type` | visual `type` / dual `button` |
| Alert / Notification | `color`                   | `type` (`error` → `danger`)   |
| Dropdown / Tooltip   | `placement`               | `position`                    |

**Theme** — load product CSS **after** `@lumi-ui/svelte/styles`. Override seeds only:

```css
:root {
	--lumi-brand-primary: …;
	--lumi-brand-secondary: …;
	/* optional */ --lumi-status-success/warning/danger/info;
	/* optional */ --lumi-color-neutral; --lumi-color-canvas;
}
```

Remove: `*-rgb`, `*-dark`, brand/status solid/foreground seeds, and any direct `--lumi-color-primary` (etc.) assignments. Default identity is azure × orchid on warm paper (OKLCH).

**Layout** — `.lumi-grid--cards` is fluid `auto-fill` (not centered caps). Narrow grids clamp to the container.

**Behavior** — clickable `Card` = button (no nested interactives). Toasts need `.lumi-toast-portal`. Radio groups share `name`.

## 0.2.2 → 0.2.3 (CSS-only polish)

No TS, prop, or public export changes. Everything below is internal styling; upgrading is drop-in. Applies to all consumers (Coedula, Faztore, Aeduca).

**Control / theme pass**

| Change                                    | Consumer action                                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Plain **cards do not blur**               | Opt in: `--lumi-surface-blur-filter` (`.lumi-auth-card` / `.lumi-drive-toolbar-card` already do) |
| Shared focus outline / control motion     | None; non-primary accents focus correctly                                                        |
| Info solid darker (`oklch(52% 0.15 210)`) | Visual QA on filled `info`                                                                       |
| Brand/status seed retune                  | Visual QA if you rely on Lumi defaults                                                           |

Translucent custom card example:

```css
.my-glass {
	--lumi-surface-blur: var(--lumi-blur-sm);
	--lumi-surface-blur-filter: blur(var(--lumi-surface-blur))
		saturate(var(--lumi-surface-saturation));
}
```

**Cross-component consistency pass** — one recipe per role, calmer shared motion. No public token or API additions; components align to the surface/focus contracts in [GUIDE §6](./GUIDE.md#6-design-language) (switcher shells are glass + elevated active pill, not control-fill).

| Area                                          | What changed                                                                                                                                                                                                                                                                                                                             | Consumer action                    |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **Tabs + SegmentedControl**                   | One segmented-shell recipe (glass shell, `72/28` glass/strong border, `--lumi-control-shadow`), one 9% accent hover, one elevated active pill (surface gradient, 28% accent edge, quiet shadow). Tab hover lift removed; vertical tab nav now gets the same shell background (was transparent) and drops its legacy mobile right border. | Visual QA on tab bars / segmenters |
| **Spinners** (Button, Table, Select, Loading) | One recipe: faint 18% accent track + solid arc, one 1s cadence (`--lumi-duration-slower` × 2, was 500–1000ms drift; Select's hardcoded `0.6s` removed). Select spinner now honors `prefers-reduced-motion`.                                                                                                                              | Visual QA on loading states        |
| **Icon tiles** (IconBadge + InfoItem)         | One tile recipe: 12% accent fill, 20% accent border, `--lumi-radius-lg`, unified 30% top sheen. IconBadge keeps its standalone `--lumi-shadow-sm` elevation and warning-strength bump.                                                                                                                                                   | Visual QA on icon tiles            |
| **Chip focus**                                | Shared accent focus outline (`--lumi-focus-outline` with `--lumi-control-accent`) replaces the full-strength `currentColor` ring on chip action/close.                                                                                                                                                                                   | Keyboard QA on chips               |
| **Sidebar sub-items**                         | Radius unified to `--lumi-control-radius` (was `--lumi-radius-base`); sub-items now match root items.                                                                                                                                                                                                                                    | None                               |
| **Token leftovers**                           | Progress sheens use border-width tokens; dark control shadows use border-width tokens (no raw `1px` there); component media queries rem-based (`64/48/40/30rem`) matching `core.css`; InfoItem hover uses `--lumi-transition-control`.                                                                                                   | None                               |

Verified consistent, no change needed: **Checkbox**, **Radio**, **Switch**, **Input** (already on the shared control-fill / active / focus-shadow contract), **Button** focus halo (deliberate full-strength accent ring for filled actions).

## Checklist

1. `pnpm up @lumi-ui/svelte` (or link + `pnpm run package` in Lumi)
2. Theme = seeds only, after styles import
3. Grep and migrate legacy props / removed tokens
4. Opt in glass blur on translucent cards
5. `pnpm run check` + light/dark visual pass (forms, focus, cards, status solids)
