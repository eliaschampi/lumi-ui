<script module lang="ts">
	import { lumiDriveEn } from '../../i18n/drive';

	const COPY = lumiDriveEn;
</script>

<script lang="ts">
	import { Icon } from '../Icon';
	import { useLumiLocale } from '../../i18n';
	import { Image } from '../Image';
	import {
		driveTagColorCssVar,
		formatFileSize,
		getDriveServeUrl,
		getDriveTagByHash,
		getDriveTypeLabel,
		getFileColor,
		getFileIcon,
		type DriveServeUrlResolver
	} from '../../utils/drive';
	import type { DriveFileItem } from './types';

	interface Props {
		file: DriveFileItem;
		selected?: boolean;
		isTrash?: boolean;
		onclick?: (file: DriveFileItem) => void;
		ondblclick?: (file: DriveFileItem) => void;
		oncontextmenu?: (event: MouseEvent, file: DriveFileItem) => void;
		ondragstart?: (event: DragEvent, file: DriveFileItem) => void;
		ondragend?: () => void;
		ondrop?: (event: DragEvent, file: DriveFileItem) => void;
		serveUrl?: DriveServeUrlResolver;
	}

	const {
		file,
		selected = false,
		isTrash = false,
		onclick,
		ondblclick,
		oncontextmenu,
		ondragstart,
		ondragend,
		ondrop,
		serveUrl = getDriveServeUrl
	}: Props = $props();

	const i18n = useLumiLocale(COPY);
	let isDragging = $state(false);
	let isDropTarget = $state(false);
	let dragCounter = $state(0);
	let longPressTimer: ReturnType<typeof setTimeout> | undefined;
	let longPressTriggered = false;
	const tagOption = $derived(getDriveTagByHash(file.tag, i18n.t));
	const previewUrl = $derived(
		file.type === 'img' ? serveUrl(file.code, { variant: 'thumb' }) : ''
	);
	const typeLabel = $derived(getDriveTypeLabel(file.type, i18n.t));

	const cardClasses = $derived([
		'lumi-drive-file-card',
		selected && 'lumi-drive-file-card--selected',
		isDragging && 'lumi-drive-file-card--dragging',
		isDropTarget && file.type === 'dir' && 'lumi-drive-file-card--drop-target'
	]);

	function handleClick() {
		if (longPressTriggered) {
			longPressTriggered = false;
			return;
		}
		onclick?.(file);
	}

	function handleDblClick() {
		ondblclick?.(file);
	}

	function handleContextMenu(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		oncontextmenu?.(event, file);
	}

	function handleDragStart(event: DragEvent) {
		if (isTrash) return;
		isDragging = true;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('application/json', JSON.stringify(file));
		}
		ondragstart?.(event, file);
	}

	function handleDragEnd() {
		isDragging = false;
		isDropTarget = false;
		dragCounter = 0;
		ondragend?.();
	}

	function handleDragEnter() {
		if (file.type === 'dir' && !isTrash && !isDragging) {
			dragCounter += 1;
			isDropTarget = true;
		}
	}

	function handleDragLeave() {
		if (file.type === 'dir' && !isTrash) {
			dragCounter -= 1;
			if (dragCounter <= 0) {
				dragCounter = 0;
				isDropTarget = false;
			}
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();

		if (!event.dataTransfer) {
			return;
		}

		if (file.type === 'dir' && !isTrash && !isDragging) {
			event.dataTransfer.dropEffect = 'move';
		} else {
			event.dataTransfer.dropEffect = 'none';
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();

		if (file.type !== 'dir' || isTrash || isDragging) {
			return;
		}

		dragCounter = 0;
		isDropTarget = false;
		ondrop?.(event, file);
	}

	function handleTouchStart(event: TouchEvent) {
		if (isTrash) return;

		longPressTriggered = false;
		longPressTimer = setTimeout(() => {
			longPressTriggered = true;
			const touch = event.touches[0];
			if (!touch) return;

			const syntheticEvent = new MouseEvent('contextmenu', {
				bubbles: true,
				cancelable: true,
				clientX: touch.clientX,
				clientY: touch.clientY
			});

			oncontextmenu?.(syntheticEvent, file);
		}, 600);
	}

	function clearLongPress() {
		if (longPressTimer !== undefined) {
			clearTimeout(longPressTimer);
			longPressTimer = undefined;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleDblClick();
		}
	}
</script>

<button
	type="button"
	class={cardClasses}
	draggable={!isTrash}
	onclick={handleClick}
	ondblclick={handleDblClick}
	oncontextmenu={handleContextMenu}
	ondragstart={handleDragStart}
	ondragend={handleDragEnd}
	ondragenter={handleDragEnter}
	ondragleave={handleDragLeave}
	ondragover={handleDragOver}
	ondrop={handleDrop}
	ontouchstart={handleTouchStart}
	ontouchend={clearLongPress}
	ontouchmove={clearLongPress}
	onkeydown={handleKeydown}
>
	<div class="lumi-drive-file-card__preview">
		{#if file.type === 'img'}
			<Image
				class="lumi-drive-file-card__image"
				src={previewUrl}
				alt={file.name}
				loading="lazy"
				fetchpriority="low"
				radius="none"
				errorLabel={file.name}
			/>
		{:else}
			<div class="lumi-drive-file-card__icon-scene">
				<Icon
					icon={getFileIcon(file.type)}
					size="var(--lumi-drive-file-icon-size)"
					color={getFileColor(file.type)}
				/>
			</div>
		{/if}
		<span class="lumi-drive-file-card__kind">{typeLabel}</span>
		{#if tagOption}
			<span class="lumi-drive-file-card__tag">
				<span
					class="lumi-drive-file-card__tag-dot"
					style:--drive-tag-color={driveTagColorCssVar(tagOption.color)}
				></span>
			</span>
		{/if}
	</div>

	<div class="lumi-drive-file-card__content">
		<div class="lumi-drive-file-card__name" title={file.name}>
			{file.name}
		</div>
		<div class="lumi-drive-file-card__meta">
			<span class="lumi-drive-file-card__type">{typeLabel}</span>
			{#if file.type !== 'dir'}
				<span class="lumi-drive-file-card__separator">•</span>
				<span class="lumi-drive-file-card__size"
					>{formatFileSize(file.size)}</span
				>
			{/if}
		</div>
	</div>
</button>

<style>
	.lumi-drive-file-card {
		--drive-file-card-padding: var(--lumi-drive-file-card-padding);
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: var(--lumi-space-xs);
		width: 100%;
		min-width: 0;
		padding: var(--drive-file-card-padding);
		background: var(--lumi-gradient-card);
		border: var(--lumi-border-width-thin) solid
			var(--lumi-floating-surface-border);
		border-radius: var(--lumi-surface-radius);
		cursor: pointer;
		transition:
			transform var(--lumi-duration-fast) var(--lumi-easing-default),
			box-shadow var(--lumi-duration-fast) var(--lumi-easing-default),
			border-color var(--lumi-duration-fast) var(--lumi-easing-default),
			background-color var(--lumi-duration-fast) var(--lumi-easing-default);
		text-align: left;
		position: relative;
		overflow: hidden;
		box-shadow: var(--lumi-shadow-sm);
	}

	.lumi-drive-file-card:hover {
		transform: translateY(var(--lumi-interactive-lift));
		border-color: var(--lumi-color-border-interactive);
		background: var(--lumi-gradient-card-hover);
		box-shadow: var(--lumi-shadow-md);
	}

	.lumi-drive-file-card:focus-visible {
		outline: none;
		border-color: var(--lumi-color-border-interactive);
		box-shadow: var(--lumi-focus-ring), var(--lumi-shadow-md);
	}

	.lumi-drive-file-card--selected {
		border-color: var(--lumi-color-primary);
		background:
			linear-gradient(
				145deg,
				color-mix(in srgb, var(--lumi-color-primary) 5%, transparent) 0%,
				transparent 68%,
				transparent 100%
			),
			var(--lumi-color-surface-card-hover);
		box-shadow: var(--lumi-shadow-md);
	}

	.lumi-drive-file-card--dragging {
		opacity: 0.5;
	}

	.lumi-drive-file-card--drop-target {
		border: var(--lumi-border-width-thin) dashed var(--lumi-color-primary);
		background: color-mix(
			in srgb,
			var(--lumi-color-primary) 10%,
			var(--lumi-color-surface-card)
		);
		transform: scale(var(--lumi-interactive-hover-scale));
	}

	.lumi-drive-file-card__preview {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		aspect-ratio: var(--lumi-drive-file-preview-ratio);
		border-radius: var(--lumi-radius-panel);
		background:
			linear-gradient(
				145deg,
				color-mix(in srgb, var(--lumi-color-primary) 5%, transparent) 0%,
				transparent 45%,
				color-mix(in srgb, var(--lumi-color-surface-card) 92%, transparent) 100%
			),
			var(--lumi-color-background-secondary);
		overflow: hidden;
	}

	.lumi-drive-file-card__preview :global(.lumi-drive-file-card__image) {
		width: 100%;
		height: 100%;
	}

	.lumi-drive-file-card:hover
		.lumi-drive-file-card__preview
		:global(.lumi-drive-file-card__image img) {
		transform: scale(var(--lumi-card-media-hover-scale));
	}

	.lumi-drive-file-card__icon-scene {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background:
			radial-gradient(
				circle at 50% 35%,
				color-mix(in srgb, var(--lumi-color-surface-card) 70%, transparent) 0%,
				transparent 70%
			),
			transparent;
	}

	.lumi-drive-file-card__kind {
		position: absolute;
		left: var(--lumi-space-xs);
		top: var(--lumi-space-xs);
		display: inline-flex;
		align-items: center;
		padding: var(--lumi-space-2xs) var(--lumi-space-xs);
		border-radius: var(--lumi-radius-full);
		font-size: var(--lumi-font-size-xs);
		font-weight: var(--lumi-font-weight-medium);
		color: var(--lumi-color-text-muted);
		background: color-mix(
			in srgb,
			var(--lumi-color-surface-glass-strong) 90%,
			transparent
		);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border-glass);
	}

	.lumi-drive-file-card__tag {
		position: absolute;
		right: var(--lumi-space-xs);
		bottom: var(--lumi-space-xs);
		width: var(--lumi-space-lg);
		height: var(--lumi-space-lg);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border-glass);
		background: color-mix(
			in srgb,
			var(--lumi-color-surface-glass-strong) 92%,
			transparent
		);
		border-radius: var(--lumi-radius-full);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.lumi-drive-file-card__tag-dot {
		width: var(--lumi-drive-tag-dot-size);
		height: var(--lumi-drive-tag-dot-size);
		border-radius: var(--lumi-radius-full);
		background: var(--drive-tag-color, var(--lumi-color-border));
	}

	.lumi-drive-file-card__content {
		padding: 0;
		min-width: 0;
	}

	.lumi-drive-file-card__name {
		width: 100%;
		font-size: var(--lumi-font-size-sm);
		font-weight: var(--lumi-font-weight-medium);
		line-height: var(--lumi-line-height-tight);
		color: var(--lumi-color-text);
		min-height: calc(var(--lumi-font-size-sm) * 2.4);
		display: -webkit-box;
		overflow: hidden;
		overflow-wrap: anywhere;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.lumi-drive-file-card__meta {
		display: flex;
		align-items: center;
		gap: var(--lumi-space-2xs);
	}

	.lumi-drive-file-card__type,
	.lumi-drive-file-card__size {
		font-size: var(--lumi-font-size-xs);
		color: var(--lumi-color-text-muted);
		letter-spacing: var(--lumi-letter-spacing-wide);
	}

	.lumi-drive-file-card__separator {
		font-size: var(--lumi-font-size-xs);
		color: var(--lumi-color-text-muted);
	}

	@media (max-width: 40rem) {
		.lumi-drive-file-card {
			--drive-file-card-padding: var(--lumi-drive-file-card-padding-mobile);
		}
	}
</style>
