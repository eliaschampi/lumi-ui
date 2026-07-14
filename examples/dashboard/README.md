# Lumi UI Dashboard Example

Independent SvelteKit showcase linked to the local Lumi UI package. It demonstrates a responsive dashboard shell, real routes, light/dark/system behavior, forms, components, tables, charts, and grids without application CSS.

## Run

Package Lumi first so the linked `dist/` is current:

```bash
cd ../..
pnpm run package
```

Then run the example on its isolated port:

```bash
cd examples/dashboard
pnpm install
pnpm run dev
```

Open `http://localhost:5174`.

## Rules Demonstrated

- Svelte 5 Runes only.
- Components imported from `@lumi-ui/svelte`.
- One global `@lumi-ui/svelte/styles` import.
- Optional color-scheme controller from its subpath.
- Actual SvelteKit pages behind one responsive shell.
- Layout composed exclusively with Lumi components and public classes from `core.css` and `patterns.css`.
- No local `<style>`, inline style, raw color, or CSS framework.
