<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { slider: en.slider };
</script>

<script lang="ts">
	import { useLumiLocale } from '../../i18n';
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

	const i18n = useLumiLocale(COPY);
	const uid = $props.id();
	const sliderId = $derived(id ?? `lumi-slider-${uid}`);

	const percentage = $derived.by(() => {
		const range = max - min;
		if (!Number.isFinite(value) || !Number.isFinite(range) || range <= 0)
			return 0;
		return Math.min(100, Math.max(0, ((value - min) / range) * 100));
	});
</script>

<div
	class={[
		'lumi-slider',
		`lumi-slider--${size}`,
		disabled && 'lumi-slider--disabled',
		className
	]}
	style:--slider-fill="{percentage}%"
	style:--slider-accent="var(--lumi-color-{color})"
>
	{#if label}
		<div class="lumi-slider__header">
			<label class="lumi-slider__label" for={sliderId}>{label}</label>
			{#if showValue}
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
			onchange={() => onchange?.(value)}
			aria-label={label ? undefined : i18n.t.slider}
		/>

		{#if showTooltip}
			<span class="lumi-slider__tooltip" aria-hidden="true">{value}</span>
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
	.lumi-slider {
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-sm);
		width: 100%;

		--lumi-control-accent: var(--slider-accent);
		--slider-fill: 0%;
		--slider-track: color-mix(
			in srgb,
			var(--lumi-color-border-strong) 68%,
			var(--lumi-color-surface)
		);
		--_track-h: var(--lumi-space-2xs);
		--_thumb-size: var(--lumi-icon-md);
	}

	.lumi-slider--sm {
		--_track-h: var(--lumi-border-width-thick);
		--_thumb-size: var(--lumi-icon-sm);
	}

	.lumi-slider--lg {
		--_track-h: calc(var(--lumi-space-2xs) + var(--lumi-border-width-thick));
		--_thumb-size: var(--lumi-icon-lg);
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
		transition: color var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	.lumi-slider:focus-within .lumi-slider__label {
		color: var(--slider-accent);
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
		height: var(--lumi-control-height-sm);
		margin: 0;
		appearance: none;
		-webkit-appearance: none;
		background: linear-gradient(
			to right,
			var(--slider-accent) 0%,
			var(--slider-accent) var(--slider-fill),
			var(--slider-track) var(--slider-fill),
			var(--slider-track) 100%
		);
		background-position: center;
		background-repeat: no-repeat;
		background-size: 100% var(--_track-h);
		border-radius: var(--lumi-radius-full);
		outline: var(--lumi-border-width-thick) solid transparent;
		outline-offset: var(--lumi-focus-outline-offset);
		cursor: pointer;
	}

	/* Thumb state lives on the input; both engine pseudo-elements read it. */
	.lumi-slider__input {
		--_thumb-scale: 1;
		--_thumb-ring: 0 0 0 var(--lumi-border-width-thin)
			color-mix(in srgb, var(--slider-accent) 18%, transparent);
		--_thumb-shadow: var(--lumi-shadow-sm);
	}

	.lumi-slider__input:hover,
	.lumi-slider__input:active {
		--_thumb-scale: var(--lumi-interactive-zoom-scale);
		--_thumb-shadow: var(--lumi-shadow-md);
		--_thumb-ring: 0 0 0 var(--lumi-space-2xs)
			color-mix(in srgb, var(--slider-accent) 22%, transparent);
	}

	.lumi-slider__input:focus-visible {
		--_thumb-shadow: var(--lumi-shadow-md);
		--_thumb-ring: 0 0 0 var(--lumi-space-2xs)
			color-mix(
				in srgb,
				var(--slider-accent) var(--lumi-control-focus-ring-strength),
				transparent
			);
	}

	.lumi-slider__input:active {
		--_thumb-ring: 0 0 0 var(--lumi-space-xs)
			color-mix(in srgb, var(--slider-accent) 26%, transparent);
	}

	.lumi-slider__input::-webkit-slider-thumb {
		appearance: none;
		width: var(--_thumb-size);
		height: var(--_thumb-size);
		background: var(--lumi-color-surface);
		border: var(--lumi-border-width-thick) solid var(--slider-accent);
		border-radius: var(--lumi-radius-full);
		box-shadow: var(--_thumb-shadow), var(--_thumb-ring);
		transform: scale(var(--_thumb-scale));
		transition:
			transform var(--lumi-duration-fast) var(--lumi-easing-default),
			box-shadow var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	/* Same rule body; unknown pseudo-elements invalidate a shared selector list. */
	.lumi-slider__input::-moz-range-thumb {
		width: var(--_thumb-size);
		height: var(--_thumb-size);
		background: var(--lumi-color-surface);
		border: var(--lumi-border-width-thick) solid var(--slider-accent);
		border-radius: var(--lumi-radius-full);
		box-shadow: var(--_thumb-shadow), var(--_thumb-ring);
		transform: scale(var(--_thumb-scale));
		transition:
			transform var(--lumi-duration-fast) var(--lumi-easing-default),
			box-shadow var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	/* Glass tooltip */
	.lumi-slider__tooltip {
		position: absolute;
		left: var(--slider-fill);
		bottom: calc(100% + var(--lumi-space-xs));
		transform: translate(calc(-1 * var(--slider-fill)), var(--lumi-space-xs));
		padding: var(--lumi-space-2xs) var(--lumi-space-sm);
		background: var(--lumi-color-surface-overlay);
		border: var(--lumi-border-width-thin) solid
			color-mix(in srgb, var(--slider-accent) 35%, transparent);
		box-shadow: var(--lumi-shadow-lg);
		color: var(--lumi-color-text);
		font-family: var(--lumi-font-family-mono);
		font-size: var(--lumi-font-size-xs);
		font-weight: var(--lumi-font-weight-bold);
		border-radius: var(--lumi-radius-tooltip);
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		transition:
			opacity var(--lumi-duration-fast) var(--lumi-easing-default),
			transform var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	/* Show tooltip on hover or active of input, or hover of control */
	.lumi-slider__control:hover .lumi-slider__tooltip,
	.lumi-slider__input:focus-visible ~ .lumi-slider__tooltip,
	.lumi-slider__input:active ~ .lumi-slider__tooltip {
		opacity: 1;
		transform: translate(calc(-1 * var(--slider-fill)), 0);
	}

	.lumi-slider__range-labels {
		display: flex;
		justify-content: space-between;
		margin-top: var(--lumi-space-sm);
		font-size: var(--lumi-font-size-xs);
		color: var(--lumi-color-text-muted);
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

	@media (forced-colors: active) {
		.lumi-slider__input:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
