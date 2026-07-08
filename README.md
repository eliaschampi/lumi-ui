# Lumi UI

Reusable Svelte 5 component library for calm, modern, glassmorphic and lightly neumorphic product interfaces.

This library was extracted from Coedula and Faztore with a strict rule: **core components do not know the business domain**.

## Install

```bash
pnpm add git+https://github.com/eliaschampi/lumi-ui.git#main --ignore-scripts
```

For local development before the remote package is pushed:

```bash
pnpm add ../lumi-ui --ignore-scripts
```

`dist/` is part of the package contract and is intended to be versioned. Consumers
do not need to run package build scripts during install.

## Usage

```svelte
<script lang="ts">
	import { Button, Card, Dialog, Input, Select, Table } from '@lumi-ui/svelte';
	import '@lumi-ui/svelte/styles';
	import '@lumi-ui/svelte/themes/coedula.css';
</script>

<Card title="Resumen" subtitle="Estado actual" spaced>
	<Input label="Nombre" placeholder="Nombre visible" />
	<Button type="filled" icon="check">Guardar</Button>
</Card>
```

Use one theme at a time:

```ts
import "@lumi-ui/svelte/styles";
import "@lumi-ui/svelte/themes/coedula.css";
// or
import "@lumi-ui/svelte/themes/faztore.css";
```

## Included Core

- Structure: `Card`, `Sidebar`, `SidebarHeader`, `Navbar`
- Forms: `Button`, `Input`, `NumberInput`, `Textarea`, `Select`, `RemoteSelect`, `Checkbox`, `SegmentedControl`
- Overlays: `Dialog`, `Dropdown`, `DropdownItem`, `Context`, `ContextItem`
- Display/navigation: `Table`, `Tabs`, `Avatar`, `Icon`, `TagOption`
- File workspace: `DriveFileCard`, `DriveFileGrid`, `DriveFileList`, `DriveFilePreview`, `DriveFileUploader`, `DriveSidebar`
- Utilities: `portal`, icon registry, `@lumi-ui/svelte/drive`

## Architecture Principle

Lumi UI exposes primitives and neutral patterns. Apps translate their domain into Lumi contracts.

Good:

```ts
variant: "default";
color: "success";
selected: true;
orientation: "vertical";
```

Not allowed in core:

```ts
variant: "attendance";
variant: "inventory";
studentStatus: "enrolled";
productStockState: "low";
```

Domain-specific components belong in each app or in a separate package such as `@lumi-ui/coedula` or `@lumi-ui/faztore`.
