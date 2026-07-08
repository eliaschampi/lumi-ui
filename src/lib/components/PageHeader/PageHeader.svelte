<script lang="ts">
	import type { Snippet } from 'svelte';
	import Title from '../Title/Title.svelte';
	import type { PageHeaderProps } from './types';

	interface Props extends PageHeaderProps {
		actions?: Snippet;
	}

	const {
		title = '',
		subtitle = '',
		icon = '',
		size = 'lg',
		color = 'text',
		class: className = '',
		actions
	}: Props = $props();

	const classes = $derived(
		['lumi-page-header', actions && 'lumi-page-header--with-actions', className]
			.filter(Boolean)
			.join(' ')
	);
</script>

<header class={classes}>
	<div class="lumi-page-header__title">
		<Title {title} {subtitle} {icon} {size} {color} />
	</div>

	{#if actions}
		<div class="lumi-page-header__actions" role="group" aria-label="Page actions">
			{@render actions()}
		</div>
	{/if}
</header>

<style>
	.lumi-page-header {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--lumi-space-md);
		padding: var(--lumi-space-lg);
		border-radius: var(--lumi-radius-2xl);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border);
		background: var(--lumi-gradient-subtle), var(--lumi-color-surface-card);
		box-shadow: var(--lumi-shadow-sm);
		overflow: hidden;
		isolation: isolate;
		transition: var(--lumi-transition-all);
	}

	.lumi-page-header::before {
		content: '';
		position: absolute;
		inset: 0;
		background:
			radial-gradient(
				circle at top left,
				rgba(var(--lumi-color-primary-rgb), 0.035),
				transparent 42%
			),
			linear-gradient(145deg, var(--lumi-color-surface-raised), var(--lumi-color-surface-card));
		z-index: -2;
	}

	.lumi-page-header__title {
		position: relative;
		z-index: var(--lumi-z-base);
		min-width: 0;
	}

	.lumi-page-header__actions {
		position: relative;
		z-index: var(--lumi-z-base);
		display: flex;
		align-items: center;
		gap: var(--lumi-space-sm);
		flex-shrink: 0;
		flex-wrap: wrap;
	}

	@media (max-width: 768px) {
		.lumi-page-header {
			padding: var(--lumi-space-md);
			border-radius: var(--lumi-radius-xl);
			grid-template-columns: 1fr;
		}

		.lumi-page-header__actions {
			width: 100%;
			justify-content: flex-end;
			gap: var(--lumi-space-xs);
		}
	}
</style>
