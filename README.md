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

- **Light by construction.** No runtime theme provider, no CSS-in-JS, no icon registry unless you ask for one. A `Button` is 2.6 KB gzip with its CSS; the global stylesheet is 8.4 KB and splits further for lean pages.
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
| **[1.0 review](./docs/REFACTOR_REVIEW.md)**              | What changed in 1.0 and the evidence behind it                           |
| **[AGENTS.md](./AGENTS.md)**                             | Agent rules → [Agent Guide](./docs/AGENT_GUIDE.md)                       |

## Lightweight Contract

Budgets are release gates; **re-measure on every release**. Browser figures sum separately gzipped (level 9) JavaScript and component CSS from fully minified Vite 8 production ES bundles (Rolldown + Lightning CSS) with Svelte externalized. Measured **2026-10-17** for 1.0.0; 0.6.0 re-measured with the same method.

| Surface                                                                                  |   0.6.0 |   1.0.0 |    Budget |
| ---------------------------------------------------------------------------------------- | ------: | ------: | --------: |
| Global CSS `@lumi-ui/svelte/styles` (bundled, minified)                                  |  11,661 |   8,396 |   ≤ 8,500 |
| `Button`                                                                                 |  10,880 |   2,646 |   ≤ 3,000 |
| `Divider`                                                                                |   9,650 |     977 |   ≤ 1,000 |
| `Switch` + `Radio` + `Textarea` + `Checkbox` + `SegmentedControl` + `Input` + `Table`    |  22,424 |  14,074 |  ≤ 15,500 |
| Storefront set: `Button` + `Card` + `Image` + `Chip` + `Input` + `Icon` + `Divider`      |  17,249 |   8,910 |   ≤ 9,000 |
| Each new component (`ToggleGroup`, `Skeleton`, `Message`, `MessageList`, `Pagination`\*) |       — | ≤ 3,074 |   ≤ 3,500 |
| npm tarball                                                                              | 161 KiB | 181 KiB | ≤ 200 KiB |

\* `Pagination` alone adds 2.2 KB on top of the `Button` it renders. `Toaster` is 3.6 KB including `Notification`, its timers and modal-aware placement.

In a real SvelteKit storefront (Faztore), migrating with the codemod and loading lean styles cut each public page by about 9 KB gzip (home 100.2 → 91.0 KB, product 96.3 → 87.3 KB) and its render-blocking CSS by 15–20% — the only app changes were the codemod output and three style imports.

```bash
pnpm run package
npm pack --dry-run --ignore-scripts --json   # tarball + unpacked size
```

## Development

```bash
pnpm install --ignore-scripts
pnpm run lint && pnpm run check && pnpm run test && pnpm run package
```

Runnable showcase: [`eliaschampi/lumi-web`](https://github.com/eliaschampi/lumi-web). Release checklist: [Guide §8](./docs/GUIDE.md#8-release-verification).

MIT licensed.
