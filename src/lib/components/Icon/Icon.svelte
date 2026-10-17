<script module lang="ts">
	const SCALE = /^(xs|sm|md|lg|xl|2xl)$/;
	const ROLE = /^(primary|secondary|success|warning|danger|info)$/;

	function paint(color: string): string | undefined {
		if (color === 'inherit') return undefined;
		if (color === 'muted') return 'var(--lumi-color-text-muted)';
		return ROLE.test(color) ? `var(--lumi-color-${color})` : color;
	}
</script>

<script lang="ts">
	import { resolveIcon } from '../../utils/icons';
	import type { IconProps } from './types';

	const {
		icon,
		color = 'inherit',
		size = 'md',
		stroke = 2,
		class: className = '',
		'aria-label': ariaLabel
	}: IconProps = $props();

	const Resolved = $derived(resolveIcon(icon));
	// Default size and inherited color come from CSS; emit only overrides.
	const style = $derived.by(() => {
		const tint = paint(color);
		const length =
			size === 'md' ? '' : SCALE.test(size) ? `var(--lumi-icon-${size})` : size;
		const rules = [
			length && `--lumi-icon-size: ${length}`,
			tint && `--lumi-icon-color: ${tint}`
		].filter(Boolean);
		return rules.length ? rules.join('; ') : undefined;
	});
</script>

{#if Resolved}
	<!-- Lucide hides the icon unless an aria-* key is present, so spread conditionally. -->
	<Resolved
		class={className ? `lumi-icon ${className}` : 'lumi-icon'}
		{style}
		strokeWidth={stroke}
		{...ariaLabel ? { role: 'img', 'aria-label': ariaLabel } : {}}
	/>
{/if}
