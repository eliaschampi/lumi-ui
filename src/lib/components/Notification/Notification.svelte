<script lang="ts">
	import Bell from '@lucide/svelte/icons/bell';
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import CircleX from '@lucide/svelte/icons/circle-x';
	import Info from '@lucide/svelte/icons/info';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import X from '@lucide/svelte/icons/x';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { LUMI_CONFIG } from '../config';
	import type { IconComponent } from '../../utils/icons';
	import type { NotificationProps, NotificationColor } from './types';

	let {
		color,
		type,
		title = '',
		message = '',
		closable = true,
		position = 'top-right',
		duration = 0,
		active = $bindable(true),
		class: className = '',
		onclose
	}: NotificationProps = $props();
	const resolvedColor = $derived(
		color ?? (type === 'error' ? 'danger' : type) ?? 'primary'
	);

	const iconMap: Record<NotificationColor, IconComponent> = {
		success: CircleCheck,
		warning: TriangleAlert,
		danger: CircleX,
		info: Info,
		primary: Bell
	};

	const transitionDuration = LUMI_CONFIG.transitions.base;

	const role = $derived(
		resolvedColor === 'danger' || resolvedColor === 'warning'
			? 'alert'
			: 'status'
	);

	const classes = $derived.by(() => {
		const classList = [
			'lumi-notification',
			`lumi-notification--${resolvedColor}`,
			`lumi-notification--position-${position}`,
			duration > 0 && 'lumi-notification--timed'
		];

		if (className) classList.push(className);
		return classList.filter(Boolean).join(' ');
	});

	const NotificationIcon = $derived(iconMap[resolvedColor]);
	const styleVars = $derived(
		`--notification-color: var(--lumi-color-${resolvedColor}); --notification-bg: var(--lumi-color-${resolvedColor}-bg); --notification-duration: ${duration}ms;`
	);

	$effect(() => {
		if (!active || duration <= 0) return;

		const timer = window.setTimeout(() => {
			handleClose();
		}, duration);

		return () => {
			window.clearTimeout(timer);
		};
	});

	function handleClose(): void {
		if (!active) return;
		active = false;
		onclose?.();
	}
</script>

{#if active}
	<div
		class={classes}
		style={styleVars}
		{role}
		aria-live={role === 'alert' ? 'assertive' : 'polite'}
		aria-atomic="true"
		data-position={position}
		transition:fly={{ y: 12, duration: transitionDuration, easing: cubicOut }}
	>
		<div class="lumi-notification__icon" aria-hidden="true">
			<NotificationIcon size="var(--lumi-icon-md)" />
		</div>

		<div class="lumi-notification__content">
			{#if title}
				<div class="lumi-notification__title">{title}</div>
			{/if}
			{#if message}
				<p class="lumi-notification__text">{message}</p>
			{/if}
		</div>

		{#if closable}
			<button
				type="button"
				class="lumi-notification__close"
				aria-label="Close notification"
				onclick={handleClose}
			>
				<X size="var(--lumi-icon-sm)" />
			</button>
		{/if}
	</div>
{/if}

<style>
	.lumi-notification {
		--lumi-notification-max-inline-size: calc(var(--lumi-space-6xl) * 5);
		--notification-color: var(--lumi-color-primary);
		--notification-bg: var(--lumi-color-primary-bg);

		display: flex;
		align-items: flex-start;
		gap: var(--lumi-space-md);
		inline-size: min(100%, var(--lumi-notification-max-inline-size));
		padding: var(--lumi-space-md);
		background: var(--notification-bg);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border-light);
		border-inline-start: var(--lumi-space-2xs) solid var(--notification-color);
		border-radius: var(--lumi-layout-floating-radius);
		box-shadow: var(--lumi-shadow-lg);
		pointer-events: auto;
		position: relative;
		overflow: hidden;
	}

	.lumi-notification--timed::after {
		content: '';
		position: absolute;
		inset-inline: 0;
		bottom: 0;
		height: var(--lumi-border-width-thick);
		background: color-mix(
			in srgb,
			var(--notification-color) 70%,
			var(--lumi-color-surface)
		);
		transform-origin: left;
		animation: lumi-notification-timeout var(--notification-duration) linear
			forwards;
	}

	.lumi-notification__icon {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--lumi-space-xxl);
		height: var(--lumi-space-xxl);
		border-radius: var(--lumi-radius-full);
		color: var(--notification-color);
		background-color: color-mix(
			in srgb,
			var(--notification-color) 10%,
			var(--lumi-color-surface-raised)
		);
		border: var(--lumi-border-width-thin) solid
			color-mix(in srgb, var(--notification-color) 16%, transparent);
		position: relative;
		z-index: var(--lumi-z-base);
	}

	.lumi-notification__content {
		flex: 1;
		min-width: 0;
		padding-top: var(--lumi-space-2xs);
		position: relative;
		z-index: var(--lumi-z-base);
	}

	.lumi-notification__title {
		margin: 0;
		font-weight: var(--lumi-font-weight-semibold);
		color: var(--lumi-color-text);
		line-height: var(--lumi-line-height-tight);
		margin-bottom: var(--lumi-space-2xs);
		font-size: var(--lumi-font-size-base);
	}

	.lumi-notification__text {
		margin: 0;
		color: var(--lumi-color-text-muted);
		line-height: var(--lumi-line-height-normal);
		font-size: var(--lumi-font-size-sm);
		word-break: break-word;
	}

	.lumi-notification__close {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--lumi-space-xl);
		height: var(--lumi-space-xl);
		padding: 0;
		background: transparent;
		border: var(--lumi-border-width-thin) solid transparent;
		border-radius: var(--lumi-radius-full);
		color: var(--lumi-color-text-muted);
		cursor: pointer;
		transition: var(--lumi-transition-control);
		margin-top: var(--lumi-space-2xs);
		position: relative;
		z-index: var(--lumi-z-base);
	}

	.lumi-notification__close:hover {
		background-color: color-mix(
			in srgb,
			var(--lumi-color-background-hover) 85%,
			transparent
		);
		color: var(--lumi-color-text);
		border-color: var(--lumi-color-border-light);
	}

	.lumi-notification__close:focus-visible {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-space-2xs);
	}

	@keyframes lumi-notification-timeout {
		from {
			transform: scaleX(1);
		}

		to {
			transform: scaleX(0);
		}
	}

	@media (max-width: 48rem) {
		.lumi-notification {
			inline-size: 100%;
			gap: var(--lumi-space-sm);
			padding: var(--lumi-space-sm);
			border-radius: var(--lumi-layout-floating-radius-mobile);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lumi-notification,
		.lumi-notification__close {
			transition: none;
		}

		.lumi-notification--timed::after {
			animation: none;
		}
	}
</style>
