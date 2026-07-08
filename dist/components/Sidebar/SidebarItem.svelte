	<script lang="ts">
		import type { Snippet } from 'svelte';
		import type { SidebarItemProps } from './types';

	interface Props extends SidebarItemProps {
		children?: Snippet;
		icon?: Snippet;
	}

	const {
		active = false,
		collapsed = false,
		href = undefined,
		level = 'root',
		expanded = undefined,
		class: className = '',
		onclick,
		children,
		icon
	}: Props = $props();

	const itemClasses = $derived.by(() =>
		[
			'lumi-sidebar-item',
			`lumi-sidebar-item--${level}`,
			active && 'lumi-sidebar-item--active',
			collapsed && 'lumi-sidebar-item--collapsed',
			className
		]
			.filter(Boolean)
			.join(' ')
	);

	const ariaCurrent = $derived(active ? 'page' : undefined);
	const ariaExpanded = $derived(expanded === undefined ? undefined : expanded ? 'true' : 'false');
</script>

{#if href}
	<a {href} class={itemClasses} aria-current={ariaCurrent} {onclick}>
		{#if icon}
			<span class="lumi-sidebar-item__icon">
				{@render icon()}
			</span>
		{/if}
		{#if !collapsed}
			<span class="lumi-sidebar-item__text">
				{#if children}
					{@render children()}
				{/if}
			</span>
		{/if}
	</a>
{:else}
	<button
		type="button"
		class={itemClasses}
		aria-pressed={active}
		aria-expanded={ariaExpanded}
		{onclick}
	>
		{#if icon}
			<span class="lumi-sidebar-item__icon">
				{@render icon()}
			</span>
		{/if}
		{#if !collapsed}
			<span class="lumi-sidebar-item__text">
				{#if children}
					{@render children()}
				{/if}
			</span>
		{/if}
	</button>
{/if}

<style>
	.lumi-sidebar-item {
		font: inherit;
		font-size: var(--lumi-font-size-sm);
		font-weight: var(--lumi-font-weight-medium);
		letter-spacing: normal;
		--sidebar-item-hover-bg: color-mix(in srgb, var(--lumi-color-primary) 9%, transparent);
		--sidebar-item-active-bg: linear-gradient(
			145deg,
			rgba(var(--lumi-color-primary-rgb), 0.055),
			rgba(var(--lumi-color-primary-rgb), 0.018)
		);
		--sidebar-item-focus-ring: color-mix(in srgb, var(--lumi-color-primary) 20%, transparent);
		--sidebar-item-lift: calc(var(--lumi-space-2xs) * -0.25);
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--lumi-space-md);
		padding: var(--lumi-space-sm) var(--lumi-space-md);
		min-height: var(--lumi-sidebar-item-height);
		border-radius: var(--lumi-control-radius);
		color: var(--lumi-color-text-muted);
		text-decoration: none;
		background: transparent;
		border: var(--lumi-border-width-thin) solid transparent;
		cursor: pointer;
		text-align: left;
		transition:
			background-color var(--lumi-duration-fast) var(--lumi-easing-default),
			color var(--lumi-duration-fast) var(--lumi-easing-default),
			box-shadow var(--lumi-duration-fast) var(--lumi-easing-default),
			transform var(--lumi-duration-fast) var(--lumi-easing-default);
		width: 100%;
		outline: none;
	}

	.lumi-sidebar-item--sub {
		--sidebar-item-hover-bg: color-mix(in srgb, var(--lumi-color-primary) 8%, transparent);
		--sidebar-item-active-bg: color-mix(in srgb, var(--lumi-color-primary) 12%, transparent);
		gap: var(--lumi-space-sm);
		min-height: var(--lumi-sidebar-subitem-height);
		padding: var(--lumi-space-xs) var(--lumi-space-sm);
		border-radius: var(--lumi-radius-base);
	}

	.lumi-sidebar-item::before {
		content: '';
		position: absolute;
		left: var(--lumi-space-2xs);
		top: var(--lumi-space-xs);
		bottom: var(--lumi-space-xs);
		width: var(--lumi-border-width-thick);
		border-radius: var(--lumi-radius-full);
		background: var(--lumi-color-primary);
		opacity: 0;
		transform: scaleY(0.6);
		transition:
			opacity var(--lumi-duration-fast) var(--lumi-easing-default),
			transform var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	.lumi-sidebar-item:hover:not(.lumi-sidebar-item--active) {
		background: var(--sidebar-item-hover-bg);
		color: var(--lumi-color-text);
		border-color: color-mix(in srgb, var(--lumi-color-primary) 18%, transparent);
		transform: translateY(var(--sidebar-item-lift));
	}

	.lumi-sidebar-item:focus-visible {
		background: var(--sidebar-item-hover-bg);
		box-shadow: 0 0 0 var(--lumi-border-width-thick) var(--sidebar-item-focus-ring);
	}

	.lumi-sidebar-item:active:not(.lumi-sidebar-item--active) {
		transform: none;
	}

	.lumi-sidebar-item--active {
		background: var(--sidebar-item-active-bg);
		color: var(--lumi-color-primary);
		border-color: color-mix(in srgb, var(--lumi-color-primary) 24%, var(--lumi-color-border));
		box-shadow: var(--lumi-shadow-sm);
	}

	.lumi-sidebar-item--sub.lumi-sidebar-item--active {
		box-shadow: none;
	}

	.lumi-sidebar-item--active::before {
		opacity: 1;
		transform: scaleY(1);
	}

	.lumi-sidebar-item--active:hover {
		background: var(--sidebar-item-active-bg);
		color: var(--lumi-color-primary);
		transform: none;
	}

	.lumi-sidebar-item__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: var(--lumi-icon-md);
		height: var(--lumi-icon-md);
	}

	.lumi-sidebar-item--sub .lumi-sidebar-item__icon {
		width: var(--lumi-sidebar-subitem-icon-size);
		height: var(--lumi-sidebar-subitem-icon-size);
		opacity: var(--lumi-sidebar-subitem-icon-opacity);
	}

	.lumi-sidebar-item__text {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: var(--lumi-line-height-normal);
	}

	.lumi-sidebar-item :global(.lumi-sidebar-nav-label) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--lumi-space-xs);
		width: 100%;
		min-width: 0;
	}

	.lumi-sidebar-item :global(.lumi-sidebar-nav-label > span) {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.lumi-sidebar-item--collapsed {
		justify-content: center;
		padding-left: var(--lumi-space-sm);
		padding-right: var(--lumi-space-sm);
	}

	.lumi-sidebar-item--collapsed::before {
		display: none;
	}
</style>
