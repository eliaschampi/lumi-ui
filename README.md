# Lumi UI

Lightweight Svelte 5 components with a calm glass design language, semantic tokens and **English + Spanish built in**. SSR-first, accessible, and small enough for SEO-critical storefronts — a page pays only for the components and icons it renders.

```bash
pnpm add @lumi-ui/svelte
```

```svelte
<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import { Button, Card, Input } from '@lumi-ui/svelte';
	import '@lumi-ui/svelte/styles';
</script>

<Card title="Profile" spaced>
	<Input label="Display name" icon={Search} clearable />
	<Button variant="filled" href="/profile">Save</Button>
</Card>
```

## Why Lumi

- **Light by construction.** No runtime theme provider, no CSS-in-JS, no icon registry unless you ask for one. A `Button` is 2.8 KB gzip with its CSS, a `Tooltip` 4.1 KB, and the global stylesheet 7.7 KB, which splits further for lean pages. Overlays position themselves with no third-party engine.
- **Bilingual.** English by default; one line switches every built-in label, placeholder and `Intl` format to Spanish (`setLumiLocale`). Unused copy never reaches the bundle.
- **Platform first.** Real links (`Button href`, crawlable `Pagination`), `<ul>`/`<hr>` semantics, cascade layers so your CSS wins, container queries, `inert`, native date inputs — less JavaScript, better SEO.
- **One recipe per role.** Fields, switchers, spinners and skeletons share global recipes, so every control looks and behaves like its peers in light and dark mode.

## Language

```svelte
<script lang="ts">
	import { lumiEs, setLumiLocale } from '@lumi-ui/svelte';

	setLumiLocale({
		locale: 'es-PE',
		currency: 'PEN',
		timeZone: 'America/Lima',
		messages: lumiEs
	});
</script>
```

Explicit props (`placeholder`, `closeLabel`, …) always win. Details: [Guide §1](./docs/GUIDE.md#language-and-formatting).

## Entry Points

| Import                                          | Purpose                                                                   |
| ----------------------------------------------- | ------------------------------------------------------------------------- |
| `@lumi-ui/svelte`                               | Components, types, locale API, formatters, icon registry API, `portal`    |
| `@lumi-ui/svelte/icons`                         | Optional curated `lumiIcons` map for string icon names                    |
| `@lumi-ui/svelte/drive`                         | Pure Drive helpers, types and Drive copy                                  |
| `@lumi-ui/svelte/color-scheme`                  | Optional light/dark/system controller and pre-paint script                |
| `@lumi-ui/svelte/styles`                        | Tokens + core (base, layout, utilities), import once                      |
| `@lumi-ui/svelte/styles/{tokens.base,base}.css` | Minimum for pages that only render components                             |
| `@lumi-ui/svelte/styles/{layout,utilities}.css` | App shells / composition helpers, when the markup uses them               |
| `@lumi-ui/svelte/styles/patterns.css`           | Opt-in operative compositions (filter summaries, toolbars, metric lists…) |

Brand seeds and color scheme: [Guide §3](./docs/GUIDE.md#3-theming-and-color-scheme). Lean loading for public pages: [Guide §1](./docs/GUIDE.md#load-styles-once).

## Documentation

| Document                                                 | Covers                                                                   |
| -------------------------------------------------------- | ------------------------------------------------------------------------ |
| **[Guide](./docs/GUIDE.md)**                             | Install, styles, icons, language, theming, layouts, CSS, design, release |
| **[Components](./docs/COMPONENTS.md)**                   | Component catalog and selection                                          |
| **[Component authoring](./docs/COMPONENT_AUTHORING.md)** | How to build or change a component                                       |
| **[Consumer reference](./docs/CONSUMER_REFERENCE.md)**   | Compact product integration recipes                                      |
| **[Upgrade](./docs/UPGRADE.md)**                         | Migration guides and codemods (`scripts/migrate-1.0.mjs`)                |
| **[Reviews](./docs/REFACTOR_REVIEW.md)**                 | What changed in 1.0 and 1.2 and the evidence behind it                   |
| **[AGENTS.md](./AGENTS.md)**                             | Agent rules → [Agent Guide](./docs/AGENT_GUIDE.md)                       |

## Lightweight Contract

Budgets are release gates: `pnpm run package && pnpm run size` re-measures them and fails over budget. Browser figures sum separately gzipped (level 9) JavaScript and component CSS from fully minified Vite 8 production ES bundles (Rolldown + Lightning CSS) with Svelte externalized. Measured **2026-11-05** for 1.2.1; 1.1.1 re-measured with the same script.

| Surface                                                                               |   1.1.1 |   1.2.1 |    Budget |
| ------------------------------------------------------------------------------------- | ------: | ------: | --------: |
| Global CSS `@lumi-ui/svelte/styles` (bundled, minified)                               |   8,486 |   7,768 |   ≤ 7,800 |
| Lean CSS `tokens.base.css` + `base.css`                                               |   5,901 |   5,081 |   ≤ 5,100 |
| `Button`                                                                              |   2,754 |   2,745 |   ≤ 3,000 |
| `Divider`                                                                             |     966 |     968 |   ≤ 1,000 |
| `Tooltip`                                                                             |   9,748 |   4,076 |   ≤ 4,300 |
| `Dropdown` + `DropdownItem`                                                           |  11,091 |   5,468 |   ≤ 5,800 |
| `Select`                                                                              |  14,256 |   8,666 |   ≤ 9,000 |
| `Switch` + `Radio` + `Textarea` + `Checkbox` + `SegmentedControl` + `Input` + `Table` |  14,619 |  15,129 |  ≤ 15,500 |
| Storefront set: `Button` + `Card` + `Image` + `Chip` + `Input` + `Icon` + `Divider`   |   9,478 |   9,692 |  ≤ 10,000 |
| `Tabs`, `SegmentedControl`, `ToggleGroup`, `Skeleton`, `Message`, `MessageList`       | ≤ 3,070 | ≤ 3,133 |   ≤ 3,500 |
| All exports                                                                           |  79,786 |  74,117 |         — |
| npm tarball                                                                           | 183 KiB | 188 KiB | ≤ 200 KiB |
| Runtime dependencies (packages installed with Lumi, Lucide aside)                     |       4 |       1 |         — |

The component rows that grow do so because the switcher and skeleton recipes left the global stylesheet for the components that use them. What a page downloads still falls: measured against 1.1.1 as global CSS plus component, **all 76 exports and sets are lighter**, whether the CSS ships merged or in separate files (median −793 B, worst case `Tabs` −8 B). The tarball grows by the new modules, and installing Lumi still drops about 0.5 MB with Floating UI gone. `Pagination` adds 2.2 KB on top of the `Button` it renders. `Toaster` is 3.6 KB including `Notification`, its timers and modal-aware placement.

In a real SvelteKit storefront (Faztore), migrating with the codemod and loading lean styles cut each public page by 8–9 KB gzip (home 100.2 → 91.6 KB, product 96.3 → 87.8 KB) and its render-blocking CSS by 12–16% — the only app changes were the codemod output and three style imports.

```bash
pnpm run package && pnpm run size
```

```bash
npm pack --dry-run --ignore-scripts --json
```

## Development

```bash
pnpm install --ignore-scripts
pnpm run lint && pnpm run check && pnpm run test && pnpm run package && pnpm run size
```

Runnable showcase: [`eliaschampi/lumi`](https://github.com/eliaschampi/lumi) ([live site](https://eliaschampi.github.io/lumi/)). Release checklist: [Guide §8](./docs/GUIDE.md#8-release-verification).

MIT licensed.
