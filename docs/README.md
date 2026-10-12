# Lumi UI Documentation

Five documents cover the library. Source remains authoritative for exact APIs.

| Document                                            | Covers                                                                                      |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **[Guide](./GUIDE.md)**                             | Install, first page, theming, layouts, core CSS, design language, library design, release   |
| **[Components](./COMPONENTS.md)**                   | Every root-exported component, selection matrix, contracts                                  |
| **[Component authoring](./COMPONENT_AUTHORING.md)** | How to build or change a component: skeleton, prop contract, CSS, a11y, pre-merge checklist |
| **[Consumer reference](./CONSUMER_REFERENCE.md)**   | Compact setup, theming, layout classes, and component usage for product apps                |
| **[Upgrade](./UPGRADE.md)**                         | Consumer migration notes through 0.5.0                                                      |

Coding agents: [AGENTS.md](../AGENTS.md) → [Agent Guide](./AGENT_GUIDE.md). Working pages: the [`lumi-web`](https://github.com/eliaschampi/lumi-web) showcase.

## Authority

| Question                     | Source of truth                                                                                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository rules             | [`AGENTS.md`](../AGENTS.md)                                                                                                                        |
| Entry points, peer versions  | [`package.json`](../package.json)                                                                                                                  |
| Exported symbols             | Root or subpath `index.ts`                                                                                                                         |
| Props and snippets           | Component `types.ts` **and** `.svelte` (`types.ts` is not always exhaustive)                                                                       |
| Tokens and CSS classes       | [`tokens.base.css`](../src/lib/styles/tokens.base.css), [`core.css`](../src/lib/styles/core.css), [`patterns.css`](../src/lib/styles/patterns.css) |
| Intent and composition       | [Guide](./GUIDE.md)                                                                                                                                |
| App integration recipes      | [Consumer reference](./CONSUMER_REFERENCE.md)                                                                                                      |
| Breaking / visual migrations | [Upgrade](./UPGRADE.md)                                                                                                                            |

## When Public Behavior Changes

| Change                                                    | Update                                                                      |
| --------------------------------------------------------- | --------------------------------------------------------------------------- |
| Root component export                                     | [Components](./COMPONENTS.md)                                               |
| Install, theming, layout recipe, CSS family, architecture | [Guide](./GUIDE.md) (the relevant section)                                  |
| Authoring contract, prop naming, or pre-merge checklist   | [Component authoring](./COMPONENT_AUTHORING.md)                             |
| Consumer setup / class recipes used by products           | [Consumer reference](./CONSUMER_REFERENCE.md) when the compact table shifts |
| Visual or migration impact for apps                       | [Upgrade](./UPGRADE.md) (even for CSS-only polish)                          |

Guides route, compare, and explain—they do not mirror full TypeScript or CSS declarations.
