<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { contextMenu: en.contextMenu };
</script>

<script lang="ts">
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
		() => ({ offset: 0, maxHeight: 300, viewportPadding: 12 })
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
			contextElement:
				event.currentTarget instanceof Element
					? event.currentTarget
					: undefined,
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

	// Focus the first item once positioned, then report the resolved spot.
	$effect(() => {
		if (!floating.hasPosition || !pendingOpen) return;
		const { event, data } = pendingOpen;
		pendingOpen = null;
		surface?.focusItem('first');
		onopen?.(event, data, floating.position.top, floating.position.left);
	});

	// Any press, other context menu or scroll outside the menu closes it.
	$effect(() => {
		if (!floating.isOpen) return;
		const outside = (event: Event) => {
			if (!menuElement?.contains(event.target as Node)) hide(false);
		};
		const onscroll = () => hide(false);
		document.addEventListener('pointerdown', outside, true);
		document.addEventListener('contextmenu', outside, true);
		window.addEventListener('scroll', onscroll, {
			capture: true,
			passive: true
		});
		return () => {
			document.removeEventListener('pointerdown', outside, true);
			document.removeEventListener('contextmenu', outside, true);
			window.removeEventListener('scroll', onscroll, true);
		};
	});

	$effect(() => () => floating.close());
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
