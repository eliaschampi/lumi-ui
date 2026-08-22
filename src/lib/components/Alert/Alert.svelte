<script lang="ts">
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import CircleX from '@lucide/svelte/icons/circle-x';
	import Info from '@lucide/svelte/icons/info';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import X from '@lucide/svelte/icons/x';
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import { LUMI_CONFIG } from '../config';
	import type { IconComponent } from '../../utils/icons';
	import type { AlertColor, AlertProps } from './types';

	type Props = AlertProps & {
		children?: Snippet;
		onclose?: (event: MouseEvent) => void;
	};

	let {
		color,
		type,
		title,
		icon = true,
		closable = false,
		class: className,
		onclose,
		children,
		active = $bindable(true)
	}: Props = $props();
	const resolvedColor = $derived(color ?? type ?? 'info');

	// Icon mapping for alert colors
	const iconMap: Record<AlertColor, IconComponent> = {
		success: CircleCheck,
		warning: TriangleAlert,
		danger: CircleX,
		info: Info,
		primary: Info,
		secondary: Info
	};

	const AlertIcon = $derived(iconMap[resolvedColor]);
	const role = $derived(
		resolvedColor === 'danger' || resolvedColor === 'warning'
			? 'alert'
			: 'status'
	);
	const styleVars = $derived(
		`--alert-color: var(--lumi-color-${resolvedColor}); --alert-bg: var(--lumi-color-${resolvedColor}-bg);`
	);
	const transitionDuration = LUMI_CONFIG.transitions.base;

	const alertClasses = $derived.by(() => {
		const classes = ['lumi-alert', `lumi-alert--${resolvedColor}`];
		if (className) classes.push(className);
		return classes.join(' ');
	});

	function handleClose(event: MouseEvent) {
		active = false;
		if (onclose) {
			onclose(event);
		}
	}
</script>

{#if active}
	<div
		class={alertClasses}
		style={styleVars}
		{role}
		aria-live={role === 'alert' ? 'assertive' : 'polite'}
		aria-atomic="true"
		transition:fade={{ duration: transitionDuration }}
	>
		<!-- Alert content -->
		<div class="lumi-alert__content">
			<!-- Icon -->
			{#if icon}
				<div class="lumi-alert__icon">
					<AlertIcon size="var(--lumi-icon-md)" />
				</div>
			{/if}

			<!-- Content wrapper -->
			<div class="lumi-alert__body">
				<!-- Title -->
				{#if title}
					<div class="lumi-alert__title">{title}</div>
				{/if}

				<!-- Message -->
				<div class="lumi-alert__message">
					{#if children}
						{@render children()}
					{/if}
				</div>
			</div>
		</div>

		<!-- Close button -->
		{#if closable}
			<button
				class="lumi-alert__close"
				type="button"
				aria-label="Cerrar alerta"
				onclick={handleClose}
			>
				<X size="var(--lumi-icon-sm)" />
			</button>
		{/if}
	</div>
{/if}

<style>
	.lumi-alert {
		/* Base alert styles */
		--alert-color: var(--lumi-color-info);
		--alert-bg: var(--lumi-color-info-bg);
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--lumi-space-sm);
		padding: var(--lumi-space-md);
		border-radius: var(--lumi-surface-radius);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border-light);
		border-inline-start: var(--lumi-border-width-accent) solid
			var(--alert-color);
		background: var(--alert-bg);
		box-shadow: var(--lumi-shadow-sm);
	}

	/* Icon styling */
	.lumi-alert__icon {
		flex-shrink: 0;
		width: var(--lumi-space-lg);
		height: var(--lumi-space-lg);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--alert-color);
	}

	/* Content layout */
	.lumi-alert__content {
		display: flex;
		align-items: center;
		gap: var(--lumi-space-sm);
		flex: 1;
		min-width: 0;
	}

	/* Body content */
	.lumi-alert__body {
		flex: 1;
		min-width: 0;
	}

	/* Title styling */
	.lumi-alert__title {
		font-size: var(--lumi-font-size-base);
		font-weight: var(--lumi-font-weight-semibold);
		line-height: var(--lumi-line-height-tight);
		margin: 0 0 var(--lumi-space-xs) 0;
		color: var(--lumi-color-text);
	}

	/* Message styling */
	.lumi-alert__message {
		font-size: var(--lumi-font-size-sm);
		line-height: var(--lumi-line-height-relaxed);
		margin: 0;
		color: var(--lumi-color-text-muted);
	}

	/* Close button */
	.lumi-alert__close {
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
		flex-shrink: 0;
	}

	.lumi-alert__close:hover {
		background: var(--lumi-color-background-hover);
		border-color: var(--lumi-color-border-light);
		color: var(--lumi-color-text);
	}

	.lumi-alert__close:focus-visible {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
	}
</style>
