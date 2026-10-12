# Refactor review — 2026-10-12

Reviewed the public Svelte surface, component contracts and implementations, styles, shared utilities, package contents, and browser behavior for **0.5.0**. The source diff removes 898 lines and adds 925, a net increase of 27 lines for shared chart and modal behavior; no dependencies were added. Package metadata and upgrade notes are ready for release. No publication was performed.

## Applied

| Responsibility        | Change                                                                                                                                                                                                                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tables                | Index selected row identities once, preserve number/string identity, avoid cloning data without an active local search, normalize pagination inputs, keep keyboard behavior out of editable cells, and shrink wide table content within dashboard grids.                                                                  |
| Charts                | Share a finite, signed, overflow-safe axis scale; keep zero and negative values visible; fit charts to their actual container; share pointer/keyboard tooltip state; expose arrow/Home/End/Escape navigation and tooltip descriptions.                                                                                    |
| Dialogs and drawers   | Use one per-document modal stack for scroll locking, top-modal Escape handling, focus trapping/restoration, and inert lower overlays. Resolve parent-child order even when nested dialogs mount in the same update. Portal mobile drawers out of clipped layouts and release their modal state at the desktop breakpoint. |
| Layouts               | Bound grid tracks and children, let mobile cards fit containers below 320px, use dynamic viewport height and safe-area tokens, and keep closed mobile sidebar links out of the focus order.                                                                                                                               |
| Shared component code | Remove duplicated handlers, styles, formatters, stale callbacks, listeners, allocations and state; use Svelte-generated stable IDs instead of browser-only randomness; clean and alphabetize the root export surface without changing its symbols.                                                                        |
| Release readiness     | Bump package metadata to 0.5.0, document corrected runtime behavior and portal styling in the upgrade guide, and remeasure package and browser payloads.                                                                                                                                                                  |

## Verification evidence

- Table SSR checks cover 63 valid combinations and 12 malformed numeric inputs. A 1,000-selected-row operation count falls from 1,504,500 `rowKey` calls to 3,000; this is an operation-count comparison, not a latency claim. Browser checks confirm Enter invokes a double-click-only row action and editable cells retain Enter.
- Chart checks cover 36 zero, negative, sparse, narrow, missing, and extreme-value cases. At a 390px viewport the 280px card has no page-level horizontal overflow; long table content scrolls inside the table. Keyboard `End` reaches the last point, updates the tooltip description, and Escape clears it.
- Browser checks confirm simultaneously mounted parent/child dialogs put the child on top and focused, closing it restores focus to the parent, Escape closes the active modal, and body styles/focus restore after the final close. The mobile drawer traps focus, supports keyboard selection and Escape, then releases modal state when resized to desktop. A 390×844 dialog respects all four safe-area values with no horizontal overflow.
- Public export AST comparison preserves exported names, aliases, source origins, and type/value distinctions. File-size, MIME, extension, and component-identity checks cover the shared helper changes.
- Under one Vite 8.1.3, OXC, Lightning CSS, external-Svelte, gzip-9 comparison against the immediately previous working-tree snapshot: controls plus CSS are 25,572 bytes (115 fewer), charts plus CSS 9,260 bytes (315 more for chart behavior), Checkbox 2,764 bytes (29 fewer), and global CSS 11,828 bytes (140 more). The current budgets remain 25,600 bytes for controls and 12,288 bytes for global CSS.
- `npm pack --dry-run --ignore-scripts --json` reports a 162,383-byte tarball and 768,511 unpacked bytes. No dependencies were added.
- Final checks: `pnpm install --ignore-scripts`, `pnpm run lint`, `pnpm run check`, example `pnpm run check`, `pnpm run package`, and `git diff --check`.

## Remaining release considerations

1. `AvatarPicker` still defaults to `name="avatar"`; multiple pickers in one form need distinct names. Changing the default would alter submitted field names.
2. Historical Drive/dashboard compositions, Spanish copy, and PEN/es-PE formatting remain compatibility contracts. Replacing them with domain-neutral localization needs an explicit migration.
3. Arbitrary string icon props retain the Lucide registry by contract. Consumers with fixed internal icons should use deep Lucide imports to avoid pulling in that registry.

The measured controls payload has only 28 bytes of headroom under its current 25 KiB release budget, so remeasure it after any further component change. Passing these focused checks and budgets is not a claim of complete accessibility coverage.
