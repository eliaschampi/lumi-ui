<script lang="ts">
  import { Icon } from "../Icon";
  import { Table } from "../Table";
  import type { TableRow } from "../Table";
  import {
    driveTagColorCssVar,
    formatFileSize,
    formatDriveDate,
    getDriveTagByHash,
    getDriveTypeLabel,
    getFileColor,
    getFileIcon,
    type DriveDateFormatter,
  } from "../../utils/drive";
  import type { DriveFileItem } from "./types";

  interface Props {
    files: DriveFileItem[];
    selectedFiles: string[];
    isTrash?: boolean;
    onfileclick?: (file: DriveFileItem) => void;
    onfiledblclick?: (file: DriveFileItem) => void;
    onfilecontextmenu?: (event: MouseEvent, file: DriveFileItem) => void;
    onfiledragstart?: (event: DragEvent, file: DriveFileItem) => void;
    onfiledragend?: () => void;
    onfiledrop?: (event: DragEvent, file: DriveFileItem) => void;
    formatDate?: DriveDateFormatter;
  }

  const {
    files,
    selectedFiles,
    isTrash = false,
    onfileclick,
    onfiledblclick,
    onfilecontextmenu,
    onfiledragstart,
    onfiledragend,
    onfiledrop,
    formatDate = formatDriveDate,
  }: Props = $props();

  const tableData = $derived(files as unknown as TableRow[]);
  const selectedFileSet = $derived(new Set(selectedFiles));

  function toDriveFile(row: TableRow): DriveFileItem {
    return row as unknown as DriveFileItem;
  }

  function handleRowClick(row: TableRow) {
    onfileclick?.(toDriveFile(row));
  }

  function handleRowDblClick(row: TableRow) {
    onfiledblclick?.(toDriveFile(row));
  }

  function handleRowContextMenu(event: MouseEvent, row: TableRow) {
    onfilecontextmenu?.(event, toDriveFile(row));
  }

  function handleDragStart(event: DragEvent, file: DriveFileItem) {
    if (isTrash) return;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("application/json", JSON.stringify(file));
    }
    onfiledragstart?.(event, file);
  }

  function handleDragOver(event: DragEvent, file: DriveFileItem) {
    event.preventDefault();
    if (file.type === "dir" && !isTrash && event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }

  function handleDrop(event: DragEvent, file: DriveFileItem) {
    event.preventDefault();
    if (file.type !== "dir" || isTrash) {
      return;
    }
    onfiledrop?.(event, file);
  }
</script>

<Table
  data={tableData}
  layout="fixed"
  hover
  onrow-click={(row) => handleRowClick(row)}
  onrow-dblclick={(row) => handleRowDblClick(row)}
  onrow-contextmenu={(event, row) => handleRowContextMenu(event, row)}
>
  {#snippet thead()}
    <th class="lumi-table-column--main">Nombre</th>
    <th class="lumi-table-column--compact">Tipo</th>
    <th class="lumi-table-column--compact">Tamaño</th>
    <th class="lumi-table-column--compact">Modificado</th>
  {/snippet}

  {#snippet row({ row })}
    {@const file = row as unknown as DriveFileItem}
    {@const tagOption = getDriveTagByHash(file.tag)}
    <td
      class="lumi-table-column--main"
      class:drive-file-list__cell--selected={selectedFileSet.has(file.code)}
    >
      <button
        type="button"
        class="drive-file-list__name-content"
        tabindex="-1"
        draggable={!isTrash}
        ondragstart={(event) => handleDragStart(event, file)}
        ondragend={() => onfiledragend?.()}
        ondragover={(event) => handleDragOver(event, file)}
        ondrop={(event) => handleDrop(event, file)}
      >
        <Icon
          icon={getFileIcon(file.type)}
          size="sm"
          color={getFileColor(file.type)}
        />
        <span
          class="drive-file-list__name-text lumi-text-break lumi-text-clamp--2"
          title={file.name}>{file.name}</span
        >
        {#if tagOption}
          <span
            class="drive-file-list__tag"
            style:--drive-tag-color={driveTagColorCssVar(tagOption.color)}
          ></span>
        {/if}
      </button>
    </td>
    <td class:drive-file-list__cell--selected={selectedFileSet.has(file.code)}>
      <span class="lumi-text--sm lumi-text--muted"
        >{getDriveTypeLabel(file.type)}</span
      >
    </td>
    <td class:drive-file-list__cell--selected={selectedFileSet.has(file.code)}>
      <span class="lumi-text--sm lumi-text--muted">
        {file.type === "dir" ? "—" : formatFileSize(file.size)}
      </span>
    </td>
    <td class:drive-file-list__cell--selected={selectedFileSet.has(file.code)}>
      <span class="lumi-text--sm lumi-text--muted"
        >{formatDate(file.updated_at)}</span
      >
    </td>
  {/snippet}
</Table>

<style>
  .drive-file-list__cell--selected {
    background: color-mix(
      in srgb,
      var(--lumi-color-primary) 10%,
      var(--lumi-color-surface-card)
    );
  }

  .drive-file-list__name-content {
    display: flex;
    align-items: center;
    gap: var(--lumi-space-xs);
    width: 100%;
    min-width: 0;
    padding: var(--lumi-space-2xs);
    border: none;
    background: transparent;
    color: var(--lumi-color-text);
    text-align: left;
    font: inherit;
  }

  .drive-file-list__name-text {
    flex: 1 1 auto;
    min-width: 0;
  }

  .drive-file-list__tag {
    width: var(--lumi-drive-tag-dot-size);
    height: var(--lumi-drive-tag-dot-size);
    border-radius: var(--lumi-radius-full);
    flex-shrink: 0;
    background: var(--drive-tag-color, var(--lumi-color-border));
  }
</style>
