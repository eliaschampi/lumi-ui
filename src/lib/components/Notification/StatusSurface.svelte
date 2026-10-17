<script module lang="ts">
	const NONE = () => ({ duration: 0 });
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TransitionConfig } from 'svelte/transition';
	import { CloseButton } from '../CloseButton';
	import type { LumiColor } from '../config';
	import { STATUS_GLYPHS } from './status';

	interface Props {
		color: LumiColor;
		title?: string;
		message?: string;
		icon?: boolean;
		/** Toast look: raised, rounder, icon tile */
		floating?: boolean;
		role?: 'alert' | 'status';
		closeLabel?: string;
		/** Auto-expire after ms (0 = never); pauses on hover and focus */
		duration?: number;
		class?: string;
		children?: Snippet;
		/** Enter/exit transition; none when the owner animates a wrapper */
		motion?: (node: Element, params: object) => TransitionConfig;
		params?: object;
		onclose?: () => void;
		onexpire?: () => void;
		onoutroend?: () => void;
	}

	const {
		color,
		title,
		message,
		icon = true,
		floating = false,
		role,
		closeLabel,
		duration = 0,
		class: className,
		children,
		motion = NONE,
		params = {},
		onclose,
		onexpire,
		onoutroend
	}: Props = $props();

	// Countdown that pauses while hovered or focused; restarts when `duration` changes.
	let hovered = $state(false);
	let focused = $state(false);
	let elapsed = 0;
	let counted = 0;
	$effect(() => {
		if (duration !== counted) {
			counted = duration;
			elapsed = 0;
		}
		if (duration <= 0 || hovered || focused) return;
		const start = Date.now();
		const timer = setTimeout(() => onexpire?.(), duration - elapsed);
		return () => {
			clearTimeout(timer);
			elapsed += Date.now() - start;
		};
	});
</script>

<!-- Internal: the one status shell shared by Alert, Notification and Toaster. -->
<div
	class={[
		'lumi-status',
		floating && 'lumi-status--floating',
		duration > 0 && 'lumi-status--timed',
		className
	]}
	style:--lumi-control-accent="var(--lumi-color-{color})"
	style:--lumi-status-duration={duration > 0 ? `${duration}ms` : undefined}
	{role}
	aria-atomic={role && 'true'}
	onpointerenter={() => (hovered = true)}
	onpointerleave={() => (hovered = false)}
	onfocusin={() => (focused = true)}
	onfocusout={() => (focused = false)}
	{onoutroend}
	transition:motion={params}
>
	{#if icon}
		<span class="lumi-status__icon" aria-hidden="true">
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				{#each STATUS_GLYPHS[color] as d (d)}<path {d} />{/each}
			</svg>
		</span>
	{/if}

	<div class="lumi-status__body">
		{#if title}<p class="lumi-status__title">{title}</p>{/if}
		{#if message}<p class="lumi-status__text">{message}</p>{/if}
		{#if children}<div class="lumi-status__text">{@render children()}</div>{/if}
	</div>

	{#if closeLabel}
		<CloseButton label={closeLabel} onclick={onclose} />
	{/if}
</div>

<style>
	.lumi-status {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--lumi-space-sm);
		padding: var(--lumi-space-md);
		overflow: hidden;
		background: color-mix(
			in oklch,
			var(--lumi-control-accent) var(--lumi-state-bg-strength),
			var(--lumi-color-surface)
		);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border-light);
		border-inline-start: var(--lumi-border-width-accent) solid
			var(--lumi-control-accent);
		border-radius: var(--lumi-surface-radius);
		box-shadow: var(--lumi-shadow-sm);
	}

	.lumi-status--floating {
		align-items: flex-start;
		gap: var(--lumi-space-md);
		inline-size: min(100%, calc(var(--lumi-space-6xl) * 5));
		border-radius: var(--lumi-layout-floating-radius);
		box-shadow: var(--lumi-shadow-lg);
	}

	.lumi-status__icon {
		display: grid;
		flex-shrink: 0;
		place-items: center;
		color: var(--lumi-control-accent);
	}

	.lumi-status__icon svg {
		inline-size: var(--lumi-icon-md);
		block-size: var(--lumi-icon-md);
	}

	.lumi-status--floating .lumi-status__icon {
		inline-size: var(--lumi-space-xxl);
		block-size: var(--lumi-space-xxl);
		border: var(--lumi-border-width-thin) solid
			color-mix(in srgb, var(--lumi-control-accent) 20%, transparent);
		border-radius: var(--lumi-radius-full);
		background: color-mix(
			in srgb,
			var(--lumi-control-accent) 12%,
			var(--lumi-color-surface-raised)
		);
	}

	.lumi-status__body {
		flex: 1;
		min-inline-size: 0;
	}

	.lumi-status--floating .lumi-status__body {
		padding-block-start: var(--lumi-space-2xs);
	}

	.lumi-status__title {
		margin-block-end: var(--lumi-space-2xs);
		color: var(--lumi-color-text);
		font-size: var(--lumi-font-size-base);
		font-weight: var(--lumi-font-weight-semibold);
		line-height: var(--lumi-line-height-tight);
	}

	.lumi-status__text {
		color: var(--lumi-color-text-muted);
		font-size: var(--lumi-font-size-sm);
		line-height: var(--lumi-line-height-relaxed);
		overflow-wrap: break-word;
	}

	/* Countdown bar mirrors the paused timer. */
	.lumi-status--timed::after {
		content: '';
		position: absolute;
		inset-inline: 0;
		inset-block-end: 0;
		block-size: var(--lumi-border-width-thick);
		background: color-mix(
			in srgb,
			var(--lumi-control-accent) 70%,
			var(--lumi-color-surface)
		);
		transform-origin: left;
		animation: lumi-status-countdown var(--lumi-status-duration) linear forwards;
	}

	.lumi-status--timed:is(:hover, :focus-within)::after {
		animation-play-state: paused;
	}

	:global([dir='rtl']) .lumi-status--timed::after {
		transform-origin: right;
	}

	@keyframes lumi-status-countdown {
		to {
			transform: scaleX(0);
		}
	}

	@media (max-width: 48rem) {
		.lumi-status--floating {
			inline-size: 100%;
			gap: var(--lumi-space-sm);
			padding: var(--lumi-space-sm);
			border-radius: var(--lumi-layout-floating-radius-mobile);
		}
	}
</style>
