<script lang="ts">
	import type { SidebarItemProps } from './types';

	const {
		current = false,
		collapsed = false,
		href,
		level = 'root',
		expanded,
		class: className,
		onclick,
		children,
		icon
	}: SidebarItemProps = $props();

	const classes = $derived([
		'lumi-sidebar-item',
		level === 'sub' && 'lumi-sidebar-item--sub',
		current && 'lumi-sidebar-item--active',
		collapsed && 'lumi-sidebar-item--collapsed',
		className
	]);
</script>

{#snippet content()}
	{#if icon}
		<span class="lumi-sidebar-item__icon">{@render icon()}</span>
	{/if}
	<!-- Collapsed rails keep the label for assistive tech. -->
	<span class={collapsed ? 'lumi-sr-only' : 'lumi-sidebar-item__text'}>
		{@render children?.()}
	</span>
{/snippet}

{#if href}
	<a
		{href}
		class={classes}
		aria-current={current ? 'page' : undefined}
		{onclick}
	>
		{@render content()}
	</a>
{:else}
	<button
		type="button"
		class={classes}
		aria-current={current || undefined}
		aria-expanded={expanded}
		{onclick}
	>
		{@render content()}
	</button>
{/if}

<style>
	.lumi-sidebar-item {
		font: inherit;
		font-size: var(--lumi-font-size-sm);
		font-weight: var(--lumi-font-weight-medium);
		letter-spacing: normal;
		--lumi-control-accent: var(--lumi-color-primary);
		--sidebar-item-hover-bg: color-mix(
			in srgb,
			var(--lumi-color-primary) 9%,
			transparent
		);
		--sidebar-item-active-bg: linear-gradient(
			145deg,
			color-mix(in srgb, var(--lumi-color-primary) 5.5%, transparent),
			color-mix(in srgb, var(--lumi-color-primary) 1.8%, transparent)
		);
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--lumi-space-md);
		padding: var(--lumi-space-sm) var(--lumi-space-md);
		min-height: var(--lumi-sidebar-item-height);
		border-radius: var(--lumi-radius-control);
		color: var(--lumi-color-text-muted);
		text-decoration: none;
		background: transparent;
		border: var(--lumi-border-width-thin) solid transparent;
		cursor: pointer;
		text-align: left;
		transition: var(--lumi-transition-control);
		width: 100%;
	}

	.lumi-sidebar-item--sub {
		--sidebar-item-hover-bg: color-mix(
			in srgb,
			var(--lumi-color-primary) 8%,
			transparent
		);
		--sidebar-item-active-bg: color-mix(
			in srgb,
			var(--lumi-color-primary) 12%,
			transparent
		);
		gap: var(--lumi-space-sm);
		min-height: var(--lumi-sidebar-subitem-height);
		padding: var(--lumi-space-xs) var(--lumi-space-sm);
		border-radius: var(--lumi-radius-control);
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
		border-color: color-mix(
			in srgb,
			var(--lumi-color-primary) 18%,
			transparent
		);
	}

	.lumi-sidebar-item:focus-visible {
		background: var(--sidebar-item-hover-bg);
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
	}

	.lumi-sidebar-item--active {
		background: var(--sidebar-item-active-bg);
		color: var(--lumi-color-primary);
		border-color: color-mix(
			in srgb,
			var(--lumi-color-primary) 24%,
			var(--lumi-color-border)
		);
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
