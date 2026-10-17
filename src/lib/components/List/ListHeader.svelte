<script lang="ts">
	import { Icon } from '../Icon';
	import type { ListHeaderProps } from './types';

	const { title, icon, actions, class: className }: ListHeaderProps = $props();
</script>

<li class={['lumi-list-header', className]}>
	{#if icon}<Icon {icon} size="sm" />{/if}
	<span class="lumi-list-header__title">{title}</span>
	{#if actions}
		<span class="lumi-list-header__actions">{@render actions()}</span>
	{/if}
</li>

<style>
	.lumi-list-header {
		display: flex;
		align-items: center;
		gap: var(--lumi-space-sm);
		margin-block-end: var(--lumi-space-2xs);
		padding: var(--lumi-space-xs) var(--lumi-space-sm);
		border-block-end: var(--lumi-border-width-thin) solid
			var(--lumi-color-border-light);
		color: var(--lumi-control-accent, var(--lumi-color-text-muted));
	}

	.lumi-list-header__title {
		flex: 1;
		min-inline-size: 0;
		overflow: hidden;
		font-size: var(--lumi-font-size-xs);
		font-weight: var(--lumi-font-weight-semibold);
		letter-spacing: var(--lumi-letter-spacing-wide);
		line-height: var(--lumi-line-height-tight);
		text-overflow: ellipsis;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.lumi-list-header__actions {
		display: inline-flex;
		align-items: center;
		gap: var(--lumi-space-xs);
	}
</style>
