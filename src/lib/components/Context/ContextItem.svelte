<script lang="ts">
	import Icon from '../Icon/Icon.svelte';
	import type { ContextItemProps } from './types';

	const {
		title = '',
		icon = '',
		shortcut = '',
		disabled = false,
		color,
		class: className = '',
		onclick
	}: ContextItemProps = $props();

	const itemClasses = $derived.by(() =>
		['lumi-context-item', disabled && 'lumi-context-item--disabled', className]
			.filter(Boolean)
			.join(' ')
	);

	const colorStyle = $derived(
		color
			? `--_accent: var(--lumi-color-${color}); --_accent-bg: var(--lumi-color-${color}-bg)`
			: undefined
	);

	function handleClick(event: MouseEvent): void {
		if (!disabled) {
			onclick?.(event);
		}
	}
</script>

<button
	type="button"
	{disabled}
	class={itemClasses}
	style={colorStyle}
	tabindex="-1"
	role="menuitem"
	aria-disabled={disabled || undefined}
	onclick={handleClick}
>
	{#if icon}
		<div class="lumi-context-item__icon">
			<Icon {icon} size="sm" />
		</div>
	{/if}

	<span class="lumi-context-item__text">{title}</span>

	{#if shortcut}
		<span class="lumi-context-item__shortcut">{shortcut}</span>
	{/if}
</button>

<style>
	.lumi-context-item {
		--lumi-control-accent: var(--lumi-color-primary);
		--context-item-hover-bg: color-mix(
			in srgb,
			var(--lumi-color-primary) 4%,
			transparent
		);
		--context-item-lift: var(--lumi-interactive-lift);
		display: flex;
		width: 100%;
		align-items: center;
		gap: var(--lumi-space-md);
		padding: var(--lumi-space-sm) var(--lumi-space-md);
		cursor: pointer;
		transition: var(--lumi-transition-interactive);
		user-select: none;
		color: var(--lumi-color-text);
		font-size: var(--lumi-font-size-sm);
		line-height: var(--lumi-line-height-normal);
		font-family: inherit;
		border-radius: var(--lumi-radius-control);
		border: none;
		background: transparent;
		text-align: left;
		text-decoration: none;
	}

	.lumi-context-item:hover:not(.lumi-context-item--disabled) {
		background: var(--_accent-bg, var(--context-item-hover-bg));
		color: var(--lumi-color-text);
		transform: translateY(var(--context-item-lift));
	}

	.lumi-context-item:focus-visible {
		background: var(--context-item-hover-bg);
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
	}

	.lumi-context-item:active:not(.lumi-context-item--disabled) {
		transform: none;
	}

	.lumi-context-item__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--_accent, var(--lumi-color-text-muted));
		flex-shrink: 0;
		width: var(--lumi-icon-sm);
		height: var(--lumi-icon-sm);
	}

	.lumi-context-item:hover .lumi-context-item__icon {
		color: inherit;
	}

	.lumi-context-item__text {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.lumi-context-item__shortcut {
		margin-left: var(--lumi-space-lg);
		font-size: var(--lumi-font-size-xs);
		color: var(--lumi-color-text-muted);
		opacity: 0.8;
	}

	/* States */
	.lumi-context-item--disabled {
		opacity: var(--lumi-opacity-disabled);
		cursor: not-allowed;
	}
</style>
