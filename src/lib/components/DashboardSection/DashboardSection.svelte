<script lang="ts">
	import { Card } from '../Card';
	import { Title } from '../Title';
	import type { DashboardSectionProps } from './types';

	const {
		title,
		subtitle = '',
		icon,
		titleColor = 'text',
		spaced = true,
		children,
		actions,
		footer,
		class: className = ''
	}: DashboardSectionProps = $props();
</script>

<Card class="lumi-dashboard-section {className}" {spaced} {footer}>
	<div class="lumi-dashboard-section__header">
		<Title
			{title}
			{subtitle}
			{icon}
			size="md"
			color={titleColor}
			iconColor="primary"
		/>
		{#if actions}
			<div class="lumi-dashboard-section__actions">{@render actions()}</div>
		{/if}
	</div>

	{@render children?.()}
</Card>

<style>
	.lumi-dashboard-section__header,
	.lumi-dashboard-section__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--lumi-space-sm);
	}

	.lumi-dashboard-section__header {
		align-items: flex-start;
		justify-content: space-between;
	}

	.lumi-dashboard-section__actions {
		justify-content: flex-end;
	}
</style>
