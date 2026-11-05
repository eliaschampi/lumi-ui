<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { contextMenu: en.contextMenu };
</script>

<script lang="ts">
	import { tick } from 'svelte';
	import {
		createFloating,
		type FloatingReference
	} from '../../utils/floating.svelte';
	import MenuSurface from '../Dropdown/MenuSurface.svelte';
	import { useLumiLocale } from '../../i18n';
	import type { ContextProps } from './types';

	const {
		size = 'md',
		'aria-label': ariaLabel,
		class: className,
		onopen,
		onclose,
		children
	}: ContextProps = $props();

	const i18n = useLumiLocale(COPY);

	let menuElement: HTMLDivElement | undefined = $state();
	let surface: MenuSurface | undefined = $state();
	let reference: FloatingReference | undefined = $state();
	let contextData = $state<unknown>(null);
	let previousFocus: HTMLElement | null = null;
	let pendingOpen: { event: MouseEvent; data?: unknown } | null = null;

	const floating = createFloating(
		() => reference,
		() => menuElement,
		() => ({
			offset: 0,
			maxHeight: 300,
			viewportPadding: 12,
			closeOnScroll: true,
			onoutside: () => hide(false)
		})
	);

	/** Open at the pointer of `event`; `data` reaches the children snippet. */
	export function open(event: MouseEvent, data?: unknown): void {
		event.preventDefault();
		event.stopPropagation();
		const { clientX: x, clientY: y } = event;
		const active = document.activeElement;
		previousFocus =
			active === menuElement && event.currentTarget instanceof HTMLElement
				? event.currentTarget
				: active instanceof HTMLElement
					? active
					: null;
		reference = {
			getBoundingClientRect: () => ({ x, y, width: 0, height: 0 })
		};
		contextData = data;
		pendingOpen = { event, data };
		floating.open();
	}

	export function close(): void {
		hide(true);
	}

	function hide(restoreFocus: boolean): void {
		if (!floating.isOpen) return;
		floating.close();
		pendingOpen = null;
		onclose?.();
		const target = previousFocus;
		previousFocus = null;
		if (restoreFocus && target?.isConnected)
			requestAnimationFrame(() => {
				if (!floating.isOpen) target.focus({ preventScroll: true });
			});
	}

	// Focus the first item once visible, then report the resolved spot.
	$effect(() => {
		if (!floating.hasPosition || !pendingOpen) return;
		const { event, data } = pendingOpen;
		pendingOpen = null;
		void tick().then(() => {
			surface?.focusItem('first');
			onopen?.(event, data, floating.position.top, floating.position.left);
		});
	});
</script>

{#if floating.isOpen}
	<MenuSurface
		bind:this={surface}
		bind:element={menuElement}
		{size}
		class={className}
		style={floating.styleString}
		aria-label={ariaLabel || i18n.t.contextMenu}
		onclose={hide}
		onclick={(event) => {
			if ((event.target as Element).closest('[role^="menuitem"]')) hide(true);
		}}
	>
		{@render children?.({ data: contextData })}
	</MenuSurface>
{/if}
