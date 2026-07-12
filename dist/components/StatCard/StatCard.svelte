<script lang="ts">
	import Title from '../Title/Title.svelte';
	import IconBadge from '../IconBadge/IconBadge.svelte';
	import { Card } from '../Card';
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

	const cardClasses = $derived.by(() => {
		return ['lumi-stat-card', className].filter(Boolean).join(' ');
	});
</script>

<Card
	{href}
	hoverable={hoverable ?? Boolean(href)}
	class={cardClasses}
	aria-label={href ? title : undefined}
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
		container-type: inline-size;
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-xs);
		min-height: 100%;
	}

	.lumi-stat-card__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--lumi-space-xs);
	}

	.lumi-stat-card__value {
		font-size: var(--lumi-font-size-3xl);
		font-weight: var(--lumi-font-weight-bold);
		line-height: var(--lumi-line-height-tight);
		margin-bottom: 0;
		color: var(--lumi-color-text);
		overflow-wrap: break-word;
	}

	.lumi-stat-card__subtitle {
		font-size: var(--lumi-font-size-sm);
		color: var(--lumi-color-text-muted);
	}
</style>
