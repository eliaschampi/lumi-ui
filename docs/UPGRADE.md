# Upgrade

Consumer migration for **0.1.5 → 1.0** and later. Use **pnpm** only. Source remains authoritative.

## 1.0.0 → 1.1.0

No code changes are required.

| Change                                                  | Note                                                                                                                                                                     |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **New:** `Button summary`                               | Renders the `<summary>` of a native `<details>`: a disclosure toggle without JavaScript that reads as pressed while open. Replace app-styled `<summary>` toggles with it |
| `--lumi-color-text-light` mixes 54% ink (was 48%)       | Tertiary ink (neutral status dots, slider range labels) reaches 3:1 on surfaces; it reads slightly darker                                                                |
| Body dot pattern and `--lumi-app-pattern-dot-*` removed | The layer was transparent by default and painted a full-viewport repeat for nothing; add your own background layer if you set those tokens                               |

## 0.6.0 → 1.0.0

First public major release. **Lighter by default** (simple components no longer ship the icon registry; global CSS is split and pruned), **bilingual** (English default, Spanish opt-in), and **one name per concept** across components. One runtime dependency was added: `esm-env` (already present in every Svelte app), which lets production builds drop development-only warnings.

From a Lumi checkout:

```bash
node scripts/migrate-1.0.mjs <app-dir>                  # report only
node scripts/migrate-1.0.mjs <app-dir> --write          # rewrite props, snippets, patterns import
node scripts/migrate-1.0.mjs <app-dir> --write --icons  # also turn icon="name" into Lucide imports
npx prettier --write <app-dir> && npx svelte-check      # then resolve every `manual:` line
```

### 1. App root (every app)

```svelte
<script lang="ts">
	import '@lumi-ui/svelte/styles';
	import '@lumi-ui/svelte/styles/patterns.css'; // only if you use pattern classes
	import { lumiEs, registerIcons, setLumiLocale } from '@lumi-ui/svelte';
	import { lumiDriveEs } from '@lumi-ui/svelte/drive'; // only if you render Drive
	import { lumiIcons } from '@lumi-ui/svelte/icons'; // only for string icon names

	registerIcons(lumiIcons);
	const messages = { ...lumiEs, ...lumiDriveEs };
	setLumiLocale({
		locale: 'es-PE',
		currency: 'PEN',
		timeZone: 'America/Lima',
		messages
	});
</script>
```

| Change                                                                                                                                                                                                                       | Why / migration                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| String icon names (`icon="search"`) render nothing until registered                                                                                                                                                          | The 103-icon registry cost ~9.7 KB gzip on every page with a Button. Pass components (`icon={SearchIcon}`, `--icons` does it) or `registerIcons(lumiIcons)` in the layout that needs it |
| `getAvailableIcons()`, root `IconName`                                                                                                                                                                                       | `Object.keys(lumiIcons)`, `LumiIconName` from `@lumi-ui/svelte/icons`                                                                                                                   |
| Built-in copy and formatting default to English, `en-US`, `USD`, runtime time zone                                                                                                                                           | `setLumiLocale(...)` as above; set `timeZone` so server and browser render identical date-times                                                                                         |
| `validateDriveName`, Drive labels and tags return English outside components                                                                                                                                                 | Pass `lumiDriveEs` (server code has no locale context)                                                                                                                                  |
| `@lumi-ui/svelte/styles` = tokens + core; `patterns.css` is opt-in                                                                                                                                                           | Import `@lumi-ui/svelte/styles/patterns.css` where you use filter summaries, toolbars, metric lists… (the codemod adds it)                                                              |
| `core.css` = `base.css` + `layout.css` + `utilities.css`, all in cascade layers                                                                                                                                              | Unlayered app CSS now wins without specificity hacks; lean public pages may load tokens + base (+ utilities)                                                                            |
| 122 unused global classes removed (`lumi-hero*`, `lumi-container--*`, most `lumi-max-w--*` steps, `lumi-opacity--*`, `lumi-bg--*`…)                                                                                          | None were used by Lumi, Coedula, Aeduca or Faztore; the codemod reports any remaining use                                                                                               |
| `LUMI_CONFIG`, `getIconSize`, `LumiTransition`, `LumiIconSize` removed                                                                                                                                                       | Use the `--lumi-*` tokens; size/color types remain                                                                                                                                      |
| Removed root types: `DividerPosition`, `NotificationType`, `TooltipPosition`, `DropdownPosition`, `DropdownTrigger`, `CollapseRadius`, `ErrorStateContent`, `ErrorStateVariant`, `ErrorStateHomeHref`, `TablePaginationData` | `DividerAlign`; `LumiColor` for Alert/Notification colors; `placement` unions from each component's `types.ts`; the rest have no replacement (the props were removed)                   |
| Removed tokens: `--lumi-color-text-inverse`, `--lumi-container-width-md`, `--lumi-centered-card-width-xl`, `--lumi-grid-auto-min`, `--lumi-max-width-{md,xl,5xl,6xl}`                                                        | Unused by Lumi and the three apps; component-private variables were renamed to `--lumi-<component>-*`                                                                                   |
| Drive `TAG_OPTIONS`, `DRIVE_MENU_OPTIONS`, `DRIVE_SCOPE_OPTIONS`, `DRIVE_SCOPE_SEGMENT_OPTIONS`                                                                                                                              | `getDriveTagOptions()`, `getDriveMenuOptions()`, `getDriveScopeOptions()`, `getDriveScopeSegmentOptions()`; `getFileIcon` returns components                                            |
| `--lumi-dashboard-content-bg` defaults to `transparent`                                                                                                                                                                      | Delete the override every app carried                                                                                                                                                   |
| `.lumi-toast-portal` wrapper + `Notification` loop + app toast store                                                                                                                                                         | `<Toaster toaster={toaster} />` with `const toaster = createToaster()`; the class is removed                                                                                            |
| `.lumi-context*` classes                                                                                                                                                                                                     | `.lumi-menu*` (shared by Dropdown and Context)                                                                                                                                          |

### 2. Callback props lose their hyphen (Svelte 5 convention)

`onrow-click` → `onrowclick`, `onrow-dblclick` → `onrowdblclick`, `onrow-contextmenu` → `onrowcontextmenu`, `onrow-select` → `onrowselect`, `onpage-change` → `onpagechange` (Table); `onaction-click` → `onactionclick` (Input); `ontoggle-sidebar` → `ontogglesidebar` (Navbar). Rewritten by the codemod.

### 3. Component changes

| Component              | 0.6                                                                                                                   | 1.0                                                                                                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button                 | visual `type="filled…"`, `button="submit"`, `radius`                                                                  | `variant`, native `type`; `radius` removed. **New:** `href` renders `<a>`, `pressed` → `aria-pressed`                                                                               |
| Input                  | `onicon-click`, `iconLabel`, `iconAfter`, `labelPlaceholder`, `validate()`/`blur()`/`select()`                        | removed (use `actionIcon` + `onactionclick`); `labelPlaceholder` → `placeholder`; only `focus()` remains. **New:** `clearable`                                                      |
| Select / RemoteSelect  | `autocomplete`; `valueKey`, `labelKey`, `disabledKey`, `serializeValue`, floating geometry props                      | `searchable`; others removed. RemoteSelect `minQueryLength`/`debounceMs`/`limit` are optional                                                                                       |
| NumberInput            | `min` defaulted to `0`                                                                                                | no implicit bound (codemod adds `min={0}`); `onchange` fires on committed edits and steps                                                                                           |
| Table                  | `showingLabel`, `ofLabel`, `loadingText`, `paginationSlot`, `TablePaginationData`                                     | removed: pagination is `Pagination` + locale `paginationRange`; loading shows skeleton rows                                                                                         |
| DateRangeFilter        | `hideApply`, `resetLabel`, `onreset`                                                                                  | omit `onapply` to hide the button; reset removed. Layout no longer needs `patterns.css`                                                                                             |
| TagOption, ListItem    | `active`                                                                                                              | `selected`                                                                                                                                                                          |
| SidebarItem            | `active`                                                                                                              | `current`                                                                                                                                                                           |
| Avatar                 | `text`, `icon`, `onerror`; relative `src` got a `/` prefix                                                            | `name`; icon as children; `src` used as given; `alt=""` marks it decorative                                                                                                         |
| AvatarGroup            | items `{ text, alt }`                                                                                                 | items `{ name, src }`; **new** `total` for server counts                                                                                                                            |
| UserInfo               | `name` + `lastName`, `photoUrl`, `avatarSize`, `avatarColor`, `actions` snippet, `<h3>`                               | one `name`, `src`, `size`, `color`, `trailing` snippet, **new** `href`; no heading element                                                                                          |
| Divider                | `text`, `position="left/right"`, `spaced`, `icon`, `onclick`, `DividerPosition`                                       | `label`, `align="start/end"`, `spacing`, **new** `orientation`, `variant`; `<hr>` when plain; `DividerAlign`                                                                        |
| List / ListItem        | `subtitle`, `clickable`, `avatar`, `titleSlot`, `subtitleSlot`, children as actions; `div role=list`                  | `description`, interactive via `href`/`onclick`, `leading`, `title`, `description`, `trailing` snippets; `<ul>`/`<li>`                                                              |
| ListHeader             | `color`, `children`                                                                                                   | inherits the List color; `actions`                                                                                                                                                  |
| Image                  | `srcSet`, `fetchPriority`, `isZoomed`, `removeWrapper`, `disableSkeleton`, `decoding`                                 | `srcset`, `fetchpriority`, `zoom`; others removed. **New:** `fit`, `ratio`; never hidden while loading                                                                              |
| Alert, Notification    | `type` (`error`), `NotificationType`; `onclose(event)`                                                                | `color` (`danger`); `onclose()` fires after the exit transition; Notification pauses on hover/focus                                                                                 |
| Tooltip, Dropdown      | `position`, `TooltipPosition`, `DropdownPosition`; Dropdown `trigger="hover\|click"`, geometry, `closeOnClickOutside` | `placement`; the trigger mode, geometry and outside-click props are removed (menus open on click)                                                                                   |
| Dropdown trigger       | `triggerContent` wrapped in `<div role="button">`, often holding a `Button`                                           | The trigger is a real `<button>` around `triggerContent`; for your own control use `{#snippet trigger(props)}<Button {...props}>…</Button>{/snippet}` (the codemod flags each case) |
| PageHeader             | title rendered as `<h3>`                                                                                              | `<h1>` by default; pass `level` to change it                                                                                                                                        |
| Card                   | `aria-pressed="false"` on every button card; `--card-image-height`                                                    | `aria-pressed` only with `selected`; `--lumi-card-image-height` (codemod rewrites)                                                                                                  |
| Context                | `closeOnClick`, `closeOnScroll`, `itemSelector`, geometry props                                                       | removed (always closes on select/scroll; items are `[role="menuitem"]`)                                                                                                             |
| Collapse               | `defaultOpen`, `onchange`, `radius`, `titleSnippet`                                                                   | `bind:open`, `ontoggle`; content stays in the DOM (`inert` when closed)                                                                                                             |
| Sidebar, Navbar        | `ariaLabel`; Navbar default title "Dashboard"                                                                         | `aria-label`; no default title                                                                                                                                                      |
| EmptyState, InfoItem   | `titleSlot`, `descriptionSlot`, `/assets/images/` prefix; `iconSlot`, `labelSlot`                                     | text props; image paths used as given                                                                                                                                               |
| Progress               | bindable `value`; `--progress-*` custom properties                                                                    | plain `value`; `--lumi-progress-*` (codemod rewrites)                                                                                                                               |
| FileUpload             | `clear()` instance method                                                                                             | Set `files = []` through `bind:files`                                                                                                                                               |
| StatusIndicator        | `status` accepted any string                                                                                          | Only `StatusIndicatorStatus` values; map app states before passing them                                                                                                             |
| Tabs                   | an unknown `value` left no tab focusable                                                                              | Falls back to the first enabled tab                                                                                                                                                 |
| NumberInput (behavior) | emptying the field committed `min` or `0`                                                                             | The field stays empty (bound value `null`), so `required` can fail                                                                                                                  |
| Select (behavior)      | `name` used a hidden input; `required` never blocked submission                                                       | A visually hidden proxy input validates `required`; a disabled Select is not submitted, like native controls                                                                        |
| Checkbox, Switch       | `aria-label` fell back to `label`                                                                                     | the visible label names the control                                                                                                                                                 |

### 4. New

`ToggleGroup` (multi-select toggles), `Skeleton`, `Message` + `MessageList` (chat rows and transcript), `Pagination` (buttons or crawlable `rel` links), `Toaster` + `createToaster()` (replaces app-local toast stores), `formatNumber`, `formatDate`, `getInitials`, `registerIcons`, `setLumiLocale`, `lumiEn`, `lumiEs`, CSS recipes `.lumi-skeleton`, `.lumi-spinner`, `.lumi-switcher`, `.lumi-sr-only`, `.lumi-text-clamp--3`.

### 5. What the codemod cannot fix

- Add `@lucide/svelte` to the app (`pnpm add @lucide/svelte`) when converting icons.
- App types that mirror Lumi's (e.g. a local Drive menu option with `icon: string`): use `DriveMenuOption`.
- App toast stores using `'error'`: map to `'danger'`, or replace the store with `createToaster()`.
- Content moved into a `trailing`/`actions` snippet no longer sees `{#if x}` narrowing of a prop or `$bindable`; use `x?.field` or a `{@const}`.
- Pages that render pattern classes outside the file that imports `@lumi-ui/svelte/styles` get the import added there; move it if your layouts split styles.

Review forms, tables, lists and dialogs in light/dark mode and with the keyboard after migrating.

## 0.5.0 → 0.6.0

Dependencies are unchanged. **Breaking:** form fields share one validation model, and unused tokens are removed. Every other change keeps its API.

**Fields.** `Input`, `Textarea`, `Select` and `NumberInput` accept `error?: FieldError` (`true` marks the field invalid; a message also shows it) and `hint?: string` (helper text that an error replaces). Labels mark `required` fields with a decorative `*` on every field, not only `Textarea`.

| Before (0.5.0)                                                                                              | After (0.6.0)                                         |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `<Input danger={Boolean(errors.x)} dangerText={errors.x}>`                                                  | `<Input error={errors.x}>`                            |
| `<Input descriptionText="…">`                                                                               | `<Input hint="…">`                                    |
| `<Select error={Boolean(errors.x)} errorMessage={errors.x}>`                                                | `<Select error={errors.x}>`                           |
| `Input` `success`, `warning`, `successText`, `warningText`, `valIconSuccess/Danger/Warning`, `iconNoBorder` | Removed (unused); invalid fields show the danger icon |
| `.lumi-select--error`, `.lumi-input-container--has-state`, `.lumi-textarea--error`                          | `--invalid` modifiers                                 |

From a Lumi checkout, `node scripts/migrate-0.6.mjs <app-dir>` reports these call sites and `--write` rewrites them; run `svelte-check` afterwards. Labels no longer repeat as `aria-label` when a visible label exists. Only a missing label falls back to the placeholder.

**Tokens removed** (no references in Lumi or its consumers): `--lumi-blur-lg`, `--lumi-color-primary-300/500/600`, `--lumi-dashboard-card-grid-max`, `--lumi-drive-scope-control-basis`, `--lumi-drive-scope-control-min-width`, `--lumi-drive-search-control-min-width`, `--lumi-drive-selection-dot-size`, `--lumi-easing-in`, `--lumi-sidebar-header-sheen`, `--lumi-sidebar-header-sheen-opacity`, `--lumi-transition-all`.

**Corrected behavior**

- Link and button `Card`s no longer replace their content with `title` as the accessible name; `StatCard` values and `QuickAccessCard` descriptions are announced again. Pass `aria-label` only for a deliberate override.
- `Checkbox` animates again: the check draws as a pen stroke and the indeterminate dash grows from its center. The previous transition never ran because the icon mounts already checked.
- Hover lifts no longer stick after a tap on touch screens; press feedback remains. Additive `--lumi-surface-hover` lets content follow its interactive surface: an `IconBadge` inside a link `Card` lifts and tilts its glyph on hover or keyboard focus.
- Icon tiles (`IconBadge`, `InfoItem`) draw their top sheen with the theme's elevation rim, so dark mode loses the bright edge and `IconBadge` its doubled rim.
- `Table` announces every control in Spanish like its visible defaults, mirrors row accents in RTL and drops an invalid `aria-label` on its pagination wrapper.
- Chart category labels and series legends keep their full text; the former 12-character default cut is gone, and `…` appears only when the measured space cannot hold a label. Pass `xLabelMaxLength` to restore a hard cap. Value axes use exact round ticks (no more `13`/`38` or repeated `2 M`), compact currency above one thousand (`S/ 1.5 M`) and a gutter sized to their widest label.

Migrate field props with the table above, then review forms, cards and charts in light/dark mode.

## 0.4.2 → 0.5.0

Public component props and exports remain compatible; dependencies are unchanged. Review these corrected behaviors when upgrading:

- `Table` normalizes page sizes, page numbers and totals to finite integers. Numeric and string row keys keep distinct identities. Rows with only a double-click action also support Enter/Space; editable controls keep their own keyboard events.
- Line and bar charts render finite zero values; bars support negative values on the shared signed scale. Charts fit narrow cards without shrinking their SVG typography and support arrows, Home, End and Escape while focused.
- `Dialog` and mobile `PageSidebar` share scroll locking, focus restoration and Escape ownership across concurrent overlays. Only the top modal is interactive. The drawer portals out of clipped containers; desktop resizing releases its modal resources.
- Grids constrain wide children, mobile tracks fit narrow containers, viewport helpers use dynamic height, and layouts respect device safe areas through four additive `--lumi-safe-area-*` tokens. Edge-to-edge iOS/iPadOS layouts need `viewport-fit=cover`. Closed mobile `Sidebar` links no longer receive focus.
- Selection and upload paths perform less repeated work; shared helpers and styling remove duplication. Existing design tokens and component classes remain available.

Check light/dark layouts and keyboard navigation in your app. Keep loading the library styles before consumer overrides; portaled drawers inherit styles from the document rather than their former ancestors.

## 0.4.1 → 0.4.2

No component props, events, public exports, or dependency requirements changed. No consumer migration is required.

- Destroying a closed `Dialog` no longer removes document keydown listeners or restores body scroll. The effect that acquired them releases them, so another open overlay keeps its scroll lock and keyboard handling.

## 0.4.0 → 0.4.1

No component props, events, public exports, or dependency requirements changed. No consumer migration is required.

- Line/area and bar axes fit at most seven label candidates to the actual SVG font and available width. Full labels remain in tooltips and all data points stay plotted.
- Charts share tooltip positioning and size observation, use instance-safe gradients, and avoid per-point hit targets and temporary slope arrays. Missing values break line segments; smooth curves stay within adjacent values.
- `NumberInput` handles fractional minima and scientific-notation steps, prevents increments beyond its maximum, and applies the same bounds to buttons and keyboard input.
- Tabs support Home/End and keep keyboard focus with selection. Controls share size, focus, motion, and logical border recipes; default theme seeds now honor the existing accent dials.

Review visual changes in light/dark mode if your application relies on Lumi defaults. The responsive axis fitting adds a small browser payload; see the measured [lightweight contract](../README.md#lightweight-contract).

## 0.3.0 → 0.4.0

- `PageSidebar` now stays pinned while its adjacent content grows on desktop; mobile drawer behavior is unchanged.
- `Tab.content` adds managed panels that remain mounted while inactive. Multi-step forms should move conditional panel bodies into these snippets so native `FormData` retains every field.
- `Checkbox` has a clearer token-driven accent surface while preserving the existing API and form semantics.
- Charts avoid redundant resize updates and intermediate sparse-label arrays; donut percentage formatting is shared across instances.
- **Breaking (API):** `Notification.position` and the exported `NotificationPosition` type are removed — placement is owned by the `.lumi-toast-portal` wrapper.
- **Breaking (classes):** Drive BEM classes are renamed `drive-*` → `lumi-drive-*` (e.g. `.drive-file-card` → `.lumi-drive-file-card`), matching the library namespace; `--drive-*` custom properties are unchanged.
- Charts share plot primitives (`.lumi-chart-empty/svg/grid/label/crosshair/hit` in `core.css`) instead of per-component copies.
- Focus rings across all affordances now use the canonical `--lumi-focus-outline-offset`; `Notification` follows the shared icon-tile recipe and animates its timeout bar from the inline start under RTL.
- `NumberInput` joins `Input`/`Select`/`Textarea` in the shared autofill override; `SegmentedControl` matches the `Tabs` control-height floor; `Collapse` slide timing comes from `LUMI_CONFIG.transitions`.

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

## 0.2.x → 0.3.x (soft-depth visual system)

No component props, events, BEM classes, exports, or TypeScript contracts changed.
This is a drop-in visual and CSS recipe update. Existing consumer styles continue to
override the same brand/status seed variables after the Lumi styles import.

**Theme seed changes** — default accent seeds are now gamut-safe and share a common
lightness plane. Consumers that rely on Lumi's default colors should perform a light
and dark visual QA pass. Custom seed overrides remain supported without migration:

```css
:root {
	--lumi-brand-primary: …;
	--lumi-brand-secondary: …;
	--lumi-status-success: …;
	--lumi-status-warning: …;
	--lumi-status-danger: …;
	--lumi-status-info: …;
}
```

**New semantic CSS recipes** — `--lumi-radius-control`, `--lumi-radius-option`,
`--lumi-radius-panel`, `--lumi-radius-tooltip`, `--lumi-radius-tile`,
`--lumi-shadow-inset`, `--lumi-focus-ring`, `--lumi-transition-interactive`, and
the elevation/motion tokens are additive token contract entries. Existing token
names remain available.

**Behavioral polish** — interactive motion uses shared lift/press/zoom values;
reduced motion is handled centrally; indeterminate progress uses compositor-friendly
transforms; and dropdowns no longer run a duplicate CSS transition alongside their
Svelte transition. Review custom overrides that depend on the old shadow geometry.

**Checklist**

1. Keep the existing styles import order and seed overrides.
2. Review cards, controls, dialogs, dropdowns, tabs, and progress in light and dark mode.
3. Keyboard-check focus rings and `prefers-reduced-motion` behavior.
4. Run `pnpm run check` and `pnpm run package` in the library workspace.
