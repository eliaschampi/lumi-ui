# Lumi UI Guide

Complete product documentation. Component selection lives in [Components](./COMPONENTS.md). Source (`types.ts`, `.svelte`, CSS) is authoritative for exact APIs.

**Contents:** [Install](#1-install) · [First page](#2-first-page) · [Theming](#3-theming-and-color-scheme) · [Layouts](#4-layouts-and-composition) · [Core CSS](#5-core-css-reference) · [Design language](#6-design-language) · [Library design](#7-library-design) · [Release](#8-release-verification)

---

## 1. Install

```bash
pnpm add @lumi-ui/svelte
```

Supported Svelte versions: [`peerDependencies`](../package.json). No Tailwind, Bootstrap, provider, or CSS-in-JS required.

### Public entry points

[`package.json`](../package.json) is authoritative.

| Import                                   | Source                                                      | Contract                                                                                           |
| ---------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `@lumi-ui/svelte`                        | [`src/lib/index.ts`](../src/lib/index.ts)                   | Components, shared types, icon registry API, locale API, formatters, portal action, config         |
| `@lumi-ui/svelte/icons`                  | [`icons.ts`](../src/lib/icons.ts)                           | Optional curated `lumiIcons` map for string icon names                                             |
| `@lumi-ui/svelte/drive`                  | [`drive.ts`](../src/lib/drive.ts)                           | Pure Drive helpers, types and Drive copy (not the UI components)                                   |
| `@lumi-ui/svelte/color-scheme`           | [`color-scheme/index.ts`](../src/lib/color-scheme/index.ts) | Pre-paint script, controller, pure policy, types                                                   |
| `@lumi-ui/svelte/styles`                 | [`styles/index.css`](../src/lib/styles/index.css)           | Tokens + core (base, layout, utilities)                                                            |
| `@lumi-ui/svelte/styles/tokens.base.css` | [`tokens.base.css`](../src/lib/styles/tokens.base.css)      | Token contract only                                                                                |
| `@lumi-ui/svelte/styles/core.css`        | [`core.css`](../src/lib/styles/core.css)                    | `base.css` + `layout.css` + `utilities.css`                                                        |
| `@lumi-ui/svelte/styles/base.css`        | [`base.css`](../src/lib/styles/base.css)                    | Reset, control contracts, surfaces and shared recipes (spinner, skeleton, switcher, icon, sr-only) |
| `@lumi-ui/svelte/styles/layout.css`      | [`layout.css`](../src/lib/styles/layout.css)                | App and dashboard shells, page sidebar, two-column layouts, toast portal                           |
| `@lumi-ui/svelte/styles/utilities.css`   | [`utilities.css`](../src/lib/styles/utilities.css)          | Flex, grid, stack, text, spacing and display helpers                                               |
| `@lumi-ui/svelte/styles/patterns.css`    | [`patterns.css`](../src/lib/styles/patterns.css)            | Opt-in operative compositions (filter summary, toolbars, metric lists…)                            |

Drive UI components are root exports. Add a subpath only for cohesive optional capability—not mere convenience.

### Load styles once

At the application root, import Lumi styles, then brand overrides:

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '@lumi-ui/svelte/styles';
	import '../lumi-theme.css';

	const { children } = $props();
</script>

{@render children?.()}
```

```css
/* src/lumi-theme.css — most products need only these two seeds */
:root {
	--lumi-brand-primary: #7c3aed;
	--lumi-brand-secondary: #0f766e;
}
```

Lumi derives semantic states, surfaces, and light/dark values. Advanced seeds: [§3 Theming](#3-theming-and-color-scheme).

Every global stylesheet declares the same cascade-layer order (`lumi.tokens, lumi.base, lumi.components, lumi.layout, lumi.utilities, lumi.patterns`), so **unlayered consumer CSS always wins** over Lumi globals regardless of import order or selector specificity. Component styles are scoped and unlayered; restyle components through their tokens and props, never by patching internals.

**Lean public pages.** Pages that only render components (storefronts, landing pages) need tokens + base; add utilities or layout only when markup uses them. Load `patterns.css` in the layouts that use it (dashboards, auth), not at the root:

```ts
// src/routes/+layout.svelte — public, SEO-sensitive tree
import '@lumi-ui/svelte/styles/tokens.base.css';
import '@lumi-ui/svelte/styles/base.css';
import '@lumi-ui/svelte/styles/utilities.css';

// src/routes/(dashboard)/+layout.svelte — app tree
import '@lumi-ui/svelte/styles/layout.css';
import '@lumi-ui/svelte/styles/patterns.css';
```

### Icons

Pass Lucide components. Deep imports keep each page to the icons it renders:

```svelte
<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import { Button } from '@lumi-ui/svelte';
</script>

<Button icon={Search} aria-label="Search" />
```

Icon props also accept a string name resolved through a registry that is **empty by default**. Apps that store icon names as data register them once, in the layout that needs them (never the barrel `@lucide/svelte`):

```ts
import { registerIcons } from '@lumi-ui/svelte';
import { lumiIcons } from '@lumi-ui/svelte/icons'; // the curated 0.x map, same keys

registerIcons(lumiIcons); // or registerIcons({ house: House, users: Users })
```

Registration is idempotent and request-safe (static configuration). An unknown name renders nothing and warns once in development.

### Language and formatting

Built-in copy (accessible names, empty states, pagination, placeholders) defaults to **English** with `en-US` / `USD` formatting. Spanish ships as `lumiEs` and costs nothing until imported. Set both once at the root; components read them from Svelte context, so SSR requests stay isolated:

```svelte
<script lang="ts">
	import { lumiEs, setLumiLocale } from '@lumi-ui/svelte';
	import { lumiDriveEs } from '@lumi-ui/svelte/drive'; // only if you render Drive

	const messages = { ...lumiEs, ...lumiDriveEs }; // keep the object stable
	setLumiLocale({
		locale: 'es-PE',
		currency: 'PEN',
		timeZone: 'America/Lima',
		messages
	});
</script>
```

- Partial `messages` override single keys; missing keys fall back to English.
- Pass a function to follow reactive state: `setLumiLocale(() => (lang === 'es' ? es : en))`.
- Explicit props (`placeholder`, `closeLabel`, `noDataText`…) always win over locale copy.
- `formatNumber(value, { locale, style: 'currency', currency })`, `formatDate(value, { locale, timeZone })` and `getInitials(name)` are the same cached, pure helpers components use; prefer them to per-app copies.

### Local package development

```bash
pnpm add @lumi-ui/svelte@link:../lumi-ui
cd ../lumi-ui && pnpm run package
```

Repackage after public export changes. Runnable showcase: [`lumi-web`](https://github.com/eliaschampi/lumi).

---

## 2. First page

```svelte
<script lang="ts">
	import { Button, Card, Input, PageHeader } from '@lumi-ui/svelte';

	let name = $state('');
</script>

<div class="lumi-stack lumi-stack--lg">
	<PageHeader title="Workspace" subtitle="A clean starting point">
		{#snippet actions()}<Button variant="filled">Create</Button>{/snippet}
	</PageHeader>

	<div class="lumi-grid lumi-grid--responsive">
		<Card title="Profile" spaced>
			<Input bind:value={name} name="name" label="Display name" />
			<Button variant="filled" disabled={!name.trim()}>Save</Button>
		</Card>
		<Card title="Status"
			>Use components for behavior and utilities for composition.</Card
		>
	</div>
</div>
```

Root exports components and public shared types. Choose primitives: [Components](./COMPONENTS.md). Compose pages: [§4 Layouts](#4-layouts-and-composition).

---

## 3. Theming and color scheme

Brand identity is CSS data. Light/dark/system preference is optional behavior from `@lumi-ui/svelte/color-scheme`.

### Brand seeds

| Seed                     | Role                                      |
| ------------------------ | ----------------------------------------- |
| `--lumi-brand-primary`   | Primary actions, focus, active navigation |
| `--lumi-brand-secondary` | Supporting identity and contrast          |

Brand seeds also provide the stable filled surface. Dark mode derives a brighter accent without changing that solid.

### Status seeds

Feedback states are seeds too. Lumi derives the soft `-bg` and a brighter dark-mode accent from them.

| Seed                    | Default (OKLCH)       | Role                                              |
| ----------------------- | --------------------- | ------------------------------------------------- |
| `--lumi-status-success` | `oklch(54% 0.16 158)` | Confirmations, positive state                     |
| `--lumi-status-warning` | `oklch(80% 0.17 80)`  | Caution, needs attention                          |
| `--lumi-status-danger`  | `oklch(56% 0.205 24)` | Destructive actions, errors, blocking             |
| `--lumi-status-info`    | `oklch(52% 0.15 210)` | Neutral information (distinct from brand primary) |

Defaults share a perceptually balanced OKLCH system in [`tokens.base.css`](../src/lib/styles/tokens.base.css). Warning keeps a bright amber **solid** (black content) and derives a darker on-surface accent for text/indicators. Accent tints and state backgrounds mix in OKLCH so chroma stays even across hues.

Default identity: azure primary (`oklch(55% 0.205 257)`), orchid secondary (`oklch(56% 0.2 310)`), warm ink (`rgb(34 28 26)`), and warm-paper canvas (`rgb(247 243 237)`).

### Semantic background/foreground contract

The foreground belongs to the effective background, not to light or dark mode. Every public role (`primary`, `secondary`, `success`, `warning`, `danger`, `info`) exposes the same family:

| Token                            | Responsibility                            |
| -------------------------------- | ----------------------------------------- |
| `--lumi-color-{role}`            | Accent for border, focus, icon, indicator |
| `--lumi-color-{role}-solid`      | High-presence chromatic surface           |
| `--lumi-color-{role}-foreground` | Content on `solid`                        |
| `--lumi-color-{role}-bg`         | Low-intensity soft surface                |

Components consume the semantic family while products override only brand or status seeds. Use `solid + foreground` for filled surfaces; the default foreground is white except warning, which uses black.

### Token ownership

[`tokens.base.css`](../src/lib/styles/tokens.base.css) flows brand/neutral seeds → semantic colors, surfaces, borders, shadows, geometry, layout sizing, motion, and dark overrides.

| Layer           | Owns                                                                |
| --------------- | ------------------------------------------------------------------- |
| Consumer        | Brand seeds; may consume public `--lumi-*` semantic tokens          |
| Components      | Semantic tokens only (not application palettes)                     |
| `core.css`      | Reset, shells, layouts, and utilities ([§5](#5-core-css-reference)) |
| `patterns.css`  | Reusable composition patterns ([§5](#shared-css-patterns))          |
| Application CSS | Product-specific page layout (tokenized)                            |

Do not target component selectors. Do not redefine success/warning/danger/info as brand.

```css
/* Valid product composition */
.account-summary {
	display: grid;
	gap: var(--lumi-space-md);
	border-radius: var(--lumi-radius-xl);
}
```

### Optional color-scheme runtime

Without the optional entry, CSS still supports default Lumi appearance. Add a controller only when users choose `system`, `light`, or `dark`.

Keep controller and pre-paint options in **one** object—both must match or server pre-paint and mounted controller disagree:

```ts
// src/lib/color-scheme.svelte.ts
import {
	createColorScheme,
	type ColorSchemeOptions
} from '@lumi-ui/svelte/color-scheme';

export const colorSchemeOptions = {
	storageKey: 'product-color-scheme',
	defaultPreference: 'system'
} satisfies ColorSchemeOptions;

export const colorScheme = createColorScheme(colorSchemeOptions);
```

```svelte
<!-- root layout -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { ColorSchemeScript } from '@lumi-ui/svelte/color-scheme';
	import { colorScheme, colorSchemeOptions } from '$lib/color-scheme.svelte';

	onMount(colorScheme.start);
</script>

<ColorSchemeScript {...colorSchemeOptions} />
```

#### Controller contract

| Member                 | Meaning                               |
| ---------------------- | ------------------------------------- |
| `preference`           | Stored: `system` \| `light` \| `dark` |
| `resolved`             | Applied: `light` \| `dark`            |
| `setPreference(value)` | Persist, resolve, apply               |
| `cyclePreference()`    | Advance through choices               |
| `start()`              | Sync; returns idempotent cleanup      |

One controller per app. `start()` is SSR-safe, reference-counted, and removes its media-query listener after the last cleanup.

The app owns selector labels, icons, placement, and localization. Prefer `SegmentedControl` for a few visible choices in settings—not inside a menu role.

#### First paint, SSR, and CSP

`ColorSchemeScript` sets `data-theme` before paint; the controller takes over after mount. Client-only apps need an equivalent static host bootstrap for pre-JS accuracy.

The component emits a small inline script: strict `script-src` must authorize its exact hash. With nonces, render the body from [`createColorSchemeBootScript`](../src/lib/color-scheme/boot.ts) at the CSP boundary—do not enable `unsafe-inline` for convenience.

### `/color-scheme` exports

Full surface of the optional `@lumi-ui/svelte/color-scheme` subpath. Pure policy helpers and constants are exported for apps that build a custom selector or validate a stored value without instantiating the controller.

| Symbol                                                                                                                  | Kind             | Use                                                            |
| ----------------------------------------------------------------------------------------------------------------------- | ---------------- | -------------------------------------------------------------- |
| `createColorScheme(options?)`                                                                                           | factory          | Returns a `ColorSchemeController` (table above)                |
| `ColorSchemeScript`                                                                                                     | Svelte component | Pre-paint resolver; accepts the same `ColorSchemeOptions`      |
| `createColorSchemeBootScript(options)`                                                                                  | function         | Inline script body string for a nonce-gated CSP boundary       |
| `COLOR_SCHEME_PREFERENCES`, `DEFAULT_COLOR_SCHEME_PREFERENCE`, `DEFAULT_COLOR_SCHEME_STORAGE_KEY`                       | constants        | `['system','light','dark']`, `'system'`, `'lumi-color-scheme'` |
| `parseColorSchemePreference`, `resolveColorScheme`                                                                      | pure helpers     | Validate a stored string; resolve a preference against the OS  |
| `ColorSchemeController`, `ColorSchemeOptions`, `ColorSchemePreference`, `ColorSchemeScriptProps`, `ResolvedColorScheme` | types            | Public type contracts                                          |

Source: [`color-scheme/index.ts`](../src/lib/color-scheme/index.ts).

### Theming verification

- Brand CSS loads after Lumi styles.
- Every `solid + foreground` pair passes 4.5:1 in light and dark.
- Required indicators, checks, thumbs, focus, and borders pass 3:1 against adjacent colors.
- Brand and status seeds pass with their paired solid foreground.
- System preference tracks the OS; preference persists without flash on SSR navigation/reload.
- Exactly one pre-paint script; selector a11y and localization are app-owned.

---

## 4. Layouts and composition

Recipes for shells and pages. Exhaustive class families and breakpoints: [§5](#5-core-css-reference). Declarations: [`core.css`](../src/lib/styles/core.css) and [`patterns.css`](../src/lib/styles/patterns.css).

Components own behavior and accessibility. CSS classes own page composition—do not patch component-private selectors.

### Choose a structure

| Need                   | Start with                                                 |
| ---------------------- | ---------------------------------------------------------- |
| App navigation shell   | `.lumi-dashboard-layout` + `Sidebar` + `Navbar`            |
| Standard page rhythm   | `.lumi-stack` + `PageHeader` + `Card` / `DashboardSection` |
| Filters beside results | `.lumi-layout--two-columns` + `PageSidebar`                |
| Fluid cards            | `.lumi-grid .lumi-grid--responsive`                        |
| Dashboard card grid    | `.lumi-grid .lumi-grid--cards`                             |
| Fixed desktop columns  | `.lumi-grid` + `--columns-2-lg` … `--columns-4-lg`         |
| Focused / auth task    | `.lumi-centered-layout` + `.lumi-centered-card`            |
| Bounded content        | `.lumi-container` + one size modifier                      |

### Dashboard shell

Grid areas: `sidebar`, `navbar`, `content`. Keep shell classes and component props synchronized.

```svelte
<script lang="ts">
	let collapsed = $state(false);
	let mobileOpen = $state(false);

	function toggleSidebar(): void {
		if (window.matchMedia('(max-width: 64rem)').matches) {
			mobileOpen = !mobileOpen;
			return;
		}
		collapsed = !collapsed;
	}
</script>

<div
	class="lumi-dashboard-layout"
	class:lumi-sidebar--is-collapsed={collapsed}
	class:lumi-sidebar--mobile-open={mobileOpen}
>
	<Sidebar {collapsed} {mobileOpen}>...</Sidebar>
	<Navbar ontogglesidebar={toggleSidebar} />
	<main class="lumi-dashboard-layout__content">{@render children?.()}</main>
	<button
		type="button"
		class="lumi-mobile-overlay lumi-border--none"
		aria-label="Close navigation"
		onclick={() => (mobileOpen = false)}
	></button>
</div>
```

At `64rem` and below, core switches the shell to navbar/content and `Sidebar` uses fixed mobile presentation. Keep viewport state aligned with that breakpoint. Closed mobile navigation is excluded from keyboard navigation. Full shell: the [`lumi-web`](https://github.com/eliaschampi/lumi) showcase. Breakpoints: [§5 Responsive effects](#responsive-effects).

### Standard page

```svelte
<div class="lumi-stack lumi-stack--lg">
	<PageHeader title="Records" subtitle="Current workspace">
		{#snippet actions()}<Button variant="filled">Create</Button>{/snippet}
	</PageHeader>

	<DashboardSection title="Directory">
		<Table data={rows}>...</Table>
	</DashboardSection>
</div>
```

`Card` = generic surface. `DashboardSection` = titled section with actions/footer.

### Page sidebar

`PageSidebar` reuses one sidebar snippet for desktop surface and mobile drawer. The trigger **must** sit inside `.lumi-page-sidebar__header-actions` (public composition contract). Desktop aside hides at `64rem`.

The mobile drawer portals to the document body, locks page scrolling, contains keyboard focus, closes with Escape and restores focus to its trigger. It shares modal ownership with `Dialog`, so closing a nested dialog returns focus to the drawer. Resizing above `64rem` releases modal resources. Shells, containers, navigation and modal surfaces respect `--lumi-safe-area-top/right/bottom/left`, defaulting to the device safe-area insets. For edge-to-edge iOS/iPadOS layouts, set `viewport-fit=cover` in the viewport meta tag so the browser exposes nonzero safe-area values.

```svelte
<PageHeader title="Records">
	{#snippet actions()}
		<div class="lumi-page-sidebar__header-actions">
			<Button
				variant="border"
				class="lumi-page-sidebar__mobile-trigger"
				onclick={() => (filtersOpen = true)}
			>
				Filters
			</Button>
		</div>
	{/snippet}
</PageHeader>

<div class="lumi-layout--two-columns lumi-page-sidebar-layout">
	<PageSidebar bind:mobileOpen={filtersOpen} mobileTitle="Filters">
		{#snippet sidebar()}...{/snippet}
	</PageSidebar>
	<section class="lumi-layout--content-right">...</section>
</div>
```

### Grids, flex, stack, containers

Always include `.lumi-grid`; a modifier alone does not set `display: grid`.

| Content behavior                      | Modifier                            |
| ------------------------------------- | ----------------------------------- |
| General responsive cards              | `--responsive`                      |
| Cards that should not stretch forever | `--cards`                           |
| Weighted identity/content columns     | `--identity-split`                  |
| Exact column count                    | `--columns-1` … `--columns-4`       |
| Exact columns on large screens only   | `--columns-2-lg` … `--columns-4-lg` |
| Full-row child                        | `.lumi-grid-item--span-all`         |

Tokenized gaps: `2xs`–`xxl`. Responsive collapse differs by family—see [grid contract](#grid-contract).

```svelte
<div
	class="lumi-flex lumi-flex--wrap lumi-align-items--center lumi-justify--between lumi-flex--gap-sm"
>
	...
</div>
<div class="lumi-stack lumi-stack--md">...</div>
<main class="lumi-container">...</main>
<main class="lumi-centered-layout">
	<Card class="lumi-centered-card lumi-centered-card--md">...</Card>
</main>
```

- **Flex** — direction, wrap, alignment, justification, gaps, item growth, mobile stacking.
- **Stack** — canonical vertical rhythm via `.lumi-stack` + `.lumi-stack--*`.
- **Container** — sizes `sm`–`2xl` always; `wide` / `ultrawide` only from `80rem` / `96rem`.

### Composition rules

- Prefer a canonical shell/grid/flex/stack before writing page CSS.
- Tokenize genuinely new application composition with `--lumi-*`.
- Keep overlays portaled and independent of page overflow.
- Do not nest full dashboard shells or duplicate `PageSidebar` drawer markup.
- Use the showcase for complete pages; recipes stay on contracts.

---

## 5. Core CSS reference

Family-level map of composition CSS. Shells and utilities: [`core.css`](../src/lib/styles/core.css). Product-composition patterns: [`patterns.css`](../src/lib/styles/patterns.css). Find the family here, then inspect the owning file for exact declarations.

### Import and scope

```ts
import '@lumi-ui/svelte/styles'; // tokens.base.css → core.css (base, layout, utilities)
import '@lumi-ui/svelte/styles/patterns.css'; // opt-in compositions
```

Direct subpaths exist when a build needs control; load tokens first. `patterns.css` is not part of the default entry. Importing `base.css` (or core) also applies global box-sizing, `html`/`body`/`#app`, selection, reduced-motion, and responsive heading rules.

Classes below are supported composition hooks. Other selectors style component internals—use component props, not those selectors. Braces `{…}` mean alternatives, not literal class names.

### Shells and layouts (CSS)

| Family             | Contract                                                                                                                                                                                                          |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard          | `.lumi-dashboard-layout`, `__content`, `.lumi-mobile-overlay`; sync `lumi-sidebar--is-collapsed` and `lumi-sidebar--mobile-open` with `Sidebar`                                                                   |
| Two column         | `.lumi-layout--two-columns` + `.lumi-layout--sidebar-left` + `.lumi-layout--content-right`; collapses at `64rem`                                                                                                  |
| Page sidebar hooks | `.lumi-page-sidebar-layout`, `__header-actions`, `__mobile-trigger`, `__section`, `__label`, `__radio-group`, `__radio-option`, `__radio-description`, `__bounded-list`; drawer internals belong to `PageSidebar` |
| Scroll well        | `.lumi-scroll-well` recessed internally scrolling surface; cap and background through `--lumi-scroll-well-max-height` / `--lumi-scroll-well-bg`                                                                   |
| Containers         | `.lumi-container` (+ `--sm`); `--ultrawide` from `96rem`                                                                                                                                                          |
| Centered task      | `.lumi-centered-layout`, `.lumi-centered-card`, `--{sm,md,lg,xl}`; combine with `Card`                                                                                                                            |
| Dashboard data     | `.lumi-dashboard-overview-grid` collapses at `68.75rem`; `.lumi-dashboard-analytics-grid` at `61.25rem`                                                                                                           |

### Grid contract

Always combine modifiers with `.lumi-grid`.

| Family                           | Behavior                                                                                             |
| -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `.lumi-grid--responsive`         | Auto-fit from `--lumi-grid-responsive-min`; one column at `48rem`                                    |
| `.lumi-grid--cards`              | Fluid auto-fill from `--lumi-dashboard-card-grid-min`; left-aligned; no forced one-column breakpoint |
| `.lumi-grid--identity-split`     | Weighted identity/content split; one column at `64rem`                                               |
| `.lumi-grid--columns-{1,2,3,4}`  | Exact count; `2–4` → auto-fit at `48rem`, one column at `30rem`                                      |
| `.lumi-grid--columns-{2,3,4}-lg` | Explicit columns from `64rem` up                                                                     |
| `.lumi-grid--gap-{sm,md,lg,xl}`  | Tokenized gap                                                                                        |
| `.lumi-grid-item--span-all`      | Span all columns                                                                                     |

Fluid families clamp their minimum track to the containing block, so a narrow nested grid cannot create page overflow. Use `--responsive` when items should fill the row and `--cards` for variable-length collections that should preserve card measure.

At exactly `64rem`, both max-width shell rules and min-width `*-lg` grid rules apply.

### Shared CSS patterns

Domain-neutral compositions in [`patterns.css`](../src/lib/styles/patterns.css) (not Svelte components; included by `@lumi-ui/svelte/styles`). Use documented BEM children; do not invent modifiers.

| Pattern                | Families and variants                                                                                                                                                                                                                                                                                                                                           |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surfaces and auth      | `.lumi-surface`, `.lumi-auth-mark`; apply `.lumi-card--ambient` and `.lumi-auth-card` via `Card class`. **Plain cards do not blur** (`backdrop-filter: none`); glass/translucent cards must set `--lumi-surface-blur-filter` (`.lumi-auth-card`, `.lumi-drive-toolbar-card` do). This is a minor CSS migration if you previously relied on every card blurring. |
| Shared control hooks   | Interactive roots re-declare accent-aware `--lumi-focus-outline` and form roots re-declare focus fill/shadow in core. Text fields opt into `.lumi-autofill` + `--lumi-control-autofill-bg`.                                                                                                                                                                     |
| Filter summary         | `.lumi-filter-summary` + `__copy`, `__eyebrow`, `__title`, `__subtitle`, `__title-row`, `__meta`, `__actions`; `--compact`, `--split`, `--centered`, semantic color variants                                                                                                                                                                                    |
| Section actions        | `.lumi-section-toolbar`, `.lumi-toolbar-field`, `.lumi-form-action-row`, `.lumi-inline-filters` (each has existing child/compact variants)                                                                                                                                                                                                                      |
| Ranked metrics         | `.lumi-metric-rank-list` / `.lumi-metric-rank-row`; list `--dense`, `--accent-secondary`, `--scroll-capped`                                                                                                                                                                                                                                                     |
| Identity and selection | `.lumi-person-cell`, `.lumi-selected-panel`, `.lumi-result-list`, `.lumi-placeholder-tile`                                                                                                                                                                                                                                                                      |
| Context panels         | `.lumi-search-panel` + BEM children                                                                                                                                                                                                                                                                                                                             |
| Collections            | `.lumi-item-row`, `.lumi-item-list`; interactive/active row variants                                                                                                                                                                                                                                                                                            |
| Summaries              | `.lumi-total-box`, `.lumi-scan-result`                                                                                                                                                                                                                                                                                                                          |
| Small helpers          | `.lumi-scrollbar`, `.lumi-list-item--stack-actions`                                                                                                                                                                                                                                                                                                             |
| Specialized hooks      | `.lumi-drive-toolbar-card` via `Card class`; `.lumi-drive-content`, `.lumi-drive-loading`, `.lumi-navbar-branch`, `.lumi-navbar-user-dropdown`, `.lumi-brand-logo-wordmark`                                                                                                                                                                                     |

Chart-tooltip support and base component selectors are component-owned even when styles live in core.

### Utility families

| Concern            | Classes                                                                                                                                                                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Flex               | `.lumi-flex`; `.lumi-flex--{column,mobile-column,wrap,nowrap,center,between}`; `.lumi-flex--gap-{2xs,xs,sm,md,lg,xl}`; `.lumi-flex-item--{auto,grow,shrink,no-shrink}`                                                                    |
| Align              | `.lumi-align-items--{start,center,end,stretch}`; `.lumi-justify--{start,center,between,end}`                                                                                                                                              |
| Grid               | `.lumi-grid--{responsive,cards,identity-split,columns-1…4,columns-2-lg…4-lg}`; `.lumi-grid--gap-{sm,md,lg,xl}`; `.lumi-grid-item--span-all`                                                                                               |
| Vertical rhythm    | `.lumi-stack` with `.lumi-stack--{2xs,xs,sm,md,lg,xl}`                                                                                                                                                                                    |
| Spacing            | `.lumi-padding--{none,2xs,xs,sm,md,lg,xl}`; `.lumi-padding-{x,y}--{2xs,xs,sm,md}`; `.lumi-margin--none`; `.lumi-margin-{top,bottom}--{2xs,xs,sm,md,lg}` (logical properties)                                                              |
| Size               | `.lumi-width--{full,tablet-full}`, `.lumi-min-width--0`, `.lumi-min-w--{sm,lg,xl}`, `.lumi-max-w--{sm,lg,4xl,prose,full}`, `.lumi-h--full`, `.lumi-min-h--screen`                                                                         |
| Text               | `.lumi-text--{xs,sm,lg,xl,2xl,4xl}`; `.lumi-text--{center,right}`; `.lumi-text--{muted,primary,secondary,success,warning,danger,info}`; `.lumi-font--{medium,semibold,bold}`; `.lumi-line-height--relaxed`; `.lumi-text-decoration--none` |
| Text overflow      | `.lumi-text-ellipsis`, `.lumi-text-break`, `.lumi-text-pre-line`, `.lumi-text-clamp--{2,3}`; `.lumi-sr-only` (base) hides visually but keeps text for assistive tech                                                                      |
| Presentation       | `.lumi-border`, `.lumi-border--{light,none}`; `.lumi-rounded--{md,lg,xl,full}`; `.lumi-shadow--sm`; `.lumi-bg--{transparent,surface,control,glass,primary}`; `.lumi-opacity--80`                                                          |
| Display / position | `.lumi-block`, `.lumi-hidden`, `.lumi-overflow-hidden`; `.lumi-position--{relative,absolute,bottom-right}`; `.lumi-z--dropdown`                                                                                                           |

The utility set is deliberately small: it covers the composition every product repeats. Anything else belongs in scoped CSS with `--lumi-*` tokens.

### Responsive effects

| Boundary                     | Core behavior                                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `max-width: 64rem`           | Dashboard → navbar/content; two-column and identity grids collapse; tablet-full width and mobile-column activate; PageSidebar desktop/drawer swap |
| `max-width: 48rem`           | Responsive grid → one column; columns `2–4` → auto-fit; public patterns stack; large padding/text/headings compact                                |
| `max-width: 30rem`           | Auto grids and columns `2–6` → one column; large stack gaps compact                                                                               |
| `min-width: 64rem`           | `columns-{2,3,4}-lg` activate                                                                                                                     |
| `min-width: 80rem` / `96rem` | Wide / ultrawide container caps                                                                                                                   |

### CSS compatibility

- Do not copy core or pattern declarations into app CSS; compose the public class or its `--lumi-*` token.
- Narrow search: `rg -n "lumi-filter-summary" src/lib/styles/patterns.css`.

---

## 6. Design language

Visual and interaction intent. Structural ownership: [§7 Library design](#7-library-design). Exact tokens: [`tokens.base.css`](../src/lib/styles/tokens.base.css).

### Calm glass

Lumi is a premium, minimal product shell—not a generic kit and not loud SaaS gradients. North star: _if you remove one more line of decoration and the UI still feels complete, you are closer to Lumi._

1. **Layered light, not heavy chrome.** Surfaces float over a softly tinted canvas; borders are thin and low-contrast.
2. **Elevation is quiet.** Shadows use the neutral ink key (`--lumi-color-shadow-key`) with contact + ambient layers; avoid pure-black blobs.
3. **Glass is restrained.** Blur and translucency appear on overlays, shells, and **opt-in** glass cards—never as a noisy texture soup. Plain cards stay crisp (`backdrop-filter: none` unless `--lumi-surface-blur-filter` is set).
4. **Disciplined gradients.** Card washes keep the `145deg` axis; the app canvas may layer one faint primary radial accent over its neutral gradient—subtle, not neon.
5. **Sheen is optional polish.** Top-edge inset highlights simulate liquid glass; keep opacity low.
6. **No arbitrary decoration.** No confetti backgrounds, no multi-colored borders, no bounce-heavy motion.

### Surface ladder

From recessed to floating:

```txt
inset → surface → card → elevated → raised / overlay / glass
```

- **Inset / control-fill** — text fields, checkbox/radio/switch peers, wells (recessed scroll areas use `.lumi-scroll-well`; binary active uses `--lumi-control-active-*`)
- **Switcher shell** — Tabs nav and SegmentedControl track: quiet glass mix + glass/strong border + `--lumi-control-shadow` (not control-fill)
- **Surface / card** — content panels
- **Elevated / raised** — sticky headers, highlighted panels; exclusive switcher **active pill** (surface-card gradient + quiet shadow)
- **Glass / floating** — dialogs, dropdowns, context menus, tooltips

Do not style Tabs and SegmentedControl as inset fields. Binary peers (checkbox/radio/switch) and exclusive switchers are different roles; keep one recipe per role.

Dashboard content background is intentionally translucent so cards stay visibly elevated above the shell. Do not solid-fill the main content until cards disappear into a flat slab.

### Contrast and semantics

- Text: full ink (`--lumi-color-text`) on surfaces; muted/light for secondary copy.
- Focus (shared contract):
  - **Field / peer visuals** (input shell, checkbox visual, switch track): `--lumi-control-focus-shadow` with `--lumi-control-accent` on the control root.
  - **Keyboard affordances** (icon buttons, list/menu items, tabs, close controls): `--lumi-focus-outline` + `--lumi-focus-outline-offset` (or a positive offset when the control is free-floating).
  - Set `--lumi-control-accent` from the semantic color; do not invent per-component focus rings.
  - **Accent-aware recipes are re-declared on interactive roots** (see `core.css`). `:root` may hold a primary-only fallback; never put `var(--lumi-control-accent)` in a `:root` outline/shadow recipe or every control inherits baked primary.
- Semantic states pair color with icon or text—never color alone.

Components must not invent `purple`, `teal`, or product names as colors. The public color API is `primary | secondary | success | warning | danger | info` ([§3](#3-theming-and-color-scheme)).

The default brand and status seeds share `--lumi-accent-lightness` and respect `--lumi-accent-chroma-max`. Warning keeps its amber lightness and paired dark foreground. Override the shared dials at the theme root to tune the family together, or override an individual seed to give one role its own identity.

### Geometry — space, type, radius, motion

| Concern        | Tokens                                                                                                                                                                                        | Rule                                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Spacing        | `--lumi-space-2xs` … `--lumi-space-6xl` (quarter-rem base)                                                                                                                                    | Compose from tokens; no magic numbers unless a `calc()` of tokens                                                        |
| Typography     | Inter + system stack; scale `xs`→`4xl`; weights normal→bold                                                                                                                                   | Root uses compact `sm`; body inherits it for dense product UI                                                            |
| Radius         | `--lumi-radius-control` (alias `--lumi-control-radius` still resolves), `--lumi-radius-option`, `--lumi-radius-panel`, `--lumi-radius-tooltip`, `--lumi-surface-radius`, `--lumi-radius-full` | Choose by semantic role; do not invent per component                                                                     |
| Motion         | `--lumi-duration-fast` … `--lumi-duration-slower`, `--lumi-duration-spin`, `--lumi-motion-scale`                                                                                              | Fast = micro; base = UI; slow = overlays; spin = continuous ~1s; reduced motion collapses the shared dial                |
| Control UI     | `--lumi-transition-control`, `--lumi-transition-interactive`                                                                                                                                  | Shared color/fill/border/shadow recipe; interactive adds the tokenized transform                                         |
| Easing         | `--lumi-easing-default`                                                                                                                                                                       | Primary smooth-decelerate curve                                                                                          |
| Press / lift   | `--lumi-interactive-press-scale`, `--lumi-interactive-hover-scale`, `--lumi-interactive-zoom-scale`, `--lumi-interactive-lift`                                                                | Subtle; never jump; flattened on touch (`hover: none`)                                                                   |
| Surface follow | `--lumi-surface-hover` (0 or 1)                                                                                                                                                               | An interactive surface sets 1 on hover or keyboard focus; nested tiles and glyphs move with it, never on their own hover |

Control heights share one ladder (`--lumi-control-height-xs` … `--lumi-control-height-xl`), but not every component exposes every step: **Input** uses `xs…xl`, **Button** `sm…xl`, **Select / Textarea / NumberInput** `sm…lg`, **Chip** `sm` (+ compact). Match the step the component actually supports. Coordinate Svelte transitions with the `--lumi-duration-*` tokens (150 / 220 / 300 ms); Lumi's own JS transitions collapse to zero under reduced motion.

### Interaction patterns

| Pattern     | Expectation                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------- |
| Hover       | Soft fill/border shift; optional 1px lift—never jump (switcher options: fill only, no lift)     |
| Focus       | Visible ring/outline from shared tokens; keyboard-first                                         |
| Disabled    | Reduced opacity (`--lumi-opacity-disabled`), no pointer events                                  |
| Loading     | Shared spinner recipe (18% accent track + solid arc, ~1s) or progress; block double-submit      |
| Selection   | Binary peers: control-active fill. Switchers: elevated active pill. Cards/lists: clear vs hover |
| Destructive | `danger` color; confirm in app logic, not red styling alone                                     |
| Overlays    | Portal + Floating UI; Escape closes unless `persistent`                                         |
| Autofill    | Text fields use `.lumi-autofill` + `--lumi-control-autofill-bg`                                 |

Dashboard chart tooltips portal to the page and remeasure when their content or viewport changes. Line series align by index against the first series; missing values break the curve. Smooth segments stay within adjacent values. Line and bar charts share one signed scale; donut slices stay nonnegative.

Line/area and bar axes measure at most seven evenly spaced label candidates with the actual SVG font. Full labels win over label count: narrow charts first show fewer labels, kept inside the plot, and only a label wider than half the plot ends in `…`, without splitting Unicode code points. `xLabelMaxLength` is an optional hard cap, not a default. Resizing restores labels when space returns; tooltips keep the full labels and all data points remain plotted. Series legends shorten a name only when it exceeds the chart width.

Value axes step on a 1-2-5 ladder no finer than their format prints, so every tick label is exact; thousands use compact notation. The gutter widens to the widest rendered value label instead of clipping it.

### Minimalism checklist

Before shipping a visual change:

1. Can this use an existing token instead of a new one?
2. Does this introduce a second way to do the same thing? (If yes, stop.)
3. Would both products want this by default?
4. Is the default quieter than the custom case?
5. Did you remove something unused while adding something new?

Good minimalism: fewer props, fewer CSS branches, shared sizes. Bad minimalism: removing a11y, contrast, or empty states.

---

## 7. Library design

Lumi is a semantic Svelte 5 system shared by unrelated products—not a business-component collection.

### Principles

1. **Semantic APIs over visual instructions.** Props express intent (`color`, `size`, `selected`, `disabled`, `loading`, `orientation`); tokens decide presentation.
2. **Domain neutrality.** Components understand interaction patterns, never students, inventory, sales, enrollment, products, or cashboxes. Apps map domain state into Lumi semantics.
3. **Tokens are the visual language.** Reusable color, spacing, geometry, shadow, layout sizing, z-index, and motion use `var(--lumi-...)`. Runtime calculations and media-query syntax are the narrow exceptions.
4. **Composition before configuration.** Combine small components, snippets, and CSS contracts before adding flags or wrappers.
5. **Brand and behavior are separate.** Brand seeds are CSS; user light/dark preference is an optional controller ([§3](#3-theming-and-color-scheme)).
6. **Optional by construction.** Cohesive optional behavior uses subpaths and explicit lifecycle; no provider or import-time global store.
7. **Accessibility is behavior.** Roles, names, keyboard models, focus, disabled/loading state, and cleanup must agree with the interaction.
8. **Calm hierarchy.** Neutral layered surfaces carry structure; semantic colors and motion communicate meaning without decoration becoming policy.

### Decision filter

Before adding code, in order:

1. Useful across unrelated products?
2. Does an existing component, CSS family, action, or utility already solve it?
3. Is the API semantic and domain-neutral?
4. Does it centralize meaningful behavior, accessibility, or visual ownership?
5. Can reusable presentation use existing tokens?
6. Works across light/dark, keyboard/pointer, mobile, SSR, and reduced motion where relevant?
7. Is the public API smaller and more stable than the detail it hides?

If (1) is no → keep it in the consumer. If reusable but not primitive → do not force into `components/`.

### Avoid

- Theme providers or runtime palette editors required by core
- Domain-named props, variants, classes, routes, or services
- Raw reusable palettes and one-off layout constants
- Component-internal selector patches from an application
- Overlays inside clipped parents or controls with mismatched roles
- Public helpers without a concrete consumer contract

### Source layers

```text
consumer application
  → public entry point
    → components / optional capability
      → relative actions, utils, types, config
        → browser platform + peer dependencies
```

```text
src/lib/
├── components/     public Svelte surface
├── color-scheme/   optional preference lifecycle
├── actions/        focused DOM behavior
├── utils/          shared internal and pure helpers
├── types/          cross-component public types
├── styles/         token graph + core and patterns CSS
├── drive.ts        Drive helper/type subpath
└── index.ts        root API
```

Internal imports stay relative. Library source never imports `$lib`, `$app`, consumer routes, application state, permissions, endpoints, or persistence.

Audit findings and measured tradeoffs: [2026-10-12 review](./REFACTOR_REVIEW.md).

### Public contract lookup

1. Root/subpath `index.ts` — is the symbol public?
2. Component `types.ts` — shared exported props/types
3. Component `.svelte` — local props, snippets, callbacks, behavior, a11y
4. CSS files — actual token and class behavior

`types.ts` is not exhaustive for every component; some snippets and older contracts stay local. New public components centralize reusable props in `types.ts` and export only supported types via `index.ts`.

### Component boundary

```text
components/Name/
├── Name.svelte
├── types.ts
└── index.ts
```

The root surface includes historical compositions (dashboard, Drive). Do not use that precedent for new configuration-heavy work under `components/`: reusable non-primitives → future `src/lib/patterns/`; domain workflow → consumer app. This future component layer is distinct from `src/lib/styles/patterns.css`.

### Ownership

| Lumi owns                                    | Consumer owns                                    |
| -------------------------------------------- | ------------------------------------------------ |
| Domain-neutral interaction and accessibility | Business rules, permissions, routes, persistence |
| Semantic component contracts                 | Domain-to-semantic mapping                       |
| Token graph and reusable CSS composition     | Brand seeds and product-specific pages           |
| Portal/floating mechanics                    | Product copy and localization                    |
| Optional generic color-scheme lifecycle      | Whether and where to expose a selector           |

An exported helper or class family is a compatibility promise. Prefer semantic props/factories over exposing implementation structure.

### CSS ownership

```text
tokens.base.css → core.css → patterns.css → consumer brand CSS → consumer page CSS
```

- Tokens: reusable visual values
- Core CSS ([§5](#5-core-css-reference)): global reset, shells, layouts, utilities
- Patterns CSS ([§5](#shared-css-patterns)): reusable domain-neutral compositions
- Component-local CSS: non-public selectors
- Consumer CSS: compose with public tokens; never patch component internals

### State and browser lifecycle

| State                      | Owner                                |
| -------------------------- | ------------------------------------ |
| Local interaction          | Component `$state` / `$derived`      |
| Bindable value             | `$bindable` contract                 |
| Component effect           | `$effect` with cleanup               |
| Optional global preference | Explicit factory/controller instance |
| Business state             | Consumer application                 |

Avoid import-time DOM mutation. Scope and clean up listeners, observers, timers, requests, and portals; cancel deferred close callbacks when reopening. Use `$props.id()` for SSR-stable DOM IDs.

`Select`, `Dropdown`, `Context`, and `Tooltip` share floating positioning; clipped overlays use `portal`. Each component owns its focus model, dismissal, keyboard navigation, and role. Menus contain menu items; mixed controls need a neutral popover pattern.

---

## 8. Release verification

```bash
pnpm install --ignore-scripts
pnpm run lint
pnpm run check
pnpm run test
pnpm run package
git diff --check
```

`pnpm run lint` runs **oxlint** on `src` (including `<script>` blocks inside `.svelte`) then **Prettier** check. Use `pnpm run format` to write Prettier; `pnpm run lint:fix` applies safe oxlint fixes. Type and Svelte diagnostics remain on `pnpm run check`. `pnpm run test` runs the Vitest + jsdom suite in `tests/` (behavior and regression contracts; add a test with every bug fix).

Before a release, also:

1. Re-measure the [Lightweight Contract](../README.md#lightweight-contract) budgets (fully minified production bundles, gzip 9) and `npm pack --dry-run`.
2. Dry-run the current codemod on each consumer (`node scripts/migrate-1.0.mjs <app>`), then `svelte-check` the migrated app against the packaged build.
3. Check overlays inside a Dialog, keyboard flows and light/dark mode in a browser; SSR output alone does not cover positioning.

For a locally linked consumer, package Lumi before checking that app. The [`lumi-web`](https://github.com/eliaschampi/lumi) showcase consumes the published package and needs no local link. Do not start a duplicate dev server for docs or type-only changes.
