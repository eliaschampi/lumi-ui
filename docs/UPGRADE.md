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

## Unreleased control / theme pass (minor CSS)

No TS or public export breaks. Ship as **minor**, not patch.

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

## Checklist

1. `pnpm up @lumi-ui/svelte` (or link + `pnpm run package` in Lumi)
2. Theme = seeds only, after styles import
3. Grep and migrate legacy props / removed tokens
4. Opt in glass blur on translucent cards
5. `pnpm run check` + light/dark visual pass (forms, focus, cards, status solids)
