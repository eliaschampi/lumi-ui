<script lang="ts">
	import { Icon } from '../Icon';
	import type { IconBadgeProps } from './types';

	const {
		icon,
		color = 'primary',
		size = 'md',
		class: className = ''
	}: IconBadgeProps = $props();

	const classes = $derived(
		[
			'lumi-icon-badge',
			`lumi-icon-badge--${size}`,
			`lumi-icon-badge--${color}`,
			className
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div class={classes} style:--icon-badge-color="var(--lumi-color-{color})">
	<Icon {icon} {size} />
</div>

<style>
	/* Shared icon-tile recipe (same fill/border/radius/rim as InfoItem icon);
	   the standalone badge adds the quiet elevation, whose rim is the sheen. */
	.lumi-icon-badge {
		--icon-badge-color: var(--lumi-color-primary);
		--icon-badge-bg-strength: 12%;
		--icon-badge-border-strength: 20%;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--lumi-radius-tile);
		color: var(--icon-badge-color);
		background: color-mix(
			in srgb,
			var(--icon-badge-color) var(--icon-badge-bg-strength),
			transparent
		);
		border: var(--lumi-border-width-thin) solid
			color-mix(
				in srgb,
				var(--icon-badge-color) var(--icon-badge-border-strength),
				transparent
			);
		box-shadow: var(--lumi-shadow-sm);
	}

	/* Follows the interactive surface around it, never its own hover: the badge
	   is not a control. Transform only, so the motion stays on the compositor. */
	.lumi-icon-badge :global(.lumi-icon) {
		transform: translateY(
				calc(var(--lumi-surface-hover) * var(--lumi-interactive-lift) * 2)
			)
			rotate(calc(var(--lumi-surface-hover) * var(--lumi-motion-scale) * -8deg));
		transition:
			transform var(--lumi-duration-base) var(--lumi-easing-default),
			color var(--lumi-duration-fast) var(--lumi-easing-default);
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
	.lumi-icon-badge--warning {
		--icon-badge-bg-strength: 17%;
		--icon-badge-border-strength: 24%;
	}
</style>
