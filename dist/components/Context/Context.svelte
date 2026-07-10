<script lang="ts">
	import type { Snippet } from 'svelte';
	import { scale } from 'svelte/transition';
	import { portal } from '../../actions/portal';
	import {
		createFloating,
		type FloatingReference
	} from '../../utils/floating.svelte';
	import { LUMI_CONFIG } from '../config';
	import type { ContextProps } from './types';

	interface Props extends ContextProps {
		children?: Snippet<[{ data: unknown }]>;
	}

	const {
		size = 'md',
		closeOnClick = true,
		closeOnScroll = true,
		itemSelector = '.lumi-context-item',
		maxHeight = LUMI_CONFIG.floating.context.maxHeight,
		viewportPadding = LUMI_CONFIG.floating.context.viewportPadding,
		'aria-label': ariaLabel = '',
		class: className = '',
		onopen,
		onclose,
		children
	}: Props = $props();

	let contextMenu: HTMLDivElement | undefined = $state();
	let reference: FloatingReference | undefined = $state();
	let contextData = $state<unknown>(null);
	let previousActiveElement: HTMLElement | null = null;
	let pendingOpen: { event: MouseEvent; data?: unknown } | null = null;

	const floating = createFloating(
		() => reference,
		() => contextMenu,
		() => ({
			placement: 'bottom-start',
			offset: LUMI_CONFIG.floating.context.offset,
			maxHeight,
			viewportPadding,
			zIndex: 'var(--lumi-z-dropdown)',
			strategy: 'fixed'
		})
	);

	const contextClasses = $derived.by(() =>
		['lumi-context', `lumi-context--${size}`, className]
			.filter(Boolean)
			.join(' ')
	);
	const transitionDuration = LUMI_CONFIG.transitions.fast;

	function createPointReference(event: MouseEvent): FloatingReference {
		const { clientX: x, clientY: y } = event;
		const contextElement =
			event.currentTarget instanceof Element
				? event.currentTarget
				: event.target instanceof Element
					? event.target
					: undefined;

		return {
			contextElement,
			getBoundingClientRect: () => ({
				x,
				y,
				top: y,
				right: x,
				bottom: y,
				left: x,
				width: 0,
				height: 0
			})
		};
	}

	export function open(event: MouseEvent, data?: unknown): void {
		event.preventDefault();
		event.stopPropagation();
		const activeElement =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;
		previousActiveElement =
			activeElement === contextMenu &&
			event.currentTarget instanceof HTMLElement
				? event.currentTarget
				: activeElement;
		reference = createPointReference(event);
		contextData = data;
		pendingOpen = { event, data };
		floating.open();
	}

	export function close(): void {
		closeContext(true);
	}

	function closeContext(restoreFocus: boolean): void {
		if (!floating.isOpen) return;
		floating.close();
		pendingOpen = null;
		onclose?.();

		const elementToRestore = previousActiveElement;
		previousActiveElement = null;
		if (restoreFocus && elementToRestore?.isConnected) {
			requestAnimationFrame(() => {
				if (!floating.isOpen) elementToRestore.focus({ preventScroll: true });
			});
		}
	}

	function handleClick(event: Event): void {
		if (closeOnClick) {
			const target = event.target as HTMLElement;
			if (target.closest(itemSelector)) {
				closeContext(true);
			}
		}
	}

	function handleKeydown(event: KeyboardEvent): void {
		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				closeContext(true);
				break;
			case 'ArrowDown':
				event.preventDefault();
				focusNextItem(1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				focusNextItem(-1);
				break;
			case 'Home':
			case 'End':
				event.preventDefault();
				focusBoundaryItem(event.key === 'Home' ? 'first' : 'last');
				break;
			case 'Tab':
				closeContext(true);
				break;
		}
	}

	function getItems(): HTMLElement[] {
		if (!contextMenu) return [];
		return Array.from(
			contextMenu.querySelectorAll<HTMLElement>(itemSelector)
		).filter((item) => item.getAttribute('aria-disabled') !== 'true');
	}

	function focusNextItem(direction: number): void {
		const items = getItems();
		if (!items.length) return;
		const currentIndex = items.findIndex(
			(item) => item === document.activeElement
		);

		let nextIndex = currentIndex + direction;
		if (nextIndex < 0) nextIndex = items.length - 1;
		if (nextIndex >= items.length) nextIndex = 0;

		items[nextIndex]?.focus();
	}

	function focusBoundaryItem(boundary: 'first' | 'last'): void {
		const items = getItems();
		items[boundary === 'first' ? 0 : items.length - 1]?.focus();
	}

	function handleClickOutside(event: Event): void {
		if (
			floating.isOpen &&
			contextMenu &&
			!contextMenu.contains(event.target as Node)
		) {
			closeContext(false);
		}
	}

	function handleScroll(): void {
		closeContext(false);
	}

	$effect(() => {
		if (
			!floating.isOpen ||
			!floating.hasPosition ||
			!pendingOpen ||
			!contextMenu
		)
			return;
		const { event, data } = pendingOpen;
		pendingOpen = null;
		contextMenu.focus();
		onopen?.(event, data, floating.position.top, floating.position.left);
	});

	$effect(() => {
		if (!floating.isOpen) return;

		document.addEventListener('click', handleClickOutside, true);
		document.addEventListener('contextmenu', handleClickOutside, true);
		if (closeOnScroll) {
			window.addEventListener('scroll', handleScroll, {
				capture: true,
				passive: true
			});
		}

		return () => {
			document.removeEventListener('click', handleClickOutside, true);
			document.removeEventListener('contextmenu', handleClickOutside, true);
			if (closeOnScroll) {
				window.removeEventListener('scroll', handleScroll, true);
			}
		};
	});

	$effect(() => () => floating.close());
</script>

{#if floating.isOpen}
	<div
		bind:this={contextMenu}
		use:portal
		class={contextClasses}
		style={floating.styleString}
		tabindex="-1"
		role="menu"
		aria-label={ariaLabel || 'Context menu'}
		transition:scale={{ duration: transitionDuration, start: 0.96 }}
		onkeydown={handleKeydown}
		onclick={handleClick}
	>
		<div class="lumi-context__content">
			{#if children}
				{@render children({ data: contextData })}
			{/if}
		</div>
	</div>
{/if}

<style>
	.lumi-context {
		position: fixed;
		z-index: var(--lumi-z-dropdown);
		background: var(--lumi-floating-surface-bg);
		border: var(--lumi-border-width-thin) solid
			var(--lumi-floating-surface-border);
		border-radius: var(--lumi-radius-2xl);
		padding: var(--lumi-space-xs);
		min-width: calc(var(--lumi-space-5xl) * 2);
		max-width: calc(var(--lumi-space-5xl) * 3 + var(--lumi-space-xl));
		box-shadow: var(--lumi-floating-surface-shadow);
		outline: none;
		transform-origin: top left;
		display: flex;
		flex-direction: column;
	}

	.lumi-context__content {
		overflow-y: auto;
		max-height: inherit;
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-2xs);
	}

	/* Scrollbar */
	.lumi-context__content::-webkit-scrollbar {
		width: var(--lumi-space-2xs);
	}

	.lumi-context__content::-webkit-scrollbar-track {
		background: transparent;
	}

	.lumi-context__content::-webkit-scrollbar-thumb {
		background: var(--lumi-color-border);
		border-radius: var(--lumi-radius-full);
	}

	/* Sizes */
	.lumi-context--sm {
		min-width: calc(
			var(--lumi-space-4xl) + var(--lumi-space-xl) + var(--lumi-space-sm)
		);
	}
	.lumi-context--md {
		min-width: calc(var(--lumi-space-5xl) * 2 + var(--lumi-space-sm));
	}
	.lumi-context--lg {
		min-width: calc(var(--lumi-space-5xl) * 3);
	}

	@media (prefers-reduced-motion: reduce) {
		.lumi-context {
			transition: none !important;
			animation: none !important;
		}
	}
</style>
