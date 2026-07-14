# Lumi UI

Domain-neutral Svelte 5 components, semantic tokens, and responsive CSS composition shared by Coedula and Faztore.

## Install

```bash
pnpm add @lumi-ui/svelte
```

```svelte
<script lang="ts">
	import { Button, Card, Input } from '@lumi-ui/svelte';
	import '@lumi-ui/svelte/styles';
</script>

<Card title="Profile" spaced>
	<Input label="Display name" />
	<Button variant="filled">Save</Button>
</Card>
```

## Documentation

| Document                                                 | Covers                                                                        |
| -------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **[Guide](./docs/GUIDE.md)**                             | Install, theming, layouts, core CSS, design language, library design, release |
| **[Components](./docs/COMPONENTS.md)**                   | Component catalog and selection                                               |
| **[Component authoring](./docs/COMPONENT_AUTHORING.md)** | How to build or change a component                                            |
| **[docs hub](./docs/README.md)**                         | Authority map                                                                 |
| **[AGENTS.md](./AGENTS.md)**                             | Agent rules → [Agent Guide](./docs/AGENT_GUIDE.md)                            |

## Entry Points

| Import                                   | Purpose                                                                |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| `@lumi-ui/svelte`                        | Root components, public types, config, icons, charts, portal, Drive UI |
| `@lumi-ui/svelte/styles`                 | Tokens + core + patterns CSS (import once)                             |
| `@lumi-ui/svelte/color-scheme`           | Optional light/dark/system controller and pre-paint script             |
| `@lumi-ui/svelte/drive`                  | Pure Drive helpers and types                                           |
| `@lumi-ui/svelte/styles/tokens.base.css` | Token contract only                                                    |
| `@lumi-ui/svelte/styles/core.css`        | Reset, shells, and utilities without implicit tokens                   |
| `@lumi-ui/svelte/styles/patterns.css`    | Reusable composition patterns without implicit tokens or core          |

Brand seeds and color scheme: [Guide §3](./docs/GUIDE.md#3-theming-and-color-scheme).

Components consume semantic `--lumi-*` tokens. Business rules, routes, persistence, copy, and localization stay in the application.

## Example and Development

[`examples/dashboard`](./examples/dashboard) is a locally linked SvelteKit showcase.

```bash
pnpm install --ignore-scripts
pnpm run check
pnpm run package
```

Full release checklist: [Guide §8](./docs/GUIDE.md#8-release-verification).
