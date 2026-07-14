# Agent Guide

> Context budget: repository `AGENTS.md` → this file → **one section** of [GUIDE.md](./GUIDE.md) **or** [COMPONENTS.md](./COMPONENTS.md) → exact source files. Do not preload everything.

## Route the Task

| Task                                         | Read                                                     |
| -------------------------------------------- | -------------------------------------------------------- |
| Install / integrate                          | [GUIDE §1–2](./GUIDE.md#1-install)                       |
| Brand or light/dark                          | [GUIDE §3](./GUIDE.md#3-theming-and-color-scheme)        |
| Shells, grids, page composition              | [GUIDE §4](./GUIDE.md#4-layouts-and-composition)         |
| CSS class family or utility                  | [GUIDE §5](./GUIDE.md#5-core-css-reference)              |
| Visual language, interaction, minimalism     | [GUIDE §6](./GUIDE.md#6-design-language)                 |
| Entry points, ownership, “does this belong?” | [GUIDE §7](./GUIDE.md#7-library-design)                  |
| Choose or change a component                 | [Components](./COMPONENTS.md) → `types.ts` → `.svelte`   |
| Build, fix, or refactor a component          | [Component authoring](./COMPONENT_AUTHORING.md) → source |

## Workflow

1. Classify ownership: component, CSS composition, optional entry point, future `src/lib/patterns/`, or consumer app.
2. Search for an existing symbol, utility, token, or nearby implementation.
3. Read barrel → contract → implementation → only the CSS it uses.
4. Preserve `AGENTS.md` invariants and existing public behavior.
5. Update [Components](./COMPONENTS.md) for export changes; otherwise the matching [Guide](./GUIDE.md) section.
6. Run the smallest verification for the changed files.

```bash
rg --files src/lib/components
rg "export .*Button" src/lib package.json
rg -- "--lumi-grid|--lumi-space" src/lib/styles
rg '\$props|Snippet|aria-|role=' src/lib/components/Button
```

## Verification

| Change                      | Minimum check                                            |
| --------------------------- | -------------------------------------------------------- |
| Markdown only               | Links, focused Prettier, `git diff --check`              |
| Types or Svelte             | `pnpm run check`                                         |
| Public exports or packaging | `pnpm run check && pnpm run package`                     |
| CSS, tokens, or layout      | `pnpm run check`; visual check only if behavior changed  |
| Overlay interaction         | Checks + keyboard, focus, dismissal, clipping, collision |

Do not start a duplicate dev server. Release checklist: [GUIDE §8](./GUIDE.md#8-release-verification).

## Done When

- One owner; no duplicated API or policy.
- Public behavior typed where possible, semantic, domain-neutral, accessible.
- Reusable presentation uses `--lumi-*` tokens.
- Browser effects are SSR-safe and clean up.
- Exports and the owning guide match source.
- Focused verification passes without unrelated changes.
