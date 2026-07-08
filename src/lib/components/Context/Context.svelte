<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount, tick } from 'svelte';
	import { scale } from 'svelte/transition';
	import { portal } from '../../actions/portal';
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
		maxHeight = 300,
		viewportPadding = 12,
		'aria-label': ariaLabel = '',
		class: className = '',
		onopen,
		onclose,
		children
	}: Props = $props();

	let contextMenu: HTMLDivElement | undefined = $state();
	let show = $state(false);
	let isPositioned = $state(false);
	let top = $state(0);
	let left = $state(0);
	let contextData = $state<unknown>(null);

	const contextClasses = $derived.by(() =>
		[
			'lumi-context',
			`lumi-context--${size}`,
			show && isPositioned && 'lumi-context--visible',
			className
		]
			.filter(Boolean)
			.join(' ')
	);
	const transitionDuration = LUMI_CONFIG.transitions.fast;

	const contextStyle = $derived.by(() => ({
		top: `${top}px`,
		left: `${left}px`,
		maxHeight: `${maxHeight}px`
	}));

	export function open(event: MouseEvent, data?: unknown): void {
		event.preventDefault();
		event.stopPropagation();

		contextData = data;
		show = true;
		isPositioned = false;
		void positionMenu(event, data);
	}

	async function positionMenu(event: MouseEvent, data?: unknown): Promise<void> {
		await tick();
		if (!contextMenu || !show) return;

		const { clientX, clientY } = event;
		const maxLeft = window.innerWidth - contextMenu.offsetWidth - viewportPadding;
		const maxTop = window.innerHeight - contextMenu.offsetHeight - viewportPadding;

		left = Math.min(Math.max(viewportPadding, clientX), maxLeft);
		top = Math.min(Math.max(viewportPadding, clientY), maxTop);

		requestAnimationFrame(() => {
			if (!contextMenu || !show) return;
			isPositioned = true;
			contextMenu.focus();

			if (closeOnScroll) {
				window.addEventListener('scroll', close, { passive: true });
			}

			onopen?.(event, data, top, left);
		});
	}

	export function close(): void {
		if (!show) return;

		isPositioned = false;
		setTimeout(() => {
			show = false;
			contextData = null;
		}, transitionDuration);

		if (closeOnScroll) {
			window.removeEventListener('scroll', close);
		}

		onclose?.();
	}

	function handleClick(event: Event): void {
		if (closeOnClick) {
			const target = event.target as HTMLElement;
			if (target.closest(itemSelector)) {
				close();
			}
		}
	}

	function handleKeydown(event: KeyboardEvent): void {
		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				close();
				break;
			case 'ArrowDown':
				event.preventDefault();
				focusNextItem(1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				focusNextItem(-1);
				break;
		}
	}

	function focusNextItem(direction: number): void {
		if (!contextMenu) return;

		const items = contextMenu.querySelectorAll(itemSelector);
		const currentIndex = Array.from(items).findIndex((item) => item === document.activeElement);

		let nextIndex = currentIndex + direction;
		if (nextIndex < 0) nextIndex = items.length - 1;
		if (nextIndex >= items.length) nextIndex = 0;

		const nextItem = items[nextIndex] as HTMLElement;
		nextItem?.focus();
	}

	function handleClickOutside(event: Event): void {
		if (show && contextMenu && !contextMenu.contains(event.target as Node)) {
			close();
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside, true);
		document.addEventListener('contextmenu', handleClickOutside, true);

		return () => {
			document.removeEventListener('click', handleClickOutside, true);
			document.removeEventListener('contextmenu', handleClickOutside, true);
			if (closeOnScroll) {
				window.removeEventListener('scroll', close);
			}
		};
	});
</script>

{#if show}
	<div
		bind:this={contextMenu}
		use:portal
		class={contextClasses}
		style:top={contextStyle.top}
		style:left={contextStyle.left}
		style:max-height={contextStyle.maxHeight}
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
		border: var(--lumi-border-width-thin) solid var(--lumi-floating-surface-border);
		border-radius: var(--lumi-radius-2xl);
		padding: var(--lumi-space-xs);
		min-width: calc(var(--lumi-space-5xl) * 2);
		max-width: calc(var(--lumi-space-5xl) * 3 + var(--lumi-space-xl));
		box-shadow: var(--lumi-floating-surface-shadow);
		outline: none;
		opacity: 0;
		transform-origin: top left;
		display: flex;
		flex-direction: column;
	}

	.lumi-context--visible {
		opacity: 1;
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
		min-width: calc(var(--lumi-space-4xl) + var(--lumi-space-xl) + var(--lumi-space-sm));
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
