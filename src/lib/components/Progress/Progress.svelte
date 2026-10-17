<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { progress: en.progress };
</script>

<script lang="ts">
	import { useLumiLocale } from '../../i18n';
	import type { ProgressProps } from './types';

	const {
		value = 0,
		color = 'primary',
		size = 'md',
		indeterminate = false,
		striped = false,
		animated = false,
		showLabel = false,
		label,
		labelSnippet,
		'aria-label': ariaLabel,
		class: className,
		oncomplete
	}: ProgressProps = $props();

	const i18n = useLumiLocale(COPY);
	const clampedValue = $derived(
		Number.isFinite(value) ? Math.min(Math.max(value, 0), 100) : 0
	);

	// Notify once per climb to 100%; dropping below re-arms it.
	let notified = false;
	$effect(() => {
		const complete = !indeterminate && clampedValue >= 100;
		if (complete && !notified) oncomplete?.();
		notified = complete;
	});
</script>

<div
	class={[
		'lumi-progress',
		size !== 'md' && `lumi-progress--${size}`,
		animated && 'lumi-progress--animated',
		className
	]}
	style:--lumi-control-accent="var(--lumi-color-{color})"
>
	<div
		class="lumi-progress__track"
		role="progressbar"
		aria-label={ariaLabel || label || i18n.t.progress}
		aria-valuenow={indeterminate ? undefined : clampedValue}
		aria-valuemin={0}
		aria-valuemax={100}
	>
		<div
			class={[
				'lumi-progress__bar',
				indeterminate && 'lumi-progress__bar--indeterminate'
			]}
			style:width={indeterminate ? undefined : `${clampedValue}%`}
		>
			{#if striped || animated}
				<div class="lumi-progress__stripes"></div>
			{/if}
		</div>
	</div>

	{#if showLabel}
		<div class="lumi-progress__label">
			{#if labelSnippet}
				{@render labelSnippet({ value: clampedValue, max: 100 })}
			{:else if label}
				{label}
			{:else}
				{Math.round(clampedValue)}%
			{/if}
		</div>
	{/if}
</div>

<style>
	.lumi-progress {
		display: flex;
		align-items: center;
		gap: var(--lumi-space-sm);
		width: 100%;
		--lumi-progress-track-bg: var(--lumi-color-surface-inset);
		--lumi-progress-indeterminate-scale: 0.3;
		--lumi-progress-stripe-color: color-mix(
			in srgb,
			var(--lumi-color-white) 32%,
			transparent
		);
		--lumi-progress-stripe-size: var(--lumi-space-md);
		--lumi-progress-highlight: color-mix(
			in srgb,
			var(--lumi-color-white) 18%,
			transparent
		);
		--lumi-progress-track-shadow: inset 0 var(--lumi-border-width-thin)
			var(--lumi-border-width-thick)
			color-mix(in srgb, var(--lumi-color-black) 8%, transparent);
	}

	.lumi-progress__track {
		flex: 1;
		height: var(--lumi-space-sm);
		background: var(--lumi-progress-track-bg);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border-light);
		border-radius: var(--lumi-radius-full);
		box-shadow: var(--lumi-progress-track-shadow);
		overflow: hidden;
		position: relative;
	}

	.lumi-progress__bar {
		height: 100%;
		background: var(--lumi-control-accent);
		border-radius: var(--lumi-radius-full);
		box-shadow: inset 0 var(--lumi-border-width-thin) 0
			var(--lumi-progress-highlight);
		transition: width var(--lumi-duration-slow) var(--lumi-easing-default);
		position: relative;
		overflow: hidden;
	}

	.lumi-progress__bar--indeterminate {
		width: 100%;
		position: absolute;
		inset-block: 0;
		left: 0;
		transform-origin: left center;
		animation: lumi-progress-indeterminate var(--lumi-duration-shimmer)
			var(--lumi-easing-default) infinite;
		will-change: transform;
	}

	.lumi-progress__stripes {
		position: absolute;
		inset: 0;
		background-image: linear-gradient(
			45deg,
			var(--lumi-progress-stripe-color) 25%,
			transparent 25%,
			transparent 50%,
			var(--lumi-progress-stripe-color) 50%,
			var(--lumi-progress-stripe-color) 75%,
			transparent 75%,
			transparent
		);
		background-size: var(--lumi-progress-stripe-size)
			var(--lumi-progress-stripe-size);
	}

	.lumi-progress--animated .lumi-progress__stripes {
		animation: lumi-progress-stripes var(--lumi-duration-shimmer) linear
			infinite;
	}

	.lumi-progress__label {
		font-size: var(--lumi-font-size-sm);
		font-weight: var(--lumi-font-weight-medium);
		color: var(--lumi-color-text);
		min-width: calc(var(--lumi-space-md) * 3);
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	/* Size Variants */
	.lumi-progress--xs .lumi-progress__track {
		height: var(--lumi-space-2xs);
		--lumi-progress-stripe-size: var(--lumi-space-xs);
	}

	.lumi-progress--sm .lumi-progress__track {
		height: var(--lumi-space-xs);
		--lumi-progress-stripe-size: var(--lumi-space-sm);
	}

	.lumi-progress--lg .lumi-progress__track {
		height: var(--lumi-space-md);
		--lumi-progress-stripe-size: var(--lumi-space-lg);
	}

	.lumi-progress--xl .lumi-progress__track {
		height: var(--lumi-space-lg);
		--lumi-progress-stripe-size: var(--lumi-space-xl);
	}

	/* Transform, not `left`: the sweep stays on the compositor and never triggers
	   layout on the track. The bar is full-width so translateX percentages are
	   relative to the track, and scaleX carves out the travelling sliver. */
	@keyframes lumi-progress-indeterminate {
		from {
			transform: translateX(-100%)
				scaleX(var(--lumi-progress-indeterminate-scale));
		}
		to {
			transform: translateX(100%)
				scaleX(var(--lumi-progress-indeterminate-scale));
		}
	}

	@keyframes lumi-progress-stripes {
		from {
			background-position: var(--lumi-progress-stripe-size) 0;
		}
		to {
			background-position: 0 0;
		}
	}

	/* core.css collapses durations globally; the indeterminate bar additionally
	   needs a resting shape, since a frozen sliver reads as a stuck progress. */
	@media (prefers-reduced-motion: reduce) {
		.lumi-progress__bar--indeterminate {
			transform: none;
			background: color-mix(
				in srgb,
				var(--lumi-control-accent) 35%,
				var(--lumi-progress-track-bg)
			);
			will-change: auto;
		}
	}
</style>
