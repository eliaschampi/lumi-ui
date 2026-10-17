<script module lang="ts">
	import type { StatusIndicatorStatus } from './types';

	const NEUTRAL = 'var(--lumi-color-text-light)';
	const COLORS: Record<StatusIndicatorStatus, string> = {
		default: NEUTRAL,
		inactive: NEUTRAL,
		active: 'var(--lumi-color-success)',
		pending: 'var(--lumi-color-warning)',
		primary: 'var(--lumi-color-primary)',
		secondary: 'var(--lumi-color-secondary)',
		success: 'var(--lumi-color-success)',
		warning: 'var(--lumi-color-warning)',
		danger: 'var(--lumi-color-danger)',
		info: 'var(--lumi-color-info)'
	};
</script>

<script lang="ts">
	import type { StatusIndicatorProps } from './types';

	const {
		status = 'default',
		active,
		pulse = false,
		tooltip = '',
		class: className
	}: StatusIndicatorProps = $props();
</script>

<span
	class={[
		'lumi-status-indicator',
		pulse && 'lumi-status-indicator--pulse',
		className
	]}
	style:--lumi-control-accent={COLORS[
		active === undefined ? status : active ? 'active' : 'inactive'
	]}
	role={tooltip ? 'img' : undefined}
	aria-label={tooltip || undefined}
	aria-hidden={tooltip ? undefined : 'true'}
	title={tooltip || undefined}
></span>

<style>
	.lumi-status-indicator {
		display: inline-block;
		flex-shrink: 0;
		inline-size: var(--lumi-space-xs);
		block-size: var(--lumi-space-xs);
		border-radius: var(--lumi-radius-full);
		background: var(--lumi-control-accent);
		box-shadow: 0 0 0 var(--lumi-border-width-thick)
			color-mix(in srgb, var(--lumi-control-accent) 18%, transparent);
		transition: background-color var(--lumi-duration-fast)
			var(--lumi-easing-default);
	}

	.lumi-status-indicator--pulse {
		animation: lumi-pulse var(--lumi-duration-pulse) var(--lumi-easing-in-out)
			infinite;
	}
</style>
