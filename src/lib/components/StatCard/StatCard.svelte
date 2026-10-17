<script lang="ts">
	import { Card } from '../Card';
	import { IconBadge } from '../IconBadge';
	import { Title } from '../Title';
	import type { StatCardProps } from './types';

	const {
		title,
		value,
		icon,
		color = 'primary',
		href,
		hoverable,
		subtitle = '',
		class: className = ''
	}: StatCardProps = $props();
</script>

<Card
	{href}
	hoverable={hoverable ?? Boolean(href)}
	class="lumi-stat-card {className}"
>
	<div class="lumi-stat-card__container">
		<div class="lumi-stat-card__header">
			<Title {title} size="sm" {color} />
			<IconBadge {icon} {color} size="md" />
		</div>
		<div class="lumi-stat-card__value">{value}</div>
		{#if subtitle}
			<div class="lumi-stat-card__subtitle">{subtitle}</div>
		{/if}
	</div>
</Card>

<style>
	.lumi-stat-card__container {
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-xs);
		min-height: 100%;
	}

	.lumi-stat-card__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-block-end: var(--lumi-space-xs);
	}

	.lumi-stat-card__value {
		font-size: var(--lumi-font-size-3xl);
		font-weight: var(--lumi-font-weight-bold);
		font-variant-numeric: tabular-nums;
		line-height: var(--lumi-line-height-tight);
		color: var(--lumi-color-text);
		overflow-wrap: break-word;
	}

	.lumi-stat-card__subtitle {
		font-size: var(--lumi-font-size-sm);
		color: var(--lumi-color-text-muted);
	}
</style>
