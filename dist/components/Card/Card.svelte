<script lang="ts">
	import type { Snippet } from 'svelte';
	import Image from '../Image/Image.svelte';
	import type { CardProps } from './types';

	interface Props extends CardProps {
		children?: Snippet;
		header?: Snippet;
		footer?: Snippet;
		onclick?: (event: MouseEvent) => void;
		'aria-label'?: string;
	}

	const {
		clickable = false,
		href,
		target,
		rel,
		hoverable,
		selected = false,
		image,
		imageHeight,
		imageAlt,
		title,
		subtitle,
		spaced = false,
		class: className,
		style,
		'aria-label': ariaLabel = '',
		onclick,
		children,
		header,
		footer
	}: Props = $props();

	const isInteractive = $derived(clickable || href !== undefined);
	const linkRel = $derived(
		target === '_blank' ? (rel ?? 'noopener noreferrer') : rel
	);

	const cardClasses = $derived.by(() => {
		const classes = ['lumi-card'];
		const isHoverable = hoverable ?? Boolean(isInteractive || image);

		if (clickable) classes.push('lumi-card--clickable');
		if (isInteractive) classes.push('lumi-card--interactive');
		if (isHoverable) classes.push('lumi-card--hoverable');
		if (selected) classes.push('lumi-card--selected');
		if (image) classes.push('lumi-card--with-image');
		if (spaced) classes.push('lumi-card--spaced');
		if (className) classes.push(className);
		return classes.join(' ');
	});

	const cardStyles = $derived.by(() => {
		const styles: string[] = [];
		if (imageHeight !== undefined)
			styles.push(`--card-image-height: ${imageHeight}px;`);
		if (style) styles.push(style);
		return styles.join(' ') || undefined;
	});

	function handleClick(event: MouseEvent) {
		onclick?.(event);
	}
</script>

{#snippet cardContent()}
	{#if image}
		<div class="lumi-card__media">
			<Image
				src={image}
				alt={imageAlt ?? ''}
				radius="none"
				class="lumi-card__image"
			/>
		</div>
	{/if}

	{#if header || title}
		<div class="lumi-card__header">
			{#if header}
				{@render header()}
			{:else}
				{#if title}
					<h4 class="lumi-card__title">{title}</h4>
				{/if}
				{#if subtitle}
					<p class="lumi-card__subtitle">{subtitle}</p>
				{/if}
			{/if}
		</div>
	{/if}

	{#if children}
		<div class="lumi-card__content">
			{@render children()}
		</div>
	{/if}

	{#if footer}
		<div class="lumi-card__footer">
			{@render footer()}
		</div>
	{/if}
{/snippet}

{#if href !== undefined}
	<a
		{href}
		{target}
		rel={linkRel}
		class={cardClasses}
		style={cardStyles}
		onclick={handleClick}
		aria-label={ariaLabel || title || undefined}
		aria-current={selected ? 'true' : undefined}
	>
		{@render cardContent()}
	</a>
{:else if clickable}
	<button
		type="button"
		class={cardClasses}
		style={cardStyles}
		onclick={handleClick}
		aria-label={ariaLabel || title || undefined}
		aria-pressed={selected}
	>
		{@render cardContent()}
	</button>
{:else}
	<div class={cardClasses} style={cardStyles}>
		{@render cardContent()}
	</div>
{/if}

<style>
	.lumi-card {
		--card-hover-lift: var(--lumi-interactive-lift);
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
		transition:
			background-color var(--lumi-duration-fast) var(--lumi-easing-default),
			border-color var(--lumi-duration-fast) var(--lumi-easing-default),
			box-shadow var(--lumi-duration-fast) var(--lumi-easing-default),
			transform var(--lumi-duration-fast) var(--lumi-easing-default);
		width: 100%;
		text-align: left;
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
	}

	.lumi-card--interactive:focus-visible {
		outline: none;
		border-color: var(--lumi-color-border-interactive);
		box-shadow:
			0 0 0 var(--lumi-border-width-thick)
				color-mix(in srgb, var(--lumi-color-primary) 24%, transparent),
			var(--lumi-shadow-md);
	}

	.lumi-card--hoverable:hover {
		transform: translateY(var(--card-hover-lift));
		border-color: var(--lumi-color-border-interactive);
		background: var(--lumi-gradient-card-hover);
		box-shadow: var(--lumi-shadow-md);
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
		height: var(--card-image-height, var(--lumi-card-media-height));
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
	}

	.lumi-card--hoverable:hover .lumi-card__media :global(.lumi-image__img) {
		transform: scale(var(--lumi-card-media-hover-scale));
	}

	/* Sections */
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
		margin: 0;
		color: var(--lumi-color-text);
		line-height: var(--lumi-line-height-tight);
		font-size: var(--lumi-font-size-lg);
		font-weight: var(--lumi-font-weight-semibold);
	}

	.lumi-card__subtitle {
		margin: 0;
		color: var(--lumi-color-text-muted);
		font-size: var(--lumi-font-size-sm);
		line-height: var(--lumi-line-height-normal);
	}

	/* With Image adjustments */
	.lumi-card--with-image .lumi-card__header {
		padding-top: var(--lumi-space-lg);
	}

	@media (prefers-reduced-motion: reduce) {
		.lumi-card,
		.lumi-card__media :global(.lumi-image__img) {
			transition: none;
		}

		.lumi-card--hoverable:hover .lumi-card__media :global(.lumi-image__img) {
			transform: none;
		}
	}
</style>
