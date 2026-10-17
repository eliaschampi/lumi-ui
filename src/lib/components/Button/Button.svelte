<script lang="ts">
	import Icon from '../Icon/Icon.svelte';
	import type { ButtonProps } from './types';

	const {
		variant = 'filled',
		color = 'primary',
		size = 'md',
		icon,
		iconAfter = false,
		loading = false,
		disabled = false,
		pressed,
		type = 'button',
		href,
		target,
		rel,
		download,
		class: className,
		style,
		children,
		...rest
	}: ButtonProps = $props();

	const inert = $derived(disabled || loading);
	// Primary is the CSS default; other roles override the three accent slots.
	const tint = $derived(
		[
			color !== 'primary' &&
				`--btn-color:var(--lumi-color-${color});--btn-solid:var(--lumi-color-${color}-solid);--btn-foreground:var(--lumi-color-${color}-foreground)`,
			style
		]
			.filter(Boolean)
			.join(';') || undefined
	);
	const classes = $derived([
		'lumi-button',
		`lumi-button--${variant}`,
		`lumi-button--${size}`,
		icon && !children && 'lumi-button--icon-only',
		loading && 'lumi-button--loading',
		className
	]);
</script>

{#snippet content()}
	{#if loading}
		<span class="lumi-spinner lumi-button__spinner" aria-hidden="true"></span>
	{/if}
	{#if icon && !iconAfter && !loading}
		<Icon {icon} size="var(--btn-icon)" />
	{/if}
	{#if children}
		<span class="lumi-button__text">{@render children()}</span>
	{/if}
	{#if icon && iconAfter && !loading}
		<Icon {icon} size="var(--btn-icon)" />
	{/if}
{/snippet}

{#if href !== undefined}
	<a
		{...rest}
		class={classes}
		href={inert ? undefined : href}
		target={inert ? undefined : target}
		rel={inert ? undefined : rel}
		download={inert ? undefined : download}
		role={inert ? 'link' : undefined}
		aria-disabled={inert || undefined}
		aria-busy={loading || undefined}
		style={tint}
	>
		{@render content()}
	</a>
{:else}
	<button
		{...rest}
		class={classes}
		{type}
		disabled={inert}
		aria-pressed={pressed}
		aria-busy={loading || undefined}
		style={tint}
	>
		{@render content()}
	</button>
{/if}

<style>
	/* Semantic actions with restrained tactile depth. Disabled and loading
	   controls drop pointer events, so hover/active rules need no guards. */
	.lumi-button {
		--btn-color: var(--lumi-color-primary);
		--btn-solid: var(--lumi-color-primary-solid);
		--btn-foreground: var(--lumi-color-primary-foreground);
		--lumi-control-accent: var(--btn-color);
		--btn-icon: 1.2em;
		--btn-lift: 0;
		--btn-shade: var(--lumi-color-black);
		--btn-sheen: inset 0 var(--lumi-border-width-thin) 0
			color-mix(in srgb, var(--lumi-color-white) 26%, transparent);
		--btn-glow: 0 var(--lumi-space-xs) var(--lumi-space-lg)
			calc(var(--lumi-space-xs) * -1)
			color-mix(in srgb, var(--btn-solid) 22%, transparent);
		--btn-glow-hover: 0 var(--lumi-space-sm) var(--lumi-space-xl)
			calc(var(--lumi-space-xs) * -1)
			color-mix(in srgb, var(--btn-solid) 28%, transparent);
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--lumi-space-xs);
		font-family: var(--lumi-font-family-sans);
		font-weight: var(--lumi-font-weight-semibold);
		line-height: var(--lumi-line-height-none);
		letter-spacing: var(--lumi-letter-spacing-wide);
		text-decoration: none;
		white-space: nowrap;
		border: var(--lumi-border-width-base) solid transparent;
		border-radius: var(--lumi-radius-control);
		outline: var(--lumi-border-width-thick) solid transparent;
		cursor: pointer;
		user-select: none;
		isolation: isolate;
		transition: var(--lumi-transition-interactive);
	}

	.lumi-button:is(:disabled, [aria-disabled='true']) {
		pointer-events: none;
	}

	.lumi-button:is(:disabled, [aria-disabled='true']):not(
			.lumi-button--loading
		) {
		opacity: var(--lumi-opacity-disabled);
	}

	.lumi-button:hover {
		transform: translateY(var(--btn-lift));
	}

	.lumi-button:active {
		transform: scale(var(--lumi-interactive-press-scale));
	}

	/* Sizes */
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
		--btn-icon: 1.4em;
		height: var(--lumi-control-height-lg);
		padding: 0 var(--lumi-space-xl);
		font-size: var(--lumi-font-size-base);
	}

	.lumi-button--xl {
		--btn-icon: 1.4em;
		height: var(--lumi-control-height-xl);
		padding: 0 var(--lumi-space-xxl);
		font-size: var(--lumi-font-size-lg);
	}

	/* Square from the size height. */
	.lumi-button--icon-only {
		padding: 0;
		aspect-ratio: 1;
	}

	/* Solid fills: filled + gradient pair solid with its foreground. */
	.lumi-button--filled,
	.lumi-button--gradient {
		--btn-lift: var(--lumi-interactive-lift);
		color: var(--btn-foreground);
		background: var(--btn-solid);
		border-color: color-mix(in srgb, var(--btn-solid) 48%, transparent);
		box-shadow: var(--btn-sheen), var(--btn-glow), var(--lumi-shadow-sm);
	}

	.lumi-button--filled:hover {
		background: color-mix(in srgb, var(--btn-solid) 90%, var(--btn-shade));
	}

	.lumi-button--filled:hover,
	.lumi-button--gradient:hover {
		box-shadow: var(--btn-sheen), var(--btn-glow-hover), var(--lumi-shadow-md);
	}

	.lumi-button--filled:active,
	.lumi-button--gradient:active {
		box-shadow: var(--lumi-shadow-sm);
	}

	.lumi-button--gradient {
		--btn-glow: 0 var(--lumi-space-xs) var(--lumi-space-lg)
			calc(var(--lumi-space-xs) * -1)
			color-mix(in srgb, var(--btn-solid) 30%, transparent);
		--btn-glow-hover: 0 var(--lumi-space-sm) var(--lumi-space-xl)
			calc(var(--lumi-space-xs) * -1)
			color-mix(in srgb, var(--btn-solid) 36%, transparent);
		--btn-sheen: inset 0 var(--lumi-border-width-thin) 0
			color-mix(in srgb, var(--lumi-color-white) 18%, transparent);
		background: linear-gradient(
			135deg,
			var(--btn-solid),
			color-mix(in srgb, var(--btn-solid) 90%, var(--btn-shade)) 52%,
			color-mix(in srgb, var(--btn-solid) 75%, var(--btn-shade))
		);
	}

	/* Gradients shade away from the paired foreground when supported. */
	@supports (color: contrast-color(red)) {
		.lumi-button {
			--btn-shade: contrast-color(var(--btn-foreground));
		}
	}

	/* Quiet variants tint the accent. */
	.lumi-button--border {
		color: var(--btn-color);
		background: var(--lumi-color-surface-glass);
		border-color: color-mix(
			in srgb,
			var(--btn-color) 34%,
			var(--lumi-color-border)
		);
	}

	.lumi-button--border:hover {
		background: var(--lumi-color-surface-glass-strong);
		border-color: color-mix(
			in srgb,
			var(--btn-color) 48%,
			var(--lumi-color-border)
		);
	}

	.lumi-button--flat {
		color: var(--btn-color);
		background: color-mix(in srgb, var(--btn-color) 9%, transparent);
		border-color: color-mix(in srgb, var(--btn-color) 18%, transparent);
	}

	.lumi-button--ghost {
		color: var(--btn-color);
		background: transparent;
	}

	.lumi-button--flat:hover,
	.lumi-button--ghost:hover {
		background: color-mix(in srgb, var(--btn-color) 14%, transparent);
		border-color: color-mix(in srgb, var(--btn-color) 28%, transparent);
	}

	.lumi-button--border:active,
	.lumi-button--flat:active,
	.lumi-button--ghost:active {
		background: color-mix(in srgb, var(--btn-color) 17%, transparent);
	}

	/* Toggle on: quiet variants settle into a tinted, pressed-in fill. */
	.lumi-button[aria-pressed='true']:not(
			.lumi-button--filled,
			.lumi-button--gradient
		) {
		color: var(--btn-color);
		background: color-mix(in srgb, var(--btn-color) 16%, transparent);
		border-color: color-mix(in srgb, var(--btn-color) 45%, transparent);
		box-shadow: inset 0 var(--lumi-border-width-thin) var(--lumi-space-2xs)
			color-mix(in srgb, var(--btn-color) 18%, transparent);
	}

	/* Focus wins over hover and pressed fills (doubled class for weight). */
	.lumi-button.lumi-button:focus-visible {
		box-shadow: var(--lumi-focus-ring-offset);
	}

	/* Spinner (shared recipe) centered over the hidden label. */
	.lumi-button__spinner {
		--lumi-spinner-size: var(--btn-icon);
		position: absolute;
	}

	.lumi-button--loading .lumi-button__text {
		opacity: 0;
	}

	.lumi-button__text {
		display: inline-flex;
		align-items: center;
	}

	@media (forced-colors: active) {
		.lumi-button:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
