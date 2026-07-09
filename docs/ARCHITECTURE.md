# Lumi UI Architecture

## Extraction Decision

The library is a selective merge:

- Coedula source: `Dialog`, `Context`, `RemoteSelect`, broad layout utilities, and robust overlay behavior.
- Faztore source: `Input`, `NumberInput`, `SegmentedControl`, `Sidebar`, `SidebarHeader`, `floating.svelte.ts`, and richer surface tokens.
- Shared/equal source: `Table`, `Tabs`, `Textarea`, `Button`, `Icon`, `Avatar`, `Card` with targeted fusion.

## Package Shape

```txt
src/lib/
  actions/
  components/
  styles/
    core.css
    index.css
    tokens.base.css
  utils/
```

## CSS Ownership

`tokens.base.css` defines the full token contract and ships the default identity (Coedula — cobalt primary, olive secondary, warm-paper neutrals). `core.css` owns only domain-neutral layout, surfaces, and utilities.

No domain classes belong in `core.css`.

Examples that must stay out:

- `.lumi-page-sidebar__card--attendance`
- `.lumi-page-sidebar__card--inventory`
- `.lumi-product-*`
- `.lumi-student-*`

## Component Ownership

Primitive components must be usable in any product surface. If a component needs app actions, server endpoints, permissions, database entities, stores, or route invalidation, it is not a core component.

## Overlay Standard

Floating UI behavior uses `@floating-ui/dom` through `createFloating`. Components that can be clipped by parent overflow must use `portal`.

Portaled overlays own their open lifecycle. If a component delays unmounting for transitions, a new open must cancel the pending close before changing target data or position.

## Theme Direction

The target visual language is calm, modern, high-contrast-enough glass:

- semantic color seeds
- layered surfaces
- translucent layout content so cards remain visibly elevated
- subtle 145 degree gradients
- tokenized shadows
- soft motion
- no arbitrary decoration
