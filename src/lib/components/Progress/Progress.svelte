<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ProgressProps } from './types';

	interface Props extends ProgressProps {
		labelSnippet?: Snippet<[{ value: number; max: number }]>;
	}

	const {
		value = $bindable(0),
		color = 'primary',
		size = 'md',
		indeterminate = false,
		striped = false,
		animated = false,
		showLabel = false,
		label,
		labelSnippet,
		'aria-label': ariaLabel = '',
		class: className = '',
		oncomplete
	}: Props = $props();

	let completionNotified = $state(false);

	const clampedValue = $derived(Math.min(Math.max(value, 0), 100));
	const styleVars = $derived.by(
		() =>
			`--progress-color: var(--lumi-color-${color}); --progress-foreground: var(--lumi-color-${color}-foreground);`
	);
	const progressStyle = $derived(indeterminate ? '' : `width: ${clampedValue}%`);

	const progressClasses = $derived(
		[
			'lumi-progress',
			`lumi-progress--${color}`,
			`lumi-progress--${size}`,
			indeterminate && 'lumi-progress--indeterminate',
			striped && 'lumi-progress--striped',
			animated && 'lumi-progress--animated',
			className
		]
			.filter(Boolean)
			.join(' ')
	);

	$effect(() => {
		const reachedComplete = !indeterminate && clampedValue >= 100;
		if (reachedComplete && !completionNotified) {
			completionNotified = true;
			oncomplete?.();
		}
		if (!reachedComplete) {
			completionNotified = false;
		}
	});
</script>

<div class={progressClasses} style={styleVars}>
	<!-- Progress track -->
	<div class="lumi-progress__track">
		<!-- Progress bar -->
		<div
			class="lumi-progress__bar"
			class:lumi-progress__bar--indeterminate={indeterminate}
			style={progressStyle}
			role="progressbar"
			aria-label={ariaLabel || label || 'Progress'}
			aria-valuenow={indeterminate ? undefined : clampedValue}
			aria-valuemin="0"
			aria-valuemax="100"
		>
			<!-- Striped pattern -->
			{#if striped || animated}
				<div class="lumi-progress__stripes"></div>
			{/if}
		</div>
	</div>

	<!-- Label -->
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
		--progress-track-bg: var(--lumi-color-surface-inset);
		--progress-indeterminate-width: 30%;
		--progress-stripe-color: color-mix(
			in srgb,
			var(--progress-foreground) 32%,
			transparent
		);
		--progress-stripe-size: var(--lumi-space-md);
		--progress-highlight: color-mix(
			in srgb,
			var(--lumi-color-white) 18%,
			transparent
		);
		--progress-track-shadow: inset 0 1px 2px
			color-mix(in srgb, var(--lumi-color-black) 8%, transparent);
	}

	.lumi-progress__track {
		flex: 1;
		height: var(--lumi-space-sm);
		background: var(--progress-track-bg);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border-light);
		border-radius: var(--lumi-radius-full);
		box-shadow: var(--progress-track-shadow);
		overflow: hidden;
		position: relative;
	}

	.lumi-progress__bar {
		height: 100%;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--progress-color) 82%, var(--progress-foreground)) 0%,
			var(--progress-color) 100%
		);
		border-radius: var(--lumi-radius-full);
		box-shadow: inset 0 1px 0 var(--progress-highlight);
		transition: width var(--lumi-duration-slow) var(--lumi-easing-default);
		position: relative;
		overflow: hidden;
	}

	.lumi-progress__bar--indeterminate {
		width: var(--progress-indeterminate-width);
		position: absolute;
		inset-block: 0;
		left: 0;
		animation: lumi-progress-indeterminate var(--lumi-duration-shimmer) var(--lumi-easing-default)
			infinite;
		will-change: left;
	}

	.lumi-progress__stripes {
		position: absolute;
		inset: 0;
		background-image: linear-gradient(
			45deg,
			var(--progress-stripe-color) 25%,
			transparent 25%,
			transparent 50%,
			var(--progress-stripe-color) 50%,
			var(--progress-stripe-color) 75%,
			transparent 75%,
			transparent
		);
		background-size: var(--progress-stripe-size) var(--progress-stripe-size);
	}

	.lumi-progress--animated .lumi-progress__stripes {
		animation: lumi-progress-stripes var(--lumi-duration-shimmer) linear infinite;
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
		--progress-stripe-size: var(--lumi-space-xs);
	}

	.lumi-progress--sm .lumi-progress__track {
		height: var(--lumi-space-xs);
		--progress-stripe-size: var(--lumi-space-sm);
	}

	.lumi-progress--md .lumi-progress__track {
		height: var(--lumi-space-sm);
		--progress-stripe-size: var(--lumi-space-md);
	}

	.lumi-progress--lg .lumi-progress__track {
		height: var(--lumi-space-md);
		--progress-stripe-size: var(--lumi-space-lg);
	}

	.lumi-progress--xl .lumi-progress__track {
		height: var(--lumi-space-lg);
		--progress-stripe-size: var(--lumi-space-xl);
	}

	@keyframes lumi-progress-indeterminate {
		from {
			left: calc(var(--progress-indeterminate-width) * -1);
		}
		to {
			left: 100%;
		}
	}

	@keyframes lumi-progress-stripes {
		from {
			background-position: var(--progress-stripe-size) 0;
		}
		to {
			background-position: 0 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lumi-progress__bar {
			transition: none;
		}

		.lumi-progress__bar--indeterminate,
		.lumi-progress__stripes {
			animation: none;
		}
	}
</style>
