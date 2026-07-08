<script lang="ts">
	import type { Snippet } from 'svelte';
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
		hoverable,
		selected = false,
		image,
		imageHeight = 200,
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

	const cardClasses = $derived.by(() => {
		const classes = ['lumi-card'];
		const isHoverable = hoverable ?? Boolean(clickable || image);

		if (clickable) classes.push('lumi-card--clickable');
		if (isHoverable) classes.push('lumi-card--hoverable');
		if (selected) classes.push('lumi-card--selected');
		if (image) classes.push('lumi-card--with-image');
		if (spaced) classes.push('lumi-card--spaced');
		if (className) classes.push(className);
		return classes.join(' ');
	});

	const cardStyles = $derived.by(() => {
		const imageHeightStyle = `--card-image-height: ${imageHeight}px;`;
		return style ? `${imageHeightStyle} ${style}` : imageHeightStyle;
	});

	function handleClick(event: MouseEvent) {
		if (clickable && onclick) {
			onclick(event);
		}
	}
</script>

{#snippet cardContent()}
	{#if image}
		<div class="lumi-card__image">
			<img src={image} alt={imageAlt || title || 'Card image'} />
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

	<div class="lumi-card__content">
		{#if children}
			{@render children()}
		{/if}
	</div>

	{#if footer}
		<div class="lumi-card__footer">
			{@render footer()}
		</div>
	{/if}
{/snippet}

{#if clickable}
	<button
		type="button"
		class={cardClasses}
		style={cardStyles}
		onclick={handleClick}
		aria-label={ariaLabel || title || 'Card'}
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
		--lumi-surface-shadow: var(--lumi-card-surface-shadow, var(--lumi-shadow-md));
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

	/* Clickable state */
	.lumi-card--clickable {
		cursor: pointer;
	}

	.lumi-card--clickable:focus-visible {
		outline: none;
		box-shadow:
			0 0 0 var(--lumi-border-width-thick)
				color-mix(in srgb, var(--lumi-color-primary) 18%, transparent),
			var(--lumi-shadow-md);
	}

	.lumi-card--hoverable:hover {
		transform: translateY(var(--card-hover-lift));
		border-color: var(--lumi-color-border-interactive);
		background: var(--lumi-gradient-card-hover);
		box-shadow: var(--lumi-shadow-lg);
	}

	.lumi-card--hoverable:active {
		transform: translateY(0);
		box-shadow: var(--lumi-shadow-sm);
	}

	.lumi-card--selected,
	.lumi-card--selected:hover {
		--lumi-surface-border: var(--lumi-border-width-base) solid var(--lumi-color-primary);
		--lumi-surface-shadow: var(--lumi-shadow-lg);
		border-color: var(--lumi-color-primary);
	}

	/* Spaced content */
	.lumi-card--spaced .lumi-card__content {
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-md);
	}

	/* Image */
	.lumi-card__image {
		width: 100%;
		height: var(--card-image-height);
		overflow: hidden;
		flex-shrink: 0;
		position: relative;
		border-bottom: var(--lumi-border-width-thin) solid var(--lumi-color-border-glass);
	}

	.lumi-card__image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform var(--lumi-duration-slow) var(--lumi-easing-default);
	}

	.lumi-card--hoverable:hover .lumi-card__image img {
		transform: scale(1.05);
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
	.lumi-card__image + .lumi-card__content,
	.lumi-card__content:first-child {
		padding-top: var(--lumi-space-lg);
	}

	.lumi-card__footer {
		padding-top: var(--lumi-space-md);
		border-top: var(--lumi-border-width-thin) solid var(--lumi-color-border-glass);
		background: color-mix(in srgb, var(--lumi-color-surface-glass-strong) 86%, transparent);
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
</style>
