<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import { portal } from '../../actions/portal';
	import { createFloating } from '../../utils/floating.svelte';
	import { LUMI_CONFIG } from '../config';
	import type { TooltipPlacement, TooltipProps } from './types';

	interface Props extends TooltipProps {
		children?: Snippet;
		content?: Snippet;
	}

	const {
		text = '',
		color = 'primary',
		placement = 'top',
		delay = 0,
		class: className = '',
		children,
		content
	}: Props = $props();

	const instanceId = $props.id();
	const tooltipId = `lumi-tooltip-${instanceId}`;

	let isVisible = $state(false);
	let showTimeout: number | null = null;
	let triggerRef: HTMLDivElement | undefined = $state();
	let tooltipRef: HTMLDivElement | undefined = $state();
	let arrowRef: HTMLSpanElement | undefined = $state();

	const floating = createFloating(
		() => triggerRef,
		() => tooltipRef,
		() => ({
			placement,
			offset: LUMI_CONFIG.floating.tooltip.offset,
			maxHeight: LUMI_CONFIG.floating.tooltip.maxHeight,
			viewportPadding: LUMI_CONFIG.floating.tooltip.viewportPadding,
			zIndex: 'var(--lumi-z-tooltip)',
			strategy: 'fixed' as const,
			arrow: arrowRef
				? { element: arrowRef, padding: LUMI_CONFIG.floating.tooltip.arrowPadding }
				: undefined
		})
	);

	const side = $derived(floating.resolvedPlacement.split('-')[0] as TooltipPlacement);
	const tooltipClasses = $derived(
		['lumi-tooltip__content', `lumi-tooltip--${side}`, className].filter(Boolean).join(' ')
	);

	const tooltipStyles = $derived.by(() => {
		const { arrowX, arrowY } = floating.position;
		const x = arrowX != null ? `${arrowX}px` : 'calc(50% - var(--lumi-tooltip-arrow) / 2)';
		const y = arrowY != null ? `${arrowY}px` : 'calc(50% - var(--lumi-tooltip-arrow) / 2)';
		return [
			floating.styleString,
			`--lumi-tooltip-arrow-x: ${x}`,
			`--lumi-tooltip-arrow-y: ${y}`,
			`--tooltip-accent: var(--lumi-color-${color})`
		].join('; ');
	});

	function clearShowTimeout(): void {
		if (showTimeout !== null) {
			clearTimeout(showTimeout);
			showTimeout = null;
		}
	}

	function showTooltip(): void {
		clearShowTimeout();
		if (isVisible) {
			floating.updatePosition();
			return;
		}
		const reveal = (): void => {
			isVisible = true;
			floating.open();
		};
		if (delay > 0) {
			showTimeout = window.setTimeout(() => {
				showTimeout = null;
				reveal();
			}, delay);
		} else {
			reveal();
		}
	}

	function hideTooltip(): void {
		clearShowTimeout();
		isVisible = false;
		floating.close();
	}

	function handleFocusOut(event: FocusEvent): void {
		const next = event.relatedTarget as Node | null;
		if (next && triggerRef?.contains(next)) return;
		hideTooltip();
	}

	$effect(() => {
		if (!isVisible) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') hideTooltip();
		};
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	});

	$effect(() => () => {
		clearShowTimeout();
		floating.close();
	});
</script>

<div
	bind:this={triggerRef}
	class="lumi-tooltip"
	role="group"
	aria-describedby={isVisible ? tooltipId : undefined}
	onmouseenter={showTooltip}
	onmouseleave={hideTooltip}
	onfocusin={showTooltip}
	onfocusout={handleFocusOut}
>
	{#if children}
		{@render children()}
	{/if}
</div>

{#if isVisible}
	<div
		bind:this={tooltipRef}
		use:portal
		id={tooltipId}
		class={tooltipClasses}
		style={tooltipStyles}
		role="tooltip"
		transition:fade={{ duration: LUMI_CONFIG.transitions.fast }}
	>
		{#if content}
			{@render content()}
		{:else}
			{text}
		{/if}
		<span bind:this={arrowRef} class="lumi-tooltip__arrow" aria-hidden="true"></span>
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
			var(--tooltip-accent, var(--lumi-color-border-strong)) 32%,
			var(--lumi-color-border-strong)
		);
		--lumi-tooltip-arrow: var(--lumi-space-xs);
		--lumi-tooltip-tuck: calc(
			(var(--lumi-tooltip-arrow) / 2) + var(--lumi-border-width-thin)
		);
		position: fixed;
		z-index: var(--lumi-z-tooltip);
		padding: var(--lumi-space-xs) var(--lumi-space-sm);
		max-width: calc(var(--lumi-space-5xl) * 3);
		border: var(--lumi-border-width-thin) solid var(--lumi-tooltip-border);
		border-radius: var(--lumi-radius-lg);
		background: var(--lumi-tooltip-bg);
		color: var(--lumi-color-text);
		box-shadow: var(--lumi-shadow-md);
		font-family: var(--lumi-font-family-sans);
		font-size: var(--lumi-font-size-xs);
		font-weight: var(--lumi-font-weight-medium);
		line-height: var(--lumi-line-height-snug);
		text-align: center;
		pointer-events: none;
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
