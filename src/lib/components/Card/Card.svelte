<script lang="ts">
	import Image from '../Image/Image.svelte';
	import type { CardProps } from './types';

	const {
		clickable = false,
		href,
		target,
		rel,
		hoverable,
		selected,
		image,
		imageHeight,
		imageAlt,
		title,
		subtitle,
		spaced = false,
		class: className,
		style,
		'aria-label': ariaLabel,
		onclick,
		children,
		media,
		header,
		footer
	}: CardProps = $props();

	const tag = $derived(href !== undefined ? 'a' : clickable ? 'button' : 'div');
	// A button may only hold phrasing content, so its sections become spans.
	const part = $derived(tag === 'button' ? 'span' : 'div');
	const interactive = $derived(tag !== 'div');
</script>

<!-- svelte-ignore a11y_no_static_element_interactions (`onclick` only reaches the native <a> or <button> branches.) -->
<svelte:element
	this={tag}
	{href}
	target={href && target}
	rel={href && (target === '_blank' ? (rel ?? 'noopener noreferrer') : rel)}
	type={tag === 'button' ? 'button' : undefined}
	class={[
		'lumi-card',
		interactive && 'lumi-card--interactive',
		(hoverable ?? (interactive || media || image)) && 'lumi-card--hoverable',
		selected && 'lumi-card--selected',
		spaced && 'lumi-card--spaced',
		className
	]}
	{style}
	style:--lumi-card-image-height={imageHeight && `${imageHeight}px`}
	aria-label={ariaLabel}
	aria-current={href && selected ? 'true' : undefined}
	aria-pressed={tag === 'button' ? selected : undefined}
	onclick={interactive ? onclick : undefined}
>
	{#if media || image}
		<svelte:element this={part} class="lumi-card__media">
			{#if media}
				{@render media()}
			{:else if image && part === 'span'}
				<!-- Phrasing content only inside a button card. -->
				<img
					class="lumi-card__image"
					src={image}
					alt={imageAlt ?? ''}
					loading="lazy"
					decoding="async"
				/>
			{:else if image}
				<Image
					src={image}
					alt={imageAlt ?? ''}
					radius="none"
					class="lumi-card__image"
				/>
			{/if}
		</svelte:element>
	{/if}

	{#if header || title || subtitle}
		<svelte:element this={part} class="lumi-card__header">
			{#if header}
				{@render header()}
			{:else}
				{#if title}
					<svelte:element
						this={part === 'span' ? 'span' : 'h4'}
						class="lumi-card__title">{title}</svelte:element
					>
				{/if}
				{#if subtitle}
					<svelte:element
						this={part === 'span' ? 'span' : 'p'}
						class="lumi-card__subtitle">{subtitle}</svelte:element
					>
				{/if}
			{/if}
		</svelte:element>
	{/if}

	{#if children}
		<svelte:element this={part} class="lumi-card__content">
			{@render children()}
		</svelte:element>
	{/if}

	{#if footer}
		<svelte:element this={part} class="lumi-card__footer">
			{@render footer()}
		</svelte:element>
	{/if}
</svelte:element>

<style>
	.lumi-card {
		--lumi-surface-bg: var(--lumi-card-surface-bg, var(--lumi-gradient-card));
		--lumi-surface-shadow: var(
			--lumi-card-surface-shadow,
			var(--lumi-shadow-sm)
		);
		position: relative;
		min-width: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition: var(--lumi-transition-interactive);
		width: 100%;
		text-align: start;
		color: var(--lumi-color-text);
		appearance: none;
		font: inherit;
		text-decoration: none;
		padding: 0;
		isolation: isolate;
	}

	.lumi-card::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		background: var(--lumi-gradient-card-sheen);
		opacity: var(--lumi-card-sheen-opacity);
		z-index: 0;
	}

	.lumi-card > * {
		position: relative;
		z-index: 1;
	}

	/* Interactive state */
	.lumi-card--interactive {
		cursor: pointer;
		outline: var(--lumi-border-width-thick) solid transparent;
	}

	.lumi-card--interactive:focus-visible {
		--lumi-surface-hover: 1;
		outline-color: transparent;
		border-color: var(--lumi-color-border-interactive);
		box-shadow: var(--lumi-focus-ring), var(--lumi-shadow-md);
	}

	.lumi-card--hoverable:hover {
		transform: translateY(var(--lumi-interactive-lift));
		border-color: var(--lumi-color-border-interactive);
		background: var(--lumi-gradient-card-hover);
		box-shadow: var(--lumi-shadow-md);
	}

	.lumi-card--interactive:focus-visible {
		--lumi-surface-hover: 1;
	}

	@media (hover: hover) {
		.lumi-card--hoverable:hover {
			--lumi-surface-hover: 1;
		}
	}

	.lumi-card--interactive:active {
		transform: translateY(0);
		box-shadow: var(--lumi-shadow-sm);
	}

	.lumi-card--selected,
	.lumi-card--selected:hover {
		--lumi-surface-border: var(--lumi-border-width-base) solid
			var(--lumi-color-primary);
		--lumi-surface-shadow: var(--lumi-shadow-md);
		border-color: var(--lumi-color-primary);
	}

	/* Spaced content */
	.lumi-card--spaced .lumi-card__content {
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-md);
	}

	/* Image */
	.lumi-card__media {
		width: 100%;
		height: var(--lumi-card-image-height, var(--lumi-card-media-height));
		overflow: hidden;
		flex-shrink: 0;
		position: relative;
		background: var(--lumi-color-background-secondary);
		border-bottom: var(--lumi-border-width-thin) solid
			var(--lumi-color-border-glass);
	}

	.lumi-card__media :global(.lumi-card__image) {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}

	.lumi-card--hoverable:hover .lumi-card__media :global(.lumi-image img) {
		transform: scale(var(--lumi-card-media-hover-scale));
	}

	/* Sections (spans inside a button card, so display is explicit) */
	.lumi-card__media,
	.lumi-card__content,
	.lumi-card__footer,
	.lumi-card__title,
	.lumi-card__subtitle {
		display: block;
	}

	.lumi-card__header,
	.lumi-card__content,
	.lumi-card__footer {
		padding: var(--lumi-space-lg);
	}

	.lumi-card__header {
		display: grid;
		gap: var(--lumi-space-2xs);
		padding-bottom: var(--lumi-space-xs);
	}

	.lumi-card__header:last-child {
		padding-bottom: var(--lumi-space-lg);
	}

	.lumi-card__content {
		flex: 1;
		min-width: 0;
		padding-top: var(--lumi-space-sm);
		padding-bottom: var(--lumi-space-lg);
	}

	/* Comfortable breathing room when content leads (no header) or follows the image,
	   instead of relying on :first-child which fails whenever an image is rendered. */
	.lumi-card__media + .lumi-card__content,
	.lumi-card__content:first-child {
		padding-top: var(--lumi-space-lg);
	}

	.lumi-card__footer {
		padding-top: var(--lumi-space-md);
		border-top: var(--lumi-border-width-thin) solid
			var(--lumi-color-border-glass);
		background: color-mix(
			in srgb,
			var(--lumi-color-surface-glass-strong) 86%,
			transparent
		);
	}

	/* Typography */
	.lumi-card__title {
		color: var(--lumi-color-text);
		line-height: var(--lumi-line-height-tight);
		font-size: var(--lumi-font-size-lg);
		font-weight: var(--lumi-font-weight-semibold);
	}

	.lumi-card__subtitle {
		color: var(--lumi-color-text-muted);
		font-size: var(--lumi-font-size-sm);
		line-height: var(--lumi-line-height-normal);
	}

	@media (forced-colors: active) {
		.lumi-card--interactive:focus-visible {
			outline-color: CanvasText;
			box-shadow: none;
		}
	}
</style>
