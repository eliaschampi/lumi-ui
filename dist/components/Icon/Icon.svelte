<script module lang="ts">
	const SIZE_TOKENS = {
		xs: 'var(--lumi-icon-xs)',
		sm: 'var(--lumi-icon-sm)',
		md: 'var(--lumi-icon-md)',
		lg: 'var(--lumi-icon-lg)',
		xl: 'var(--lumi-icon-xl)',
		'2xl': 'var(--lumi-icon-2xl)'
	} as const;

	const COLOR_TOKENS = {
		primary: 'var(--lumi-color-primary)',
		secondary: 'var(--lumi-color-secondary)',
		success: 'var(--lumi-color-success)',
		warning: 'var(--lumi-color-warning)',
		danger: 'var(--lumi-color-danger)',
		info: 'var(--lumi-color-info)',
		muted: 'var(--lumi-color-text-muted)'
	} as const;
</script>

<script lang="ts">
	import { getIcon } from '../../utils/icons';
	import type { IconProps } from './types';

	const {
		icon,
		color = 'inherit',
		size = 'md',
		stroke = 2,
		class: className = '',
		'aria-label': ariaLabel
	}: IconProps = $props();

	// String → registry lookup | Component → passthrough
	const ResolvedIcon = $derived.by(() => {
		if (!icon) return null;
		if (typeof icon === 'string') return getIcon(icon);
		return icon;
	});

	const classes = $derived.by(() => {
		return ['lumi-icon', className].filter(Boolean).join(' ');
	});

	const style = $derived.by(() => {
		const resolvedSize = SIZE_TOKENS[size as keyof typeof SIZE_TOKENS] ?? size;
		const entries = [`--lumi-icon-size: ${resolvedSize}`];

		if (color !== 'inherit') {
			const resolvedColor =
				COLOR_TOKENS[color as keyof typeof COLOR_TOKENS] ?? color;
			entries.push(`--lumi-icon-color: ${resolvedColor}`);
		}

		return entries.join('; ');
	});

	const accessibilityProps = $derived(
		ariaLabel ? { role: 'img', 'aria-label': ariaLabel } : {}
	);
</script>

{#if ResolvedIcon}
	<ResolvedIcon
		class={classes}
		{style}
		strokeWidth={stroke}
		{...accessibilityProps}
	/>
{/if}

<style>
	:global(.lumi-icon) {
		display: inline-block;
		width: var(--lumi-icon-size);
		height: var(--lumi-icon-size);
		flex-shrink: 0;
		vertical-align: middle;
		color: var(--lumi-icon-color, inherit);
		transition: color var(--lumi-duration-base) var(--lumi-easing-default);
		user-select: none;
	}
</style>
