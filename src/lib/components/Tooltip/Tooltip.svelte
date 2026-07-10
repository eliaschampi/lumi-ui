<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import { portal } from '../../actions/portal';
	import { createFloating } from '../../utils/floating.svelte';
	import { LUMI_CONFIG } from '../config';
	import type { TooltipPosition, TooltipProps } from './types';

	interface Props extends TooltipProps {
		children?: Snippet;
		content?: Snippet;
	}

	const {
		text = '',
		color = 'primary',
		position = 'top',
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

	const transitionDuration = LUMI_CONFIG.transitions.fast;

	// Position, collision handling and arrow alignment share the same
	// Floating UI controller used by the other portaled components.
	const floating = createFloating(
		() => triggerRef,
		() => tooltipRef,
		() => ({
			placement: position,
			offset: LUMI_CONFIG.floating.tooltip.offset,
			maxHeight: LUMI_CONFIG.floating.tooltip.maxHeight,
			viewportPadding: LUMI_CONFIG.floating.tooltip.viewportPadding,
			zIndex: 'var(--lumi-z-tooltip)',
			strategy: 'fixed' as const,
			arrow: arrowRef
				? {
						element: arrowRef,
						padding: LUMI_CONFIG.floating.tooltip.arrowPadding
					}
				: undefined
		})
	);

	const resolvedPosition = $derived(
		floating.resolvedPlacement.split('-')[0] as TooltipPosition
	);

	const tooltipClasses = $derived.by(() =>
		['lumi-tooltip__content', `lumi-tooltip--${resolvedPosition}`, className]
			.filter(Boolean)
			.join(' ')
	);

	const tooltipStyles = $derived(
		[
			floating.styleString,
			`--lumi-tooltip-arrow-x: ${floating.position.arrowX ?? 0}px`,
			`--lumi-tooltip-arrow-y: ${floating.position.arrowY ?? 0}px`,
			`--tooltip-accent: var(--lumi-color-${color})`,
			`--tooltip-accent-rgb: var(--lumi-color-${color}-rgb)`
		].join('; ')
	);

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
		const nextTarget = event.relatedTarget as Node | null;
		if (nextTarget && triggerRef?.contains(nextTarget)) return;
		hideTooltip();
	}

	function handleEscape(event: KeyboardEvent): void {
		if (event.key === 'Escape') hideTooltip();
	}

	$effect(() => {
		if (!isVisible) return;
		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	});

	// Component-level resource and timeout cleanup
	$effect(() => {
		return () => {
			clearShowTimeout();
			floating.close();
		};
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
		transition:fade={{ duration: transitionDuration }}
	>
		{#if content}
			{@render content()}
		{:else}
			{text}
		{/if}
		<span bind:this={arrowRef} class="lumi-tooltip__arrow" aria-hidden="true"
		></span>
	</div>
{/if}

<style>
	.lumi-tooltip {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.lumi-tooltip__content {
		position: fixed;
		z-index: var(--lumi-z-tooltip);
		padding: var(--lumi-space-xs) var(--lumi-space-sm);
		font-size: var(--lumi-font-size-xs);
		border-radius: var(--lumi-radius-lg);
		max-width: calc(var(--lumi-space-5xl) * 3);
		color: var(--lumi-color-text);
		white-space: normal;
		text-align: center;
		pointer-events: none;
		font-family: var(--lumi-font-family-sans);
		font-weight: var(--lumi-font-weight-medium);
		line-height: var(--lumi-line-height-snug);
		background:
			linear-gradient(
				145deg,
				rgba(var(--tooltip-accent-rgb, var(--lumi-color-primary-rgb)), 0.04) 0%,
				rgba(var(--tooltip-accent-rgb, var(--lumi-color-primary-rgb)), 0) 30%
			),
			var(--lumi-color-surface-glass-strong);
		border: var(--lumi-border-width-thin) solid
			color-mix(
				in srgb,
				var(--tooltip-accent, var(--lumi-color-border-glass)) 38%,
				var(--lumi-color-border-glass) 62%
			);
		box-shadow: var(--lumi-shadow-md);
		transform-origin: center;
	}

	.lumi-tooltip__arrow {
		position: absolute;
		width: var(--lumi-space-xs);
		height: var(--lumi-space-xs);
		background: var(--lumi-color-surface-glass-strong);
		border: var(--lumi-border-width-thin) solid
			color-mix(
				in srgb,
				var(--tooltip-accent, var(--lumi-color-border-glass)) 38%,
				var(--lumi-color-border-glass) 62%
			);
		transform: rotate(45deg);
	}

	.lumi-tooltip--top .lumi-tooltip__arrow {
		top: calc(100% - (var(--lumi-space-2xs) * 1.5));
		left: var(--lumi-tooltip-arrow-x);
		transform: translateX(-50%) rotate(45deg);
	}

	.lumi-tooltip--bottom .lumi-tooltip__arrow {
		bottom: calc(100% - (var(--lumi-space-2xs) * 1.5));
		left: var(--lumi-tooltip-arrow-x);
		transform: translateX(-50%) rotate(45deg);
	}

	.lumi-tooltip--left .lumi-tooltip__arrow {
		left: calc(100% - (var(--lumi-space-2xs) * 1.5));
		top: var(--lumi-tooltip-arrow-y);
		transform: translateY(-50%) rotate(45deg);
	}

	.lumi-tooltip--right .lumi-tooltip__arrow {
		right: calc(100% - (var(--lumi-space-2xs) * 1.5));
		top: var(--lumi-tooltip-arrow-y);
		transform: translateY(-50%) rotate(45deg);
	}

	@media (prefers-reduced-motion: reduce) {
		.lumi-tooltip__content {
			transition: none !important;
			animation: none !important;
		}
	}
</style>
