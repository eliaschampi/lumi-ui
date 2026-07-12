<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ButtonProps } from './types';
	import Icon from '../Icon/Icon.svelte';
	import { getIconSize, type LumiDisplaySize } from '../config';

	interface Props extends ButtonProps {
		children?: Snippet;
		onclick?: (event: MouseEvent) => void;
		'aria-label'?: string;
	}

	const {
		type = 'filled',
		color = 'primary',
		size = 'md',
		icon,
		iconAfter = false,
		radius = false,
		loading = false,
		disabled = false,
		button = 'button',
		'aria-label': ariaLabel = '',
		class: className,
		onclick,
		children
	}: Props = $props();

	const iconPixelSize = $derived.by(() => {
		const sizeOffsets: Record<LumiDisplaySize, number> = {
			sm: -2,
			md: -4,
			lg: -2,
			xl: -4
		};
		return getIconSize(size) + sizeOffsets[size];
	});

	const buttonClasses = $derived.by(() => {
		const classes = ['lumi-button', `lumi-button--${type}`, `lumi-button--${size}`];

		if (radius) classes.push('lumi-button--radius');
		if (icon && !children) classes.push('lumi-button--icon-only');
		if (loading) classes.push('lumi-button--loading');
		if (className) classes.push(className);

		return classes.join(' ');
	});

	// Map colors to CSS variables dynamically
	const styleVars = $derived.by(() => {
		const colorVar = `var(--lumi-color-${color})`;
		const colorRgb = `var(--lumi-color-${color}-rgb)`;
		const solidVar = `var(--lumi-color-${color}-solid)`;
		const colorForeground = `var(--lumi-color-${color}-foreground)`;
		return `--btn-color: ${colorVar}; --btn-color-rgb: ${colorRgb}; --btn-solid: ${solidVar}; --btn-foreground: ${colorForeground};`;
	});

	function handleClick(event: MouseEvent) {
		if (!disabled && !loading && onclick) {
			onclick(event);
		}
	}
</script>

<button
	class={buttonClasses}
	type={button}
	disabled={disabled || loading}
	aria-label={ariaLabel || (icon && !children ? icon : undefined)}
	onclick={handleClick}
	style={styleVars}
>
	{#if loading}
		<span class="lumi-button__spinner"></span>
	{/if}

	{#if icon && !iconAfter && !loading}
		<span class="lumi-button__icon">
			<Icon {icon} size={`${iconPixelSize}px`} />
		</span>
	{/if}

	{#if children}
		<span class="lumi-button__text">
			{@render children()}
		</span>
	{/if}

	{#if icon && iconAfter && !loading}
		<span class="lumi-button__icon">
			<Icon {icon} size={`${iconPixelSize}px`} />
		</span>
	{/if}
</button>

<style>
	/* ========================================================================== */
	/* LUMI BUTTON - semantic actions with restrained tactile depth */
	/* ========================================================================== */

	.lumi-button {
		--button-hover-lift: 0;
		--button-color-shadow: 0 var(--lumi-space-xs) var(--lumi-space-lg)
			calc(var(--lumi-space-xs) * -1)
			color-mix(in srgb, var(--btn-solid) 22%, transparent);
		--button-color-shadow-hover: 0 var(--lumi-space-sm) var(--lumi-space-xl)
			calc(var(--lumi-space-xs) * -1)
			color-mix(in srgb, var(--btn-solid) 28%, transparent);
		/* Base Layout */
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--lumi-space-xs);

		/* Typography */
		font-family: var(--lumi-font-family-sans);
		font-weight: var(--lumi-font-weight-semibold);
		line-height: var(--lumi-line-height-none);
		text-decoration: none;
		white-space: nowrap;
		letter-spacing: var(--lumi-letter-spacing-wide);

		/* Visual */
		border: var(--lumi-border-width-base) solid transparent;
		border-radius: var(--lumi-control-radius);
		cursor: pointer;
		user-select: none;
		position: relative;
		overflow: hidden;
		outline: none;
		isolation: isolate;

		transition:
			background-color var(--lumi-duration-fast) var(--lumi-easing-default),
			border-color var(--lumi-duration-fast) var(--lumi-easing-default),
			color var(--lumi-duration-fast) var(--lumi-easing-default),
			box-shadow var(--lumi-duration-fast) var(--lumi-easing-default),
			transform var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	/* Focus visible */
	.lumi-button:focus-visible {
		outline: none;
		box-shadow:
			0 0 0 var(--lumi-border-width-thick)
				color-mix(in srgb, var(--lumi-color-background) 88%, transparent),
			0 0 0 calc(var(--lumi-border-width-thick) * 2) var(--btn-color);
	}

	/* Disabled - Elegant fade */
	.lumi-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
		transform: none;
	}

	/* Hover lift effect */
	.lumi-button:hover:not(:disabled) {
		transform: translateY(var(--button-hover-lift));
	}

	/* Active press effect */
	.lumi-button:active:not(:disabled) {
		transform: translateY(0) scale(var(--lumi-interactive-press-scale));
	}

	/* ========================================================================== */
	/* SIZE VARIANTS */
	/* ========================================================================== */

	.lumi-button--sm {
		height: var(--lumi-control-height-sm);
		padding: 0 var(--lumi-space-md);
		font-size: var(--lumi-font-size-xs);
	}

	.lumi-button--md {
		height: var(--lumi-control-height-md);
		padding: 0 var(--lumi-space-lg);
		font-size: var(--lumi-font-size-sm);
	}

	.lumi-button--lg {
		height: var(--lumi-control-height-lg);
		padding: 0 var(--lumi-space-xl);
		font-size: var(--lumi-font-size-base);
	}

	.lumi-button--xl {
		height: var(--lumi-control-height-xl);
		padding: 0 var(--lumi-space-xxl);
		font-size: var(--lumi-font-size-lg);
	}

	/* ========================================================================== */
	/* SHAPE VARIANTS */
	/* ========================================================================== */

	.lumi-button--radius {
		border-radius: var(--lumi-radius-full);
	}

	/* Icon only - Square aspect ratio */
	.lumi-button--icon-only {
		padding: 0;
		aspect-ratio: 1;
	}
	.lumi-button--icon-only.lumi-button--sm {
		width: var(--lumi-control-height-sm);
	}
	.lumi-button--icon-only.lumi-button--md {
		width: var(--lumi-control-height-md);
	}
	.lumi-button--icon-only.lumi-button--lg {
		width: var(--lumi-control-height-lg);
	}
	.lumi-button--icon-only.lumi-button--xl {
		width: var(--lumi-control-height-xl);
	}

	/* ========================================================================== */
	/* TYPE VARIANTS */
	/* ========================================================================== */

	/* FILLED - tactile primary action */
	.lumi-button--filled {
		--button-hover-lift: var(--lumi-interactive-lift);
		background: var(--btn-solid);
		color: var(--btn-foreground);
		border-color: color-mix(in srgb, var(--btn-solid) 48%, transparent);
		box-shadow:
			inset 0 var(--lumi-border-width-thin) 0
				color-mix(in srgb, var(--lumi-color-white) 26%, transparent),
			var(--button-color-shadow),
			var(--lumi-shadow-sm);
	}

	.lumi-button--filled:hover:not(:disabled) {
		background: color-mix(in srgb, var(--btn-solid) 90%, var(--lumi-color-black));
		box-shadow:
			inset 0 var(--lumi-border-width-thin) 0
				color-mix(in srgb, var(--lumi-color-white) 32%, transparent),
			var(--button-color-shadow-hover),
			var(--lumi-shadow-md);
	}

	.lumi-button--filled:active:not(:disabled) {
		box-shadow: var(--lumi-shadow-sm);
	}

	/* BORDER - quiet outline action */
	.lumi-button--border {
		background: var(--lumi-color-surface-glass);
		color: var(--btn-color);
		border-color: color-mix(in srgb, var(--btn-color) 34%, var(--lumi-color-border));
	}

	.lumi-button--border:hover:not(:disabled) {
		background: var(--lumi-color-surface-glass-strong);
		border-color: color-mix(in srgb, var(--btn-color) 48%, var(--lumi-color-border));
	}

	.lumi-button--border:active:not(:disabled) {
		background: rgba(var(--btn-color-rgb), 0.15);
	}

	/* FLAT - tinted low-emphasis action */
	.lumi-button--flat {
		background: color-mix(in srgb, var(--btn-color) 9%, transparent);
		color: var(--btn-color);
		border-color: color-mix(in srgb, var(--btn-color) 18%, transparent);
	}

	.lumi-button--flat:hover:not(:disabled) {
		background: rgba(var(--btn-color-rgb), 0.15);
		border-color: rgba(var(--btn-color-rgb), 0.32);
	}

	.lumi-button--flat:active:not(:disabled) {
		background: rgba(var(--btn-color-rgb), 0.18);
	}

	/* GHOST - transparent low-emphasis action */
	.lumi-button--ghost {
		background: transparent;
		color: var(--btn-color);
		border-color: transparent;
		box-shadow: none;
	}

	.lumi-button--ghost:hover:not(:disabled) {
		background: color-mix(in srgb, var(--btn-color) 10%, transparent);
		border-color: color-mix(in srgb, var(--btn-color) 18%, transparent);
	}

	.lumi-button--ghost:active:not(:disabled) {
		background: color-mix(in srgb, var(--btn-color) 16%, transparent);
		border-color: color-mix(in srgb, var(--btn-color) 22%, transparent);
	}

	/* GRADIENT - expressive tactile action */
	.lumi-button--gradient {
		--button-hover-lift: var(--lumi-interactive-lift);
		background: linear-gradient(
			145deg,
			color-mix(in srgb, var(--btn-solid) 96%, var(--lumi-color-white)) 0%,
			var(--btn-solid) 100%
		);
		color: var(--btn-foreground);
		border-color: color-mix(in srgb, var(--btn-solid) 45%, transparent);
		box-shadow:
			inset 0 var(--lumi-border-width-thin) 0
				color-mix(in srgb, var(--lumi-color-white) 18%, transparent),
			var(--button-color-shadow),
			var(--lumi-shadow-sm);
	}

	.lumi-button--gradient:hover:not(:disabled) {
		border-color: color-mix(in srgb, var(--btn-solid) 60%, transparent);
		box-shadow:
			inset 0 var(--lumi-border-width-thin) 0
				color-mix(in srgb, var(--lumi-color-white) 22%, transparent),
			var(--button-color-shadow-hover),
			var(--lumi-shadow-md);
	}

	.lumi-button--gradient:active:not(:disabled) {
		box-shadow:
			inset 0 var(--lumi-border-width-thin) 0
				color-mix(in srgb, var(--lumi-color-white) 24%, transparent),
			var(--lumi-shadow-sm);
	}

	/* ========================================================================== */
	/* LOADING STATE */
	/* ========================================================================== */

	.lumi-button__spinner {
		position: absolute;
		width: 1.2em;
		height: 1.2em;
		border: var(--lumi-border-width-thick) solid currentColor;
		border-right-color: transparent;
		border-radius: var(--lumi-radius-full);
		animation: lumi-spin var(--lumi-duration-slower) linear infinite;
	}

	.lumi-button--loading {
		color: transparent !important;
		pointer-events: none;
	}

	.lumi-button--loading .lumi-button__spinner {
		color: var(--lumi-color-text);
	}

	.lumi-button--filled.lumi-button--loading .lumi-button__spinner,
	.lumi-button--gradient.lumi-button--loading .lumi-button__spinner {
		color: var(--btn-foreground);
	}

	.lumi-button--border.lumi-button--loading .lumi-button__spinner,
	.lumi-button--flat.lumi-button--loading .lumi-button__spinner,
	.lumi-button--ghost.lumi-button--loading .lumi-button__spinner {
		color: var(--btn-color);
	}

	/* ========================================================================== */
	/* INNER ELEMENTS */
	/* ========================================================================== */

	.lumi-button__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.lumi-button__text {
		display: inline-flex;
		align-items: center;
	}

	@media (prefers-reduced-motion: reduce) {
		.lumi-button,
		.lumi-button__spinner {
			transition: none;
			animation: none;
		}
	}
</style>
