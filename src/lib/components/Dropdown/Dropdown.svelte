<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { scale } from 'svelte/transition';
	import { portal } from '../../actions/portal';
	import { createFloating } from '../../utils/floating.svelte';
	import { LUMI_CONFIG } from '../config';
	import type { DropdownPlacement, DropdownTrigger } from './types';

	interface Props {
		open?: boolean;
		placement?: DropdownPlacement;
		position?: DropdownPlacement; // Added for backwards compatibility
		size?: 'sm' | 'md';
		disabled?: boolean;
		trigger?: DropdownTrigger;
		closeOnClickOutside?: boolean;
		maxHeight?: number;
		offset?: number;
		viewportPadding?: number;
		'aria-label'?: string;
		class?: string;
		onopen?: () => void;
		onclose?: () => void;
		children?: Snippet;
		content?: Snippet;
		triggerContent?: Snippet;
	}

	let {
		open = $bindable(false),
		placement,
		position,
		size = 'md',
		disabled = false,
		trigger = 'click',
		closeOnClickOutside = true,
		maxHeight = 320,
		offset = 8,
		viewportPadding = 12,
		'aria-label': ariaLabel = '',
		class: className = '',
		onopen,
		onclose,
		children,
		content,
		triggerContent
	}: Props = $props();

	// Support both placement and position (deprecated) with fallback to default
	const resolvedPlacement = $derived(placement ?? position ?? 'bottom-start');

	let dropdownRef: HTMLDivElement | undefined = $state();
	let menuRef: HTMLDivElement | undefined = $state();

	const instanceId = $props.id();
	const triggerId = `lumi-dropdown-trigger-${instanceId}`;
	const menuId = `lumi-dropdown-menu-${instanceId}`;
	const transitionDuration = LUMI_CONFIG.transitions.fast;

	const floating = createFloating(
		() => dropdownRef,
		() => menuRef,
		() => ({
			placement: resolvedPlacement,
			maxHeight,
			offset,
			viewportPadding,
			zIndex: 'var(--lumi-z-dropdown)',
			strategy: 'fixed' as const
		})
	);

	// Sync external `open` prop with the floating controller.
	$effect(() => {
		if (open && !floating.isOpen) openDropdown();
		else if (!open && floating.isOpen) closeDropdown();
	});

	// Provide close function to child components (DropdownItem).
	setContext('dropdownClose', closeDropdown);

	const dropdownClasses = $derived.by(() =>
		['lumi-dropdown', open && 'lumi-dropdown--open', className].filter(Boolean).join(' ')
	);

	const styleVars = `--dropdown-transition-duration: ${transitionDuration}ms;`;

	// Render rule (no double-render of `children`):
	//   trigger  -> `triggerContent`, or `children` only when no `content` is given.
	//   menu     -> `content`, or `children` only when `triggerContent` is given.
	const triggerSnippet = $derived(triggerContent ?? (content ? undefined : children));
	const menuSnippet = $derived(content ?? (triggerContent ? children : undefined));

	function openDropdown(): void {
		if (disabled || floating.isOpen) return;
		floating.open();
		open = true;
		onopen?.();
	}

	function closeDropdown(): void {
		if (!floating.isOpen) return;
		floating.close();
		open = false;
		onclose?.();
	}

	function toggle(): void {
		if (disabled) return;
		if (open) closeDropdown();
		else openDropdown();
	}

	function handleClickOutside(event: PointerEvent): void {
		if (!closeOnClickOutside || !open || !dropdownRef || !menuRef) return;
		const target = event.target as Element;
		if (!dropdownRef.contains(target) && !menuRef.contains(target)) {
			closeDropdown();
		}
	}

	function handleEscape(event: KeyboardEvent): void {
		if (event.key === 'Escape' && open) closeDropdown();
	}

	function handleTriggerClick(event: MouseEvent): void {
		if (trigger === 'click') {
			event.stopPropagation();
			toggle();
		}
	}

	function handleTriggerKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggle();
		} else if (event.key === 'Escape') {
			closeDropdown();
		}
	}

	// Hover trigger: the menu is portaled to document.body, so both the trigger
	// and the menu coordinate via a shared, cancelable close timer. Moving the
	// cursor from trigger into the portaled menu no longer closes the dropdown.
	let hoverCloseTimer: ReturnType<typeof setTimeout> | null = null;

	function cancelHoverClose(): void {
		if (hoverCloseTimer !== null) {
			clearTimeout(hoverCloseTimer);
			hoverCloseTimer = null;
		}
	}

	function scheduleHoverClose(): void {
		if (trigger !== 'hover' || disabled) return;
		cancelHoverClose();
		hoverCloseTimer = setTimeout(() => {
			hoverCloseTimer = null;
			closeDropdown();
		}, 80);
	}

	function handleTriggerEnter(): void {
		if (trigger !== 'hover' || disabled) return;
		cancelHoverClose();
		openDropdown();
	}

	function handleTriggerLeave(): void {
		if (trigger !== 'hover') return;
		scheduleHoverClose();
	}

	function handleMenuEnter(): void {
		if (trigger !== 'hover') return;
		cancelHoverClose();
	}

	function handleMenuLeave(): void {
		if (trigger !== 'hover') return;
		scheduleHoverClose();
	}

	// Reactive document listeners: attached only while open, and only when
	// their feature is enabled. A change to `closeOnClickOutside` after mount
	// is now honored on the next open cycle.
	$effect(() => {
		if (!open) return;
		if (closeOnClickOutside) {
			document.addEventListener('pointerdown', handleClickOutside, true);
		}
		document.addEventListener('keydown', handleEscape);
		return () => {
			document.removeEventListener('pointerdown', handleClickOutside, true);
			document.removeEventListener('keydown', handleEscape);
		};
	});

	// Component-level resource and timer cleanup
	$effect(() => {
		return () => {
			cancelHoverClose();
			floating.close();
		};
	});
</script>

<div
	bind:this={dropdownRef}
	class={dropdownClasses}
	style={styleVars}
	onmouseenter={handleTriggerEnter}
	onmouseleave={handleTriggerLeave}
	role="presentation"
>
	<div
		id={triggerId}
		class="lumi-dropdown__trigger"
		aria-expanded={open}
		aria-haspopup="menu"
		aria-controls={open ? menuId : undefined}
		aria-disabled={disabled}
		aria-label={ariaLabel || undefined}
		role="button"
		tabindex={disabled ? -1 : 0}
		onclick={handleTriggerClick}
		onkeydown={handleTriggerKeydown}
	>
		{#if triggerSnippet}
			{@render triggerSnippet()}
		{/if}
	</div>

	{#if open}
		<div
			bind:this={menuRef}
			use:portal
			id={menuId}
			class="lumi-dropdown__menu lumi-dropdown__menu--{size}"
			role="menu"
			aria-labelledby={triggerId}
			tabindex="-1"
			style={floating.styleString}
			onmouseenter={handleMenuEnter}
			onmouseleave={handleMenuLeave}
			transition:scale={{ duration: transitionDuration, start: 0.96 }}
		>
			<div class="lumi-dropdown__content">
				{#if menuSnippet}
					{@render menuSnippet()}
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.lumi-dropdown {
		position: relative;
		display: inline-block;
	}

	.lumi-dropdown__trigger {
		cursor: pointer;
		user-select: none;
		display: inline-flex;
	}

	.lumi-dropdown__trigger:focus {
		outline: none;
	}

	.lumi-dropdown__trigger:focus-visible {
		outline: var(--lumi-border-width-thick) solid var(--lumi-color-primary);
		border-radius: var(--lumi-radius-md);
	}

	.lumi-dropdown__menu {
		background: var(--lumi-floating-surface-bg);
		border: var(--lumi-border-width-thin) solid var(--lumi-floating-surface-border);
		border-radius: var(--lumi-radius-2xl);
		box-shadow: var(--lumi-floating-surface-shadow);
		padding: var(--lumi-space-xs);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition:
			opacity var(--dropdown-transition-duration) var(--lumi-easing-default),
			transform var(--dropdown-transition-duration) var(--lumi-easing-default);
	}

	.lumi-dropdown__content {
		overflow-y: auto;
		max-height: inherit;
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-2xs);
	}

	.lumi-dropdown__content::-webkit-scrollbar {
		width: var(--lumi-space-2xs);
	}

	.lumi-dropdown__content::-webkit-scrollbar-track {
		background: transparent;
	}

	.lumi-dropdown__content::-webkit-scrollbar-thumb {
		background: var(--lumi-color-border);
		border-radius: var(--lumi-radius-full);
	}

	.lumi-dropdown__menu--sm {
		min-width: calc(var(--lumi-space-4xl) + var(--lumi-space-xl) + var(--lumi-space-sm));
	}

	.lumi-dropdown__menu--md {
		min-width: calc(var(--lumi-space-5xl) * 2 + var(--lumi-space-sm));
	}

	@media (prefers-reduced-motion: reduce) {
		.lumi-dropdown__menu {
			transition: none !important;
		}
	}
</style>