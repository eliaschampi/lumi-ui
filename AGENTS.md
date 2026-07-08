# Lumi UI Agent Instructions

This package is the shared Lumi UI source of truth for Coedula and Faztore.

## Non-Negotiable Rules

1. Use Svelte 5 Runes only: `$state`, `$derived`, `$props`, `$effect`, `$bindable`.
2. Components must be domain-neutral. Never add education, inventory, sales, student, product, enrollment, or cashbox concepts to core components.
3. Use `var(--lumi-...)` tokens for color, spacing, radius, shadow, z-index, layout sizing, and motion.
4. Do not add Tailwind, Bootstrap, inline colors, raw design palettes, or one-off CSS frameworks.
5. Keep internal imports relative inside the package. Do not use `$lib` or `$app`.
6. Prefer semantic APIs: `tone`, `color`, `size`, `variant`, `orientation`, `clearable`, `selected`, `disabled`, `loading`, `aria-*`.
7. Overlay components must portal out of clipped parents and preserve keyboard/focus behavior.
8. If a pattern is reusable but not primitive, place it under a future `patterns/` module instead of `components/`.

## Library Layers

- `src/lib/components`: primitive, reusable Svelte components.
- `src/lib/styles/tokens.base.css`: complete default token contract.
- `src/lib/styles/themes`: product themes that preserve app identity.
- `src/lib/styles/core.css`: domain-neutral layout, surface, and utility classes.
- `src/lib/actions` and `src/lib/utils`: internal primitives shared by components.

## Quality Bar

Every new component must include:

- `Component.svelte`
- `types.ts`
- `index.ts`
- tokenized CSS only
- accessibility labels/states where behavior requires them
- no app/domain imports

Before release, run:

```bash
pnpm install --ignore-scripts
pnpm run check
pnpm run package
```
