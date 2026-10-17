<script lang="ts">
	import type { DividerProps } from './types';

	const {
		orientation = 'horizontal',
		align = 'center',
		label,
		variant = 'solid',
		spacing = 'md',
		class: className
	}: DividerProps = $props();

	const classes = $derived([
		'lumi-divider',
		orientation === 'vertical' && 'lumi-divider--vertical',
		variant === 'dashed' && 'lumi-divider--dashed',
		className
	]);
	// The default spacing lives in CSS; only a change is written inline.
	const space = $derived(
		spacing === 'md'
			? undefined
			: spacing === 'none'
				? '0'
				: `var(--lumi-space-${spacing})`
	);
	const vertical = $derived(
		orientation === 'vertical' ? 'vertical' : undefined
	);
</script>

{#if label}
	<div
		class={[classes, `lumi-divider--labeled lumi-divider--${align}`]}
		style:--lumi-divider-space={space}
		role="separator"
		aria-orientation={vertical}
		aria-label={label}
	>
		<span class="lumi-divider__label">{label}</span>
	</div>
{:else}
	<hr
		class={classes}
		style:--lumi-divider-space={space}
		aria-orientation={vertical}
	/>
{/if}

<style>
	.lumi-divider {
		--lumi-divider-line: var(--lumi-border-width-thin)
			var(--lumi-divider-style, solid) var(--lumi-color-border);
		flex-shrink: 0;
		margin-block: var(--lumi-divider-space, var(--lumi-space-md));
		border: 0;
		border-block-start: var(--lumi-divider-line);
		color: var(--lumi-color-text-muted);
	}

	.lumi-divider--dashed {
		--lumi-divider-style: dashed;
	}

	.lumi-divider--vertical {
		align-self: stretch;
		margin-block: 0;
		margin-inline: var(--lumi-divider-space, var(--lumi-space-md));
		border-block-start: 0;
		border-inline-start: var(--lumi-divider-line);
	}

	/* Labeled: the line is drawn by the pseudo-elements around the label. */
	.lumi-divider--labeled {
		display: flex;
		align-items: center;
		gap: var(--lumi-space-sm);
		border: 0;
	}

	.lumi-divider--labeled::before,
	.lumi-divider--labeled::after {
		content: '';
		flex: 1;
		border-block-start: var(--lumi-divider-line);
	}

	.lumi-divider--start::before,
	.lumi-divider--end::after {
		display: none;
	}

	.lumi-divider__label {
		font-size: var(--lumi-font-size-xs);
		font-weight: var(--lumi-font-weight-medium);
		white-space: nowrap;
	}
</style>
