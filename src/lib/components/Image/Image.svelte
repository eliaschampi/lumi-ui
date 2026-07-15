<script lang="ts">
	import ImageOff from '@lucide/svelte/icons/image-off';
	import type { ImageProps } from './types';

	const {
		src,
		srcSet = '',
		sizes = '',
		alt = '',
		width,
		height,
		radius = 'lg',
		loading = 'lazy',
		decoding = 'async',
		fetchPriority = 'auto',
		isZoomed = false,
		removeWrapper = false,
		disableSkeleton = false,
		errorLabel = 'Image unavailable',
		class: className = '',
		onload,
		onerror
	}: ImageProps = $props();

	let currentSrc = $state<string | null>(null);
	let isLoading = $state(true);
	let hasError = $state(false);

	const classes = $derived.by(() => {
		return [
			'lumi-image',
			radius !== 'none' && `lumi-image--radius-${radius}`,
			isZoomed && 'lumi-image--zoomed',
			isLoading && 'lumi-image--loading',
			hasError && 'lumi-image--error',
			className
		]
			.filter(Boolean)
			.join(' ');
	});

	const wrapperStyles = $derived.by(() => {
		const styles: string[] = [];
		if (width) styles.push(`width: ${width}px`);
		if (height) styles.push(`height: ${height}px`);
		return styles.join('; ');
	});

	const handleImageLoad = (event: Event) => {
		isLoading = false;
		hasError = false;
		if (onload) onload(event);
	};

	const handleImageError = () => {
		isLoading = false;
		hasError = true;
		if (onerror) onerror();
	};

	$effect(() => {
		if (src === currentSrc) return;
		currentSrc = src;
		isLoading = Boolean(src);
		hasError = false;
	});
</script>

{#if !removeWrapper}
	<div class={classes} style={wrapperStyles} aria-busy={isLoading}>
		<!-- Main image -->
		<img
			{src}
			{alt}
			srcset={srcSet}
			{sizes}
			{width}
			{height}
			class="lumi-image__img"
			{loading}
			{decoding}
			fetchpriority={fetchPriority}
			aria-hidden={hasError || undefined}
			onload={handleImageLoad}
			onerror={handleImageError}
		/>

		<!-- Loading skeleton -->
		{#if !disableSkeleton && isLoading}
			<div class="lumi-image__skeleton" aria-hidden="true"></div>
		{/if}

		{#if hasError}
			<div class="lumi-image__error-state" role="status">
				<ImageOff class="lumi-image__error-icon" aria-hidden="true" />
				<span>{errorLabel}</span>
			</div>
		{/if}
	</div>
{:else}
	<!-- Without wrapper -->
	<img
		{src}
		{alt}
		srcset={srcSet}
		{sizes}
		{width}
		{height}
		class="{classes} lumi-image__img"
		style={wrapperStyles}
		{loading}
		{decoding}
		fetchpriority={fetchPriority}
		onload={handleImageLoad}
		onerror={handleImageError}
	/>
{/if}

<style>
	.lumi-image {
		position: relative;
		display: inline-block;
		overflow: hidden;
		background: var(--lumi-color-background-secondary);
	}

	.lumi-image__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition:
			opacity var(--lumi-duration-base) var(--lumi-easing-default),
			transform var(--lumi-duration-slow) var(--lumi-easing-default);
	}

	/* Radius variants */
	.lumi-image--radius-sm {
		border-radius: var(--lumi-radius-sm);
	}

	.lumi-image--radius-md {
		border-radius: var(--lumi-radius-md);
	}

	.lumi-image--radius-lg {
		border-radius: var(--lumi-radius-lg);
	}

	.lumi-image--radius-full {
		border-radius: var(--lumi-radius-full);
	}

	/* Loading skeleton */
	.lumi-image__skeleton {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			var(--lumi-color-background-secondary) 25%,
			var(--lumi-color-background-hover) 50%,
			var(--lumi-color-background-secondary) 75%
		);
		background-size: 200% 100%;
		animation: lumi-shimmer var(--lumi-duration-shimmer) linear infinite;
	}

	/* Zoom effect */
	.lumi-image--zoomed:hover .lumi-image__img {
		transform: scale(1.1);
	}

	.lumi-image__img.lumi-image--zoomed:hover {
		transform: scale(1.1);
	}

	.lumi-image__error-state {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--lumi-space-xs);
		padding: var(--lumi-space-md);
		color: var(--lumi-color-text-muted);
		font-size: var(--lumi-font-size-xs);
		text-align: center;
	}

	:global(.lumi-image__error-icon) {
		width: var(--lumi-icon-lg);
		height: var(--lumi-icon-lg);
	}

	/* Loading state */
	.lumi-image--loading .lumi-image__img,
	.lumi-image__img.lumi-image--loading,
	.lumi-image--error .lumi-image__img,
	.lumi-image__img.lumi-image--error {
		opacity: 0;
	}

	/* Error state */
	.lumi-image--error {
		background: var(--lumi-color-background-secondary);
	}

	/* Animations */
	@keyframes lumi-shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.lumi-image__img {
			transition: none;
		}

		.lumi-image__skeleton {
			animation: none;
		}

		.lumi-image--zoomed:hover .lumi-image__img {
			transform: none;
		}

		.lumi-image__img.lumi-image--zoomed:hover {
			transform: none;
		}
	}
</style>
