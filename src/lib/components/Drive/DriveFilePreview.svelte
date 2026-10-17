<script module lang="ts">
	import * as en from '../../i18n/en';
	import { lumiDriveEn } from '../../i18n/drive';

	const COPY = { ...lumiDriveEn, close: en.close };
</script>

<script lang="ts">
	import Download from '@lucide/svelte/icons/download';
	import FileIcon from '@lucide/svelte/icons/file';
	import Music from '@lucide/svelte/icons/music';
	import { Button } from '../Button';
	import { Dialog } from '../Dialog';
	import { Icon } from '../Icon';
	import { useLumiLocale } from '../../i18n';
	import {
		formatDriveDateTime,
		formatFileSize,
		getDriveServeUrl,
		getDriveTypeLabel,
		getFileColor,
		getFileIcon,
		type DriveDateFormatter,
		type DriveServeUrlResolver
	} from '../../utils/drive';
	import type { DriveFileItem } from './types';

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
		formatDate,
		serveUrl = getDriveServeUrl
	}: Props = $props();

	const i18n = useLumiLocale(COPY);

	const previewUrl = $derived.by(() => {
		if (!file) {
			return '';
		}

		if (file.type === 'img') {
			return serveUrl(file.code, { variant: 'preview' });
		}

		return serveUrl(file.code);
	});
	const isImage = $derived(file?.type === 'img');
	const isVideo = $derived(file?.type === 'vid');
	const isAudio = $derived(file?.type === 'aud');
	const isPdf = $derived(
		file?.mime_type === 'application/pdf' ||
			file?.name.toLowerCase().endsWith('.pdf')
	);
</script>

<Dialog bind:open title={file?.name || i18n.t.drivePreview} size="lg">
	<div class="lumi-drive-preview">
		{#if !file}
			<div class="lumi-drive-preview__empty">
				<Icon icon={FileIcon} size="2xl" color="muted" />
				<p>{i18n.t.driveNoSelection}</p>
			</div>
		{:else if isImage}
			<div class="lumi-drive-preview__media-wrap">
				<img
					src={previewUrl}
					alt={file.name}
					class="lumi-drive-preview__image"
					decoding="async"
				/>
			</div>
		{:else if isVideo}
			<div class="lumi-drive-preview__media-wrap">
				<!-- svelte-ignore a11y_media_has_caption -->
				<video src={previewUrl} controls class="lumi-drive-preview__video"
				></video>
			</div>
		{:else if isAudio}
			<div class="lumi-drive-preview__audio-wrap">
				<Icon icon={Music} size="var(--lumi-space-4xl)" color="warning" />
				<audio src={previewUrl} controls class="lumi-drive-preview__audio"
				></audio>
			</div>
		{:else if isPdf}
			<div class="lumi-drive-preview__pdf-wrap">
				<iframe
					src={previewUrl}
					title={file.name}
					class="lumi-drive-preview__pdf"
				></iframe>
			</div>
		{:else}
			<div class="lumi-drive-preview__empty">
				<Icon icon={FileIcon} size="2xl" color="muted" />
				<p>{i18n.t.drivePreviewUnavailable}</p>
			</div>
		{/if}
	</div>

	{#if file}
		<div class="lumi-drive-preview__details">
			<div class="lumi-drive-preview__details-main">
				<Icon
					icon={getFileIcon(file.type)}
					size="md"
					color={getFileColor(file.type)}
				/>
				<div class="lumi-drive-preview__details-text">
					<span class="lumi-drive-preview__name">{file.name}</span>
					<span class="lumi-drive-preview__meta">
						{getDriveTypeLabel(file.type, i18n.t)}
						{#if file.type !== 'dir'}
							• {formatFileSize(file.size)}
						{/if}
					</span>
				</div>
			</div>
			<div class="lumi-drive-preview__details-meta">
				<span class="lumi-drive-preview__meta"
					>{i18n.t.driveColumnModified}: {formatDate
						? formatDate(file.updated_at)
						: formatDriveDateTime(file.updated_at, i18n)}</span
				>
				{#if file.mime_type}
					<span class="lumi-drive-preview__meta">{file.mime_type}</span>
				{/if}
			</div>
		</div>
	{/if}

	{#snippet footer()}
		<Button variant="border" onclick={() => (open = false)}
			>{i18n.t.close}</Button
		>
		{#if file}
			<Button
				variant="filled"
				icon={Download}
				onclick={() => ondownload?.(file)}>{i18n.t.driveDownload}</Button
			>
		{/if}
	{/snippet}
</Dialog>

<style>
	.lumi-drive-preview__name {
		font-weight: var(--lumi-font-weight-medium);
	}

	.lumi-drive-preview__meta {
		color: var(--lumi-color-text-muted);
		font-size: var(--lumi-font-size-xs);
	}

	.lumi-drive-preview {
		min-height: var(--lumi-drive-preview-min-height);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--lumi-space-sm);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border-light);
		border-radius: var(--lumi-radius-panel);
		background:
			linear-gradient(
				145deg,
				color-mix(in srgb, var(--lumi-color-primary) 3%, transparent) 0%,
				transparent 60%,
				transparent 100%
			),
			var(--lumi-color-background-secondary);
	}

	.lumi-drive-preview__media-wrap {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.lumi-drive-preview__image {
		max-width: 100%;
		max-height: 70vh;
		object-fit: contain;
		border-radius: var(--lumi-radius-tile);
		box-shadow: var(--lumi-shadow-md);
	}

	.lumi-drive-preview__video {
		width: 100%;
		max-height: 70vh;
		border-radius: var(--lumi-radius-tile);
		box-shadow: var(--lumi-shadow-md);
	}

	.lumi-drive-preview__audio-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--lumi-space-lg);
		padding: var(--lumi-space-xl);
		width: 100%;
	}

	.lumi-drive-preview__audio {
		width: 100%;
		max-width: var(--lumi-drive-preview-audio-max-width);
	}

	.lumi-drive-preview__pdf-wrap {
		width: 100%;
		height: 70vh;
	}

	.lumi-drive-preview__pdf {
		width: 100%;
		height: 100%;
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border-light);
		border-radius: var(--lumi-radius-tile);
		background: var(--lumi-color-surface);
	}

	.lumi-drive-preview__empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--lumi-space-sm);
		color: var(--lumi-color-text-muted);
		text-align: center;
	}

	.lumi-drive-preview__details {
		margin-top: var(--lumi-space-sm);
		padding: var(--lumi-space-sm) var(--lumi-space-md);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border-light);
		border-radius: var(--lumi-radius-tile);
		background: var(--lumi-color-surface);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--lumi-space-md);
		flex-wrap: wrap;
	}

	.lumi-drive-preview__details-main {
		display: flex;
		align-items: center;
		gap: var(--lumi-space-sm);
		min-width: 0;
	}

	.lumi-drive-preview__details-text {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.lumi-drive-preview__details-text span:first-child {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: var(--lumi-drive-preview-title-max-width);
	}

	.lumi-drive-preview__details-meta {
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-2xs);
		text-align: right;
	}

	@media (max-width: 48rem) {
		.lumi-drive-preview {
			min-height: var(--lumi-drive-preview-min-height-mobile);
		}

		.lumi-drive-preview__details-meta {
			text-align: left;
		}
	}
</style>
