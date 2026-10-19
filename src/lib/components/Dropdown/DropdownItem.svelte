<script lang="ts">
	import { getContext } from 'svelte';
	import { Icon } from '../Icon';
	import type { DropdownItemProps } from './types';

	const {
		children,
		icon,
		href,
		color,
		disabled = false,
		submit = false,
		selected,
		class: className,
		onclick
	}: DropdownItemProps = $props();

	// Absent inside a `Context` menu, which closes through its own click handler.
	const closeDropdown = getContext<(() => void) | undefined>('dropdownClose');

	function handleClick(event: MouseEvent): void {
		if (disabled) {
			event.preventDefault();
			return;
		}
		onclick?.(event);
		if (event.defaultPrevented) return;
		// A submit item lets the event reach its form before the menu unmounts.
		if (submit) setTimeout(() => closeDropdown?.());
		else closeDropdown?.();
	}

	function handleLinkKeydown(event: KeyboardEvent): void {
		if (event.key !== ' ') return;
		event.preventDefault();
		if (!disabled) (event.currentTarget as HTMLAnchorElement).click();
	}
</script>

{#snippet itemContent()}
	{#if icon}<Icon {icon} size="sm" />{/if}
	<span class="lumi-dropdown-item__content">{@render children?.()}</span>
{/snippet}

<svelte:element
	this={href ? 'a' : 'button'}
	{href}
	type={href ? undefined : submit ? 'submit' : 'button'}
	disabled={href ? undefined : disabled}
	class={[
		'lumi-dropdown-item',
		selected && 'lumi-dropdown-item--selected',
		disabled && 'lumi-dropdown-item--disabled',
		className
	]}
	style:--lumi-control-accent={color && `var(--lumi-color-${color})`}
	role={selected === undefined ? 'menuitem' : 'menuitemradio'}
	aria-checked={selected}
	aria-disabled={disabled || undefined}
	tabindex="-1"
	onclick={handleClick}
	onkeydown={href ? handleLinkKeydown : undefined}
>
	{@render itemContent()}
</svelte:element>

<style>
	/* The one menu-item recipe, shared by DropdownItem and ContextItem. A
	   `color` sets the accent; uncolored items keep neutral icons. */
	.lumi-dropdown-item {
		--lumi-dropdown-item-accent: var(
			--lumi-control-accent,
			var(--lumi-color-primary)
		);
		display: flex;
		align-items: center;
		gap: var(--lumi-space-md);
		inline-size: 100%;
		padding: var(--lumi-space-sm) var(--lumi-space-md);
		background: transparent;
		border: 0;
		border-radius: var(--lumi-radius-control);
		color: var(--lumi-color-text);
		font: inherit;
		font-size: var(--lumi-font-size-sm);
		line-height: var(--lumi-line-height-normal);
		text-align: start;
		text-decoration: none;
		cursor: pointer;
		user-select: none;
		transition: var(--lumi-transition-interactive);
	}

	.lumi-dropdown-item:hover:not(.lumi-dropdown-item--disabled),
	.lumi-dropdown-item:focus-visible {
		background: color-mix(
			in srgb,
			var(--lumi-dropdown-item-accent) 8%,
			transparent
		);
	}

	/* Same lift and press as list rows and buttons. */
	.lumi-dropdown-item:hover:not(.lumi-dropdown-item--disabled) {
		transform: translateY(var(--lumi-interactive-lift));
	}

	.lumi-dropdown-item:active:not(.lumi-dropdown-item--disabled) {
		transform: none;
	}

	.lumi-dropdown-item:focus-visible {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
	}

	.lumi-dropdown-item > :global(.lumi-icon) {
		color: var(--lumi-control-accent, var(--lumi-color-text-muted));
	}

	.lumi-dropdown-item--selected {
		color: var(--lumi-dropdown-item-accent);
		font-weight: var(--lumi-font-weight-semibold);
	}

	.lumi-dropdown-item--selected > :global(.lumi-icon),
	.lumi-dropdown-item:hover > :global(.lumi-icon) {
		color: inherit;
	}

	.lumi-dropdown-item__content {
		display: flex;
		flex: 1;
		align-items: center;
		gap: var(--lumi-space-lg);
		min-inline-size: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.lumi-dropdown-item--disabled {
		opacity: var(--lumi-opacity-disabled);
		cursor: not-allowed;
	}
</style>
