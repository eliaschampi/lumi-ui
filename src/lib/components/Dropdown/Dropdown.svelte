<script lang="ts">
	import { setContext } from 'svelte';
	import { createFloating } from '../../utils/floating.svelte';
	import MenuSurface from './MenuSurface.svelte';
	import type { DropdownProps, DropdownTriggerProps } from './types';

	let {
		open = $bindable(false),
		placement = 'bottom-start',
		size = 'md',
		disabled = false,
		'aria-label': ariaLabel,
		class: className,
		onopen,
		onclose,
		trigger,
		triggerContent,
		content,
		children
	}: DropdownProps = $props();

	let root: HTMLElement | undefined = $state();
	let menuElement: HTMLDivElement | undefined = $state();
	let surface: MenuSurface | undefined = $state();

	const instanceId = $props.id();
	const triggerId = `lumi-dropdown-trigger-${instanceId}`;
	const menuId = `lumi-dropdown-menu-${instanceId}`;

	// The wrapper anchors the menu; the trigger itself is a real button.
	const floating = createFloating(
		() => root,
		() => menuElement,
		() => ({ placement, offset: 8, maxHeight: 320, viewportPadding: 12 })
	);

	// Content rule (no double render): a trigger snippet frees `children` for the menu.
	const triggerBody = $derived(
		triggerContent ?? (content ? undefined : children)
	);
	const menuBody = $derived(
		content ?? (trigger || triggerContent ? children : undefined)
	);

	$effect(() => {
		if (open && !disabled) show();
		else hide();
	});

	setContext('dropdownClose', () => hide(true));

	// Hidden menus refuse focus, so keyboard focus waits for the first position.
	let pendingFocus = $state<'first' | 'last' | null>(null);

	function show(focus?: 'first' | 'last'): void {
		if (disabled) return;
		if (!floating.isOpen) {
			floating.open();
			open = true;
			onopen?.();
		}
		if (focus) pendingFocus = focus;
	}

	$effect(() => {
		if (!floating.hasPosition || !pendingFocus || !surface) return;
		surface.focusItem(pendingFocus);
		pendingFocus = null;
	});

	function hide(restoreFocus = false): void {
		if (!floating.isOpen) return;
		pendingFocus = null;
		floating.close();
		open = false;
		if (restoreFocus) document.getElementById(triggerId)?.focus();
		onclose?.();
	}

	const triggerProps = $derived<DropdownTriggerProps>({
		id: triggerId,
		'aria-haspopup': 'menu',
		'aria-expanded': floating.isOpen,
		'aria-controls': floating.isOpen ? menuId : undefined,
		disabled,
		onclick: () => (floating.isOpen ? hide() : show()),
		onkeydown: (event) => {
			const { key } = event;
			if (key === 'ArrowDown' || key === 'ArrowUp') {
				event.preventDefault();
				show(key === 'ArrowDown' ? 'first' : 'last');
			} else if (key === 'Escape' && floating.isOpen) {
				// Ours to handle: keep an enclosing dialog open.
				event.preventDefault();
				event.stopPropagation();
				hide(true);
			}
		}
	});

	// Outside presses close; listeners exist only while open.
	$effect(() => {
		if (!floating.isOpen) return;
		const onpointerdown = (event: PointerEvent) => {
			const target = event.target as Node;
			if (!root?.contains(target) && !menuElement?.contains(target)) hide();
		};
		document.addEventListener('pointerdown', onpointerdown, true);
		return () =>
			document.removeEventListener('pointerdown', onpointerdown, true);
	});

	$effect(() => () => floating.close());
</script>

<div bind:this={root} class={['lumi-dropdown', className]}>
	{#if trigger}
		{@render trigger(triggerProps)}
	{:else}
		<button
			type="button"
			class="lumi-dropdown__trigger"
			aria-label={ariaLabel}
			{...triggerProps}
		>
			{@render triggerBody?.()}
		</button>
	{/if}

	{#if floating.isOpen}
		<MenuSurface
			bind:this={surface}
			bind:element={menuElement}
			id={menuId}
			aria-labelledby={triggerId}
			{size}
			style={floating.styleString}
			onclose={hide}
		>
			{@render menuBody?.()}
		</MenuSurface>
	{/if}
</div>

<style>
	.lumi-dropdown {
		position: relative;
		display: inline-block;
	}

	.lumi-dropdown__trigger {
		display: inline-flex;
		align-items: center;
		padding: 0;
		background: none;
		border: 0;
		border-radius: var(--lumi-radius-control);
		color: inherit;
		font: inherit;
		cursor: pointer;
	}

	.lumi-dropdown__trigger:disabled {
		cursor: not-allowed;
		opacity: var(--lumi-opacity-disabled);
	}

	.lumi-dropdown__trigger:focus-visible {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
	}
</style>
