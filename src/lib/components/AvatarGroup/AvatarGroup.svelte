<script lang="ts">
	import Chip from '../Chip/Chip.svelte';
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
		`${items.length} miembro${items.length === 1 ? '' : 's'}${names ? `: ${names}` : ''}`
	);
</script>

<div class={classes} role="img" aria-label={ariaLabel} title={names}>
	{#each visible as item, i (i)}
		<div class="lumi-avatar-group__item">
			<Avatar text={item.text} src={item.src} alt={item.alt} {size} {color} />
		</div>
	{/each}
	{#if overflow > 0}
		<Chip color="info" size="sm" class="lumi-avatar-group__overflow">+{overflow}</Chip>
	{/if}
</div>

<style>
	.lumi-avatar-group {
		display: inline-flex;
		align-items: center;
		min-width: 0;
	}

	.lumi-avatar-group__item {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--lumi-radius-full);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-surface);
		background: var(--lumi-color-surface);
		box-shadow: var(--lumi-shadow-sm);
	}

	.lumi-avatar-group__item:not(:first-child) {
		margin-inline-start: calc(-1 * var(--lumi-space-xs));
	}

	.lumi-avatar-group--md .lumi-avatar-group__item:not(:first-child) {
		margin-inline-start: calc(-1 * var(--lumi-space-sm));
	}

	.lumi-avatar-group--lg .lumi-avatar-group__item:not(:first-child) {
		margin-inline-start: calc(-1 * var(--lumi-space-sm));
	}

	.lumi-avatar-group--xl .lumi-avatar-group__item:not(:first-child) {
		margin-inline-start: calc(-1 * var(--lumi-space-md));
	}

	.lumi-avatar-group__overflow {
		margin-inline-start: var(--lumi-space-xs);
	}
</style>
