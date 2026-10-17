<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = {
		fileUploadTitle: en.fileUploadTitle,
		fileUploadHint: en.fileUploadHint,
		fileUploadAddMore: en.fileUploadAddMore,
		fileUploadList: en.fileUploadList,
		fileUploadRemove: en.fileUploadRemove,
		fileUploadMaxSize: en.fileUploadMaxSize,
		fileUploadType: en.fileUploadType
	};

	/** Native `accept` semantics (`.ext`, `type/*`, `type/sub`) for dropped files. */
	function accepts(file: File, accept: string | undefined): boolean {
		if (!accept) return true;
		const name = file.name.toLowerCase();
		const type = file.type.toLowerCase();
		return accept.split(',').some((token) => {
			const rule = token.trim().toLowerCase();
			if (!rule || rule === '*' || rule === '*/*') return true;
			if (rule.startsWith('.')) return name.endsWith(rule);
			if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
			return type === rule;
		});
	}

	let sequence = 0;
</script>

<script lang="ts">
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import CloudUpload from '@lucide/svelte/icons/cloud-upload';
	import FileIcon from '@lucide/svelte/icons/file';
	import Plus from '@lucide/svelte/icons/plus';
	import X from '@lucide/svelte/icons/x';
	import { useLumiLocale } from '../../i18n';
	import { formatFileSize } from '../../utils/file';
	import Icon from '../Icon/Icon.svelte';
	import type { FileUploadFile, FileUploadProps } from './types';

	let {
		files = $bindable([]),
		placeholderText,
		hintText,
		accept,
		multiple = false,
		maxSize = 0,
		disabled = false,
		addMoreText,
		class: className = '',
		validateFile,
		oninvalid,
		maxSizeErrorMessage,
		onchange,
		onremove
	}: FileUploadProps = $props();

	let picker: HTMLInputElement | undefined = $state();
	let dragging = $state(false);

	const i18n = useLumiLocale(COPY);
	const invalid = $derived(files.some((file) => file.status === 'error'));

	function validate(file: File): string | null {
		if (!accepts(file, accept)) return i18n.t.fileUploadType(file.name);
		if (maxSize > 0 && file.size > maxSize) {
			return (
				maxSizeErrorMessage?.(file, maxSize) ??
				i18n.t.fileUploadMaxSize(formatFileSize(maxSize))
			);
		}
		return validateFile?.(file) ?? null;
	}

	function add(list: FileList | null | undefined): void {
		if (disabled || !list?.length) return;
		const next: FileUploadFile[] = [];
		for (const file of list) {
			const error = validate(file);
			if (error && oninvalid) {
				oninvalid(error, file);
				continue;
			}
			next.push({
				id: `lumi-file-${++sequence}`,
				file,
				status: error ? 'error' : 'selected',
				progress: 0,
				error: error ?? undefined
			});
		}
		if (!next.length) return;
		files = multiple ? [...files, ...next] : next.slice(0, 1);
		onchange?.(files);
	}

	function remove(id: string): void {
		files = files.filter((file) => file.id !== id);
		onremove?.(id);
		onchange?.(files);
	}

	function handleDrop(event: DragEvent): void {
		event.preventDefault();
		dragging = false;
		add(event.dataTransfer?.files);
	}

	function handlePick(event: Event): void {
		const input = event.currentTarget as HTMLInputElement;
		add(input.files);
		input.value = '';
	}
</script>

<div
	class={[
		'lumi-file-upload',
		dragging && 'lumi-file-upload--dragging',
		disabled && 'lumi-file-upload--disabled',
		invalid && 'lumi-file-upload--invalid',
		className
	]}
	role="presentation"
	ondragover={(event) => {
		event.preventDefault();
		dragging = !disabled;
	}}
	ondragleave={(event) => {
		// Ignore moves between children of the zone.
		if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
			dragging = false;
		}
	}}
	ondrop={handleDrop}
>
	<input
		bind:this={picker}
		type="file"
		hidden
		{accept}
		{multiple}
		{disabled}
		onchange={handlePick}
	/>

	{#if files.length === 0}
		<button
			type="button"
			class="lumi-file-upload__placeholder"
			{disabled}
			onclick={() => picker?.click()}
		>
			<span class="lumi-file-upload__glyph" aria-hidden="true">
				<Icon icon={CloudUpload} size="xl" />
			</span>
			<span class="lumi-file-upload__title">
				{placeholderText ?? i18n.t.fileUploadTitle}
			</span>
			<span class="lumi-file-upload__hint">
				{hintText ?? i18n.t.fileUploadHint}
			</span>
		</button>
	{:else}
		<ul class="lumi-file-upload__list" aria-label={i18n.t.fileUploadList}>
			{#each files as item (item.id)}
				<li
					class="lumi-file-upload__item lumi-file-upload__item--{item.status}"
				>
					<span class="lumi-file-upload__file-icon" aria-hidden="true">
						<Icon icon={FileIcon} size="md" />
					</span>
					<span class="lumi-file-upload__details">
						<span class="lumi-file-upload__name" title={item.file.name}>
							{item.file.name}
						</span>
						<span class="lumi-file-upload__meta">
							{item.status === 'error'
								? item.error
								: formatFileSize(item.file.size)}
						</span>
					</span>
					{#if item.status === 'uploading'}
						<span
							class="lumi-spinner lumi-file-upload__spinner"
							aria-hidden="true"
						></span>
					{:else if item.status === 'success'}
						<Icon icon={CircleCheck} color="success" size="md" />
					{:else if !disabled}
						<button
							type="button"
							class="lumi-file-upload__remove"
							aria-label={i18n.t.fileUploadRemove(item.file.name)}
							onclick={() => remove(item.id)}
						>
							<Icon icon={X} size="sm" />
						</button>
					{/if}
					{#if item.status === 'uploading' || item.status === 'success'}
						<span
							class="lumi-file-upload__progress"
							style:inline-size="{item.progress}%"
							role="progressbar"
							aria-label={item.file.name}
							aria-valuenow={item.progress}
							aria-valuemin={0}
							aria-valuemax={100}
						></span>
					{/if}
				</li>
			{/each}
		</ul>

		{#if multiple}
			<button
				type="button"
				class="lumi-file-upload__add"
				{disabled}
				onclick={() => picker?.click()}
			>
				<Icon icon={Plus} size="sm" />
				{addMoreText ?? i18n.t.fileUploadAddMore}
			</button>
		{/if}
	{/if}
</div>

<style>
	.lumi-file-upload {
		--lumi-control-accent: var(--lumi-color-primary);
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-sm);
		inline-size: 100%;
		min-block-size: calc(var(--lumi-space-6xl) + var(--lumi-space-4xl));
		padding: var(--lumi-space-md);
		font-family: var(--lumi-font-family-sans);
		background: var(--lumi-color-surface);
		border: var(--lumi-border-width-thick) dashed var(--lumi-color-border);
		border-radius: var(--lumi-radius-panel);
		transition: var(--lumi-transition-interactive);
	}

	.lumi-file-upload:hover,
	.lumi-file-upload:focus-within,
	.lumi-file-upload--dragging {
		border-color: var(--lumi-control-accent);
	}

	.lumi-file-upload--dragging {
		background: var(--lumi-color-primary-bg);
		transform: scale(var(--lumi-interactive-hover-scale));
	}

	.lumi-file-upload--invalid {
		--lumi-control-accent: var(--lumi-color-danger);
		border-color: var(--lumi-color-danger);
	}

	.lumi-file-upload--disabled {
		opacity: var(--lumi-opacity-disabled);
		pointer-events: none;
		border-style: solid;
	}

	/* Empty state: the whole zone is one button. */
	.lumi-file-upload__placeholder {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--lumi-space-xs);
		padding: var(--lumi-space-lg);
		font: inherit;
		color: var(--lumi-color-text-muted);
		text-align: center;
		background: transparent;
		border: 0;
		border-radius: var(--lumi-radius-control);
		cursor: pointer;
	}

	.lumi-file-upload__placeholder:focus-visible,
	.lumi-file-upload__remove:focus-visible,
	.lumi-file-upload__add:focus-visible {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
	}

	.lumi-file-upload__glyph {
		display: grid;
		place-items: center;
		inline-size: var(--lumi-space-3xl);
		block-size: var(--lumi-space-3xl);
		margin-block-end: var(--lumi-space-xs);
		background: var(--lumi-color-background-secondary);
		border-radius: var(--lumi-radius-full);
		transition: var(--lumi-transition-interactive);
	}

	.lumi-file-upload__placeholder:hover .lumi-file-upload__glyph {
		color: var(--lumi-control-accent);
		background: var(--lumi-color-primary-bg);
		transform: scale(var(--lumi-interactive-zoom-scale));
	}

	.lumi-file-upload__title {
		font-size: var(--lumi-font-size-lg);
		font-weight: var(--lumi-font-weight-medium);
		color: var(--lumi-color-text);
	}

	.lumi-file-upload__hint {
		font-size: var(--lumi-font-size-sm);
	}

	.lumi-file-upload__list {
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-sm);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.lumi-file-upload__item {
		position: relative;
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--lumi-space-md);
		padding: var(--lumi-space-sm) var(--lumi-space-md);
		background: var(--lumi-color-background);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border);
		border-radius: var(--lumi-radius-control);
		overflow: hidden;
		transition: var(--lumi-transition-control);
	}

	.lumi-file-upload__item--success {
		--lumi-file-tone: var(--lumi-color-success);
	}

	.lumi-file-upload__item--error {
		--lumi-file-tone: var(--lumi-color-danger);
	}

	.lumi-file-upload__item--success,
	.lumi-file-upload__item--error {
		color: var(--lumi-file-tone);
		background: color-mix(
			in srgb,
			var(--lumi-file-tone) 6%,
			var(--lumi-color-surface)
		);
		border-color: color-mix(in srgb, var(--lumi-file-tone) 45%, transparent);
	}

	.lumi-file-upload__file-icon {
		display: grid;
		place-items: center;
		inline-size: var(--lumi-space-xxl);
		block-size: var(--lumi-space-xxl);
		color: inherit;
		background: color-mix(in srgb, currentColor 10%, transparent);
		border-radius: var(--lumi-radius-control);
	}

	.lumi-file-upload__details {
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-2xs);
		min-inline-size: 0;
	}

	.lumi-file-upload__name {
		overflow: hidden;
		font-size: var(--lumi-font-size-sm);
		font-weight: var(--lumi-font-weight-medium);
		color: var(--lumi-color-text);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.lumi-file-upload__meta {
		font-size: var(--lumi-font-size-xs);
		color: var(--lumi-color-text-muted);
	}

	.lumi-file-upload__item--error .lumi-file-upload__meta {
		color: var(--lumi-color-danger);
	}

	.lumi-file-upload__spinner {
		--lumi-spinner-size: var(--lumi-icon-sm);
		color: var(--lumi-control-accent);
	}

	.lumi-file-upload__remove {
		display: grid;
		place-items: center;
		padding: var(--lumi-space-xs);
		color: var(--lumi-color-text-muted);
		background: transparent;
		border: 0;
		border-radius: var(--lumi-radius-full);
		cursor: pointer;
		transition: var(--lumi-transition-control);
	}

	.lumi-file-upload__remove:hover {
		color: var(--lumi-color-danger);
		background: var(--lumi-color-danger-bg);
	}

	.lumi-file-upload__progress {
		position: absolute;
		inset-block-end: 0;
		inset-inline-start: 0;
		block-size: var(--lumi-border-width-thick);
		background: var(--lumi-file-tone, var(--lumi-control-accent));
		transition: inline-size var(--lumi-duration-slow) var(--lumi-easing-default);
	}

	.lumi-file-upload__add {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--lumi-space-xs);
		padding: var(--lumi-space-sm);
		font: inherit;
		font-size: var(--lumi-font-size-sm);
		color: var(--lumi-color-text-muted);
		background: transparent;
		border: var(--lumi-border-width-thin) dashed var(--lumi-color-border);
		border-radius: var(--lumi-radius-control);
		cursor: pointer;
		transition: var(--lumi-transition-control);
	}

	.lumi-file-upload__add:hover {
		color: var(--lumi-control-accent);
		background: var(--lumi-color-primary-bg);
		border-color: var(--lumi-control-accent);
	}
</style>
