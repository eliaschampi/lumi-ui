<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { AlertProps } from './types';
	import { Icon } from '../Icon';
	import { LUMI_CONFIG } from '../config';

	type Props = AlertProps & {
		children?: Snippet;
		onclose?: (event: MouseEvent) => void;
	};

	let {
		type = 'info',
		title,
		icon = true,
		closable = false,
		class: className,
		onclose,
		children,
		active = $bindable(true)
	}: Props = $props();

	// Icon mapping for alert types
	const iconMap: Record<string, string> = {
		success: 'checkCircle',
		warning: 'alertTriangle',
		danger: 'xCircle',
		info: 'info',
		primary: 'info',
		secondary: 'info'
	};

	const alertIcon = $derived(iconMap[type] || 'info');
	const transitionDuration = LUMI_CONFIG.transitions.base;

	const alertClasses = $derived.by(() => {
		const classes = ['lumi-alert', `lumi-alert--${type}`];
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
	<div class={alertClasses} transition:fade={{ duration: transitionDuration }}>
		<!-- Alert content -->
		<div class="lumi-alert__content">
			<!-- Icon -->
			{#if icon}
				<div class="lumi-alert__icon">
					<Icon icon={alertIcon} size="md" />
				</div>
			{/if}

			<!-- Content wrapper -->
			<div class="lumi-alert__body">
				<!-- Title -->
				{#if title}
					<h4 class="lumi-alert__title">{title}</h4>
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
				aria-label="Close alert"
				onclick={handleClose}
			>
				<Icon icon="x" size="sm" />
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
		border-radius: var(--lumi-radius-2xl);
		border: var(--lumi-border-width-thin) solid
			color-mix(in srgb, var(--alert-color) 20%, transparent);
		border-left-width: var(--lumi-space-2xs);
		background:
			linear-gradient(145deg, var(--alert-bg), transparent), var(--lumi-color-surface-card);
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
		border: none;
		border-radius: var(--lumi-radius-full);
		color: var(--lumi-color-text-muted);
		cursor: pointer;
		transition: var(--lumi-transition-all);
		flex-shrink: 0;
		opacity: 0.7;
	}

	.lumi-alert__close:hover {
		opacity: 1;
		background: var(--lumi-color-background-hover);
		color: var(--lumi-color-text);
		transform: scale(1.1);
	}

	.lumi-alert__close:focus-visible {
		outline: var(--lumi-border-width-thick) solid var(--lumi-color-primary);
		outline-offset: var(--lumi-space-2xs);
	}

	/* Color variants */
	.lumi-alert--primary {
		--alert-color: var(--lumi-color-primary);
		--alert-bg: var(--lumi-color-primary-bg);
	}

	.lumi-alert--secondary {
		--alert-color: var(--lumi-color-secondary);
		--alert-bg: var(--lumi-color-secondary-bg);
	}

	.lumi-alert--success {
		--alert-color: var(--lumi-color-success);
		--alert-bg: var(--lumi-color-success-bg);
	}

	.lumi-alert--warning {
		--alert-color: var(--lumi-color-warning);
		--alert-bg: var(--lumi-color-warning-bg);
	}

	.lumi-alert--danger {
		--alert-color: var(--lumi-color-danger);
		--alert-bg: var(--lumi-color-danger-bg);
	}

	.lumi-alert--info {
		--alert-color: var(--lumi-color-info);
		--alert-bg: var(--lumi-color-info-bg);
	}
</style>
