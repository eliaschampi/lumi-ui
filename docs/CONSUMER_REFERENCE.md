# Lumi UI — Consumer Quick Reference

Compact layout & component usage for consumer web projects. Source `types.ts` / `.svelte` files are authoritative for exact props.

---

## 1. Setup

```bash
pnpm add @lumi-ui/svelte
```

### Entry points

| Import                                   | Provides                                                                    |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| `@lumi-ui/svelte`                        | All components, types, icon registry, portal, config, chart types, Drive UI |
| `@lumi-ui/svelte/styles`                 | Tokens → core → patterns (import once at root)                              |
| `@lumi-ui/svelte/styles/tokens.base.css` | Token contract only                                                         |
| `@lumi-ui/svelte/styles/core.css`        | Reset, shells, utilities (no implicit tokens)                               |
| `@lumi-ui/svelte/styles/patterns.css`    | Reusable composition patterns                                               |
| `@lumi-ui/svelte/color-scheme`           | Pre-paint script, controller, policy helpers, types                         |
| `@lumi-ui/svelte/drive`                  | Pure Drive helpers/types (not UI components)                                |

### Root layout

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '@lumi-ui/svelte/styles';
	import '../lumi-theme.css';
	const { children } = $props();
</script>

{@render children?.()}
```

### First page

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
			>Use components for behavior, utilities for composition.</Card
		>
	</div>
</div>
```

---

## 2. Theming

### Brand seeds (CSS data)

```css
/* lumi-theme.css — load AFTER @lumi-ui/svelte/styles */
:root {
	/* Most products override only these two */
	--lumi-brand-primary: #7c3aed;
	--lumi-brand-secondary: #0f766e;
}
```

### Status seeds

Defaults are OKLCH in [`tokens.base.css`](../src/lib/styles/tokens.base.css). Override only when the product needs a different semantic identity:

```css
:root {
	--lumi-status-success: oklch(54% 0.16 158);
	--lumi-status-warning: oklch(80% 0.17 80);
	--lumi-status-danger: oklch(56% 0.205 24);
	--lumi-status-info: oklch(52% 0.15 210);
}
```

Set the seed; Lumi derives accent, solid fill, paired foreground, soft `-bg`, and dark-mode accent. Never reassign derived `--lumi-color-*` tokens directly.

Every semantic role has one predictable family:

| Use                         | Token                            |
| --------------------------- | -------------------------------- |
| Border, focus, icon, marker | `--lumi-color-{role}`            |
| Filled background           | `--lumi-color-{role}-solid`      |
| Content on filled           | `--lumi-color-{role}-foreground` |
| Tinted background           | `--lumi-color-{role}-bg`         |

Choose brand and status seeds that pass with their semantic foreground. The default foreground is white except warning, which uses black.

### Migrating older color overrides

Remove direct assignments such as `--lumi-color-secondary`, `--lumi-color-secondary-solid`, or `--lumi-color-secondary-foreground`. Replace them with the owning brand/status seeds above, and keep the theme file after the Lumi import.

Check both themes before adopting:

- Filled text is at least 4.5:1 against every solid and gradient stop.
- Required icons, thumbs, checks, focus rings, and borders are at least 3:1.
- Hover/active states do not change to an unpaired background.
- Neutral `.lumi-bg--surface`, `--control`, `--background`, and `--glass` utilities restore neutral ink inside a solid ancestor.

`--lumi-color-canvas` and `--lumi-color-neutral` are the optional page/ink seeds. When overriding them, calibrate both `:root` and `[data-theme='dark']`; base backgrounds and Cards derive from the neutral surface ladder, while the app canvas may add restrained brand accents.

### Color-scheme controller (optional dark/light)

```ts
// $lib/color-scheme.svelte.ts
import {
	createColorScheme,
	type ColorSchemeOptions
} from '@lumi-ui/svelte/color-scheme';
export const colorSchemeOptions = {
	storageKey: 'app-scheme',
	defaultPreference: 'system'
} satisfies ColorSchemeOptions;
export const colorScheme = createColorScheme(colorSchemeOptions);
```

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { ColorSchemeScript } from '@lumi-ui/svelte/color-scheme';
	import { colorScheme, colorSchemeOptions } from '$lib/color-scheme.svelte';
	onMount(colorScheme.start);
</script>

<ColorSchemeScript {...colorSchemeOptions} />
```

| Member              | Meaning                               |
| ------------------- | ------------------------------------- |
| `preference`        | Stored: `system` \| `light` \| `dark` |
| `resolved`          | Applied: `light` \| `dark`            |
| `setPreference(v)`  | Persist, resolve, apply               |
| `cyclePreference()` | Advance through choices               |
| `start()`           | Sync; returns idempotent cleanup      |

**`/color-scheme` exports:** `createColorScheme` · `ColorSchemeScript` · `createColorSchemeBootScript` · `parseColorSchemePreference` · `resolveColorScheme` · constants (`COLOR_SCHEME_PREFERENCES`, `DEFAULT_COLOR_SCHEME_PREFERENCE`, `DEFAULT_COLOR_SCHEME_STORAGE_KEY`)

One controller per app. CSP: authorize the inline script hash or use `createColorSchemeBootScript` with nonces.

### Key tokens for custom CSS

```css
.my-section {
	gap: var(--lumi-space-md); /* spacing: 2xs…6xl */
	border-radius: var(
		--lumi-radius-xl
	); /* or --lumi-control-radius, --lumi-surface-radius */
	box-shadow: var(--lumi-shadow-md);
	color: var(
		--lumi-color-text
	); /* --lumi-color-text-muted, --lumi-color-text-light */
	background: var(--lumi-color-surface);
	border: 1px solid var(--lumi-color-border);
	/* Prefer shared recipes over raw duration pairs: */
	transition: var(--lumi-transition-control);
}

.my-control {
	--lumi-control-accent: var(--lumi-color-primary);
	min-height: var(--lumi-control-height-md); /* xs…xl */
	border-radius: var(--lumi-radius-control);
	box-shadow: var(--lumi-control-shadow);
	transition: var(--lumi-transition-control);
}

.my-control:focus-visible {
	outline: var(--lumi-focus-outline);
	outline-offset: var(--lumi-focus-outline-offset);
}

.my-field:focus-within {
	box-shadow: var(--lumi-control-focus-shadow);
}
```

---

## 3. Core Layout CSS

Import: `@lumi-ui/svelte/styles` = tokens → core → patterns. No Tailwind/Bootstrap.

### Structure chooser

| Need                         | Classes / Components                                               |
| ---------------------------- | ------------------------------------------------------------------ |
| App shell (sidebar + navbar) | `.lumi-dashboard-layout` + `Sidebar` + `Navbar`                    |
| Standard page                | `.lumi-stack` + `PageHeader` + `Card` / `DashboardSection`         |
| Filters beside content       | `.lumi-layout--two-columns` + `PageSidebar`                        |
| Fluid card grid              | `.lumi-grid .lumi-grid--responsive`                                |
| Dashboard cards              | `.lumi-grid .lumi-grid--cards`                                     |
| Fixed columns (desktop)      | `.lumi-grid .lumi-grid--columns-{2,3,4}-lg`                        |
| Identity/content split       | `.lumi-grid .lumi-grid--identity-split`                            |
| Auth / focused task          | `.lumi-centered-layout` + `.lumi-centered-card`                    |
| Bounded width                | `.lumi-container` (+ `--sm`)                                       |
| Dashboard analytics          | `.lumi-dashboard-overview-grid` / `.lumi-dashboard-analytics-grid` |

### Shells & layouts (CSS families)

| Family         | Contract                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dashboard      | `.lumi-dashboard-layout`, `__content`, `.lumi-mobile-overlay`; sync `lumi-sidebar--is-collapsed` / `lumi-sidebar--mobile-open` with `Sidebar`    |
| Two column     | `.lumi-layout--two-columns` + `.lumi-layout--sidebar-left` + `.lumi-layout--content-right`; collapses ≤ 64rem                                    |
| Page sidebar   | `.lumi-page-sidebar-layout`, `__header-actions`, `__mobile-trigger`, `__section`, `__label`, `__radio-group`, `__radio-option`, `__bounded-list` |
| Scroll well    | `.lumi-scroll-well` recessed scroll surface; `--lumi-scroll-well-max-height` / `--lumi-scroll-well-bg`                                           |
| Containers     | `.lumi-container` (+ `--sm`); `--ultrawide` ≥ 96rem                                                                                              |
| Centered task  | `.lumi-centered-layout` + `.lumi-centered-card--{sm,md,lg,xl}`; combine with `Card`                                                              |
| Dashboard data | `.lumi-dashboard-overview-grid` (≤ 68.75rem); `.lumi-dashboard-analytics-grid` (≤ 61.25rem)                                                      |

### Dashboard shell

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
	<Sidebar {collapsed} {mobileOpen}>
		<SidebarHeader title="App" />
		<SidebarItem href="/" current>Home</SidebarItem>
	</Sidebar>
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

### Standard page

```svelte
<div class="lumi-stack lumi-stack--lg">
	<PageHeader title="Records" subtitle="Current workspace">
		{#snippet actions()}<Button variant="filled">Create</Button>{/snippet}
	</PageHeader>
	<DashboardSection title="Directory">
		<Table data={rows} />
	</DashboardSection>
</div>
```

### Page sidebar (filters panel)

```svelte
<PageHeader title="Records">
	{#snippet actions()}
		<div class="lumi-page-sidebar__header-actions">
			<Button
				variant="border"
				class="lumi-page-sidebar__mobile-trigger"
				onclick={() => (filtersOpen = true)}>Filters</Button
			>
		</div>
	{/snippet}
</PageHeader>

<div class="lumi-layout--two-columns lumi-page-sidebar-layout">
	<PageSidebar bind:mobileOpen={filtersOpen} mobileTitle="Filters">
		{#snippet sidebar()}…{/snippet}
	</PageSidebar>
	<section class="lumi-layout--content-right">…</section>
</div>
```

### Grid

Always include `.lumi-grid`; modifiers alone don't set `display:grid`.

| Modifier                    | Behavior                                                                                |
| --------------------------- | --------------------------------------------------------------------------------------- |
| `--responsive`              | Auto-fit from `--lumi-grid-responsive-min`; 1 col ≤ 48rem                               |
| `--cards`                   | Fluid auto-fill from `--lumi-dashboard-card-grid-min`; left-aligned; no forced collapse |
| `--identity-split`          | Weighted identity/content split; 1 col ≤ 64rem                                          |
| `--columns-{1..4}`          | Exact count; 2–4 → auto-fit ≤ 48rem, 1 col ≤ 30rem                                      |
| `--columns-{2,3,4}-lg`      | Explicit columns only ≥ 64rem                                                           |
| `--gap-{sm,md,lg,xl}`       | Tokenized gap                                                                           |
| `.lumi-grid-item--span-all` | Child spans all columns                                                                 |

Fluid families clamp their minimum track to the containing block. Use `--responsive` for rows that should fill their width and `--cards` for variable-length card collections.

### Flex / Stack / Container

```html
<!-- Flex -->
<div
	class="lumi-flex lumi-flex--wrap lumi-align-items--center lumi-justify--between lumi-flex--gap-sm"
>
	…
</div>
<!-- Vertical rhythm -->
<div class="lumi-stack lumi-stack--md">…</div>
<!-- Bounded container -->
<main class="lumi-container">…</main>
<!-- Centered auth/task -->
<main class="lumi-centered-layout">
	<Card class="lumi-centered-card lumi-centered-card--md">…</Card>
</main>
```

### Utility families (complete)

| Concern                | Classes                                                                                                                                                                                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Flex**               | `.lumi-flex`; `.lumi-flex--{column,mobile-column,wrap,nowrap,center,between}`; `.lumi-flex--gap-{2xs,xs,sm,md,lg,xl}`; `.lumi-flex-item--{auto,grow,shrink,no-shrink}`                                                                    |
| **Align**              | `.lumi-align-items--{start,center,end,stretch}`; `.lumi-justify--{start,center,between,end}`                                                                                                                                              |
| **Grid**               | `.lumi-grid--{responsive,cards,identity-split,columns-1…4,columns-2-lg…4-lg}`; `.lumi-grid--gap-{sm,md,lg,xl}`; `.lumi-grid-item--span-all`                                                                                               |
| **Vertical rhythm**    | `.lumi-stack` with `.lumi-stack--{2xs,xs,sm,md,lg,xl}`                                                                                                                                                                                    |
| **Spacing**            | `.lumi-padding--{none,2xs,xs,sm,md,lg,xl}`; `.lumi-padding-{x,y}--{2xs,xs,sm,md}`; `.lumi-margin--none`; `.lumi-margin-{top,bottom}--{2xs,xs,sm,md,lg}` (logical properties)                                                              |
| **Size**               | `.lumi-width--{full,tablet-full}`, `.lumi-min-width--0`, `.lumi-min-w--{sm,lg,xl}`, `.lumi-max-w--{sm,lg,4xl,prose,full}`, `.lumi-h--full`, `.lumi-min-h--screen`                                                                         |
| **Text**               | `.lumi-text--{xs,sm,lg,xl,2xl,4xl}`; `.lumi-text--{center,right}`; `.lumi-text--{muted,primary,secondary,success,warning,danger,info}`; `.lumi-font--{medium,semibold,bold}`; `.lumi-line-height--relaxed`; `.lumi-text-decoration--none` |
| **Text overflow**      | `.lumi-text-ellipsis`, `.lumi-text-break`, `.lumi-text-pre-line`, `.lumi-text-clamp--{2,3}`; `.lumi-sr-only` (base) hides visually but keeps text for assistive tech                                                                      |
| **Presentation**       | `.lumi-border`, `.lumi-border--{light,none}`; `.lumi-rounded--{md,lg,xl,full}`; `.lumi-shadow--sm`; `.lumi-bg--{transparent,surface,control,glass,primary}`; `.lumi-opacity--80`                                                          |
| **Display / position** | `.lumi-block`, `.lumi-hidden`, `.lumi-overflow-hidden`; `.lumi-position--{relative,absolute,bottom-right}`; `.lumi-z--dropdown`                                                                                                           |

### Breakpoints

| Boundary        | Effect                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| ≤ 64rem         | Shell → navbar/content; two-column & identity grids collapse; tablet-full & mobile-column activate; PageSidebar → drawer |
| ≤ 48rem         | Responsive grid → 1 col; columns 2–4 → auto-fit; patterns stack; large padding/text compact                              |
| ≤ 30rem         | Auto grids & columns 2–6 → 1 col; large stack gaps compact                                                               |
| ≥ 64rem         | `columns-{2,3,4}-lg` activate                                                                                            |
| ≥ 80rem / 96rem | Wide / ultrawide container caps                                                                                          |

### Composition rules

- Prefer a canonical shell/grid/flex/stack before writing page CSS.
- Tokenize new application composition with `--lumi-*`.
- Keep overlays portaled and independent of page overflow.
- Don't nest full dashboard shells or duplicate `PageSidebar` drawer markup.
- Don't copy core/pattern declarations into app CSS; compose the public class or token.
- Don't target component-internal selectors from app CSS.

---

## 4. Component Usage

```ts
import {
	Button,
	Card,
	Input,
	PageHeader,
	Table,
	Dialog,
	Select
} from '@lumi-ui/svelte';
import type { ButtonProps, LumiColor, LumiSize } from '@lumi-ui/svelte';
```

### Semantic scales (shared)

- **color**: `'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'`
- **size**: per component (`Input` `xs`–`xl`; `Button` `sm`–`xl`; `Select`/`Textarea`/`NumberInput` `sm`–`lg`) — check `types.ts`
- **variant** (Button): `'filled' | 'border' | 'flat' | 'ghost' | 'gradient'`

### Choose between similar components

| Need                                                    | Choose                                                        |
| ------------------------------------------------------- | ------------------------------------------------------------- |
| Text / numeric / multiline input                        | `Input` / `NumberInput` / `Textarea`                          |
| One visible exclusive choice                            | `SegmentedControl`; `Radio` when each needs label/description |
| Several independent toggles or filters                  | `ToggleGroup`; one standalone toggle → `Button pressed`       |
| Longer or space-constrained choice                      | `Select`; `RemoteSelect` for server search                    |
| Submitted boolean vs immediate setting                  | `Checkbox` vs `Switch`                                        |
| Persistent vs transient feedback                        | `Alert` vs `Toaster` (+ `createToaster`)                      |
| Navigate vs act                                         | `Button href` vs `Button onclick`                             |
| Generic vs titled dashboard surface                     | `Card` vs `DashboardSection`                                  |
| Structured records vs short rows                        | `Table` vs `List` / `ListItem`; person rows → `UserInfo`      |
| Page through results                                    | `Pagination` (`href` for crawlable links)                     |
| Anchored / pointer / interruptive / explanatory overlay | `Dropdown` / `Context` / `Dialog` / `Tooltip`                 |
| No data / failure / pending                             | `EmptyState` / `ErrorState` / `Skeleton` or `Loading`         |
| Conversation                                            | `MessageList` of `Message` rows                               |

### Actions & Forms

| Component          | Key props                                                                                           | Notes                                |
| ------------------ | --------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `Button`           | `variant`, native `type`, `color`, `size`, `icon`, `href`, `pressed`, `disabled`, `loading`         | `href` → `<a>`; icon-only needs name |
| `Input`            | `bind:value`, `label`, `type`, `icon`, `actionIcon` + `onactionclick`, `clearable`, `error`, `hint` | Native input types incl. dates       |
| `NumberInput`      | `bind:value`, `min`, `max`, `step`, `label`, `error`, `hint`                                        | No implicit bounds                   |
| `Textarea`         | `bind:value`, `label`, `rows`, `maxlength`, `showCount`, `error`, `hint`                            | Grows with content where supported   |
| `Checkbox`         | `bind:checked`, `label`, `name`, `value`, `indeterminate`                                           | Form boolean                         |
| `Radio`            | `bind:group`, `value`, `name`, `label`, `description`, `busy`                                       | One in a named native group          |
| `Switch`           | `bind:checked`, `label`, `name`                                                                     | Immediate toggle                     |
| `Slider`           | `bind:value`, `min`, `max`, `step`, `showValue`, `showTooltip`                                      | Range selection                      |
| `Select`           | `bind:value`, `options`, `searchable`, `searchMode`, `clearable`, `loading`, `error`, `size`        | Client or server search              |
| `RemoteSelect`     | `bind:value`, `bind:selected`, `endpoint`, mappers; optional `minQueryLength`/`debounceMs`/`limit`  | Debounced, cancellable search        |
| `SegmentedControl` | `bind:value`, `options`, `fullWidth`, `orientation`, `iconOnly`, `clearable`                        | One exclusive choice                 |
| `ToggleGroup`      | `bind:value` (array), `options`, `size`, `orientation`, `fullWidth`                                 | Any number pressed                   |
| `FileUpload`       | `bind:files`, `accept`, `multiple`, `maxSize`, `validateFile`                                       | Queue + validation + removal         |
| `DateRangeFilter`  | `bind:fromValue`, `bind:toValue`, `compact`, `onapply`                                              | Apply button only with `onapply`     |
| `Fieldset`         | `legend`                                                                                            | Semantic grouping                    |
| `TagOption`        | `label`, `color`, `selected`, `onclick`                                                             | Compact tag choice                   |

### Surfaces & Feedback

| Component                     | Key props                                                                                                                | Notes                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| `Card`                        | `title`, `subtitle`, `spaced`, `href`, `onclick`, `selected`, `hoverable`, `image`; snippets `header`, `footer`, `media` | Generic / link / button card          |
| `DashboardSection`            | `title`, `subtitle`, `icon`; snippets `actions`, `footer`                                                                | Titled section                        |
| `Alert`                       | `color`, `title`, `closable`, `bind:active`, `onclose`                                                                   | Persistent inline message             |
| `Toaster` + `createToaster()` | `toaster`, `placement`; `toaster.show({ title, message, color, duration })`                                              | Transient, portaled, live region      |
| `Notification`                | `color`, `title`, `message`, `duration`                                                                                  | Rendered in place (Toaster uses it)   |
| `Chip`                        | `color`, `size`, `icon`, `closable`, `closeLabel`, `onclick`, `onclose`                                                  | Label / status / token                |
| `Collapse`                    | `title`, `bind:open`, `color`, `size`, `ontoggle`                                                                        | Content stays in the DOM, `inert`     |
| `Divider`                     | `label`, `align`, `orientation`, `variant`, `spacing`                                                                    | `<hr>` when plain                     |
| `EmptyState`                  | `title`, `description`, `icon`, `image`; snippet `actions`                                                               | No-content guidance                   |
| `ErrorState`                  | `status`, `message`, `homeHref`                                                                                          | HTTP error recovery page              |
| `Loading` / `Skeleton`        | `text`, `size` / `shape`, `width`, `height`, `lines`                                                                     | Unknown vs known layout while pending |
| `Progress`                    | `value`, `indeterminate`, `striped`, `animated`, `showLabel`                                                             | Determinate / indeterminate           |
| `Tooltip`                     | `text` or `content`, `placement`, `delay`                                                                                | Describes its focusable child         |

### Data & Dashboard

| Component                          | Key props                                                                                                               | Notes                                  |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `Table`                            | `data`, `rowKey`, `search`, `selectable`, `pagination`, `layout`, `loading`; snippets `thead`, `row`                    | Embeds `Pagination`; skeleton loading  |
| `Pagination`                       | `bind:page`, `pages`, `siblings`, `href`, `compact`, `onpagechange`                                                     | `href` → crawlable `rel` links         |
| `List` / `ListHeader` / `ListItem` | `color`, `size`, `maxHeight`; item `title`, `description`, `href`/`onclick`, `selected`; snippets `leading`, `trailing` | `<ul>`/`<li>`; stretched target        |
| `UserInfo`                         | `name`, `description`, `src`, `size`, `href`; snippet `trailing`                                                        | Person row for tables and lists        |
| `InfoItem`                         | `label`, `value`, `icon`, `layout`                                                                                      | Label/value metadata                   |
| `StatCard` / `QuickAccessCard`     | `title`, `value` / `description`, `icon`, `href`                                                                        | Metric / navigational card             |
| `DashboardChart`                   | `series`, `color`, `valueFormat`                                                                                        | Formats with the locale currency       |
| `DashboardBarChart`                | `data`, `color`, `valueFormat`                                                                                          | Single-series bars                     |
| `DashboardDonutChart`              | `data`, `centerLabel`, `centerValue`, `valueFormat`                                                                     | Ring + legend                          |
| `Message` / `MessageList`          | `align`, `variant`, `color`, `name`, `time`, `grouped`; list `busy`, `loading`, `onloadmore`                            | Chat rows; transcript pinned to latest |

### Navigation & Layout

| Component                                   | Key props / snippets                                                    | Notes                         |
| ------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------- |
| `Navbar`                                    | `title`, snippets `actions`, `user`; `ontogglesidebar`                  | Dashboard top bar             |
| `Sidebar` / `SidebarHeader` / `SidebarItem` | `collapsed`, `mobileOpen`, `aria-label`; item `href`, `icon`, `current` | Responsive primary nav        |
| `PageHeader`                                | `title`, `subtitle`, `icon`, `level` (default `1`); snippet `actions`   | Page identity + actions       |
| `PageSidebar`                               | `bind:mobileOpen`, `mobileTitle`; snippet `sidebar`                     | Desktop aside + mobile drawer |
| `Tabs`                                      | `tabs`, `bind:value`, `color`, `orientation`; `Tab.content` panels      | Managed panels stay mounted   |

### Overlays & Menus

| Component                   | Key props                                                                     | Notes                                       |
| --------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------- |
| `Dialog`                    | `bind:open`, `title`, `size`, `persistent`, `closeOnEscape`; snippet `footer` | Modal; focus-trapped; put actions in footer |
| `Dropdown` / `DropdownItem` | `bind:open`, `placement`, `size`; `triggerContent` or `trigger(props)`        | Spread `props` on your own trigger control  |
| `Context` / `ContextItem`   | programmatic open, `size`                                                     | Pointer/row context menu                    |

`Dropdown` and `Context` are menus — keep menu roles and keyboard behavior. Overlays opened inside a `Dialog` render inside it.

### Identity & Foundations

| Component         | Key props                                                                           |
| ----------------- | ----------------------------------------------------------------------------------- |
| `Avatar`          | `name`, `src`, `alt`, `size`, `color`; icon as children                             |
| `AvatarGroup`     | `items` (`{ name, src }`), `max`, `total`, `size`                                   |
| `AvatarPicker`    | `options`, `bind:value`, `name`                                                     |
| `Icon`            | `icon` (Lucide component or registered name), `size`, `color`                       |
| `IconBadge`       | `icon`, `color`, `size`                                                             |
| `StatusIndicator` | `status`, `pulse`, `tooltip`                                                        |
| `Image`           | `src`, `alt`, `width`, `height`, `ratio`, `fit`, `fetchpriority`, `srcset`, `sizes` |
| `Title`           | `title`, `subtitle`, `level`, `size`, `icon`, `color`                               |

### Drive workspace

| Component           | Use                      |
| ------------------- | ------------------------ |
| `DriveFileCard`     | File card display        |
| `DriveFileGrid`     | Grid view of files       |
| `DriveFileList`     | List view of files       |
| `DriveFilePreview`  | File preview panel       |
| `DriveFileUploader` | Upload dialog            |
| `DriveSidebar`      | Drive navigation sidebar |

Persistence/endpoints stay in the app. Pure helpers, types and `lumiDriveEs`: `import { ... } from '@lumi-ui/svelte/drive'`.

### Shared helpers & types

```ts
import {
	formatDate,
	formatNumber,
	getInitials,
	lumiEs,
	portal,
	registerIcons,
	setLumiLocale
} from '@lumi-ui/svelte';
import { lumiIcons } from '@lumi-ui/svelte/icons'; // only for string icon names
import type {
	IconComponent,
	IconSource,
	LumiColor,
	LumiChoiceOption,
	LumiLocaleOptions
} from '@lumi-ui/svelte';
```

| Export                                      | Use                                                                          |
| ------------------------------------------- | ---------------------------------------------------------------------------- |
| `setLumiLocale`, `lumiEs`, `lumiEn`         | Built-in copy + `Intl` locale, currency and time zone (root layout)          |
| `formatNumber`, `formatDate`, `getInitials` | Cached, pure helpers — replace app copies of currency/initials helpers       |
| `registerIcons`, `getIcon`, `hasIcon`       | Opt-in string icon registry (empty by default)                               |
| `portal`                                    | Svelte action: `use:portal` (open modal or body) or `use:portal={'#target'}` |

Prefer deep Lucide imports (`import Search from '@lucide/svelte/icons/search'`) on public pages; register `lumiIcons` only in layouts that render icon names from data.

---

## 5. Patterns CSS

Reusable domain-neutral compositions — opt-in: `import '@lumi-ui/svelte/styles/patterns.css'`. Apply via `class`; use documented BEM children — don't invent modifiers.

| Pattern              | Families & variants                                                                                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surfaces & auth      | `.lumi-surface`, `.lumi-auth-mark`; `.lumi-card--ambient` / `.lumi-auth-card` via `Card class`. Plain cards are crisp; translucent cards set `--lumi-surface-blur-filter`    |
| Filter summary       | `.lumi-filter-summary` + `__eyebrow`, `__title`, `__subtitle`, `__title-row`, `__meta`, `__actions`; `--compact`, `--centered`, color variants                               |
| Section actions      | `.lumi-section-toolbar`, `.lumi-toolbar-field`, `.lumi-form-action-row`, `.lumi-inline-filters` (+ child/compact variants)                                                   |
| Ranked metrics       | `.lumi-metric-rank-list` / `.lumi-metric-rank-row`; `--dense`, `--accent-secondary`, `--scroll-capped`                                                                       |
| Identity & selection | `.lumi-person-cell`, `.lumi-selected-panel`, `.lumi-result-list`, `.lumi-placeholder-tile`                                                                                   |
| Context panels       | `.lumi-search-panel` + BEM children                                                                                                                                          |
| Collections          | `.lumi-item-row`, `.lumi-item-list`; interactive/active row variants                                                                                                         |
| Summaries            | `.lumi-total-box`, `.lumi-scan-result`                                                                                                                                       |
| Small helpers        | `.lumi-scrollbar`, `.lumi-list-item--stack-actions`                                                                                                                          |
| Specialized          | `.lumi-drive-toolbar-card` (via `Card class`, includes blur opt-in), `.lumi-drive-content`, `.lumi-navbar-branch`, `.lumi-navbar-user-dropdown`, `.lumi-brand-logo-wordmark` |

---

## 6. Behavioral checks

- Read `.svelte` when snippets/callbacks matter; several are local, not in exported `*Props`.
- Built-in copy is English until `setLumiLocale` runs; explicit label props always win.
- String icon names render nothing until registered; pass components where possible.
- A clickable `Card` renders as a button and must not contain nested interactive controls.
- `ListItem` with `href`/`onclick` uses a stretched target, so `trailing` actions stay real siblings.
- Supply `Table.rowKey` when records lack stable `id` or `key`.
- Create one `createToaster()` per app in client code; call `show()` from handlers, render one `<Toaster>`.
- `MessageList` needs a height; pass `busy` while a reply streams and `loading` while history loads.
- Icon-only controls need an accessible name; decorative nested icons do not.
- `Dropdown`/`Context` are menus, not generic popovers — keep menu roles.
- One `ColorSchemeScript` + one controller instance per app.

---

## 7. Rules of thumb

0. Preserve the shared visual language: compose existing utilities and semantic surface/border tokens before adding application CSS.
1. Use `var(--lumi-*)` tokens for color, spacing, radius, shadow, motion — never raw values.
2. Compose with layout classes before writing custom CSS.
3. Components own behavior/a11y; CSS classes own page composition.
4. Overlays are portaled — don't place inside `overflow:hidden` parents.
5. Brand seeds are CSS; light/dark is an optional controller — keep them separate.
6. Don't target component selectors or redefine derived `--lumi-color-*` tokens.
7. Semantic APIs: `tone`, `color`, `size`, `variant`, `disabled`, `loading` — not visual instructions.
8. Domain-neutral: components never know about your business entities.
