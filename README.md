# Lumi UI

Reusable Svelte 5 component library for calm, modern, glassmorphic and lightly neumorphic product interfaces.

This library was extracted from Coedula and Faztore with a strict rule: **core components do not know the business domain**.

## Install

```bash
pnpm add @lumi-ui/svelte
# or
npm install @lumi-ui/svelte
```

## Usage

```svelte
<script lang="ts">
	import { Button, Card, Dialog, Input, Select, Table } from '@lumi-ui/svelte';
	import '@lumi-ui/svelte/styles';
</script>

<Card title="Resumen" subtitle="Estado actual" spaced>
	<Input label="Nombre" placeholder="Nombre visible" />
	<Button type="filled" icon="check">Guardar</Button>
</Card>
```

`@lumi-ui/svelte/styles` includes the default Lumi identity: cobalt primary, olive secondary and warm-paper neutrals. Coedula and Faztore share this visual grammar.

## Brand Theme

Lumi brand theming is CSS-only. There is no provider, runtime palette configuration or additional dependency. The developer installing the package chooses two brand colors after importing Lumi styles; the semantic ramps, translucent states and dark accents derive automatically.

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '@lumi-ui/svelte/styles';
	import '../lumi-theme.css';

	const { children } = $props();
</script>

{@render children?.()}
```

```css
/* src/lumi-theme.css */
:root {
	--lumi-brand-primary: #7c3aed;
	--lumi-brand-secondary: #0f766e;
}
```

That is the complete normal configuration. Keep `success`, `warning`, `danger`, `info`, surfaces and component tokens untouched so their meaning remains consistent.

For brands that require manually calibrated dark or foreground values, Lumi also exposes optional advanced seeds:

```css
:root {
	--lumi-brand-primary-dark: #9f7aea;
	--lumi-brand-secondary-dark: #2dd4bf;
	--lumi-brand-primary-foreground: white;
	--lumi-brand-secondary-foreground: white;
}
```

Lumi progressively selects a black or white foreground in browsers supporting `contrast-color()`, with white as the compatible fallback.

## Light, Dark and System

Lumi owns the complete visual definition for light and dark. Applications that expose a user preference can opt into the separate, tree-shakeable `color-scheme` entry point; applications that do not import it receive no runtime code.

```ts
// src/lib/color-scheme.svelte.ts
import { createColorScheme } from '@lumi-ui/svelte/color-scheme';

export const colorScheme = createColorScheme();
```

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { ColorSchemeScript } from '@lumi-ui/svelte/color-scheme';
	import { colorScheme } from '$lib/color-scheme.svelte';

	onMount(colorScheme.start);
</script>

<ColorSchemeScript />
```

`ColorSchemeScript` resolves the stored or operating-system preference before the first paint. The controller then keeps `preference` (`system`, `light`, or `dark`) and `resolved` (`light` or `dark`) synchronized without a provider or context. It has no import-time browser side effects and removes its media-query listener when the owning layout unmounts.

The storage key defaults to `lumi-color-scheme`. Pass the same `storageKey` to the script and controller only when an application requires another key. Buttons, labels, icons and localization remain application concerns.

## Included Core

- Structure: `Card`, `Sidebar`, `SidebarHeader`, `Navbar`
- Forms: `Button`, `Input`, `NumberInput`, `Textarea`, `Select`, `RemoteSelect`, `Checkbox`, `SegmentedControl`, `DateRangeFilter`
- Overlays: `Dialog`, `Dropdown`, `DropdownItem`, `Context`, `ContextItem`, `Tooltip`
- Display/navigation: `Table`, `Tabs`, `Avatar`, `Icon`, `TagOption`
- File workspace: `DriveFileCard`, `DriveFileGrid`, `DriveFileList`, `DriveFilePreview`, `DriveFileUploader`, `DriveSidebar`
- Utilities: `portal`, icon registry, `@lumi-ui/svelte/drive`

## Floating Controls

`Select`, `Dropdown`, `Context` and `Tooltip` are portaled to avoid clipped parents. They share viewport collision handling, automatic placement updates and tokenized surface geometry.

| Component  | Intended use                            | Main API                                                          |
| ---------- | --------------------------------------- | ----------------------------------------------------------------- |
| `Select`   | Single selection, optionally searchable | `bind:value`, `options`, `autocomplete`, `placement`, `clearable` |
| `Dropdown` | Triggered action menu                   | `bind:open`, `triggerContent`, `placement`, `trigger`             |
| `Context`  | Pointer-positioned action menu          | `bind:this`, `open(event, data)`, `close()`                       |
| `Tooltip`  | Short supplementary information         | `text` or `content`, `position`, `delay`, `color`                 |

```svelte
<script lang="ts">
	import { Dropdown, DropdownItem, Select, Tooltip } from '@lumi-ui/svelte';

	let status = $state<string | number | Record<string, unknown> | null>(null);
</script>

<Select bind:value={status} options={['Activo', 'Pausado']} label="Estado" />

<Dropdown aria-label="Acciones">
	{#snippet triggerContent()}Acciones{/snippet}
	<DropdownItem icon="edit">Editar</DropdownItem>
	<DropdownItem icon="trash" color="danger">Eliminar</DropdownItem>
</Dropdown>

<Tooltip text="Cambios guardados automáticamente">
	<span>Más información</span>
</Tooltip>
```

When `name` is provided, primitive `Select` values are submitted as strings. Object values use JSON by default; provide `serializeValue` when the form requires another representation.

## Architecture Principle

Lumi UI exposes primitives and neutral patterns. Apps translate their domain into Lumi contracts.

Good:

```ts
variant: 'default';
color: 'success';
selected: true;
orientation: 'vertical';
```

Not allowed in core:

```ts
variant: 'attendance';
variant: 'inventory';
studentStatus: 'enrolled';
productStockState: 'low';
```

Domain-specific components belong in each app or in a separate package such as `@lumi-ui/coedula` or `@lumi-ui/faztore`.

## Publishing

For maintainers:

```bash
pnpm install --frozen-lockfile
npm publish
```

The package lifecycle validates lint and Svelte types before publishing, then builds `dist/` during pack.

## 0.1.4 Notes

- Context menus can move directly between targets without leaving a stale menu or position.
- Core form/action utilities and filter summary styles were restored as reusable Lumi patterns instead of app-local CSS.
- The default light theme restores calibrated brand seeds, translucent dashboard content, and liquid-glass shadow balance.
