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
	let isPositioned = $state(false);
	// svelte-ignore state_referenced_locally
	// `resolvedPosition` is kept in sync with `position` by `showTooltip` and
	// the position $effect; the initializer only sets the first paint default.
	let resolvedPosition = $state<TooltipPosition>(position);
	let arrowOffset = $state(0);
	let showTimeout: number | null = null;

	let triggerRef: HTMLDivElement | undefined = $state();
	let tooltipRef: HTMLDivElement | undefined = $state();

	const tooltipGap = 10;
	const arrowEdgePadding = 12;
	const viewportPadding = 8;
	const transitionDuration = LUMI_CONFIG.transitions.fast;

	// single source of truth: flip / shift / autoUpdate are delegated to
	// @floating-ui via createFloating. Only the arrow cross-axis offset is
	// computed here, because it depends on the presentation layer (rotated
	// square pseudo-element) rather than the floating geometry.
	const floating = createFloating(
		() => triggerRef,
		() => tooltipRef,
		() => ({
			placement: position,
			offset: tooltipGap,
			viewportPadding,
			zIndex: 'var(--lumi-z-tooltip)',
			strategy: 'fixed' as const
		})
	);

	const tooltipClasses = $derived.by(() =>
		[
			'lumi-tooltip__content',
			`lumi-tooltip--${resolvedPosition}`,
			isPositioned && 'lumi-tooltip--visible',
			className
		]
			.filter(Boolean)
			.join(' ')
	);

	const tooltipStyles = $derived(
		[
			floating.styleString,
			`--lumi-tooltip-arrow-offset: ${arrowOffset}px`,
			`--tooltip-accent: var(--lumi-color-${color})`,
			`--tooltip-accent-rgb: var(--lumi-color-${color}-rgb)`
		].join('; ')
	);

	function clamp(value: number, min: number, max: number): number {
		return Math.min(Math.max(value, min), max);
	}

	function clearShowTimeout(): void {
		if (showTimeout !== null) {
			clearTimeout(showTimeout);
			showTimeout = null;
		}
	}

	function showTooltip(): void {
		clearShowTimeout();
		resolvedPosition = position;

		const reveal = (): void => {
			isVisible = true;
			isPositioned = false;
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
		isPositioned = false;
		floating.close();
	}

	function handleFocusOut(event: FocusEvent): void {
		const nextTarget = event.relatedTarget as Node | null;
		if (nextTarget && triggerRef?.contains(nextTarget)) return;
		hideTooltip();
	}

	// Arrow + resolved placement: recomputed whenever floating-ui repositions the
	// tooltip. We read the live rects (post-shift/clamp) rather than threading
	// middleware data through the public floating API, so the arrow stays
	// anchored to the trigger center even after viewport clamping, and `flip`
	// is reflected by inferring the resolved axis from the geometry.
	$effect(() => {
		if (!isVisible || !tooltipRef || !triggerRef || !floating.hasPosition) return;
		// Touch `floating.position` so this effect re-runs on every reposition.
		const { top, left } = floating.position;

		const triggerRect = triggerRef.getBoundingClientRect();
		const tooltipRect = tooltipRef.getBoundingClientRect();
		if (tooltipRect.width === 0 || tooltipRect.height === 0) return;

		const resolved: TooltipPosition =
			position === 'left' || position === 'right'
				? tooltipRect.right <= triggerRect.left
					? 'left'
					: 'right'
				: tooltipRect.bottom <= triggerRect.top
					? 'top'
					: 'bottom';

		const triggerCenterX = triggerRect.left + triggerRect.width / 2;
		const triggerCenterY = triggerRect.top + triggerRect.height / 2;

		const axisSize =
			resolved === 'top' || resolved === 'bottom' ? tooltipRect.width : tooltipRect.height;
		const desiredArrow =
			resolved === 'top' || resolved === 'bottom'
				? triggerCenterX - tooltipRect.left
				: triggerCenterY - tooltipRect.top;
		const minArrowOffset = Math.min(arrowEdgePadding, axisSize / 2);
		const maxArrowOffset = Math.max(minArrowOffset, axisSize - minArrowOffset);

		resolvedPosition = resolved;
		arrowOffset = clamp(desiredArrow, minArrowOffset, maxArrowOffset);
		isPositioned = true;
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
		opacity: 0;
		visibility: hidden;
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
		transition:
			opacity var(--lumi-duration-fast) ease,
			visibility var(--lumi-duration-fast) ease;
	}

	.lumi-tooltip__content::after {
		content: '';
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

	.lumi-tooltip--visible {
		opacity: 1;
		visibility: visible;
	}

	.lumi-tooltip--top::after {
		top: calc(100% - (var(--lumi-space-2xs) * 1.5));
		left: var(--lumi-tooltip-arrow-offset);
		transform: translateX(-50%) rotate(45deg);
	}

	.lumi-tooltip--bottom::after {
		bottom: calc(100% - (var(--lumi-space-2xs) * 1.5));
		left: var(--lumi-tooltip-arrow-offset);
		transform: translateX(-50%) rotate(45deg);
	}

	.lumi-tooltip--left::after {
		left: calc(100% - (var(--lumi-space-2xs) * 1.5));
		top: var(--lumi-tooltip-arrow-offset);
		transform: translateY(-50%) rotate(45deg);
	}

	.lumi-tooltip--right::after {
		right: calc(100% - (var(--lumi-space-2xs) * 1.5));
		top: var(--lumi-tooltip-arrow-offset);
		transform: translateY(-50%) rotate(45deg);
	}

	@media (prefers-reduced-motion: reduce) {
		.lumi-tooltip__content {
			transition: none !important;
			animation: none !important;
		}
	}
</style>