<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import Icon from '../Icon/Icon.svelte';
	import type { DropdownItemProps } from './types';

	interface Props extends DropdownItemProps {
		children?: Snippet;
	}

	const {
		children,
		icon,
		href,
		color,
		disabled = false,
		submit = false,
		selected = false,
		class: className = '',
		onclick
	}: Props = $props();

	const closeDropdown = getContext<() => void>('dropdownClose');

	const itemClasses = $derived.by(() =>
		[
			'lumi-dropdown-item',
			selected && 'lumi-dropdown-item--selected',
			disabled && 'lumi-dropdown-item--disabled',
			className
		]
			.filter(Boolean)
			.join(' ')
	);

	const colorStyle = $derived(
		color
			? `--_accent: var(--lumi-color-${color}); --_accent-bg: var(--lumi-color-${color}-bg)`
			: undefined
	);

	function handleClick(event: MouseEvent): void {
		if (disabled) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}

		onclick?.(event);

		if (event.defaultPrevented) {
			return;
		}

		if (submit) {
			// Defer closing to allow form submission to bubble
			setTimeout(() => {
				closeDropdown?.();
			}, 0);
		} else {
			closeDropdown?.();
		}
	}

	function handleLinkKeydown(event: KeyboardEvent): void {
		if (event.key !== ' ') return;
		event.preventDefault();
		if (!disabled) (event.currentTarget as HTMLAnchorElement).click();
	}
</script>

{#snippet itemContent()}
	{#if icon}
		<div class="lumi-dropdown-item__icon">
			<Icon {icon} size="sm" />
		</div>
	{/if}

	<span class="lumi-dropdown-item__content">
		{#if children}
			{@render children()}
		{/if}
	</span>
{/snippet}

{#if href}
	<a
		{href}
		class={itemClasses}
		style={colorStyle}
		role="menuitem"
		aria-current={selected ? 'true' : undefined}
		aria-disabled={disabled || undefined}
		tabindex="-1"
		onclick={handleClick}
		onkeydown={handleLinkKeydown}
	>
		{@render itemContent()}
	</a>
{:else}
	<button
		type={submit ? 'submit' : 'button'}
		{disabled}
		class={itemClasses}
		style={colorStyle}
		role="menuitem"
		aria-current={selected ? 'true' : undefined}
		aria-disabled={disabled || undefined}
		tabindex="-1"
		onclick={handleClick}
	>
		{@render itemContent()}
	</button>
{/if}

<style>
	.lumi-dropdown-item {
		--lumi-control-accent: var(--lumi-color-primary);
		--dropdown-item-hover-bg: color-mix(
			in srgb,
			var(--lumi-color-primary) 4%,
			transparent
		);
		--dropdown-item-lift: var(--lumi-interactive-lift);
		width: 100%;
		padding: var(--lumi-space-sm) var(--lumi-space-md);
		cursor: pointer;
		transition: var(--lumi-transition-interactive);
		user-select: none;
		color: var(--lumi-color-text);
		font-size: var(--lumi-font-size-sm);
		line-height: var(--lumi-line-height-normal);
		display: flex;
		align-items: center;
		gap: var(--lumi-space-md);
		background: transparent;
		border: none;
		border-radius: var(--lumi-radius-control);
		text-align: left;
		text-decoration: none;
	}

	.lumi-dropdown-item:hover:not(.lumi-dropdown-item--disabled) {
		background: var(--_accent-bg, var(--dropdown-item-hover-bg));
		color: var(--lumi-color-text);
		transform: translateY(var(--dropdown-item-lift));
	}

	.lumi-dropdown-item:focus-visible {
		background: var(--dropdown-item-hover-bg);
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
	}

	.lumi-dropdown-item:active:not(.lumi-dropdown-item--disabled) {
		transform: none;
	}

	.lumi-dropdown-item--selected {
		font-weight: var(--lumi-font-weight-semibold);
		color: var(--lumi-color-primary);
	}

	.lumi-dropdown-item--selected .lumi-dropdown-item__icon {
		color: var(--lumi-color-primary);
	}

	.lumi-dropdown-item__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--_accent, var(--lumi-color-text-muted));
		flex-shrink: 0;
		width: var(--lumi-icon-sm);
		height: var(--lumi-icon-sm);
	}

	.lumi-dropdown-item:hover .lumi-dropdown-item__icon {
		color: inherit;
	}

	.lumi-dropdown-item__content {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* States */
	.lumi-dropdown-item--disabled {
		opacity: var(--lumi-opacity-disabled);
		cursor: not-allowed;
	}
</style>
