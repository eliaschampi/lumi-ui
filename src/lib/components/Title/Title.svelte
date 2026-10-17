<script lang="ts">
	import { Icon } from '../Icon';
	import type { TitleLevel, TitleProps } from './types';

	const {
		id,
		level = 3,
		size = 'md',
		color = 'text',
		icon,
		iconColor,
		title = '',
		subtitle = '',
		class: className
	}: TitleProps = $props();

	const headingTag = $derived(`h${level}` as `h${TitleLevel}`);
</script>

<div
	class={['lumi-title', `lumi-title--${size}`, className]}
	style:--title-color="var(--lumi-color-{color})"
	style:--title-icon-color="var(--lumi-color-{iconColor ?? color})"
>
	{#if icon}
		<span class="lumi-title__icon" aria-hidden="true">
			<Icon {icon} {size} />
		</span>
	{/if}

	<div class="lumi-title__content">
		<svelte:element this={headingTag} {id} class="lumi-title__text">
			{title}
		</svelte:element>

		{#if subtitle}
			<p class="lumi-title__subtitle">{subtitle}</p>
		{/if}
	</div>
</div>

<style>
	.lumi-title {
		display: flex;
		align-items: center;
		line-height: var(--lumi-line-height-normal);
		gap: var(--lumi-space-sm);
		color: var(--title-color);
	}

	.lumi-title__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: var(--title-icon-color);
		opacity: var(--lumi-opacity-hover);
	}

	.lumi-title__content {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.lumi-title__text {
		margin: 0;
		font-weight: var(--lumi-font-weight-bold);
		color: inherit;
		line-height: var(--lumi-line-height-tight);
	}

	.lumi-title__subtitle {
		margin: var(--lumi-space-2xs) 0 0 0;
		font-weight: var(--lumi-font-weight-normal);
		color: var(--lumi-color-text-muted);
		line-height: var(--lumi-line-height-normal);
		font-size: var(--lumi-font-size-sm);
	}

	/* Sizes */
	.lumi-title--sm .lumi-title__text {
		font-size: var(--lumi-font-size-base);
	}
	.lumi-title--sm .lumi-title__subtitle {
		font-size: var(--lumi-font-size-xs);
	}
	.lumi-title--md .lumi-title__text {
		font-size: var(--lumi-font-size-lg);
	}
	.lumi-title--lg .lumi-title__text {
		font-size: var(--lumi-font-size-xl);
	}
	.lumi-title--xl .lumi-title__text {
		font-size: var(--lumi-font-size-2xl);
	}

	/* Responsive */
	@media (max-width: 48rem) {
		.lumi-title--xl .lumi-title__text {
			font-size: var(--lumi-font-size-xl);
		}
		.lumi-title--lg .lumi-title__text {
			font-size: var(--lumi-font-size-lg);
		}
	}
</style>
