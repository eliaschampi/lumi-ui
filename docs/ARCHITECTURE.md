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
  color-scheme/
  components/
  styles/
    core.css
    index.css
    tokens.base.css
  utils/
```

## CSS Ownership

`tokens.base.css` defines the full token contract and ships the shared Lumi identity (cobalt primary, olive secondary, warm-paper neutrals). `core.css` owns only domain-neutral layout, surfaces, and utilities.

Brand configuration is a build-time/cascade concern owned by the consuming application. A developer overrides `--lumi-brand-primary` and `--lumi-brand-secondary` after importing Lumi styles. Derived light/dark accents, state fills, gradients and component semantics continue to belong to Lumi.

Lumi intentionally has no theme provider or runtime palette API. Product code must not override component-level tokens to create a brand theme. Optional `*-dark` and `*-foreground` brand seeds exist only for identities that require manual accessibility calibration.

## Color Scheme Ownership

Brand identity and light/dark preference are separate contracts. Brand identity remains CSS-only. Lumi owns the visual light/dark token sets and exposes an optional `@lumi-ui/svelte/color-scheme` entry point for the generic `system | light | dark` preference lifecycle.

The color-scheme controller is SSR-safe, has no import-time DOM effects, and owns persistence, operating-system synchronization, DOM application and listener cleanup. `ColorSchemeScript` performs the matching pre-paint resolution for SSR applications. Consumer applications own only the controller instance, UI labels/icons and whether a selector is presented.

No domain classes belong in `core.css`.

Examples that must stay out:

- `.lumi-page-sidebar__card--attendance`
- `.lumi-page-sidebar__card--inventory`
- `.lumi-product-*`
- `.lumi-student-*`

## Component Ownership

Primitive components must be usable in any product surface. If a component needs app actions, server endpoints, permissions, database entities, stores, or route invalidation, it is not a core component.

## Overlay Standard

Floating UI behavior uses `@floating-ui/dom` through `createFloating`. Element anchors and pointer-based virtual references share the same flip, shift, size and arrow pipeline. Components that can be clipped by parent overflow must use `portal`.

Portaled overlays own their open lifecycle, dismissal and focus semantics. Menu roles must provide arrow/Home/End navigation, skip disabled items and restore focus when keyboard interaction closes the menu.

## Theme Direction

The target visual language is calm, modern, high-contrast-enough glass:

- semantic color seeds
- layered surfaces
- translucent layout content so cards remain visibly elevated
- subtle 145 degree gradients
- tokenized shadows
- soft motion
- no arbitrary decoration
