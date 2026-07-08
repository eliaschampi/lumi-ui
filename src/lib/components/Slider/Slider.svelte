<script lang="ts">
	import type { SliderProps } from './types';

	let {
		name,
		id,
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		label = '',
		color = 'primary',
		size = 'md',
		disabled = false,
		showValue = false,
		showTooltip = true,
		class: className = '',
		onchange
	}: SliderProps = $props();

	const uniqueId = crypto.randomUUID().slice(0, 8);
	const sliderId = $derived(id ?? (name ? `lumi-slider-${name}` : `lumi-slider-${uniqueId}`));

	const percentage = $derived.by(() => {
		const range = max - min;
		if (range <= 0) return 0;
		return Math.min(100, Math.max(0, ((value - min) / range) * 100));
	});

	const styleVars = $derived(
		`--slider-fill: ${percentage}%; --slider-accent: var(--lumi-color-${color});`
	);

	const classes = $derived(
		['lumi-slider', `lumi-slider--${size}`, disabled && 'lumi-slider--disabled', className]
			.filter(Boolean)
			.join(' ')
	);

	function handleChange(): void {
		onchange?.(value);
	}
</script>

<div class={classes} style={styleVars}>
	{#if label || (showValue && label)}
		<div class="lumi-slider__header">
			{#if label}
				<label class="lumi-slider__label" for={sliderId}>{label}</label>
			{/if}
			{#if showValue && label}
				<span class="lumi-slider__value-inline">{value}</span>
			{/if}
		</div>
	{/if}

	<div class="lumi-slider__control">
		<input
			id={sliderId}
			{name}
			class="lumi-slider__input"
			type="range"
			bind:value
			{min}
			{max}
			{step}
			{disabled}
			onchange={handleChange}
			aria-label={label || 'Slider'}
		/>

		{#if showTooltip}
			<span class="lumi-slider__tooltip" role="tooltip">{value}</span>
		{/if}

		<div class="lumi-slider__range-labels" aria-hidden="true">
			<span>{min}</span>
			<span>{max}</span>
		</div>
	</div>

	{#if showValue && !label}
		<div class="lumi-slider__value">{value}</div>
	{/if}
</div>

<style>
	/* LUMI SLIDER — Redesigned 2026 edition */
	/* Minimal, beautiful, native-driven range component • 100% token consistency */

	.lumi-slider {
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-sm);
		width: 100%;

		--slider-accent: var(--lumi-color-primary);
		--slider-fill: 0%;
		--_track-h: 6px;
		--_thumb-size: 18px;
	}

	.lumi-slider--sm {
		--_track-h: 4px;
		--_thumb-size: 15px;
	}

	.lumi-slider--lg {
		--_track-h: 8px;
		--_thumb-size: 22px;
	}

	.lumi-slider__header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.lumi-slider__label {
		font-size: var(--lumi-font-size-sm);
		font-weight: var(--lumi-font-weight-semibold);
		color: var(--lumi-color-text);
	}

	.lumi-slider__value-inline {
		font-family: var(--lumi-font-family-mono);
		font-size: var(--lumi-font-size-xs);
		font-weight: var(--lumi-font-weight-bold);
		color: var(--slider-accent);
		background: color-mix(in srgb, var(--slider-accent) 12%, transparent);
		border-radius: var(--lumi-radius-base);
		padding: var(--lumi-space-2xs) var(--lumi-space-xs);
	}

	.lumi-slider__control {
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.lumi-slider__input {
		width: 100%;
		height: calc(var(--_track-h) + 12px); /* larger hit area */
		margin: 0;
		appearance: none;
		-webkit-appearance: none;
		background: linear-gradient(
			to right,
			var(--slider-accent) 0%,
			var(--slider-accent) var(--slider-fill),
			color-mix(in srgb, var(--lumi-color-border-strong) 68%, var(--lumi-color-surface))
				var(--slider-fill),
			color-mix(in srgb, var(--lumi-color-border-strong) 68%, var(--lumi-color-surface)) 100%
		);
		border-radius: var(--lumi-radius-full);
		outline: none;
		cursor: pointer;
		box-shadow: inset 0 var(--lumi-border-width-thin) 3px rgba(0, 0, 0, 0.1);
	}

	/* Webkit thumb styling */
	.lumi-slider__input::-webkit-slider-thumb {
		appearance: none;
		-webkit-appearance: none;
		width: var(--_thumb-size);
		height: var(--_thumb-size);
		background: var(--lumi-color-surface);
		border: var(--lumi-border-width-thick) solid var(--slider-accent);
		border-radius: var(--lumi-radius-full);
		box-shadow:
			var(--lumi-shadow-md),
			0 0 0 var(--lumi-space-2xs) color-mix(in srgb, var(--slider-accent) 18%, transparent);
		transition:
			transform var(--lumi-duration-base) var(--lumi-easing-bounce),
			box-shadow var(--lumi-duration-base) var(--lumi-easing-default);
	}

	/* Mozilla thumb styling */
	.lumi-slider__input::-moz-range-thumb {
		width: var(--_thumb-size);
		height: var(--_thumb-size);
		background: var(--lumi-color-surface);
		border: var(--lumi-border-width-thick) solid var(--slider-accent);
		border-radius: var(--lumi-radius-full);
		box-shadow:
			var(--lumi-shadow-md),
			0 0 0 var(--lumi-space-2xs) color-mix(in srgb, var(--slider-accent) 18%, transparent);
		transition:
			transform var(--lumi-duration-base) var(--lumi-easing-bounce),
			box-shadow var(--lumi-duration-base) var(--lumi-easing-default);
	}

	/* Hover and Focus-visible states */
	.lumi-slider__input:hover::-webkit-slider-thumb,
	.lumi-slider__input:focus-visible::-webkit-slider-thumb {
		transform: scale(1.16);
		box-shadow:
			var(--lumi-shadow-lg),
			0 0 0 9px color-mix(in srgb, var(--slider-accent) 24%, transparent);
	}

	.lumi-slider__input:hover::-moz-range-thumb,
	.lumi-slider__input:focus-visible::-moz-range-thumb {
		transform: scale(1.16);
		box-shadow:
			var(--lumi-shadow-lg),
			0 0 0 9px color-mix(in srgb, var(--slider-accent) 24%, transparent);
	}

	/* Active dragging states (using :active pseudo-class!) */
	.lumi-slider__input:active::-webkit-slider-thumb {
		transform: scale(1.26);
		box-shadow:
			var(--lumi-shadow-xl),
			0 0 0 14px color-mix(in srgb, var(--slider-accent) 30%, transparent);
		transition: none;
	}

	.lumi-slider__input:active::-moz-range-thumb {
		transform: scale(1.26);
		box-shadow:
			var(--lumi-shadow-xl),
			0 0 0 14px color-mix(in srgb, var(--slider-accent) 30%, transparent);
		transition: none;
	}

	/* Glass tooltip */
	.lumi-slider__tooltip {
		position: absolute;
		left: var(--slider-fill);
		bottom: 100%;
		transform: translate(-50%, var(--lumi-space-xs));
		padding: var(--lumi-space-2xs) var(--lumi-space-sm);
		background: var(--lumi-color-surface-overlay);
		border: var(--lumi-border-width-thin) solid
			color-mix(in srgb, var(--slider-accent) 35%, transparent);
		box-shadow: var(--lumi-shadow-lg);
		color: var(--lumi-color-text);
		font-family: var(--lumi-font-family-mono);
		font-size: var(--lumi-font-size-xs);
		font-weight: var(--lumi-font-weight-bold);
		border-radius: var(--lumi-radius-md);
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		transition:
			opacity var(--lumi-duration-base) var(--lumi-easing-bounce),
			transform var(--lumi-duration-base) var(--lumi-easing-bounce);
	}

	/* Show tooltip on hover or active of input, or hover of control */
	.lumi-slider__control:hover .lumi-slider__tooltip,
	.lumi-slider__input:focus-visible ~ .lumi-slider__tooltip,
	.lumi-slider__input:active ~ .lumi-slider__tooltip {
		opacity: 1;
		transform: translate(-50%, -10px);
	}

	.lumi-slider__range-labels {
		display: flex;
		justify-content: space-between;
		margin-top: var(--lumi-space-sm);
		font-size: var(--lumi-font-size-xs);
		color: var(--lumi-color-text-light);
	}

	.lumi-slider__value {
		align-self: center;
		font-family: var(--lumi-font-family-mono);
		font-size: var(--lumi-font-size-sm);
		font-weight: var(--lumi-font-weight-bold);
		color: var(--slider-accent);
		background: color-mix(in srgb, var(--slider-accent) 12%, transparent);
		border-radius: var(--lumi-radius-base);
		padding: var(--lumi-space-2xs) var(--lumi-space-sm);
	}

	.lumi-slider--disabled {
		opacity: var(--lumi-opacity-disabled);
		pointer-events: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.lumi-slider__input::-webkit-slider-thumb,
		.lumi-slider__input::-moz-range-thumb,
		.lumi-slider__tooltip {
			transition: none;
		}
	}
</style>
