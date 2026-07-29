# Lumi UI consumer upgrade: 0.1.5 → 0.2.1

Step-by-step migration guide for Faztore, Coedula, and other Lumi consumers.

> **Package-manager rule:** use `pnpm` only. Do not substitute `npm`, `yarn`, or `bun` in this workflow.

## 1. Scope and audit boundary

| Item                         | Value                                                      |
| ---------------------------- | ---------------------------------------------------------- |
| Audit start                  | 2026-07-14 00:00 (`America/Lima`)                          |
| Baseline                     | `5d83e48` — last commit before the window, package `0.1.5` |
| Target                       | `a75905b` — release `0.2.1` on 2026-07-29                  |
| Post-target visual follow-up | `8c1c4bc` — refined borders and shadows                    |
| Commits reviewed             | 18                                                         |
| Public entry points removed  | None                                                       |
| Root exports removed         | None                                                       |
| New root type exports        | `DropdownPosition`, `NotificationType`, `TooltipPosition`  |

This guide covers committed changes through `0.2.1`. Commit `8c1c4bc` subsequently refines borders and shadows. That change is visual-only and is **not** part of the published `0.2.1` package; consumers receive it only from local Lumi source or a later release.

Faztore had existing uncommitted work during this audit. The consumer inspection was read-only and no Faztore or Coedula source file was changed.

## 2. Upgrade result in one minute

The 0.1.5 → 0.2.1 upgrade is mostly source-compatible, but it is not visually neutral.

1. No component or package entry point was removed.
2. Legacy component props still work through compatibility aliases, but new code must use the canonical names.
3. Several old CSS seed tokens were removed. Consumers that override them must migrate.
4. The default identity changed from cobalt/olive to fresh blue/violet. A consumer without explicit brand seeds changes appearance silently.
5. `.lumi-grid--cards` changed from centered, capped tracks to fluid, stretching tracks.
6. Controls, alerts, notifications, tooltips, tables, and focus states received behavioral and accessibility refinements.

The highest-priority action for both audited consumers is to declare an intentional product theme after the Lumi style import.

## 3. Commit-by-commit impact

| Date   | Commit    | Change                                                                                 | Consumer impact                                                                                                                         |
| ------ | --------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Jul 14 | `f1ec59a` | Aligned documentation around CSS ownership and public contracts.                       | Adopt the rule that components own behavior, Lumi classes own reusable composition, and consumer CSS owns only product-specific layout. |
| Jul 14 | `f5db7cd` | Added first-class `--lumi-status-*` seeds.                                             | Override status seeds instead of derived `--lumi-color-{success,warning,danger,info}*` values.                                          |
| Jul 15 | `03d4eda` | Deep-imported Lucide icons to avoid the Vite barrel hang.                              | No API migration. Re-test dev startup and bundle behavior only.                                                                         |
| Jul 15 | `87dc8ab` | `.gitignore` adjustment.                                                               | No consumer action.                                                                                                                     |
| Jul 16 | `bb12819` | Introduced OKLCH seed ownership for brand, neutral, canvas, dark lift, and shadow key. | Replace raw RGB-channel theme overrides with color seeds.                                                                               |
| Jul 16 | `6b98e58` | Polished `AvatarGroup`, `Tooltip`, and PageSidebar examples.                           | No prop removal. Re-test tooltip dismissal/positioning and avatar overflow presentation.                                                |
| Jul 16 | `0a84181` | Prettier-only formatting.                                                              | No consumer action.                                                                                                                     |
| Jul 18 | `0d5e1c9` | `SidebarItem.onclick` receives `MouseEvent`; `.lumi-grid--cards` became fluid.         | Existing zero-argument handlers remain valid. Review every card grid visually.                                                          |
| Jul 18 | `e2d679e` | Refined Checkbox and Switch styling.                                                   | No API migration; visually verify checked, disabled, hover, and focus states.                                                           |
| Jul 19 | `b841189` | Released `0.2.0`.                                                                      | Intermediate release boundary.                                                                                                          |
| Jul 24 | `aa163f8` | Added the consumer reference and refined component focus/interaction styling.          | Adopt the current quick reference; no public prop removal.                                                                              |
| Jul 25 | `feac61d` | Added split filter-summary composition.                                                | Optional additive classes: `.lumi-filter-summary--split` and `.lumi-filter-summary__copy`.                                              |
| Jul 25 | `fedd630` | Added custom Card media and SidebarHeader cover snippets.                              | Optional additive API; existing `image` and `coverSrc` remain supported.                                                                |
| Jul 26 | `4b5d088` | Unified component visuals and added compatibility aliases.                             | Migrate to `variant`, `color`, and `placement`; review the behavior checklist below.                                                    |
| Jul 26 | `d1d20af` | Refined the ambient palette.                                                           | Visual-only; test light and dark surfaces.                                                                                              |
| Jul 29 | `7f5d7e2` | Unified semantic color and responsive layout contracts.                                | Remove obsolete seed overrides; narrow grids now clamp to their container.                                                              |
| Jul 29 | `be5f36b` | Shipped the final fresh-blue/violet semantic palette.                                  | The final contract keeps brand/status ownership intentionally small; warning solid content is black.                                    |
| Jul 29 | `a75905b` | Released `0.2.1`.                                                                      | Target release for this guide.                                                                                                          |

## 4. Public component API changes

### 4.1 Canonical props and compatibility aliases

| Component      | Canonical 0.2.1 API                                            | Legacy API still accepted               | Migration                                                          |
| -------------- | -------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------ |
| `Button`       | `variant` controls appearance; `type` is native HTML semantics | Visual `type`; native `button`          | `type="filled" button="submit"` → `variant="filled" type="submit"` |
| `Alert`        | `color`                                                        | `type`                                  | `type="danger"` → `color="danger"`                                 |
| `Notification` | `color`                                                        | `type`; legacy `error` maps to `danger` | Use `danger` throughout app toast types and pass `color`.          |
| `Dropdown`     | `placement`                                                    | `position`                              | `position="bottom-end"` → `placement="bottom-end"`                 |
| `Tooltip`      | `placement`                                                    | `position`                              | `position="top"` → `placement="top"`                               |

Compatibility precedence is deterministic:

- `Button.variant` wins for appearance.
- `Button.button` wins for native button type when both API forms are present.
- `Alert.color` and `Notification.color` win over legacy `type`.
- `Dropdown.placement` and `Tooltip.placement` win over legacy `position`.

Compatibility aliases prevent an immediate build break, but they should be treated as a migration bridge—not as the preferred API.

### 4.2 Additive APIs

- `Card` accepts a `media` snippet. It takes precedence over `image`; media cards are hoverable by default.
- `SidebarHeader` accepts a `cover` snippet. It takes precedence over `coverSrc`.
- `SidebarItem.onclick` now receives the triggering `MouseEvent`.
- `DropdownPosition`, `NotificationType`, and `TooltipPosition` are exported for legacy typing. New code should use `DropdownPlacement`, `NotificationColor`, and `TooltipPlacement`.

### 4.3 Behavioral rules to preserve

- A clickable `Card` renders as a button. Do not nest links, buttons, selects, or other interactive controls inside it.
- `Notification` renders where it is placed. Use `.lumi-toast-portal` for a fixed application toast stack.
- `Dropdown` and `Context` are action menus, not generic popovers. Preserve their roles and keyboard behavior.
- Radios in the same bound group need the same non-empty `name`.
- `SegmentedControl` with `clearable` emits `''` when the selected option is activated again.
- `Progress.animated` implies stripes. Give custom label snippets an accessible name when visible text is insufficient.
- `Table` now suppresses row click, double-click, and context actions when the event begins inside a nested interactive control.
- Tooltip Escape dismissal and overlay cleanup are handled by Lumi; do not add duplicate document listeners.
- Icon-only controls need an accessible name.

## 5. CSS and theme contract changes

### 5.1 New token declarations

```css
--lumi-color-neutral;
--lumi-color-canvas;
--lumi-color-shadow-key;
--lumi-dark-accent-mix;
--lumi-state-bg-strength;
--lumi-status-success;
--lumi-status-warning;
--lumi-status-danger;
--lumi-status-info;
```

Most products should override only:

```css
:root {
	--lumi-brand-primary: <product-primary>;
	--lumi-brand-secondary: <product-secondary>;
}
```

Status, neutral, and canvas seeds are advanced overrides. Lumi derives consumed colors, solids, foregrounds, soft backgrounds, surfaces, borders, shadows, and dark accents.

### 5.2 Removed 0.1.5 tokens

Remove consumer assignments to:

```css
--lumi-brand-primary-dark;
--lumi-brand-primary-foreground;
--lumi-brand-secondary-dark;
--lumi-brand-secondary-foreground;
--lumi-canvas-rgb;
--lumi-neutral-rgb;
--lumi-shadow-key-rgb;
--lumi-color-background-rgb;
--lumi-color-success-rgb;
--lumi-color-success-solid-rgb;
--lumi-color-warning-rgb;
--lumi-color-warning-solid-rgb;
--lumi-color-danger-rgb;
--lumi-color-danger-solid-rgb;
--lumi-color-info-rgb;
--lumi-color-info-solid-rgb;
```

During development between 0.2.0 and 0.2.1, additional `--lumi-brand-*-solid`, `--lumi-status-*-solid`, and `--lumi-status-*-foreground` seeds briefly existed. They are not part of final 0.2.1. Remove them if a consumer followed local Lumi HEAD during that interval.

### 5.3 Correct ownership

Before:

```css
:root {
	--lumi-color-primary: #0071e3;
	--lumi-brand-primary-dark: #2563eb;
	--lumi-color-success-rgb: 0, 134, 71;
}
```

After:

```css
:root {
	--lumi-brand-primary: #0071e3;
	--lumi-brand-secondary: #47790e;
	--lumi-status-success: #008647; /* only when product-specific */
}
```

Do not assign derived `--lumi-color-*` tokens in a consumer theme. Import the product theme **after** `@lumi-ui/svelte/styles`.

### 5.4 Contrast consequence for Coedula

Coedula documentation currently specifies Azure Blue `#0071E3` and Lime Pulse `#64AA14`.

- `#0071E3` with Lumi's white primary foreground is approximately `4.70:1`: acceptable for normal text.
- `#64AA14` with Lumi's white secondary foreground is approximately `2.88:1`: not acceptable for normal text.
- A darker lime such as `#47790E` is approximately `5.24:1` with white and fits the final 0.2.1 single-seed contract.

Recommended consumer decision:

1. Use `#47790E` (or another tested darker lime) as Coedula's secondary seed; or
2. Keep `#64AA14` only after changing the shared Lumi contract to support a separately calibrated solid/foreground again.

Do not restore removed derived-token overrides locally to force the bright lime through.

## 6. Responsive and composition changes

### `.lumi-grid--cards`

Old behavior:

- capped card width;
- centered grid;
- incomplete rows did not stretch.

0.2.1 behavior:

- `auto-fill` tracks use `minmax(min(100%, minimum), 1fr)`;
- tracks stretch fluidly;
- incomplete rows remain left-aligned;
- direct children receive `min-width: 0` and `max-width: 100%`.

Do not add a competing max-width to every card automatically. First decide whether the page wants a fluid dashboard grid or a bounded product/gallery grid. If bounded cards are a real product requirement, own that constraint in a product-specific wrapper rather than changing Lumi globally.

### Narrow-container fix

`.lumi-grid--auto-fit`, `--auto-fill`, `--responsive`, and `--cards` now clamp their minimum track to the containing block. This prevents horizontal overflow in dialogs and narrow panels. No migration is normally required; remove consumer overflow workarounds only after visual confirmation.

### New split filter summary

Optional composition:

```svelte
<div class="lumi-filter-summary lumi-filter-summary--split">
	<div class="lumi-filter-summary__copy">
		<p class="lumi-filter-summary__eyebrow">Current filter</p>
		<h2 class="lumi-filter-summary__title">All records</h2>
	</div>
	<div class="lumi-filter-summary__actions">...</div>
</div>
```

It stacks on narrow screens. Existing filter summaries remain valid.

## 7. Step-by-step upgrade procedure

### Step 0 — protect the consumer worktree

```bash
cd /Users/shaun/Documents/faztore
git status --short

cd /Users/shaun/Documents/coedula
git status --short
```

Do not mix the migration with unrelated application work. Faztore was already dirty during this audit; preserve those changes and migrate in small file groups.

### Step 1 — establish one reproducible Lumi source

For local package development:

```bash
cd /Users/shaun/Documents/lumi-ui
git status --short
pnpm install --frozen-lockfile
pnpm run check
pnpm run package
```

Then refresh the consumer:

```bash
cd /Users/shaun/Documents/faztore # or coedula
pnpm install
pnpm why @lumi-ui/svelte
pnpm run check
```

The audited consumers resolve Lumi differently:

| Consumer | Package declaration                    | Resolution         |
| -------- | -------------------------------------- | ------------------ |
| Faztore  | `"@lumi-ui/svelte": "0.2.1"`           | Published registry |
| Coedula  | `"@lumi-ui/svelte": "link:../lumi-ui"` | Live local link    |

The Coedula link resolves Lumi's current `dist`, so record the Lumi commit hash used for each linked upgrade. Faztore receives only the published registry package and therefore needs a later release for post-`0.2.1` refinements such as `8c1c4bc`.

### Step 2 — keep one root style import

```svelte
<script lang="ts">
	import '@lumi-ui/svelte/styles';
	import '$lib/styles/lumi-theme.css';
</script>
```

Both consumers already import Lumi styles once in `src/routes/+layout.svelte`. They need the product theme import after it.

### Step 3 — share one color-scheme options object

```ts
// src/lib/stores/theme.ts
import {
	createColorScheme,
	type ColorSchemeOptions,
	type ColorSchemePreference
} from '@lumi-ui/svelte/color-scheme';

export const colorSchemeOptions = {
	storageKey: 'theme',
	defaultPreference: 'system'
} satisfies ColorSchemeOptions;

export type ThemePreference = ColorSchemePreference;
export const theme = createColorScheme(colorSchemeOptions);
```

```svelte
<ColorSchemeScript {...colorSchemeOptions} />
```

Faztore and Coedula currently share only the storage-key constant. Their behavior is correct today, but one options object prevents future script/controller drift.

### Step 4 — create an explicit product theme

Coedula recommended starting point:

```css
/* src/lib/styles/lumi-theme.css */
:root {
	--lumi-brand-primary: #0071e3;
	--lumi-brand-secondary: #47790e;
}
```

Faztore must choose and commit its intended primary and secondary identity. If the current Lumi default is intentional, declare those values explicitly so a future Lumi default-palette change cannot silently rebrand the product.

Do not add `[data-theme='dark']` brand colors unless the public seed contract is intentionally expanded. Lumi 0.2.1 derives dark accents from the light seeds and `--lumi-dark-accent-mix`.

### Step 5 — migrate deprecated component props

Perform the Button migration in this order:

```svelte
<!-- before -->
<Button type="filled" button="submit">Save</Button>

<!-- after -->
<Button variant="filled" type="submit">Save</Button>
```

Then migrate the semantic and placement props:

```svelte
<Alert color="danger">...</Alert>
<Notification color="danger" />
<Dropdown placement="bottom-end">...</Dropdown>
<Tooltip placement="top">...</Tooltip>
```

Run `pnpm run check` after each mechanical group. This makes accidental native button-type changes easy to isolate.

### Step 6 — normalize toast semantics

Use one union everywhere:

```ts
export type ToastType = 'success' | 'danger' | 'warning' | 'info';
```

Replace `showToast(..., 'error')` with `showToast(..., 'danger')`, and render:

```svelte
<Notification color={toast.type} ... />
```

Keep the existing `.lumi-toast-portal` wrapper.

### Step 7 — visually review affected grids

Test these viewport groups:

- wide desktop;
- approximately `64rem`;
- tablet/narrow container;
- mobile.

Check card width, incomplete-row alignment, content wrapping, and horizontal overflow. Do not judge only the first full row.

### Step 8 — adopt additive APIs only where they remove app code

- Use `Card.media` for reusable custom media without reimplementing Card structure.
- Use `SidebarHeader.cover` when a custom cover fits the standard identity layout.
- Use `.lumi-filter-summary--split` when actions/meta need to sit beside summary copy.

These APIs are optional. Do not refactor stable consumer compositions merely to use every new feature.

### Step 9 — update consumer documentation

Delete copied component catalogs when possible. Link to Lumi's authoritative sources instead:

- [`CONSUMER_REFERENCE.md`](./CONSUMER_REFERENCE.md) for normal usage;
- [`GUIDE.md`](./GUIDE.md) for architecture and layout;
- component `types.ts` and `.svelte` for exact contracts.

### Step 10 — validate with pnpm

Consumer validation:

```bash
pnpm run lint:fix
pnpm run check
pnpm run build
```

Lumi validation:

```bash
pnpm run lint
pnpm run check
pnpm run package
git diff --check
```

Then perform light/dark and responsive visual checks on the pages listed below.

## 8. Consumer-specific audit

### 8.1 Faztore

Current status:

| Area                           | Result                                             |
| ------------------------------ | -------------------------------------------------- |
| Lumi package                   | `0.2.1` registry dependency                        |
| Root Lumi style import         | Correct                                            |
| Color-scheme script/controller | Correct today; consolidate into one options object |
| Explicit product brand seeds   | Missing                                            |
| Deprecated API                 | Extensively used but still compatible              |
| Toast portal                   | Correct                                            |
| Radio names                    | Audited usages are compliant                       |
| Current check                  | `pnpm run check`: 0 errors, 0 warnings             |

Mechanical migration inventory:

| Legacy usage                | Occurrences |
| --------------------------- | ----------: |
| `Button` visual `type`      |         170 |
| `Button.button` native type |           9 |
| `Dropdown.position`         |           7 |
| `Tooltip.position`          |           1 |
| `Alert.type`                |          52 |
| `Notification.type`         |           1 |
| `showToast(..., 'error')`   |          25 |

Recommended order:

1. Add explicit Faztore brand seeds.
2. Change `ToastType` from `error` to `danger`, update the 25 calls, then use `Notification.color`.
3. Convert Button `button`/visual `type` pairs before bulk-converting remaining Button variants.
4. Convert Alert, Dropdown, and Tooltip aliases.
5. Review the four fluid card-grid sites:
   - `src/routes/(dashboard)/branches/+page.svelte`
   - `src/routes/(dashboard)/users/+page.svelte`
   - `src/lib/components/Storefront/StorefrontOffersPanel.svelte`
   - `src/lib/components/Storefront/StorefrontPublicationGallery.svelte`
6. Replace stale consumer documentation:
   - `docs/Components.md` still documents local `tokens.css`, removed RGB tokens, and legacy component props.
   - `docs/Architecture.md` still describes local `tokens.css` / `lumi-core.css` ownership.
   - `docs/public-catalog-plan.md` still references the old local CSS files.

Do not mass-edit Faztore until its existing unrelated working-tree changes are understood and preserved.

### 8.2 Coedula

Current status:

| Area                           | Result                                                                                   |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| Linked Lumi package            | `0.2.1`, `link:../lumi-ui`                                                               |
| Root Lumi style import         | Correct                                                                                  |
| Color-scheme script/controller | Correct today; consolidate into one options object                                       |
| Explicit product brand seeds   | Missing; documented Roger Blue identity is not implemented                               |
| Deprecated API                 | None found                                                                               |
| Canonical API sample           | 220 `Button.variant`, 15 native `Button.type`, 17 `Dropdown.placement`, 88 `Alert.color` |
| Toast portal                   | Correct                                                                                  |
| Toast semantic union           | Correct: uses `danger`                                                                   |
| Radio names                    | Audited usages are compliant                                                             |
| Current check                  | `pnpm run check`: 0 errors, 0 warnings                                                   |

Recommended order:

1. Implement the Coedula theme with the contrast decision described in §5.4.
2. Consolidate the color-scheme options object.
3. Review the two fluid card-grid sites:
   - `src/routes/(dashboard)/branches/+page.svelte`
   - `src/routes/(dashboard)/cycles/+page.svelte`
4. Keep the dashboard overview grid; its public selector remains supported.
5. Remove or document the direct component-selector overrides in `src/routes/(dashboard)/drive/+page.svelte` (`:global(.lumi-card)`) and `src/lib/components/StudentPhotoUploader/StudentPhotoUploader.svelte` (`:global(.lumi-image*)`). Prefer an application class passed through the component API so the app owns the customization without coupling to Lumi internals.
6. Move the inline font-size style in `src/lib/components/StudentContextSummary/StudentContextSummary.svelte` into a tokenized class to match Coedula's own no-inline-style rule.
7. Update Coedula documentation:
   - `README.md` still refers to `tokens.css`.
   - `.agents/skills/coedula/SKILL.md` and `references/architecture.md` specify explicit light/dark brand colors that no longer match the single-seed 0.2.1 contract.

Coedula is already component-API clean; its remaining upgrade work is theme ownership, documentation alignment, and focused visual QA.

## 9. Final acceptance checklist

- [ ] Consumer depends on one known Lumi commit/release.
- [ ] Lumi styles are imported once at the root.
- [ ] Product theme loads after Lumi styles.
- [ ] Only public brand/status/neutral/canvas seeds are overridden.
- [ ] No removed RGB, dark-brand, or foreground seed remains.
- [ ] `Button.variant` and native `Button.type` are unambiguous.
- [ ] Alert/Notification use `color`; Dropdown/Tooltip use `placement`.
- [ ] Toast types use `danger`, not legacy `error`.
- [ ] `.lumi-grid--cards` pages were reviewed in full and incomplete rows.
- [ ] Radios sharing a group also share a non-empty name.
- [ ] Toasts remain inside `.lumi-toast-portal`.
- [ ] No consumer CSS targets Lumi component internals without a documented exception.
- [ ] Light, dark, keyboard, forced-colors, mobile, and reduced-motion behavior were checked where relevant.
- [ ] `pnpm run lint:fix`, `pnpm run check`, and `pnpm run build` pass in the consumer.
