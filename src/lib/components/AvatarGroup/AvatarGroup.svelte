<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { avatarGroup: en.avatarGroup };
</script>

<script lang="ts">
	import { Avatar } from '../Avatar';
	import { AVATAR_SIZES } from '../Avatar/size';
	import { useLumiLocale } from '../../i18n';
	import type { AvatarGroupProps } from './types';

	const {
		items = [],
		max = 4,
		total,
		size = 'sm',
		color = 'primary',
		class: className
	}: AvatarGroupProps = $props();

	const i18n = useLumiLocale(COPY);

	const visible = $derived(items.slice(0, Math.max(0, max)));
	const count = $derived(Math.max(total ?? 0, items.length));
	const names = $derived(
		items
			.map((item) => item.name)
			.filter(Boolean)
			.join(', ')
	);
</script>

<!-- One summary for assistive tech; the avatars inside are decorative. -->
<span
	class={['lumi-avatar-group', className]}
	style:--lumi-avatar-size={AVATAR_SIZES[size]}
	role="img"
	aria-label={names
		? `${i18n.t.avatarGroup(count)}: ${names}`
		: i18n.t.avatarGroup(count)}
	title={names || undefined}
>
	{#each visible as item}
		<Avatar name={item.name} src={item.src} {size} {color} alt="" />
	{/each}
	{#if count > visible.length}
		<span class="lumi-avatar-group__more">+{count - visible.length}</span>
	{/if}
</span>

<style>
	.lumi-avatar-group {
		--lumi-avatar-group-overlap: calc(var(--lumi-avatar-size) * -0.25);
		display: inline-flex;
		align-items: center;
	}

	/* Spread slightly on hover so faces read individually. */
	@media (hover: hover) {
		.lumi-avatar-group:hover {
			--lumi-avatar-group-overlap: calc(var(--lumi-avatar-size) * -0.1);
		}
	}

	.lumi-avatar-group > :global(*) {
		/* The ring matches the surface behind the stack; override per context. */
		box-shadow: 0 0 0 var(--lumi-border-width-thick)
			var(--lumi-avatar-group-ring, var(--lumi-color-surface));
		transition: margin-inline-start var(--lumi-duration-base)
			var(--lumi-easing-default);
	}

	.lumi-avatar-group > :global(:not(:first-child)) {
		margin-inline-start: var(--lumi-avatar-group-overlap);
	}

	.lumi-avatar-group__more {
		display: inline-grid;
		place-items: center;
		inline-size: var(--lumi-avatar-size);
		block-size: var(--lumi-avatar-size);
		border-radius: var(--lumi-radius-full);
		background: color-mix(
			in srgb,
			var(--lumi-color-surface-inset) 88%,
			var(--lumi-color-text) 12%
		);
		color: var(--lumi-color-text-muted);
		font-size: calc(var(--lumi-avatar-size) * 0.34);
		font-weight: var(--lumi-font-weight-semibold);
		line-height: var(--lumi-line-height-none);
		user-select: none;
	}
</style>
