<script lang="ts">
  import { Button } from "../Button";
  import { Dialog } from "../Dialog";
  import { Icon } from "../Icon";
  import {
    formatDriveDateTime,
    formatFileSize,
    getDriveServeUrl,
    getDriveTypeLabel,
    getFileColor,
    getFileIcon,
    type DriveDateFormatter,
    type DriveServeUrlResolver,
  } from "../../utils/drive";
  import type { DriveFileItem } from "./types";

  interface Props {
    open: boolean;
    file: DriveFileItem | null;
    ondownload?: (file: DriveFileItem) => void;
    formatDate?: DriveDateFormatter;
    serveUrl?: DriveServeUrlResolver;
  }

  let {
    open = $bindable(false),
    file,
    ondownload,
    formatDate = formatDriveDateTime,
    serveUrl = getDriveServeUrl,
  }: Props = $props();

  const previewUrl = $derived.by(() => {
    if (!file) {
      return "";
    }

    if (file.type === "img") {
      return serveUrl(file.code, { variant: "preview" });
    }

    return serveUrl(file.code);
  });
  const isImage = $derived(file?.type === "img");
  const isVideo = $derived(file?.type === "vid");
  const isAudio = $derived(file?.type === "aud");
  const isPdf = $derived(
    file?.mime_type === "application/pdf" ||
      file?.name.toLowerCase().endsWith(".pdf"),
  );
</script>

<Dialog bind:open title={file?.name || "Vista previa"} size="lg">
  <div class="drive-preview">
    {#if !file}
      <div class="drive-preview__empty">
        <Icon icon="file" size="2xl" color="muted" />
        <p>No hay archivo seleccionado</p>
      </div>
    {:else if isImage}
      <div class="drive-preview__media-wrap">
        <img src={previewUrl} alt={file.name} class="drive-preview__image" />
      </div>
    {:else if isVideo}
      <div class="drive-preview__media-wrap">
        <!-- svelte-ignore a11y_media_has_caption -->
        <video src={previewUrl} controls class="drive-preview__video">
          Tu navegador no soporta la reproducción de video.
        </video>
      </div>
    {:else if isAudio}
      <div class="drive-preview__audio-wrap">
        <Icon icon="music" size="var(--lumi-space-4xl)" color="warning" />
        <audio src={previewUrl} controls class="drive-preview__audio">
          Tu navegador no soporta la reproducción de audio.
        </audio>
      </div>
    {:else if isPdf}
      <div class="drive-preview__pdf-wrap">
        <iframe src={previewUrl} title={file.name} class="drive-preview__pdf"
        ></iframe>
      </div>
    {:else}
      <div class="drive-preview__empty">
        <Icon icon="file" size="2xl" color="muted" />
        <p>Vista previa no disponible para este tipo de archivo</p>
      </div>
    {/if}
  </div>

  {#if file}
    <div class="drive-preview__details">
      <div class="drive-preview__details-main">
        <Icon
          icon={getFileIcon(file.type)}
          size="md"
          color={getFileColor(file.type)}
        />
        <div class="drive-preview__details-text">
          <span class="lumi-font--medium">{file.name}</span>
          <span class="lumi-text--xs lumi-text--muted">
            {getDriveTypeLabel(file.type)}
            {#if file.type !== "dir"}
              • {formatFileSize(file.size)}
            {/if}
          </span>
        </div>
      </div>
      <div class="drive-preview__details-meta">
        <span class="lumi-text--xs lumi-text--muted"
          >Actualizado: {formatDate(file.updated_at)}</span
        >
        {#if file.mime_type}
          <span class="lumi-text--xs lumi-text--muted">{file.mime_type}</span>
        {/if}
      </div>
    </div>
  {/if}

  {#snippet footer()}
    <Button variant="border" onclick={() => (open = false)}>Cerrar</Button>
    {#if file}
      <Button variant="filled" icon="download" onclick={() => ondownload?.(file)}
        >Descargar</Button
      >
    {/if}
  {/snippet}
</Dialog>

<style>
  .drive-preview {
    min-height: var(--lumi-drive-preview-min-height);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--lumi-space-sm);
    border: var(--lumi-border-width-thin) solid var(--lumi-color-border-light);
    border-radius: var(--lumi-radius-xl);
    background:
      linear-gradient(
        145deg,
        color-mix(in srgb, var(--lumi-color-primary) 3%, transparent) 0%,
        transparent 60%,
        transparent 100%
      ),
      var(--lumi-color-background-secondary);
  }

  .drive-preview__media-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .drive-preview__image {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
    border-radius: var(--lumi-radius-lg);
    box-shadow: var(--lumi-shadow-md);
  }

  .drive-preview__video {
    width: 100%;
    max-height: 70vh;
    border-radius: var(--lumi-radius-lg);
    box-shadow: var(--lumi-shadow-md);
  }

  .drive-preview__audio-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--lumi-space-lg);
    padding: var(--lumi-space-xl);
    width: 100%;
  }

  .drive-preview__audio {
    width: 100%;
    max-width: var(--lumi-drive-preview-audio-max-width);
  }

  .drive-preview__pdf-wrap {
    width: 100%;
    height: 70vh;
  }

  .drive-preview__pdf {
    width: 100%;
    height: 100%;
    border: var(--lumi-border-width-thin) solid var(--lumi-color-border-light);
    border-radius: var(--lumi-radius-lg);
    background: var(--lumi-color-surface);
  }

  .drive-preview__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--lumi-space-sm);
    color: var(--lumi-color-text-muted);
    text-align: center;
  }

  .drive-preview__details {
    margin-top: var(--lumi-space-sm);
    padding: var(--lumi-space-sm) var(--lumi-space-md);
    border: var(--lumi-border-width-thin) solid var(--lumi-color-border-light);
    border-radius: var(--lumi-radius-lg);
    background: var(--lumi-color-surface);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--lumi-space-md);
    flex-wrap: wrap;
  }

  .drive-preview__details-main {
    display: flex;
    align-items: center;
    gap: var(--lumi-space-sm);
    min-width: 0;
  }

  .drive-preview__details-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .drive-preview__details-text span:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: var(--lumi-drive-preview-title-max-width);
  }

  .drive-preview__details-meta {
    display: flex;
    flex-direction: column;
    gap: var(--lumi-space-2xs);
    text-align: right;
  }

  @media (max-width: 768px) {
    .drive-preview {
      min-height: var(--lumi-drive-preview-min-height-mobile);
    }

    .drive-preview__details-meta {
      text-align: left;
    }
  }
</style>
