<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { imageError: en.imageError };
</script>

<script lang="ts">
	import { useLumiLocale } from '../../i18n';
	import type { ImageProps } from './types';

	const {
		src,
		alt = '',
		width,
		height,
		srcset,
		sizes,
		ratio,
		fit = 'cover',
		radius = 'lg',
		loading = 'lazy',
		fetchpriority,
		zoom = false,
		errorLabel,
		class: className,
		onload,
		onerror
	}: ImageProps = $props();

	const i18n = useLumiLocale(COPY);

	// Keyed by URL so a new `src` starts fresh without an effect. The image is
	// never hidden while loading: server-rendered pixels paint before hydration.
	let loadedSrc = $state('');
	let failedSrc = $state('');
</script>

<div
	class={[
		'lumi-image',
		ratio && 'lumi-image--ratio',
		fit === 'contain' && 'lumi-image--contain',
		zoom && 'lumi-image--zoom',
		loadedSrc !== src && failedSrc !== src && 'lumi-skeleton',
		className
	]}
	style:--lumi-image-radius={radius === 'lg'
		? undefined
		: radius === 'none'
			? '0'
			: `var(--lumi-radius-${radius})`}
	style:aspect-ratio={ratio ??
		(width && height ? `${width} / ${height}` : undefined)}
	style:inline-size={width && !ratio ? `${width}px` : undefined}
	style:block-size={height && !width && !ratio ? `${height}px` : undefined}
>
	{#if failedSrc === src}
		<div
			class="lumi-image__error"
			role={alt ? 'img' : undefined}
			aria-label={alt || undefined}
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<rect x="3" y="3" width="18" height="18" rx="2" />
				<circle cx="9" cy="9" r="2" />
				<path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
				<path d="m3 3 18 18" />
			</svg>
			<span>{errorLabel ?? i18n.t.imageError}</span>
		</div>
	{:else}
		<img
			{src}
			{alt}
			{srcset}
			{sizes}
			{width}
			{height}
			{loading}
			{fetchpriority}
			decoding="async"
			onload={(event) => {
				loadedSrc = src;
				onload?.(event);
			}}
			onerror={(event) => {
				failedSrc = src;
				onerror?.(event);
			}}
		/>
	{/if}
</div>

<style>
	/* The frame shows the shared skeleton until the image reports load; the
	   background only applies once loaded (letterboxing for `contain`). */
	.lumi-image {
		position: relative;
		display: inline-block;
		max-inline-size: 100%;
		overflow: hidden;
		border-radius: var(--lumi-image-radius, var(--lumi-radius-lg));
	}

	.lumi-image:not(.lumi-skeleton) {
		background: var(--lumi-color-background-secondary);
	}

	.lumi-image--ratio {
		display: block;
		inline-size: 100%;
	}

	img {
		display: block;
		inline-size: 100%;
		block-size: 100%;
		object-fit: cover;
		transition: transform var(--lumi-duration-slow) var(--lumi-easing-default);
	}

	.lumi-image--contain img {
		object-fit: contain;
	}

	.lumi-image--zoom:hover img {
		transform: scale(var(--lumi-interactive-zoom-scale));
	}

	.lumi-image__error {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--lumi-space-xs);
		block-size: 100%;
		min-block-size: var(--lumi-space-4xl);
		padding: var(--lumi-space-md);
		color: var(--lumi-color-text-muted);
		font-size: var(--lumi-font-size-xs);
		text-align: center;
	}

	.lumi-image__error svg {
		inline-size: var(--lumi-icon-lg);
		block-size: var(--lumi-icon-lg);
	}
</style>
