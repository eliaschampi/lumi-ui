<script lang="ts">
	import { DropdownItem } from '../Dropdown';
	import type { ContextItemProps } from './types';

	const {
		title = '',
		icon,
		shortcut = '',
		disabled = false,
		color,
		class: className = '',
		onclick
	}: ContextItemProps = $props();
</script>

<!-- Same menu-item recipe as DropdownItem; Context closes on item click. -->
<DropdownItem
	{icon}
	{color}
	{disabled}
	class="lumi-context-item {className}"
	{onclick}
>
	<span class="lumi-context-item__title">{title}</span>
	{#if shortcut}
		<kbd class="lumi-context-item__shortcut">{shortcut}</kbd>
	{/if}
</DropdownItem>

<style>
	.lumi-context-item__title {
		flex: 1;
		min-inline-size: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.lumi-context-item__shortcut {
		color: var(--lumi-color-text-muted);
		font-family: inherit;
		font-size: var(--lumi-font-size-xs);
	}
</style>
