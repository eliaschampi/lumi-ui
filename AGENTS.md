# Lumi UI Agent Instructions

Lightweight, bilingual (English + Spanish) Svelte 5 component library; shared source of truth for Coedula, Aeduca, and Faztore.

## Documentation Routing

Progressive disclosure—do not load the entire repository:

1. Read [`docs/AGENT_GUIDE.md`](./docs/AGENT_GUIDE.md).
2. Open **one** [Guide](./docs/GUIDE.md) section, [Components](./docs/COMPONENTS.md), **or** [Component authoring](./docs/COMPONENT_AUTHORING.md).
3. Inspect the exact `types.ts`, `index.ts`, component, or stylesheet involved.

Documentation explains intent; exports, TypeScript contracts, component source, and styles remain authoritative. Hub: [`docs/README.md`](./docs/README.md).

## Non-Negotiable Rules

1. Svelte 5 Runes only: `$state`, `$derived`, `$props`, `$effect`, `$bindable`.
2. Domain-neutral components—never education, inventory, sales, student, product, enrollment, or cashbox concepts in core.
3. `var(--lumi-...)` tokens for color, spacing, radius, shadow, z-index, layout sizing, and motion.
4. No Tailwind, Bootstrap, inline colors, raw design palettes, or one-off CSS frameworks.
5. Internal imports relative only—no `$lib` or `$app` inside the package.
6. Semantic APIs: `tone`, `color`, `size`, `variant`, `orientation`, `clearable`, `selected`, `disabled`, `loading`, `aria-*`.
7. Overlays portal out of clipped parents and preserve keyboard/focus behavior.
8. Reusable non-primitives → future `src/lib/patterns/`; not `src/lib/components/` or `src/lib/styles/patterns.css`.
9. Weight is a feature: fixed icons deep-import `@lucide/svelte/icons/<name>` (never string names inside the library); re-measure budgets in README before merging.
10. User-visible and `aria-*` defaults come from `src/lib/i18n` (`import * as en` + module `COPY`, `useLumiLocale`); keep `en.ts`, `es.ts` and `types.ts` in parity.
11. A component's CSS lives in its scoped `<style>`, in `base.css` recipes, or in a stylesheet the `.svelte` component imports itself (layer `lumi.components`) — never from an `index.ts` barrel, which bundlers drop with its CSS; never depend on `utilities.css` or `patterns.css`.

## Library Layers

| Path                               | Role                                                                                                                             |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/components`               | Public Svelte surface; new entries must be primitive and reusable                                                                |
| `src/lib/styles/tokens.base.css`   | Default token contract and product identity (azure primary, orchid secondary, warm-paper surfaces; curated OKLCH seeds)          |
| `src/lib/styles/base.css`          | Reset, control contracts and shared recipes (spinner, skeleton, switcher, icon, sr-only); `core.css` = base + layout + utilities |
| `src/lib/i18n`                     | Built-in copy (English default, Spanish) and locale/currency/time-zone context                                                   |
| `src/lib/styles/patterns.css`      | Domain-neutral reusable composition patterns                                                                                     |
| `src/lib/actions`, `src/lib/utils` | Internal primitives shared by components                                                                                         |

Entry points, ownership, principles: [Guide §7](./docs/GUIDE.md#7-library-design).

## Quality Bar

Every new component: `Component.svelte`, `types.ts`, `index.ts`, tokenized CSS only, a11y labels/states where behavior requires them, no app/domain imports.

Before release:

```bash
pnpm install --ignore-scripts
pnpm run lint
pnpm run check
pnpm run test
pnpm run package
git diff --check
```

`pnpm run lint` = **oxlint** on `src` (JS/TS and `<script>` in `.svelte`) + **Prettier** check. Types/a11y stay on `pnpm run check` (`svelte-check`). Format: `pnpm run format`.
