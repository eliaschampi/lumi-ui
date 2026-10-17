<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { unnamed: en.unnamed };
</script>

<script lang="ts">
	import { Avatar } from '../Avatar';
	import { useLumiLocale } from '../../i18n';
	import type { UserInfoProps } from './types';

	const {
		name = '',
		description = '',
		src = '',
		size = 'md',
		color = 'primary',
		href,
		trailing,
		class: className
	}: UserInfoProps = $props();

	const i18n = useLumiLocale(COPY);
</script>

<div
	class={[
		'lumi-user-info',
		size !== 'md' && `lumi-user-info--${size}`,
		className
	]}
>
	<!-- Decorative: the visible name is the accessible text. -->
	<Avatar {name} {src} {size} {color} alt="" />
	<span class="lumi-user-info__text">
		<svelte:element
			this={href ? 'a' : 'span'}
			{href}
			class="lumi-user-info__name"
		>
			{name.trim() || i18n.t.unnamed}
		</svelte:element>
		{#if description}
			<span class="lumi-user-info__description">{description}</span>
		{/if}
	</span>
	{#if trailing}
		<span class="lumi-user-info__trailing">{@render trailing()}</span>
	{/if}
</div>

<style>
	.lumi-user-info {
		--lumi-user-info-name: var(--lumi-font-size-sm);
		--lumi-user-info-description: var(--lumi-font-size-xs);
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--lumi-space-sm);
		min-inline-size: 0;
	}

	.lumi-user-info--sm {
		gap: var(--lumi-space-xs);
	}

	.lumi-user-info--lg {
		--lumi-user-info-name: var(--lumi-font-size-base);
	}

	.lumi-user-info--xl {
		--lumi-user-info-name: var(--lumi-font-size-lg);
		--lumi-user-info-description: var(--lumi-font-size-sm);
		gap: var(--lumi-space-md);
	}

	.lumi-user-info__text {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--lumi-space-2xs);
		min-inline-size: 0;
	}

	.lumi-user-info__name,
	.lumi-user-info__description {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.lumi-user-info__name {
		color: var(--lumi-color-text);
		font-size: var(--lumi-user-info-name);
		font-weight: var(--lumi-font-weight-semibold);
		line-height: var(--lumi-line-height-tight);
		text-decoration: none;
	}

	.lumi-user-info__description {
		color: var(--lumi-color-text-muted);
		font-size: var(--lumi-user-info-description);
		line-height: var(--lumi-line-height-normal);
	}

	/* Stretched link: the whole row is the target, trailing content sits above. */
	a.lumi-user-info__name::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: var(--lumi-radius-control);
	}

	a.lumi-user-info__name:hover {
		color: var(--lumi-color-primary);
	}

	a.lumi-user-info__name:focus-visible {
		outline: none;
	}

	a.lumi-user-info__name:focus-visible::after {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
	}

	.lumi-user-info__trailing {
		position: relative;
		display: inline-flex;
		flex-shrink: 0;
		align-items: center;
		gap: var(--lumi-space-xs);
	}
</style>
