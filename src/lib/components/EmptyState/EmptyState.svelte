<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { emptyTitle: en.emptyTitle };
</script>

<script lang="ts">
	import Inbox from '@lucide/svelte/icons/inbox';
	import { Icon } from '../Icon';
	import { useLumiLocale } from '../../i18n';
	import type { EmptyStateProps } from './types';

	const {
		title,
		description = '',
		image = '',
		icon = Inbox,
		iconColor = 'muted',
		class: className,
		visual,
		actions
	}: EmptyStateProps = $props();

	const i18n = useLumiLocale(COPY);
</script>

<div class={['lumi-empty-state', className]}>
	{#if visual}
		{@render visual()}
	{:else if image}
		<img
			src={image}
			alt=""
			class="lumi-empty-state__image"
			loading="lazy"
			decoding="async"
		/>
	{:else}
		<span class="lumi-empty-state__icon" aria-hidden="true">
			<Icon {icon} size="xl" color={iconColor} />
		</span>
	{/if}

	<div class="lumi-empty-state__content">
		<p class="lumi-empty-state__title">{title ?? i18n.t.emptyTitle}</p>
		{#if description}
			<p class="lumi-empty-state__description">{description}</p>
		{/if}
		{#if actions}
			<div class="lumi-empty-state__actions">{@render actions()}</div>
		{/if}
	</div>
</div>

<style>
	.lumi-empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--lumi-space-lg);
		padding: var(--lumi-space-2xl);
		text-align: center;
		line-height: var(--lumi-line-height-normal);
	}

	/* A quiet round well keeps the glyph calm on any surface. */
	.lumi-empty-state__icon {
		display: grid;
		place-items: center;
		inline-size: var(--lumi-space-4xl);
		block-size: var(--lumi-space-4xl);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border-light);
		border-radius: var(--lumi-radius-full);
		background: color-mix(in srgb, var(--lumi-color-text) 4%, transparent);
	}

	.lumi-empty-state__image {
		inline-size: calc(var(--lumi-space-4xl) * 2);
		max-inline-size: 100%;
		block-size: auto;
		object-fit: contain;
	}

	.lumi-empty-state__content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--lumi-space-sm);
		max-inline-size: var(--lumi-max-width-sm);
	}

	.lumi-empty-state__title {
		color: var(--lumi-color-text);
		font-size: var(--lumi-font-size-lg);
		font-weight: var(--lumi-font-weight-semibold);
		line-height: var(--lumi-line-height-tight);
	}

	.lumi-empty-state__description {
		color: var(--lumi-color-text-muted);
		font-size: var(--lumi-font-size-sm);
	}

	.lumi-empty-state__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: var(--lumi-space-sm);
		margin-block-start: var(--lumi-space-sm);
	}
</style>
