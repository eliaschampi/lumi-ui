<script lang="ts">
	import { Icon } from '../Icon';
	import type { IconBadgeProps } from './types';

	const { icon, color = 'primary', size = 'md', class: className = '' }: IconBadgeProps = $props();

	const classes = $derived(
		['lumi-icon-badge', `lumi-icon-badge--${size}`, `lumi-icon-badge--${color}`, className]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div class={classes}>
	<Icon {icon} {size} {color} />
</div>

<style>
	.lumi-icon-badge {
		--icon-badge-color: var(--lumi-color-primary);
		--icon-badge-bg-strength: 16%;
		--icon-badge-border-strength: 22%;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--lumi-radius-xl);
		background: color-mix(
			in srgb,
			var(--icon-badge-color) var(--icon-badge-bg-strength),
			transparent
		);
		border: var(--lumi-border-width-thin) solid
			color-mix(in srgb, var(--icon-badge-color) var(--icon-badge-border-strength), transparent);
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, var(--lumi-color-white) 24%, transparent),
			var(--lumi-shadow-sm);
		transition: var(--lumi-transition-all);
	}

	.lumi-icon-badge--sm {
		width: var(--lumi-space-xl);
		height: var(--lumi-space-xl);
	}

	.lumi-icon-badge--md {
		width: var(--lumi-space-2xl);
		height: var(--lumi-space-2xl);
	}

	.lumi-icon-badge--lg {
		width: var(--lumi-space-3xl);
		height: var(--lumi-space-3xl);
	}

	.lumi-icon-badge--xl {
		width: var(--lumi-space-4xl);
		height: var(--lumi-space-4xl);
	}

	.lumi-icon-badge--primary {
		--icon-badge-color: var(--lumi-color-primary);
	}

	.lumi-icon-badge--secondary {
		--icon-badge-color: var(--lumi-color-secondary);
	}

	.lumi-icon-badge--success {
		--icon-badge-color: var(--lumi-color-success);
	}

	.lumi-icon-badge--info {
		--icon-badge-color: var(--lumi-color-info);
	}

	.lumi-icon-badge--warning {
		--icon-badge-color: var(--lumi-color-warning);
		--icon-badge-bg-strength: 17%;
		--icon-badge-border-strength: 24%;
	}

	.lumi-icon-badge--danger {
		--icon-badge-color: var(--lumi-color-danger);
	}
</style>
