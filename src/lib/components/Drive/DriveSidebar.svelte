<script lang="ts">
  import { Icon } from "../Icon";
  import { List, ListItem } from "../List";
  import { Progress } from "../Progress";
  import { SegmentedControl } from "../SegmentedControl";
  import {
    DRIVE_MENU_OPTIONS,
    DRIVE_SCOPE_SEGMENT_OPTIONS,
    formatFileSize,
    isValidDriveScope,
    type DriveMenuOption,
    type DriveScope,
  } from "../../utils/drive";

  interface StorageInfo {
    used: number;
    total: number;
    percentage: number;
  }

  interface Props {
    currentScope?: DriveScope;
    selectedMenu: DriveMenuOption | null;
    storageInfo: StorageInfo;
    closable?: boolean;
    showScopeControl?: boolean;
    onscopechange?: (scope: DriveScope) => void;
    onmenuselect?: (menu: DriveMenuOption | null) => void;
    onclose?: () => void;
  }

  const {
    currentScope,
    selectedMenu,
    storageInfo,
    closable = false,
    showScopeControl = currentScope !== undefined,
    onscopechange,
    onmenuselect,
    onclose,
  }: Props = $props();

  const effectiveScope = $derived(currentScope ?? "shared");
  const isMyDriveActive = $derived(!selectedMenu);
  const storageColor = $derived(
    storageInfo.percentage >= 95
      ? "danger"
      : storageInfo.percentage >= 80
        ? "warning"
        : "primary",
  );
</script>

{#if closable}
  <div class="drive-sidebar__header">
    <span class="lumi-text--sm lumi-font--bold">Drive</span>
    <button
      type="button"
      class="drive-sidebar__close"
      onclick={onclose}
      aria-label="Cerrar"
    >
      <Icon icon="x" size="sm" />
    </button>
  </div>
{/if}

{#if showScopeControl}
  <div class="lumi-page-sidebar__section">
    <p class="lumi-page-sidebar__label">Espacio</p>
    <div class="lumi-drive-sidebar__scope">
      <SegmentedControl
        value={effectiveScope}
        options={DRIVE_SCOPE_SEGMENT_OPTIONS}
        color="info"
        fullWidth
        aria-label="Seleccionar espacio de Drive"
        onchange={(value) => {
          if (typeof value === "string" && isValidDriveScope(value)) {
            onscopechange?.(value);
          }
        }}
      />
    </div>
  </div>
{/if}

<div class="lumi-page-sidebar__section">
  <p class="lumi-page-sidebar__label">Navegación</p>
  <List size="sm" color="primary" class="drive-sidebar__nav">
    <ListItem
      title="Mi unidad"
      subtitle="Archivos y carpetas"
      icon="hardDrive"
      clickable
      active={isMyDriveActive}
      onclick={() => onmenuselect?.(null)}
    />
    {#each DRIVE_MENU_OPTIONS.main as menu (menu.value)}
      <ListItem
        title={menu.name}
        subtitle={menu.value === "recent"
          ? "Actividad reciente"
          : "Mayor tamaño"}
        icon={menu.icon}
        clickable
        active={selectedMenu?.value === menu.value}
        onclick={() => onmenuselect?.(menu)}
      />
    {/each}
    {#each DRIVE_MENU_OPTIONS.trash as menu (menu.value)}
      <ListItem
        title={menu.name}
        subtitle="Eliminados temporalmente"
        icon={menu.icon}
        clickable
        active={selectedMenu?.value === menu.value}
        onclick={() => onmenuselect?.(menu)}
      />
    {/each}
  </List>
</div>

<div class="lumi-page-sidebar__section">
  <p class="lumi-page-sidebar__label">Almacenamiento</p>
  <Progress value={storageInfo.percentage} color={storageColor} />
  <div class="drive-sidebar__storage-meta">
    <span class="lumi-text--xs lumi-text--muted">
      {formatFileSize(storageInfo.used)} de {formatFileSize(storageInfo.total)}
    </span>
    <span class="lumi-text--xs lumi-text--muted">{storageInfo.percentage}%</span
    >
  </div>
</div>

<style>
  :global(.drive-sidebar__nav) {
    max-height: var(--lumi-drive-sidebar-nav-max-height);
  }

  .lumi-drive-sidebar__scope {
    width: 100%;
  }

  .drive-sidebar__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .drive-sidebar__close {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--lumi-space-2xs);
    border: none;
    border-radius: var(--lumi-radius-full);
    background: transparent;
    color: var(--lumi-color-text-muted);
    cursor: pointer;
    transition: var(--lumi-transition-all);
  }

  .drive-sidebar__close:hover {
    background: var(--lumi-color-background-hover);
    color: var(--lumi-color-text);
  }

  .drive-sidebar__storage-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
