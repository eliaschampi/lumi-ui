<script lang="ts">
	import Title from '../Title/Title.svelte';
	import { Card } from '../Card';
	import type { DashboardSectionProps } from './types';

	const {
		title,
		subtitle = '',
		icon = '',
		titleColor = 'text',
		spaced = true,
		children,
		actions,
		footer: footerContent,
		class: className = ''
	}: DashboardSectionProps = $props();

	const classes = $derived(
		['lumi-dashboard-section', className].filter(Boolean).join(' ')
	);
</script>

<Card class={classes} {spaced} footer={footerContent}>
	<div
		class="lumi-flex lumi-flex--gap-sm lumi-flex--wrap lumi-justify--between lumi-align-items--start"
	>
		<Title
			{title}
			{subtitle}
			{icon}
			size="md"
			color={titleColor}
			iconColor="primary"
		/>

		{#if actions}
			<div
				class="lumi-flex lumi-flex--gap-sm lumi-flex--wrap lumi-justify--end"
			>
				{@render actions()}
			</div>
		{/if}
	</div>

	{#if children}
		{@render children()}
	{/if}
</Card>
