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

| Import                                   | Source                                                      | Contract                                                                                                    |
| ---------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `@lumi-ui/svelte`                        | [`src/lib/index.ts`](../src/lib/index.ts)                   | Components, public shared types, icon registry, portal action, config, chart types, six Drive UI components |
| `@lumi-ui/svelte/styles`                 | [`styles/index.css`](../src/lib/styles/index.css)           | Tokens then reset, layouts, patterns, utilities                                                             |
| `@lumi-ui/svelte/styles/tokens.base.css` | [`tokens.base.css`](../src/lib/styles/tokens.base.css)      | Token contract without core                                                                                 |
| `@lumi-ui/svelte/styles/core.css`        | [`core.css`](../src/lib/styles/core.css)                    | Core without implicit tokens                                                                                |
| `@lumi-ui/svelte/color-scheme`           | [`color-scheme/index.ts`](../src/lib/color-scheme/index.ts) | Pre-paint script, controller, pure policy, types                                                            |
| `@lumi-ui/svelte/drive`                  | [`drive.ts`](../src/lib/drive.ts)                           | Pure Drive helpers and types (not the UI components)                                                        |

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

### Local package development

```bash
pnpm add @lumi-ui/svelte@link:../lumi-ui
cd ../lumi-ui && pnpm run package
```

Repackage after public export changes. Runnable integration: [`examples/dashboard`](../examples/dashboard).

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
		<Card title="Status">Use components for behavior and utilities for composition.</Card>
	</div>
</div>
```

Root exports components and public shared types. Choose primitives: [Components](./COMPONENTS.md). Compose pages: [§4 Layouts](#4-layouts-and-composition).

---

## 3. Theming and color scheme

Brand identity is CSS data. Light/dark/system preference is optional behavior from `@lumi-ui/svelte/color-scheme`.

### Brand seeds

| Seed                                | Role                                                     |
| ----------------------------------- | -------------------------------------------------------- |
| `--lumi-brand-primary`              | Primary actions, focus, active navigation                |
| `--lumi-brand-secondary`            | Supporting identity and controlled contrast              |
| `--lumi-brand-primary-dark`         | Optional calibrated primary in dark mode                 |
| `--lumi-brand-secondary-dark`       | Optional calibrated secondary in dark mode               |
| `--lumi-brand-primary-foreground`   | Optional foreground when auto contrast needs calibration |
| `--lumi-brand-secondary-foreground` | Optional secondary foreground calibration                |

Most products set only the first two. With advanced seeds, test foreground contrast and dark surfaces.

### Token ownership

[`tokens.base.css`](../src/lib/styles/tokens.base.css) flows brand/neutral seeds → semantic colors, surfaces, borders, shadows, geometry, layout sizing, motion, and dark overrides.

| Layer           | Owns                                                       |
| --------------- | ---------------------------------------------------------- |
| Consumer        | Brand seeds; may consume public `--lumi-*` semantic tokens |
| Components      | Semantic tokens only (not application palettes)            |
| `core.css`      | Shared composition ([§5](#5-core-css-reference))           |
| Application CSS | Product-specific page layout (tokenized)                   |

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
- Primary/secondary foregrounds pass contrast; light/dark surfaces stay distinguishable.
- System preference tracks the OS; preference persists without flash on SSR navigation/reload.
- Exactly one pre-paint script; selector a11y and localization are app-owned.

---

## 4. Layouts and composition

Recipes for shells and pages. Exhaustive class families and breakpoints: [§5](#5-core-css-reference). Declarations: [`core.css`](../src/lib/styles/core.css).

Components own behavior and accessibility. CSS classes own page composition—do not patch component-private selectors.

### Choose a structure

| Need                   | Start with                                                 |
| ---------------------- | ---------------------------------------------------------- |
| App navigation shell   | `.lumi-dashboard-layout` + `Sidebar` + `Navbar`            |
| Standard page rhythm   | `.lumi-stack` + `PageHeader` + `Card` / `DashboardSection` |
| Filters beside results | `.lumi-layout--two-columns` + `PageSidebar`                |
| Fluid cards            | `.lumi-grid .lumi-grid--responsive`                        |
| Capped dashboard cards | `.lumi-grid .lumi-grid--cards`                             |
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
	<Navbar ontoggle-sidebar={toggleSidebar} />
	<main class="lumi-dashboard-layout__content">{@render children?.()}</main>
	<button
		type="button"
		class="lumi-mobile-overlay lumi-border--none"
		aria-label="Close navigation"
		onclick={() => (mobileOpen = false)}
	></button>
</div>
```

At `64rem` and below, core switches the shell to navbar/content. `Sidebar` separately owns fixed mobile presentation at `1024px`—align viewport state with both. Full shell: [`examples/dashboard`](../examples/dashboard). Breakpoints: [§5 Responsive effects](#responsive-effects).

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

| Content behavior                       | Modifier                            |
| -------------------------------------- | ----------------------------------- |
| General responsive cards               | `--responsive`                      |
| Fluid tracks (empty collapse/preserve) | `--auto-fit` / `--auto-fill`        |
| Cards that should not stretch forever  | `--cards`                           |
| Weighted identity/content columns      | `--identity-split`                  |
| Exact column count                     | `--columns-1` … `--columns-6`       |
| Exact columns on large screens only    | `--columns-2-lg` … `--columns-4-lg` |
| Full-row child                         | `.lumi-grid-item--span-all`         |

Tokenized gaps: `2xs`–`xxl`. Responsive collapse differs by family—see [grid contract](#grid-contract).

```svelte
<div class="lumi-flex lumi-flex--wrap lumi-align-items--center lumi-justify--between lumi-flex--gap-sm">
	...
</div>
<div class="lumi-stack lumi-stack--md">...</div>
<main class="lumi-container lumi-container--lg">...</main>
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
- Use the example for complete pages; recipes stay on contracts.

---

## 5. Core CSS reference

Family-level map of composition CSS. Shells and utilities: [`core.css`](../src/lib/styles/core.css). Product-composition patterns: [`patterns.css`](../src/lib/styles/patterns.css). Find the family here, then inspect the owning file for exact declarations.

### Import and scope

```ts
import '@lumi-ui/svelte/styles'; // tokens.base.css → core.css → patterns.css
```

Direct subpaths exist when a build needs control; tokens must precede core. The default styles entry also includes patterns. Importing core also applies global box-sizing, `html`/`body`/`#app`, selection, reduced-motion, and responsive heading rules.

Classes below are supported composition hooks. Other selectors style component internals—use component props, not those selectors. Braces `{…}` mean alternatives, not literal class names.

### Shells and layouts (CSS)

| Family             | Contract                                                                                                                                                                                                          |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard          | `.lumi-dashboard-layout`, `__content`, `.lumi-mobile-overlay`; sync `lumi-sidebar--is-collapsed` and `lumi-sidebar--mobile-open` with `Sidebar`                                                                   |
| Two column         | `.lumi-layout--two-columns` + `.lumi-layout--sidebar-left` + `.lumi-layout--content-right`; collapses at `64rem`                                                                                                  |
| Page sidebar hooks | `.lumi-page-sidebar-layout`, `__header-actions`, `__mobile-trigger`, `__section`, `__label`, `__radio-group`, `__radio-option`, `__radio-description`, `__bounded-list`; drawer internals belong to `PageSidebar` |
| Containers         | `.lumi-container` + `--{sm,md,lg,xl,2xl}`; `--wide` from `80rem`, `--ultrawide` from `96rem`                                                                                                                      |
| Centered task      | `.lumi-centered-layout`, `.lumi-centered-card`, `--{sm,md,lg,xl}`; combine with `Card`                                                                                                                            |
| Hero               | `.lumi-hero`, `__title`, `__subtitle`                                                                                                                                                                             |
| Dashboard data     | `.lumi-dashboard-overview-grid` collapses at `68.75rem`; `.lumi-dashboard-analytics-grid` at `61.25rem`                                                                                                           |

### Grid contract

Always combine modifiers with `.lumi-grid`.

| Family                                     | Behavior                                                                    |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| `.lumi-grid--responsive`                   | Auto-fit from `--lumi-grid-responsive-min`; one column at `48rem`           |
| `.lumi-grid--auto-{fit,fill}`              | Fluid tracks from `--lumi-grid-auto-min`; one column at `30rem`             |
| `.lumi-grid--cards`                        | Centered, capped card tracks; not forced to one column by a breakpoint      |
| `.lumi-grid--identity-split`               | Weighted identity/content split; one column at `64rem`                      |
| `.lumi-grid--columns-{1,2,3,4,5,6}`        | Exact count; `2–4` → auto-fit at `48rem`; all `2–6` → one column at `30rem` |
| `.lumi-grid--columns-{2,3,4}-lg`           | Explicit columns from `64rem` up                                            |
| `.lumi-grid--gap-{2xs,xs,sm,md,lg,xl,xxl}` | Tokenized gap                                                               |
| `.lumi-grid-item--span-all`                | Span all columns                                                            |

At exactly `64rem`, both max-width shell rules and min-width `*-lg` grid rules apply.

### Shared CSS patterns

Domain-neutral compositions in [`patterns.css`](../src/lib/styles/patterns.css) (not Svelte components; included by `@lumi-ui/svelte/styles`). Use documented BEM children; do not invent modifiers.

| Pattern                | Families and variants                                                                                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surfaces and auth      | `.lumi-surface`, `.lumi-auth-mark`; apply `.lumi-card--ambient` and `.lumi-auth-card` via `Card class`                                                                      |
| Filter summary         | `.lumi-filter-summary` + `__eyebrow`, `__title`, `__subtitle`, `__title-row`, `__meta`, `__actions`; `--compact`, `--centered`, semantic color variants                     |
| Section actions        | `.lumi-section-toolbar`, `.lumi-toolbar-field`, `.lumi-form-action-row`, `.lumi-inline-filters` (each has existing child/compact variants)                                  |
| Ranked metrics         | `.lumi-metric-rank-list` / `.lumi-metric-rank-row`; list `--dense`, `--accent-secondary`, `--scroll-capped`                                                                 |
| Identity and selection | `.lumi-person-cell`, `.lumi-selected-panel`, `.lumi-result-list`, `.lumi-result-option`, `.lumi-placeholder-tile`                                                           |
| Context panels         | `.lumi-hero-panel`, `.lumi-search-panel` + BEM children                                                                                                                     |
| Collections            | `.lumi-history-list`/`item`, `.lumi-item-row`, `.lumi-item-list`; interactive/active row variants                                                                           |
| Summaries              | `.lumi-total-box`, `.lumi-scan-result`                                                                                                                                      |
| Small helpers          | `.lumi-cluster--pull-next-up`, `.lumi-container-responsive`, `.lumi-scrollbar`, `.lumi-list-item--stack-actions`                                                            |
| Toast stack            | `.lumi-toast-portal` — consumer-owned fixed wrapper for `Notification` children                                                                                             |
| Specialized hooks      | `.lumi-drive-toolbar-card` via `Card class`; `.lumi-drive-content`, `.lumi-drive-loading`, `.lumi-navbar-branch`, `.lumi-navbar-user-dropdown`, `.lumi-brand-logo-wordmark` |

Chart-tooltip support and base component selectors are component-owned even when styles live in core.

### Utility families

| Concern            | Forms                                                                                                                                                                                                                                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Flex               | `.lumi-flex`; `.lumi-flex--{column,row,row-reverse,column-reverse,wrap,nowrap,center,start,end,between,around,evenly,mobile-column}`; `.lumi-flex--gap-{2xs,xs,sm,md,lg,xl,xxl,3xl}`; `.lumi-align-items--{start,center,end,stretch}`; `.lumi-justify--{start,center,between,end}`; `.lumi-flex-item`, `.lumi-flex-item--{auto,grow,shrink,no-shrink}` |
| Vertical rhythm    | `.lumi-stack` with `.lumi-stack--{2xs,xs,sm,md,lg,xl,xxl}`                                                                                                                                                                                                                                                                                             |
| Width              | `.lumi-width--{full,auto,fit}`, `.lumi-min-width--0`, `.lumi-min-w--{sm,md,lg,xl}`, `.lumi-max-w--{xs,sm,md,lg,xl,2xl,3xl,4xl,5xl,6xl,prose,full}`, `.lumi-width--tablet-full`                                                                                                                                                                         |
| Height             | `.lumi-h--{full,screen}`, `.lumi-min-h--{full,screen}`                                                                                                                                                                                                                                                                                                 |
| Padding            | `.lumi-padding--{none,2xs,xs,sm,md,lg,xl,xxl,3xl}`; `.lumi-padding-{x,y}--{2xs,xs,sm,md,lg}`                                                                                                                                                                                                                                                           |
| Margin             | `.lumi-margin--{none,2xs,xs,sm,md,lg,xl,xxl}`; `.lumi-margin-{top,bottom}--{2xs,xs,sm,md,lg}`; `.lumi-mr-auto`, `.lumi-ml-auto`                                                                                                                                                                                                                        |
| Text               | `.lumi-text--{center,left,right,xs,sm,lg,xl,2xl,3xl,4xl,muted,light,primary,secondary,success,warning,danger,info}`; `.lumi-font--{medium,semibold,bold}`; `.lumi-line-height--relaxed`, `.lumi-text-decoration--none`, `.lumi-text-ellipsis`, `.lumi-text-break`, `.lumi-text-pre-line`, `.lumi-text-clamp--2`                                        |
| Presentation       | `.lumi-border`, `.lumi-border--{light,strong,none}`; `.lumi-rounded--{none,sm,base,md,lg,xl,full}`; `.lumi-shadow--{none,sm,md,lg,xl}`; `.lumi-bg--{transparent,primary,secondary,success,warning,danger,info,surface,control,background,glass}`; `.lumi-opacity--{10,20,30,40,50,60,70,80,90}`                                                        |
| Display / behavior | `.lumi-block`, `.lumi-inline-block`, `.lumi-hidden`; `.lumi-position--{relative,absolute,bottom-right}`; `.lumi-z--{dropdown,modal,tooltip,max}`; `.lumi-pointer`; `.lumi-overflow-{hidden,auto,x-auto,y-auto}`; `.lumi-container-responsive`; `.lumi-animate-{spin,pulse,fade-in,slide-up}`                                                           |
| Mobile visibility  | `.lumi-hidden-mobile` and `.lumi-visible-mobile` act only at `48rem` and below                                                                                                                                                                                                                                                                         |

Mobile-only content: combine `.lumi-hidden` with `.lumi-visible-mobile`.

### Responsive effects

| Boundary                     | Core behavior                                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `max-width: 64rem`           | Dashboard → navbar/content; two-column and identity grids collapse; tablet-full width and mobile-column activate; PageSidebar desktop/drawer swap |
| `max-width: 48rem`           | Responsive grid → one column; columns `2–4` → auto-fit; public patterns stack; visibility helpers; large padding/text/headings compact            |
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
2. **Elevation is quiet.** Shadows use the neutral ink key (`--lumi-shadow-key-rgb`) with contact + ambient layers; avoid pure-black blobs.
3. **Glass is restrained.** Blur and translucency appear on overlays, sidebars, and cards—never as a noisy texture soup.
4. **145° gradients.** Card and app washes tilt consistently (`145deg`) with tiny primary/info tints—subtle, not neon.
5. **Sheen is optional polish.** Top-edge inset highlights simulate liquid glass; keep opacity low.
6. **No arbitrary decoration.** No confetti backgrounds, no multi-colored borders, no bounce-heavy motion.

### Surface ladder

From recessed to floating:

```txt
inset → surface → card → elevated → raised / overlay / glass
```

- **Inset / control-fill** — fields, wells, segmented tracks
- **Surface / card** — content panels
- **Elevated / raised** — sticky headers, highlighted panels
- **Glass / floating** — dialogs, dropdowns, context menus, tooltips

Dashboard content background is intentionally translucent so cards stay visibly elevated above the shell. Do not solid-fill the main content until cards disappear into a flat slab.

### Contrast and semantics

- Text: full ink (`--lumi-color-text`) on surfaces; muted/light for secondary copy.
- Focus: tokenized control ring (`--lumi-control-focus-shadow`).
- Semantic states pair color with icon or text—never color alone.

Components must not invent `purple`, `teal`, or product names as colors. The public color API is `primary | secondary | success | warning | danger | info` ([§3](#3-theming-and-color-scheme)).

### Geometry — space, type, radius, motion

| Concern      | Tokens                                                                                                     | Rule                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Spacing      | `--lumi-space-2xs` … `--lumi-space-6xl` (4px base)                                                         | Compose from tokens; no magic numbers unless a `calc()` of tokens                        |
| Typography   | Inter + system stack; scale `xs`→`4xl`; weights normal→bold                                                | Prefer medium/semibold for UI chrome; base app size is compact `sm` for dense product UI |
| Radius       | `--lumi-control-radius` (controls), `--lumi-surface-radius` (large surfaces), `--lumi-radius-full` (pills) | One radius per role; do not invent per component                                         |
| Motion       | `--lumi-duration-fast` (150ms), `--lumi-duration-base` (220ms), `--lumi-duration-slow` / `slower`          | Fast = micro (hover, color); base = default UI; slow/slower = overlay enter/exit only    |
| Easing       | `--lumi-easing-default`                                                                                    | Primary smooth-decelerate curve                                                          |
| Press / lift | `--lumi-interactive-press-scale`, `--lumi-interactive-lift`                                                | Subtle; never jump                                                                       |

Align form controls to `--lumi-control-height-sm|md|lg|xl` so buttons, inputs, selects, and segmented controls feel like one family at each size. Match JS transition durations to `LUMI_CONFIG.transitions` when coordinating Svelte transitions.

### Interaction patterns

| Pattern     | Expectation                                                    |
| ----------- | -------------------------------------------------------------- |
| Hover       | Soft fill/border shift; optional 1px lift—never jump           |
| Focus       | Visible ring from tokens; keyboard-first                       |
| Disabled    | Reduced opacity (`--lumi-opacity-disabled`), no pointer events |
| Loading     | Spinner or progress; block double-submit                       |
| Selection   | Primary-tinted border/bg; clear selected vs hover              |
| Destructive | `danger` color; confirm in app logic, not red styling alone    |
| Overlays    | Portal + Floating UI; Escape closes unless `persistent`        |

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
├── styles/         token graph + core CSS
├── drive.ts        Drive helper/type subpath
└── index.ts        root API
```

Internal imports stay relative. Library source never imports `$lib`, `$app`, consumer routes, application state, permissions, endpoints, or persistence.

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

The root surface includes historical compositions (dashboard, Drive). Do not use that precedent for new configuration-heavy work under `components/`: reusable non-primitives → future `patterns/`; domain workflow → consumer app.

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
tokens.base.css → core.css → consumer brand CSS → consumer page CSS
```

- Tokens: reusable visual values
- Core CSS ([§5](#5-core-css-reference)): global reset, shells, patterns, utilities
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

Avoid import-time DOM mutation. Listeners, observers, timers, requests, and portals must be scoped and cleaned up.

`Select`, `Dropdown`, `Context`, and `Tooltip` share floating positioning; clipped overlays use `portal`. Each component owns its focus model, dismissal, keyboard navigation, and role. Menus contain menu items; mixed controls need a neutral popover pattern.

---

## 8. Release verification

```bash
pnpm install --ignore-scripts
pnpm run lint
pnpm run check
pnpm run package
git diff --check
```

For a locally linked consumer, package Lumi before checking that app. Do not start a duplicate dev server for docs or type-only changes.
