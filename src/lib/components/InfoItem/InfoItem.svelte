<script lang="ts">
	import { IconBadge } from '../IconBadge';
	import type { InfoItemProps } from './types';

	const {
		layout = 'horizontal',
		icon,
		iconColor = 'primary',
		label = '',
		value = '',
		class: className,
		children
	}: InfoItemProps = $props();
</script>

<div class={['lumi-info-item', `lumi-info-item--${layout}`, className]}>
	{#if icon}
		<IconBadge {icon} color={iconColor} class="lumi-info-item__icon" />
	{/if}

	<dl class="lumi-info-item__content">
		<dt class="lumi-info-item__label">{label}</dt>
		<dd class="lumi-info-item__value">
			{#if children}{@render children()}{:else}{value}{/if}
		</dd>
	</dl>
</div>

<style>
	.lumi-info-item {
		--info-shell-bg: var(--lumi-color-control-fill);
		--info-shell-border: var(--lumi-color-border);
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: center;
		gap: var(--lumi-space-sm);
		min-width: 0;
		padding: var(--lumi-space-sm) var(--lumi-space-md);
		border: var(--lumi-border-width-thin) solid var(--info-shell-border);
		border-radius: var(--lumi-radius-panel);
		background: var(--info-shell-bg);
	}

	.lumi-info-item--horizontal:has(> :global(.lumi-info-item__icon)) {
		grid-template-columns: auto minmax(0, 1fr);
	}

	.lumi-info-item--vertical {
		align-items: start;
	}

	.lumi-info-item--vertical > :global(.lumi-info-item__icon) {
		margin-block-end: var(--lumi-space-2xs);
	}

	.lumi-info-item__content {
		display: grid;
		gap: var(--lumi-space-2xs);
		min-width: 0;
	}

	.lumi-info-item__label {
		font-size: var(--lumi-font-size-xs);
		font-weight: var(--lumi-font-weight-semibold);
		color: var(--lumi-color-text-muted);
		line-height: var(--lumi-line-height-normal);
		letter-spacing: var(--lumi-letter-spacing-wide);
		text-transform: uppercase;
	}

	.lumi-info-item__value {
		font-size: var(--lumi-font-size-sm);
		font-weight: var(--lumi-font-weight-semibold);
		color: var(--lumi-color-text);
		line-height: var(--lumi-line-height-snug);
		min-width: 0;
		overflow-wrap: break-word;
	}

	.lumi-info-item__value :global(*) {
		min-width: 0;
		overflow-wrap: break-word;
	}
</style>
