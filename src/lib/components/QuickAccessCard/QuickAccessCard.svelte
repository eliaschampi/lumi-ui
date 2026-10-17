<script lang="ts">
	import { Card } from '../Card';
	import { IconBadge } from '../IconBadge';
	import { Title } from '../Title';
	import type { QuickAccessCardProps } from './types';

	const {
		title,
		description,
		icon,
		color = 'primary',
		href,
		hoverable = true,
		class: className = ''
	}: QuickAccessCardProps = $props();
</script>

<Card {href} {hoverable} class="lumi-quick-access-card {className}">
	<div class="lumi-quick-access-card__container">
		<IconBadge {icon} {color} size="lg" />
		<Title {title} size="md" {color} />
		<p class="lumi-quick-access-card__description">{description}</p>
	</div>
</Card>

<style>
	.lumi-quick-access-card__container {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: var(--lumi-space-sm);
	}

	.lumi-quick-access-card__description {
		font-size: var(--lumi-font-size-sm);
		color: var(--lumi-color-text-muted);
	}
</style>
