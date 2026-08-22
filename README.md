# Lumi UI

Domain-neutral Svelte 5 components, semantic tokens, and responsive CSS composition shared by Coedula, Aeduca, and Faztore.

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
| **[Consumer reference](./docs/CONSUMER_REFERENCE.md)**   | Compact product integration recipes                                           |
| **[Upgrade](./docs/UPGRADE.md)**                         | Consumer migration (0.1.5 → 0.2.x, 0.2.x → 0.3.x, 0.3.x → 0.4.0)              |
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

New code should use semantic `variant`, `color`, and `placement` props. Historical `type`, `button`, and `position` aliases remain supported where Coedula, Aeduca, or Faztore still depend on them. For `Button`, `variant` wins visually and `button` wins natively; other canonical props take precedence over their aliases.

## Lightweight Contract

The published artifact and browser payload are different measurements. Budgets below are release gates; **re-measure on every release** with the commands at the end of this section (npm prints decimal kB; the table uses binary KiB). npm tarball, unpacked size, and all-CSS gzip were remeasured on **0.4.0**. Browser component figures remain from **0.2.0**.

| Surface                                                                               |  Last measured | Release budget |
| ------------------------------------------------------------------------------------- | -------------: | -------------: |
| npm tarball                                                                           |      154.6 KiB |      ≤ 200 KiB |
| npm unpacked                                                                          |      751.3 KiB |        ≤ 1 MiB |
| All CSS (`tokens` + `core` + `patterns`, minified + gzip)                             | 11.45 KiB gzip |  ≤ 12 KiB gzip |
| `Switch` + `Radio` + `Textarea` + `Checkbox` + `SegmentedControl` + `Input` + `Table` | 22.57 KiB gzip |  ≤ 25 KiB gzip |
| Standalone `Checkbox`                                                                 |  2.47 KiB gzip |              — |

Browser figures use a production Vite bundle with Svelte externalized because it is a shared peer dependency. Root imports tree-shake to the same runtime bytes as direct barrels. Components with arbitrary string-icon props retain the Lucide registry by contract; fixed internal icons should use deep Lucide imports so simple controls do not pay for that registry.

Verify the publish footprint on every release:

```bash
pnpm run package
npm pack --dry-run --ignore-scripts --json          # tarball + unpacked size
cat dist/styles/tokens.base.css dist/styles/core.css dist/styles/patterns.css \
	| npx esbuild --loader=css --minify | gzip -9 -c | wc -c   # all-CSS min+gzip bytes
```

## Example and Development

[`examples/dashboard`](./examples/dashboard) is a locally linked SvelteKit showcase.

```bash
pnpm install --ignore-scripts
pnpm run check
pnpm run package
```

Full release checklist: [Guide §8](./docs/GUIDE.md#8-release-verification).
