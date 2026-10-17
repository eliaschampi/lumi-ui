<script lang="ts">
	import { fade } from 'svelte/transition';
	import { portal } from '../../actions/portal';
	import { createFloating } from '../../utils/floating.svelte';
	import { DURATION_FAST, motion } from '../config';
	import type { TooltipPlacement, TooltipProps } from './types';

	const {
		text = '',
		color = 'primary',
		placement = 'top',
		delay = 0,
		class: className,
		children,
		content
	}: TooltipProps = $props();

	const instanceId = $props.id();
	const tooltipId = `lumi-tooltip-${instanceId}`;
	const FOCUSABLE =
		'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';

	let visible = $state(false);
	let showTimer: ReturnType<typeof setTimeout> | undefined;
	let hideTimer: ReturnType<typeof setTimeout> | undefined;
	let triggerRef: HTMLSpanElement | undefined = $state();
	let bubbleRef: HTMLDivElement | undefined = $state();
	let arrowRef: HTMLSpanElement | undefined = $state();

	const floating = createFloating(
		() => triggerRef,
		() => bubbleRef,
		() => ({
			placement,
			offset: 10,
			maxHeight: 300,
			viewportPadding: 8,
			zIndex: 'var(--lumi-z-tooltip)',
			arrow: arrowRef ? { element: arrowRef, padding: 12 } : undefined
		})
	);

	const side = $derived(
		floating.resolvedPlacement.split('-')[0] as TooltipPlacement
	);

	// The description lives in the DOM from SSR on. It is attached to the
	// first focusable element inside, else to a focusable ancestor, else the
	// wrapper becomes focusable. Re-attached when the child rewrites its ids.
	function attach(): void {
		if (!triggerRef) return;
		const target =
			triggerRef.querySelector<HTMLElement>(FOCUSABLE) ??
			triggerRef.parentElement?.closest<HTMLElement>(FOCUSABLE);
		if (!target) {
			// Writing an unchanged value would still notify the observer.
			if (triggerRef.getAttribute('aria-describedby') === tooltipId) return;
			triggerRef.tabIndex = 0;
			triggerRef.setAttribute('aria-describedby', tooltipId);
			return;
		}
		const ids = target.getAttribute('aria-describedby');
		if (!ids?.split(' ').includes(tooltipId))
			target.setAttribute(
				'aria-describedby',
				ids ? `${ids} ${tooltipId}` : tooltipId
			);
	}

	$effect(() => {
		if (!triggerRef) return;
		attach();
		const observer = new MutationObserver(attach);
		observer.observe(triggerRef, {
			subtree: true,
			childList: true,
			attributeFilter: ['aria-describedby']
		});
		return () => observer.disconnect();
	});

	function show(): void {
		clearTimeout(hideTimer);
		if (visible) return;
		clearTimeout(showTimer);
		showTimer = setTimeout(() => {
			visible = true;
			floating.open();
		}, delay);
	}

	// A short grace period lets the pointer travel onto the bubble (WCAG 1.4.13).
	function hide(now = false): void {
		clearTimeout(showTimer);
		clearTimeout(hideTimer);
		const close = () => {
			visible = false;
			floating.close();
		};
		if (now) close();
		else hideTimer = setTimeout(close, 100);
	}

	$effect(() => {
		if (!visible) return;
		// Capture phase runs before an enclosing dialog's Escape handler.
		// An open menu or listbox owns its Escape; the tooltip yields to it.
		const onkeydown = (event: KeyboardEvent) => {
			const target = event.target as Element;
			if (
				event.key !== 'Escape' ||
				target.closest?.('[role="menu"], [role="listbox"]') ||
				target.getAttribute?.('aria-expanded') === 'true'
			)
				return;
			event.preventDefault();
			event.stopPropagation();
			hide(true);
		};
		document.addEventListener('keydown', onkeydown, true);
		return () => document.removeEventListener('keydown', onkeydown, true);
	});

	$effect(() => () => {
		clearTimeout(showTimer);
		clearTimeout(hideTimer);
		floating.close();
	});
</script>

{#snippet body()}
	{#if content}{@render content()}{:else}{text}{/if}
{/snippet}

<!-- svelte-ignore a11y_no_static_element_interactions (Hover only mirrors focus; the description is exposed through aria-describedby.) -->
<span
	bind:this={triggerRef}
	class="lumi-tooltip"
	onpointerenter={show}
	onpointerleave={() => hide()}
	onfocusin={show}
	onfocusout={() => hide(true)}
>
	{@render children?.()}
	<span id={tooltipId} class="lumi-sr-only">{@render body()}</span>
</span>

{#if visible}
	<!-- Visual copy; assistive tech reads the description above. -->
	<div
		bind:this={bubbleRef}
		use:portal
		class={['lumi-tooltip__content', `lumi-tooltip--${side}`, className]}
		style={floating.styleString}
		style:--lumi-control-accent="var(--lumi-color-{color})"
		style:--lumi-tooltip-arrow-x={floating.position.arrowX != null
			? `${floating.position.arrowX}px`
			: 'calc(50% - var(--lumi-tooltip-arrow) / 2)'}
		style:--lumi-tooltip-arrow-y={floating.position.arrowY != null
			? `${floating.position.arrowY}px`
			: 'calc(50% - var(--lumi-tooltip-arrow) / 2)'}
		aria-hidden="true"
		onpointerenter={show}
		onpointerleave={() => hide()}
		transition:fade={{ duration: motion(DURATION_FAST) }}
	>
		{@render body()}
		<span bind:this={arrowRef} class="lumi-tooltip__arrow"></span>
	</div>
{/if}

<style>
	.lumi-tooltip {
		display: inline-flex;
		align-items: center;
		position: relative;
	}

	.lumi-tooltip__content {
		--lumi-tooltip-bg: var(--lumi-color-surface-raised);
		--lumi-tooltip-border: color-mix(
			in oklch,
			var(--lumi-control-accent, var(--lumi-color-border-strong)) 32%,
			var(--lumi-color-border-strong)
		);
		--lumi-tooltip-arrow: var(--lumi-space-xs);
		--lumi-tooltip-tuck: calc(
			(var(--lumi-tooltip-arrow) / 2) + var(--lumi-border-width-thin)
		);
		padding: var(--lumi-space-xs) var(--lumi-space-sm);
		max-width: calc(var(--lumi-space-5xl) * 3);
		border: var(--lumi-border-width-thin) solid var(--lumi-tooltip-border);
		border-radius: var(--lumi-radius-tooltip);
		background: var(--lumi-tooltip-bg);
		color: var(--lumi-color-text);
		box-shadow: var(--lumi-shadow-md);
		font-size: var(--lumi-font-size-xs);
		font-weight: var(--lumi-font-weight-medium);
		line-height: var(--lumi-line-height-snug);
		text-align: center;
	}

	/* Tip edges only; square tucks under the bubble so it is one shape. */
	.lumi-tooltip__arrow {
		position: absolute;
		width: var(--lumi-tooltip-arrow);
		height: var(--lumi-tooltip-arrow);
		box-sizing: border-box;
		background: var(--lumi-tooltip-bg);
		border: var(--lumi-border-width-thin) solid var(--lumi-tooltip-border);
		border-top-color: transparent;
		border-left-color: transparent;
	}

	.lumi-tooltip--top .lumi-tooltip__arrow {
		top: calc(100% - var(--lumi-tooltip-tuck));
		left: var(--lumi-tooltip-arrow-x);
		transform: rotate(45deg);
	}

	.lumi-tooltip--bottom .lumi-tooltip__arrow {
		bottom: calc(100% - var(--lumi-tooltip-tuck));
		left: var(--lumi-tooltip-arrow-x);
		transform: rotate(225deg);
	}

	.lumi-tooltip--left .lumi-tooltip__arrow {
		left: calc(100% - var(--lumi-tooltip-tuck));
		top: var(--lumi-tooltip-arrow-y);
		transform: rotate(-45deg);
	}

	.lumi-tooltip--right .lumi-tooltip__arrow {
		right: calc(100% - var(--lumi-tooltip-tuck));
		top: var(--lumi-tooltip-arrow-y);
		transform: rotate(135deg);
	}
</style>
