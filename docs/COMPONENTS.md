# Component Catalog

> Every value currently exported from `@lumi-ui/svelte`, grouped for selection. Exact props: linked `types.ts` and `.svelte`. Local snippets/callbacks are not always in `types.ts`.

```ts
import { Button, Card } from '@lumi-ui/svelte';
import type { ButtonProps } from '@lumi-ui/svelte';
```

`ColorSchemeScript` lives on optional `/color-scheme` — see [Guide §3](./GUIDE.md#3-theming-and-color-scheme). Shared semantic scales: [`config.ts`](../src/lib/components/config.ts).

## Choose Between Similar Components

| Need                                                    | Choose                                                               |
| ------------------------------------------------------- | -------------------------------------------------------------------- |
| Text, numeric, or multiline input                       | `Input`, `NumberInput`, or `Textarea`                                |
| Few visible exclusive choices                           | `SegmentedControl`; `Radio` when each choice needs label/description |
| Longer or space-constrained choice                      | `Select`; `RemoteSelect` for server-backed search                    |
| Submitted boolean vs immediate setting                  | `Checkbox` vs `Switch`                                               |
| Persistent vs transient feedback                        | `Alert` vs `Notification`                                            |
| Generic vs titled dashboard surface                     | `Card` vs `DashboardSection`                                         |
| Structured records vs short content rows                | `Table` vs `List` / `ListItem`                                       |
| Anchored / pointer / interruptive / explanatory overlay | `Dropdown`, `Context`, `Dialog`, or `Tooltip`                        |
| No data / failure / pending                             | `EmptyState`, `ErrorState`, or `Loading`                             |

## Identity and Foundations

| Export            | Use                                        | Contract                                                                     |
| ----------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| `Icon`            | Lucide registry or compatible direct icon  | [`Icon/types.ts`](../src/lib/components/Icon/types.ts)                       |
| `Avatar`          | Image, initials, or icon identity          | [`Avatar/types.ts`](../src/lib/components/Avatar/types.ts)                   |
| `AvatarGroup`     | Bounded overlapping identities             | [`AvatarGroup/types.ts`](../src/lib/components/AvatarGroup/types.ts)         |
| `AvatarPicker`    | Choose one avatar option                   | [`AvatarPicker/types.ts`](../src/lib/components/AvatarPicker/types.ts)       |
| `Image`           | Responsive image with loading/error states | [`Image/types.ts`](../src/lib/components/Image/types.ts)                     |
| `IconBadge`       | Semantic icon badge                        | [`IconBadge/types.ts`](../src/lib/components/IconBadge/types.ts)             |
| `StatusIndicator` | Status dot, pulse, optional tooltip        | [`StatusIndicator/types.ts`](../src/lib/components/StatusIndicator/types.ts) |
| `Title`           | Semantic heading, subtitle, icon           | [`Title/types.ts`](../src/lib/components/Title/types.ts)                     |
| `UserInfo`        | Compact avatar and identity text           | [`UserInfo/types.ts`](../src/lib/components/UserInfo/types.ts)               |

## Actions and Forms

| Export                                | Use                                                 | Contract                                                                                                  |
| ------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `Button`                              | Action, icon action, or submit                      | [`types`](../src/lib/components/Button/types.ts), [`.svelte`](../src/lib/components/Button/Button.svelte) |
| `Input`                               | Text and native input types                         | [`Input/types.ts`](../src/lib/components/Input/types.ts)                                                  |
| `NumberInput`                         | Constrained numeric input                           | [`NumberInput/types.ts`](../src/lib/components/NumberInput/types.ts)                                      |
| `Textarea`                            | Multiline with hint/error/count                     | [`Textarea/types.ts`](../src/lib/components/Textarea/types.ts)                                            |
| `Checkbox`                            | Independent boolean form choice                     | [`Checkbox/types.ts`](../src/lib/components/Checkbox/types.ts)                                            |
| `Radio`                               | One labeled choice in a group                       | [`Radio/types.ts`](../src/lib/components/Radio/types.ts)                                                  |
| `Switch`                              | Immediate on/off preference                         | [`Switch/types.ts`](../src/lib/components/Switch/types.ts)                                                |
| `Slider`                              | Numeric range selection                             | [`Slider/types.ts`](../src/lib/components/Slider/types.ts)                                                |
| `Select`                              | Single choice; optional client/server search mode   | [`Select/types.ts`](../src/lib/components/Select/types.ts)                                                |
| `RemoteSelect`                        | Debounced, cancellable endpoint search with mappers | [`RemoteSelect.svelte`](../src/lib/components/Select/RemoteSelect.svelte)                                 |
| `SegmentedControl`                    | Short visible exclusive choice                      | [`SegmentedControl/types.ts`](../src/lib/components/SegmentedControl/types.ts)                            |
| `FileUpload`                          | Selection, validation, queue, removal               | [`FileUpload/types.ts`](../src/lib/components/FileUpload/types.ts)                                        |
| `DateRangeFilter`, `DateRangeToolbar` | Same from/to implementation; toolbar is an alias    | [`DateRangeFilter.svelte`](../src/lib/components/DateRangeFilter/DateRangeFilter.svelte)                  |
| `Fieldset`                            | Semantic grouping for related controls              | [`Fieldset/types.ts`](../src/lib/components/Fieldset/types.ts)                                            |
| `TagOption`                           | Compact semantic tag choice                         | [`TagOption/types.ts`](../src/lib/components/TagOption/types.ts)                                          |

## Surfaces and Feedback

| Export         | Use                                             | Contract                                                                                                                    |
| -------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `Card`         | Generic surface, link card, or button card      | [`types`](../src/lib/components/Card/types.ts), [`.svelte`](../src/lib/components/Card/Card.svelte)                         |
| `Alert`        | Persistent inline semantic message              | [`Alert/types.ts`](../src/lib/components/Alert/types.ts)                                                                    |
| `Chip`         | Compact label, status, or removable token       | [`Chip/types.ts`](../src/lib/components/Chip/types.ts)                                                                      |
| `Collapse`     | Expandable disclosure                           | [`Collapse/types.ts`](../src/lib/components/Collapse/types.ts)                                                              |
| `Divider`      | Visual or labeled separator                     | [`Divider/types.ts`](../src/lib/components/Divider/types.ts)                                                                |
| `EmptyState`   | No-content guidance                             | [`EmptyState/types.ts`](../src/lib/components/EmptyState/types.ts)                                                          |
| `ErrorState`   | Recovery surface for error statuses             | [`ErrorState/types.ts`](../src/lib/components/ErrorState/types.ts)                                                          |
| `Loading`      | Local pending indicator                         | [`Loading/types.ts`](../src/lib/components/Loading/types.ts)                                                                |
| `Notification` | Transient feedback where the consumer places it | [`types`](../src/lib/components/Notification/types.ts), [`.svelte`](../src/lib/components/Notification/Notification.svelte) |
| `Progress`     | Determinate or indeterminate progress           | [`Progress/types.ts`](../src/lib/components/Progress/types.ts)                                                              |
| `Tooltip`      | Portaled supplemental description               | [`types`](../src/lib/components/Tooltip/types.ts), [`.svelte`](../src/lib/components/Tooltip/Tooltip.svelte)                |

## Data and Dashboard Content

| Export                           | Use                                                        | Contract                                                                                                                                |
| -------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `Table`                          | Typed records, search, selection, pagination, row snippets | [`types`](../src/lib/components/Table/types.ts), [`.svelte`](../src/lib/components/Table/Table.svelte)                                  |
| `List`, `ListHeader`, `ListItem` | Short collection; section/actions; selectable rows         | [`List/types.ts`](../src/lib/components/List/types.ts)                                                                                  |
| `InfoItem`                       | Label/value metadata                                       | [`InfoItem/types.ts`](../src/lib/components/InfoItem/types.ts)                                                                          |
| `DashboardChart`                 | One or multiple typed chart series                         | [`DashboardChart/types.ts`](../src/lib/components/DashboardChart/types.ts)                                                              |
| `DashboardBarChart`              | Focused single-series bar chart                            | [`DashboardBarChart/types.ts`](../src/lib/components/DashboardBarChart/types.ts)                                                        |
| `DashboardSection`               | Titled card with actions/footer                            | [`types`](../src/lib/components/DashboardSection/types.ts), [`.svelte`](../src/lib/components/DashboardSection/DashboardSection.svelte) |
| `StatCard`                       | Linked or static metric                                    | [`StatCard/types.ts`](../src/lib/components/StatCard/types.ts)                                                                          |
| `QuickAccessCard`                | Navigational task card                                     | [`QuickAccessCard/types.ts`](../src/lib/components/QuickAccessCard/types.ts)                                                            |

## Navigation and Layout

| Export                                    | Use                                     | Contract                                                                                                                 |
| ----------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `Navbar`                                  | Dashboard top navigation slots          | [`types`](../src/lib/components/Navbar/types.ts), [`.svelte`](../src/lib/components/Navbar/Navbar.svelte)                |
| `Sidebar`, `SidebarHeader`, `SidebarItem` | Responsive primary nav + identity/items | [`Sidebar/types.ts`](../src/lib/components/Sidebar/types.ts)                                                             |
| `PageHeader`                              | Page identity and actions               | [`types`](../src/lib/components/PageHeader/types.ts), [`.svelte`](../src/lib/components/PageHeader/PageHeader.svelte)    |
| `PageSidebar`                             | Desktop side surface + mobile drawer    | [`types`](../src/lib/components/PageSidebar/types.ts), [`.svelte`](../src/lib/components/PageSidebar/PageSidebar.svelte) |
| `Tabs`                                    | Tablist for related panels              | [`types`](../src/lib/components/Tabs/types.ts), [`.svelte`](../src/lib/components/Tabs/Tabs.svelte)                      |

Shell recipes: [Guide §4](./GUIDE.md#4-layouts-and-composition). CSS families: [Guide §5](./GUIDE.md#5-core-css-reference).

## Overlays and Menus

| Export                     | Use                                     | Contract                                                                                                  |
| -------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `Dialog`                   | Interruptive modal with focus ownership | [`types`](../src/lib/components/Dialog/types.ts), [`.svelte`](../src/lib/components/Dialog/Dialog.svelte) |
| `Dropdown`, `DropdownItem` | Anchored action menu and entries        | [`Dropdown/types.ts`](../src/lib/components/Dropdown/types.ts)                                            |
| `Context`, `ContextItem`   | Pointer/row context menu and entries    | [`Context/types.ts`](../src/lib/components/Context/types.ts)                                              |

`Dropdown` and `Context` are menus, not generic popovers. Keep menu roles and keyboard behavior; use a neutral composition for mixed form controls.

## Drive Workspace

| Export                                                                                                     | Use                                                                  | Contract                                                                                        |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `DriveFileCard`, `DriveFileGrid`, `DriveFileList`, `DriveFilePreview`, `DriveFileUploader`, `DriveSidebar` | Opinionated file-workspace UI; persistence/endpoints stay in the app | [`Drive/types.ts`](../src/lib/components/Drive/types.ts), [source](../src/lib/components/Drive) |

These six are root exports. Pure helpers/types: `@lumi-ui/svelte/drive` — [Guide §1 entry points](./GUIDE.md#public-entry-points).

## Shared Config, Helpers, and Types

Non-component root exports from `@lumi-ui/svelte`. Use these to compose custom UI and keep product code type-safe against the same semantic scales components use.

| Export                                                                                                  | Kind          | Use                                                                                          |
| ------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------- |
| `LUMI_CONFIG`                                                                                           | const         | Shared size, color, icon-size, transition, floating geometry, and default-prop configuration |
| `getIconSize(size)`                                                                                     | function      | Map a `LumiSize` to an icon pixel size (falls back to `md`)                                  |
| `portal`                                                                                                | Svelte action | `use:portal={'css-selector'}` or `use:portal={element}`; default target is `document.body`   |
| `getIcon(name)`, `hasIcon(name)`, `getAvailableIcons()`                                                 | functions     | String-keyed Lucide icon registry lookup and listing                                         |
| `LumiColor`                                                                                             | type          | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info'`                   |
| `LumiSize`, `LumiCompactSize`, `LumiControlSize`, `LumiDisplaySize`, `LumiExtendedSize`, `LumiIconSize` | types         | Semantic size unions consumed by component `size` props                                      |
| `LumiTransition`                                                                                        | type          | `keyof typeof LUMI_CONFIG.transitions` (`fast` \| `base` \| `slow` \| `slower`)              |
| `ChartColor`, `ChartSeriesPoint`, `ChartValueFormat`                                                    | types         | Chart data contracts shared with `DashboardChart`                                            |
| `IconComponent`, `IconName`                                                                             | types         | Lucide component type and registry key union                                                 |

Contracts: [`config.ts`](../src/lib/components/config.ts), [`portal.ts`](../src/lib/actions/portal.ts), [`icons.ts`](../src/lib/utils/icons.ts), [`charts.ts`](../src/lib/types/charts.ts).

The string icon registry imports every registered Lucide icon at build time. For minimum bundle size, pass an imported Lucide component directly to `<Icon icon={...}/>` instead of a name.

## Behavioral Checks

- Read `.svelte` when snippets/callbacks matter; several are local, not in exported `*Props`.
- `RemoteSelect` needs endpoint/query and mapping inputs from its source.
- Supply `Table.rowKey` when records lack stable `id` or `key`.
- `Notification` renders in place; wrap in `.lumi-toast-portal` for a fixed toast stack.
- Icon-only controls need an accessible name; decorative nested icons do not.
- Preserve focus, dismissal, and roles when composing overlays.
