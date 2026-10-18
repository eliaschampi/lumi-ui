# 1.0 review — 2026-10-17

Lumi 1.0 was built by separate builders for foundation, forms/data, display/overlays and new components, each followed by an independent adversarial review and a fix round, and closed by a verification pass. Consumer evidence came from a usage audit of Faztore, Coedula and Aeduca. Migration: [Upgrade 0.6 → 1.0](./UPGRADE.md#060--100).

## What changed and why

| Area           | Change                                                                                                                                                                                | Evidence                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Icons          | String registry empty by default; library internals deep-import Lucide; `registerIcons` + optional `@lumi-ui/svelte/icons`                                                            | Every component rendering `Icon` paid ~8.4 KB gzip for 103 icons; Faztore's storefront used 8 |
| i18n           | `setLumiLocale` context, per-key English exports (tree-shaken), `lumiEs`, Drive dictionaries                                                                                          | Library mixed Spanish and English defaults; apps passed the same Spanish props ~100 times     |
| CSS            | `core.css` → `base` + `layout` + `utilities`, cascade layers, `patterns.css` and `charts.css` opt-in, 122 unused classes removed, symmetric spacing ladders                           | 105/320 core and 29/97 pattern classes were unused by Lumi and all three apps                 |
| Shared recipes | `.lumi-spinner`, `.lumi-skeleton`, `.lumi-switcher`, `.lumi-sr-only`, `.lumi-icon`, `Field/field.css`, internal `CloseButton`, `MenuSurface`, `StatusSurface`                         | Four spinner copies, four field shells, duplicated menu and status surfaces                   |
| Semantics      | `Button href`/`pressed`, `<ul>`/`<li>` lists with stretched targets, `<hr>` dividers, menus/tooltips that keep focus and Escape inside dialogs, overlays portaled into the open modal | 110 buttons navigated through JavaScript; fake toggles had no `aria-pressed`                  |
| New            | `ToggleGroup`, `Skeleton`, `Message`, `MessageList`, `Pagination` (crawlable links), `Toaster` + `createToaster`                                                                      | Hand-rolled pagination ×5, toast queues ×2, no skeletons, a chat thread in Aeduca             |
| API            | One name per concept (`selected`, `current`, `placement`, `color`, `description`, lowercase callbacks), unused props removed                                                          | Codemod `scripts/migrate-1.0.mjs` rewrites or reports every rename                            |

Deliberately not added: a custom date picker (the apps use 39 native date/time inputs and no calendars), a generic popover, and app-level patterns such as a confirm dialog (candidate for a future `src/lib/patterns/`).

## Verification evidence

- Library: `pnpm run lint`, `pnpm run check` (0 errors, 0 warnings), `pnpm run test`, `pnpm run package` and `git diff --check` pass. SSR renders of every changed component in English and Spanish were inspected for roles, names, ids and nesting.
- Sizes (fully minified Vite 8 bundles, gzip 9, Svelte external; 0.6.0 re-measured the same way): Button 10,880 → 2,646 B, Divider 9,650 → 977 B, form/table contract set 22,424 → 14,074 B, storefront set 17,249 → 8,910 B, global CSS 11,661 → 8,396 B. All exports 83,450 → 79,134 B while adding six components.
- Consumers: the codemod (after `migrate-0.6.mjs` for apps on 0.4) migrated 334 (Faztore), 449 (Coedula) and 506 (Aeduca) tags. `svelte-check` went from 0 errors on 0.x to 2 / 2 / 3 errors on 1.0, all in app-owned code: a local Drive menu type, an app toast type using `'error'`, and `{#if}` narrowing that does not reach a snippet.
- Faztore production build: public pages shrink by about 9 KB gzip (home 100.2 → 91.0 KB) and render-blocking CSS by 15–20% with lean style imports.

- An external pre-merge review found four defects, each now covered by a regression test in `tests/` that fails on the earlier code: toasts stranded when a Dialog unmounted while open (toast regions are now tracked by the modal stack instead of queried), Tabs without a tab stop for an unknown `value`, an emptied required `NumberInput` committing `min`, and `Select` `required` never blocking submission (hidden inputs cannot be validated; a visually hidden proxy now does).

## Remaining considerations

1. `Select` is ~13.5 KB, two thirds Floating UI. CSS anchor positioning + the popover API can replace it once baseline support covers the products' browsers.
2. Tooltip descriptions attach to a consumer's own focusable child only after hydration; the server output carries the description as screen-reader text.
3. Overlay positioning inside dialogs and the new `MessageList` scrolling were verified by review and SSR, not by an automated browser suite. Check them by hand in light/dark mode before publishing.
4. Input sizes (`xs`–`xl`) differ from Select/Textarea/NumberInput (`sm`–`lg`), and `Select.clearable` defaults to `true`; both are documented, unchanged contracts.
