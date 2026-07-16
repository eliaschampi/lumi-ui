<script lang="ts">
	import { Avatar } from '../Avatar';
	import type { AvatarGroupProps } from './types';

	const {
		items = [],
		max = 4,
		size = 'sm',
		color = 'primary',
		class: className = ''
	}: AvatarGroupProps = $props();

	const visible = $derived(items.slice(0, max));
	const overflow = $derived(Math.max(0, items.length - max));
	const names = $derived(
		items
			.map((item) => item.alt || item.text || '')
			.filter(Boolean)
			.join(', ')
	);
	const classes = $derived(
		['lumi-avatar-group', `lumi-avatar-group--${size}`, className].filter(Boolean).join(' ')
	);
	const ariaLabel = $derived(
		`${items.length} avatar${items.length === 1 ? '' : 's'}${names ? `: ${names}` : ''}`
	);
</script>

<div class={classes} role="img" aria-label={ariaLabel} title={names}>
	{#each visible as item, i (i)}
		<div class="lumi-avatar-group__item">
			<Avatar text={item.text} src={item.src} alt={item.alt} {size} {color} />
		</div>
	{/each}
	{#if overflow > 0}
		<div class="lumi-avatar-group__item lumi-avatar-group__overflow" aria-hidden="true">
			+{overflow}
		</div>
	{/if}
</div>

<style>
	.lumi-avatar-group {
		--lumi-avatar-group-overlap: calc(var(--lumi-space-xs) * -1);
		--lumi-avatar-group-size: var(--lumi-space-xl);
		--lumi-avatar-group-font: var(--lumi-font-size-xs);
		display: inline-flex;
		align-items: center;
	}

	.lumi-avatar-group--md {
		--lumi-avatar-group-overlap: calc(var(--lumi-space-sm) * -1);
		--lumi-avatar-group-size: var(--lumi-space-xxl);
		--lumi-avatar-group-font: var(--lumi-font-size-sm);
	}

	.lumi-avatar-group--lg {
		--lumi-avatar-group-overlap: calc(var(--lumi-space-sm) * -1);
		--lumi-avatar-group-size: var(--lumi-space-3xl);
		--lumi-avatar-group-font: var(--lumi-font-size-base);
	}

	.lumi-avatar-group--xl {
		--lumi-avatar-group-overlap: calc(var(--lumi-space-md) * -1);
		--lumi-avatar-group-size: var(--lumi-space-4xl);
		--lumi-avatar-group-font: var(--lumi-font-size-lg);
	}

	.lumi-avatar-group__item {
		display: inline-flex;
		border-radius: var(--lumi-radius-full);
		box-shadow: 0 0 0 var(--lumi-border-width-thick) var(--lumi-color-surface);
	}

	.lumi-avatar-group__item:not(:first-child) {
		margin-inline-start: var(--lumi-avatar-group-overlap);
	}

	/* Same diameter as Avatar; only the +N badge needs explicit size. */
	.lumi-avatar-group__overflow {
		inline-size: var(--lumi-avatar-group-size);
		block-size: var(--lumi-avatar-group-size);
		align-items: center;
		justify-content: center;
		font-size: var(--lumi-avatar-group-font);
		font-weight: var(--lumi-font-weight-semibold);
		line-height: 1;
		color: var(--lumi-color-text-muted);
		background: color-mix(
			in oklch,
			var(--lumi-color-surface-inset) 88%,
			var(--lumi-color-text) 12%
		);
		user-select: none;
	}
</style>
