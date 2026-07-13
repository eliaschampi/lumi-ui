# Component Authoring Guide

How to add or change Lumi UI components so the library stays **beautiful, minimal, consistent, and professional**.

Read with: [GUIDE.md](./GUIDE.md) · [COMPONENTS.md](./COMPONENTS.md) · root [AGENTS.md](../AGENTS.md)

---

## 1. Before You Build

Run the [decision filter in GUIDE §7](./GUIDE.md#7-library-design) first: useful across products, already covered, semantic and domain-neutral, centralizes behavior, tokenizable, works across modes, smaller API than the detail it hides.

Then, for authoring specifically:

- Compose `Button`, `Icon`, `Card`, `Input`, etc. before adding a new primitive.
- Reusable but not primitive → do not force into `components/`; promote to `patterns/` only when proven in both products.
- If you cannot name every prop without product vocabulary, redesign the API.

---

## 2. Directory Skeleton

```txt
src/lib/components/MyComponent/
  MyComponent.svelte   # implementation + scoped styles
  types.ts             # public props & related types
  index.ts             # re-exports
```

Then wire the public API in `src/lib/index.ts` (component + types).

### `index.ts` template

```ts
export { default as MyComponent } from './MyComponent.svelte';
export type { MyComponentProps } from './types';
```

### `types.ts` template

```ts
import type { LumiColor, LumiControlSize } from '../config';

export interface MyComponentProps {
	/** Semantic color */
	color?: LumiColor;
	/** Size on the shared scale */
	size?: LumiControlSize;
	/** Visual style of this component */
	variant?: 'default' | 'soft' | 'outline';
	disabled?: boolean;
	loading?: boolean;
	/** Accessible name when needed */
	'aria-label'?: string;
	class?: string;
}
```

Use size aliases from `config.ts` intentionally:

| Alias              | Typical use                  |
| ------------------ | ---------------------------- |
| `LumiSize`         | Full ladder                  |
| `LumiCompactSize`  | `sm` \| `md` (chips)         |
| `LumiControlSize`  | `sm` \| `md` \| `lg` (forms) |
| `LumiDisplaySize`  | `sm`…`xl` (buttons)          |
| `LumiExtendedSize` | `xs`…`xl` (inputs)           |

---

## 3. Svelte 5 Implementation Pattern

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MyComponentProps } from './types';
	import { LUMI_CONFIG } from '../config';

	interface Props extends MyComponentProps {
		children?: Snippet;
	}

	let {
		color = LUMI_CONFIG.defaults.color,
		size = LUMI_CONFIG.defaults.size,
		variant = 'default',
		disabled = false,
		loading = false,
		'aria-label': ariaLabel = '',
		class: className = '',
		children
	}: Props = $props();

	const classes = $derived(
		[
			'lumi-my-component',
			`lumi-my-component--${variant}`,
			`lumi-my-component--${size}`,
			disabled && 'lumi-my-component--disabled',
			loading && 'lumi-my-component--loading',
			className
		]
			.filter(Boolean)
			.join(' ')
	);

	const styleVars = $derived(
		`--lumi-my-accent: var(--lumi-color-${color}); --lumi-my-accent-rgb: var(--lumi-color-${color}-rgb);`
	);
</script>

<div class={classes} style={styleVars} aria-label={ariaLabel || undefined} aria-disabled={disabled || undefined}>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.lumi-my-component {
		/* tokens only */
		border-radius: var(--lumi-control-radius);
		transition: var(--lumi-transition-colors);
	}
</style>
```

### Rules of thumb

| Do                                                   | Don't                                       |
| ---------------------------------------------------- | ------------------------------------------- |
| `$props()`, `$state`, `$derived`, `$bindable`        | Svelte 4 `export let` / stores for new code |
| Relative imports (`../Icon`, `../../actions/portal`) | `$lib`, `$app`                              |
| BEM `lumi-*` classes                                 | Global unscoped class soup                  |
| `class: className` rename                            | Clash with JS reserved `class`              |
| Snippets for slots                                   | Legacy `$$slots`                            |
| Token CSS variables                                  | Hardcoded `px` colors / one-off fonts       |

---

## 4. Prop Naming Contract

### Preferred semantic props

```ts
color?: LumiColor;
size?: ...;
variant?: string;      // visual style
orientation?: 'horizontal' | 'vertical';
clearable?: boolean;
selected?: boolean;
disabled?: boolean;
loading?: boolean;
open?: boolean;        // bindable for overlays
value?: ...;           // bindable for inputs
placeholder?: string;
label?: string;
'aria-label'?: string;
class?: string;
```

### Events

Use Svelte 5 callback props:

```ts
onclick?: (event: MouseEvent) => void;
onclose?: () => void;
oninput?: (event: Event) => void;
```

### Visual style vs native type

| Need                            | Prop                                     |
| ------------------------------- | ---------------------------------------- |
| filled / outline / ghost        | `variant`                                |
| HTML button type                | `type?: 'button' \| 'submit' \| 'reset'` |
| HTML input type                 | `type?: 'text' \| 'email' \| ...`        |
| Semantic status for Alert/Toast | Prefer `color` over `type`               |

**Do not copy** historical `Button` (`type` = visual, `button` = HTML). Migrate toward this contract when touching those components.

---

## 5. CSS Authoring

### BEM

```css
.lumi-card {
}
.lumi-card--selected {
}
.lumi-card__title {
}
.lumi-card__body {
}
```

### Tokens only

```css
/* good */
background: var(--lumi-gradient-card);
box-shadow: var(--lumi-shadow-md);
padding: var(--lumi-space-md);
color: var(--lumi-color-text);

/* bad */
background: #f3f7fc;
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
padding: 13px;
color: #0b1220;
```

### Dynamic color via CSS variables

Prefer setting accent vars from the semantic `color` prop (see Button `styleVars` pattern) instead of generating huge modifier matrices for every color.

### Motion

```css
transition:
	background-color var(--lumi-duration-base) var(--lumi-easing-default),
	box-shadow var(--lumi-duration-base) var(--lumi-easing-default),
	transform var(--lumi-duration-fast) var(--lumi-easing-default);
```

### Responsive

Prefer layout tokens (`--lumi-layout-*`, breakpoints already used in `core.css`) over ad-hoc media queries that redefine the design system.

---

## 6. Accessibility Checklist

Interactive components must cover what applies:

- [ ] Keyboard operable (Enter/Space/Arrows/Escape as relevant)
- [ ] Visible focus (tokenized ring)
- [ ] `aria-label` / `aria-labelledby` when text is absent
- [ ] `aria-expanded` / `aria-controls` for disclosure & menus
- [ ] `aria-invalid` + described-by message for form errors
- [ ] `disabled` / `aria-disabled` + no silent click-through
- [ ] Focus trap + restore for modal dialogs
- [ ] Portal content still reachable / announced appropriately
- [ ] Loading state announced or button disabled while loading

---

## 7. Overlay Components

If the surface can be clipped by `overflow: hidden` parents:

1. Apply `use:portal` (default `body`).
2. Position with `createFloating` from `utils/floating.svelte.ts`.
3. Use z-index tokens (`--lumi-z-dropdown`, `--lumi-z-modal`, etc.).
4. On open: cancel pending close timers/transitions before rebinding target.
5. On close: restore focus to the trigger when the user opened via keyboard/pointer interaction that expects it.

Reference implementations: `Dialog`, `Dropdown`, `Context`, `Select`, `Tooltip`.

---

## 8. Forms Family

Forms should feel like one system:

| Concern       | Approach                                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------------------------- |
| Heights       | `--lumi-control-height-*`                                                                                         |
| Radius        | `--lumi-control-radius`                                                                                           |
| Fill / border | `--lumi-color-control-*`                                                                                          |
| Focus         | `--lumi-control-focus-shadow` + accent                                                                            |
| Labels        | Consistent label + description + message stack                                                                    |
| Validation    | Prefer explicit `error` / `success` / `warning` or a single state model — stay consistent with peers when editing |

When adding a new control, **side-by-side with Input** at `sm`/`md`/`lg` and match padding/typography.

---

## 9. Content Defaults

- Prefer **empty or neutral English** defaults for user-visible strings in core, or no default copy.
- Avoid Spanish/English product copy baked into primitives (apps localize).
- Avoid hard-coded asset paths like `/assets/images/...` — accept full URLs or leave image slots to the consumer.

---

## 10. Pre-merge checklist

For every touched component:

- [ ] `Component.svelte` + `types.ts` + `index.ts`
- [ ] `types.ts` complete and exported; root `src/lib/index.ts` updated if public
- [ ] Props (`color` / `size` / `variant` / state booleans) match peers
- [ ] No domain words in prop unions, classes, or defaults
- [ ] Tokens only—no raw hex, rgba, or magic numbers
- [ ] Defaults language-neutral (empty or neutral English; apps localize)
- [ ] Interactive → keyboard operable + accessible name
- [ ] Overlay → portal + focus trap/restore + dismissal
- [ ] Visual: light theme, and dark seeds if colors touched
- [ ] `pnpm run check` clean
- [ ] `pnpm run package` clean

Release command sequence: [GUIDE §8](./GUIDE.md#8-release-verification).

---

## 11. Quality Rubric (score before merge)

Rate 1–5. Ship only if each ≥ 4.

| Dimension       | 5 means                                        |
| --------------- | ---------------------------------------------- |
| **Beauty**      | Calm glass; no visual noise; aligns with peers |
| **Minimalism**  | Smallest API that solves the job               |
| **Consistency** | Props, sizes, tokens, BEM match the system     |
| **Reuse**       | Works in any product without domain forks      |
| **A11y**        | Keyboard + SR + focus are correct              |
| **Code**        | Typed, Runes, relative imports, no hacks       |

---

## 12. Reference Components (copy these patterns)

| Need                       | Look at                           |
| -------------------------- | --------------------------------- |
| Action control + loading   | `Button`                          |
| Text field + validation UI | `Input`                           |
| Modal a11y + portal        | `Dialog`                          |
| Floating menu              | `Dropdown`, `Context`             |
| Async options              | `Select` / `RemoteSelect`         |
| Shared config              | `config.ts`                       |
| Layout shell classes       | `core.css` dashboard layout       |
| Token seeds                | `tokens.base.css` header comments |

---

## 13. Anti-Patterns to Reject in Review

[Avoid](./GUIDE.md#7-library-design) in GUIDE §7 lists the structural anti-patterns (domain names, raw palettes, component-selector patches, clipped overlays, public helpers without a consumer). In review also reject:

1. New component without `types.ts` / `index.ts`
2. Silent a11y regressions (icon-only control with no accessible name)
3. Scope-creep refactors unrelated to the task
4. Exporting internal helpers as public API without a consumer contract
