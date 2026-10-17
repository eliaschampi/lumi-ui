<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { loading: en.loading };
</script>

<script lang="ts">
	import { useLumiLocale } from '../../i18n';
	import type { LoadingProps } from './types';

	const {
		size = 'md',
		color = 'primary',
		text = '',
		class: className,
		children
	}: LoadingProps = $props();

	const i18n = useLumiLocale(COPY);
</script>

<div
	class={['lumi-loading', size !== 'md' && `lumi-loading--${size}`, className]}
	style:--lumi-control-accent="var(--lumi-color-{color})"
	role="status"
	aria-label={text || children ? undefined : i18n.t.loading}
>
	<span class="lumi-loading__indicator" aria-hidden="true">
		<span class="lumi-spinner lumi-loading__ring"></span>
		<span class="lumi-loading__core"></span>
	</span>

	{#if text || children}
		<span class="lumi-loading__text">
			{#if children}{@render children()}{:else}{text}{/if}
		</span>
	{/if}
</div>

<style>
	.lumi-loading {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--lumi-space-md);
		color: var(--lumi-control-accent);
		--loading-ring-size: var(--lumi-space-3xl);
		--loading-core-size: var(--lumi-space-lg);
	}

	.lumi-loading__indicator {
		position: relative;
		display: grid;
		place-items: center;
		inline-size: var(--loading-ring-size);
		block-size: var(--loading-ring-size);
	}

	.lumi-loading__ring {
		position: absolute;
		inset: 0;
		--lumi-spinner-size: 100%;
	}

	.lumi-loading__core {
		inline-size: var(--loading-core-size);
		block-size: var(--loading-core-size);
		border-radius: var(--lumi-radius-full);
		background: currentColor;
		box-shadow: 0 0 var(--lumi-space-md)
			color-mix(in srgb, currentColor 35%, transparent);
		animation: lumi-loading-pulse var(--lumi-duration-shimmer)
			var(--lumi-easing-in-out) infinite;
	}

	.lumi-loading__text {
		font-size: var(--lumi-font-size-sm);
		font-weight: var(--lumi-font-weight-medium);
		color: var(--lumi-color-text-muted);
		text-align: center;
		line-height: var(--lumi-line-height-normal);
	}

	.lumi-loading--sm {
		--loading-ring-size: var(--lumi-space-xxl);
		--loading-core-size: var(--lumi-space-sm);
		gap: var(--lumi-space-sm);
	}

	.lumi-loading--lg {
		--loading-ring-size: var(--lumi-space-4xl);
		--loading-core-size: var(--lumi-space-xl);
		gap: var(--lumi-space-lg);
	}

	@keyframes lumi-loading-pulse {
		0%,
		100% {
			transform: scale(0.78);
			opacity: 0.65;
		}

		50% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
