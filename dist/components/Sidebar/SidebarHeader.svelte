<script lang="ts">
	import { Avatar } from '../Avatar';
	import type { SidebarHeaderProps } from './types';

	const {
		collapsed = false,
		coverSrc = '',
		coverAlt = '',
		userName,
		userMeta = '',
		avatarText = '',
		avatarSrc = '',
		class: className = ''
	}: SidebarHeaderProps = $props();

	const rootClasses = $derived(
		['lumi-sidebar-header', collapsed && 'lumi-sidebar-header--collapsed', className]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div class={rootClasses}>
	{#if collapsed}
		<div class="lumi-sidebar-header__avatar">
			<Avatar
				text={avatarText || userName}
				src={avatarSrc || undefined}
				alt={userName}
				size="md"
				color="primary"
			/>
		</div>
	{:else}
		<div class="lumi-sidebar-header__cover">
			{#if coverSrc}
				<img src={coverSrc} alt={coverAlt} />
			{/if}
		</div>

		<div class="lumi-sidebar-header__identity">
			<div class="lumi-sidebar-header__avatar">
				<Avatar
					text={avatarText || userName}
					src={avatarSrc || undefined}
					alt={userName}
					size="xl"
					color="primary"
				/>
			</div>
			<div class="lumi-sidebar-header__content">
				<p class="lumi-sidebar-header__name">{userName}</p>
				{#if userMeta}
					<p class="lumi-sidebar-header__meta">{userMeta}</p>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.lumi-sidebar-header {
		display: grid;
		justify-items: center;
		width: 100%;
		min-width: 0;
	}

	.lumi-sidebar-header--collapsed {
		place-items: center;
	}

	.lumi-sidebar-header__cover {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 7;
		min-height: calc(var(--lumi-space-5xl) + var(--lumi-space-xs));
		overflow: hidden;
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border-glass);
		border-radius: var(--lumi-radius-xl);
		background: var(--lumi-gradient-sidebar-header), var(--lumi-color-surface-card);
		box-shadow: var(--lumi-shadow-sm);
	}

	.lumi-sidebar-header__cover::after {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--lumi-sidebar-header-veil);
		pointer-events: none;
	}

	.lumi-sidebar-header__cover img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.lumi-sidebar-header__identity {
		position: relative;
		z-index: 1;
		display: grid;
		justify-items: center;
		gap: var(--lumi-space-xs);
		width: 100%;
		min-width: 0;
		margin-top: calc((var(--lumi-space-4xl) + var(--lumi-space-2xs)) * -0.55);
		padding: 0 var(--lumi-space-xs);
		text-align: center;
	}

	.lumi-sidebar-header__avatar {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		padding: var(--lumi-space-2xs);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border-glass);
		border-radius: var(--lumi-radius-full);
		background: var(--lumi-color-surface-card);
		box-shadow: var(--lumi-shadow-sm);
	}

	.lumi-sidebar-header__content {
		display: grid;
		gap: var(--lumi-space-2xs);
		width: 100%;
		min-width: 0;
	}

	.lumi-sidebar-header__name,
	.lumi-sidebar-header__meta {
		max-width: 100%;
		margin: 0;
		overflow: hidden;
		line-height: var(--lumi-line-height-tight);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.lumi-sidebar-header__name {
		color: var(--lumi-color-text);
		font-size: var(--lumi-font-size-sm);
		font-weight: var(--lumi-font-weight-semibold);
	}

	.lumi-sidebar-header__meta {
		color: var(--lumi-color-text-muted);
		font-size: var(--lumi-font-size-xs);
	}
</style>
