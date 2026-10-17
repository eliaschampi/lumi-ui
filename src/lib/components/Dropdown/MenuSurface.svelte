<script lang="ts">
	import type { Snippet } from 'svelte';
	import { scale } from 'svelte/transition';
	import { portal } from '../../actions/portal';
	import { DURATION_FAST, motion } from '../config';

	interface Props {
		element?: HTMLDivElement;
		id?: string;
		size?: 'sm' | 'md' | 'lg';
		style: string;
		'aria-label'?: string;
		'aria-labelledby'?: string;
		class?: string;
		onclose: (restoreFocus: boolean) => void;
		onclick?: (event: MouseEvent) => void;
		children?: Snippet;
	}

	let {
		element = $bindable(),
		size = 'md',
		style,
		class: className,
		onclose,
		onclick,
		children,
		...aria
	}: Props = $props();

	const ITEM = '[role^="menuitem"]:not([aria-disabled="true"])';

	function move(target: 'first' | 'last' | 1 | -1): void {
		const items = [...(element?.querySelectorAll<HTMLElement>(ITEM) ?? [])];
		if (!items.length) return element?.focus();
		const index = items.indexOf(document.activeElement as HTMLElement);
		const next =
			target === 'first'
				? 0
				: target === 'last'
					? items.length - 1
					: (index + target + items.length) % items.length;
		items[next].focus();
	}

	/** Focus the first or last enabled item (used right after opening). */
	export function focusItem(target: 'first' | 'last'): void {
		move(target);
	}

	// One keyboard model for every menu: roving focus, Home/End, Escape/Tab close.
	function handleKeydown(event: KeyboardEvent): void {
		const { key } = event;
		if (key === 'ArrowDown' || key === 'ArrowUp')
			move(key === 'ArrowDown' ? 1 : -1);
		else if (key === 'Home' || key === 'End')
			move(key === 'Home' ? 'first' : 'last');
		else if (key === 'Escape') onclose(true);
		else if (key === 'Tab') return onclose(true);
		else return;
		// Handled here, so an enclosing dialog must not also react.
		event.preventDefault();
		event.stopPropagation();
	}
</script>

<!-- Internal: the one menu surface shared by Dropdown and Context. -->
<div
	bind:this={element}
	use:portal
	{...aria}
	class={['lumi-menu', `lumi-menu--${size}`, className]}
	{style}
	role="menu"
	tabindex="-1"
	onkeydown={handleKeydown}
	{onclick}
	transition:scale={{ duration: motion(DURATION_FAST), start: 0.96 }}
>
	<div class="lumi-menu__content lumi-scrollbar">{@render children?.()}</div>
</div>

<style>
	.lumi-menu {
		/* Items opt into an accent with `color`; nothing leaks in from outside. */
		--lumi-control-accent: initial;
		display: flex;
		flex-direction: column;
		max-inline-size: calc(var(--lumi-space-5xl) * 3 + var(--lumi-space-xl));
		padding: var(--lumi-space-xs);
		overflow: hidden;
		background: var(--lumi-floating-surface-bg);
		border: var(--lumi-border-width-thin) solid
			var(--lumi-floating-surface-border);
		border-radius: var(--lumi-surface-radius);
		box-shadow: var(--lumi-floating-surface-shadow);
		outline: none;
	}

	.lumi-menu__content {
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-2xs);
		max-block-size: inherit;
		overflow-y: auto;
	}

	.lumi-menu--sm {
		min-inline-size: calc(
			var(--lumi-space-4xl) + var(--lumi-space-xl) + var(--lumi-space-sm)
		);
	}

	.lumi-menu--md {
		min-inline-size: calc(var(--lumi-space-5xl) * 2 + var(--lumi-space-sm));
	}

	.lumi-menu--lg {
		min-inline-size: calc(var(--lumi-space-5xl) * 3);
	}
</style>
