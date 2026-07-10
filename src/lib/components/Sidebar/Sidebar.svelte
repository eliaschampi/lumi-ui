<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SidebarProps } from './types';

	interface Props extends SidebarProps {
		children?: Snippet;
		header?: Snippet;
	}

	const {
		collapsed = false,
		mobileOpen = false,
		ariaLabel = 'Sidebar',
		class: className = '',
		children,
		header
	}: Props = $props();

	const sidebarClasses = $derived.by(() => {
		return [
			'lumi-sidebar',
			collapsed && 'lumi-sidebar--collapsed',
			mobileOpen && 'lumi-sidebar--mobile-open',
			className
		]
			.filter(Boolean)
			.join(' ');
	});
</script>

<aside class={sidebarClasses} role="navigation" aria-label={ariaLabel}>
	{#if header}
		<header class="lumi-sidebar__header">
			<div class="lumi-sidebar__header-content">
				{@render header()}
			</div>
		</header>
	{/if}

	<nav class="lumi-sidebar__body">
		<div class="lumi-sidebar__items">
			{#if children}
				{@render children()}
			{/if}
		</div>
	</nav>
</aside>

<style>
	.lumi-sidebar {
		--lumi-surface-bg: color-mix(
			in srgb,
			var(--lumi-color-surface-card) 92%,
			var(--lumi-color-background) 8%
		);
		--lumi-surface-radius-local: var(--lumi-layout-floating-radius);
		grid-area: sidebar;
		position: sticky;
		top: 0;
		align-self: start;
		display: flex;
		flex-direction: column;
		width: var(--lumi-sidebar-width);
		height: calc(100dvh - (var(--lumi-layout-shell-padding) * 2));
		margin: 0;
		transition:
			width var(--lumi-duration-base) var(--lumi-easing-default),
			transform var(--lumi-duration-base) var(--lumi-easing-default),
			box-shadow var(--lumi-duration-base) var(--lumi-easing-default);
		overflow: hidden;
		z-index: var(--lumi-z-sidebar);
	}

	.lumi-sidebar--collapsed {
		width: var(--lumi-sidebar-width-collapsed);
	}

	.lumi-sidebar__header {
		position: relative;
		padding: var(--lumi-space-md);
		flex-shrink: 0;
		min-height: calc(var(--lumi-space-5xl) + var(--lumi-space-3xl));
		display: flex;
		align-items: flex-end;
		background: var(--lumi-gradient-sidebar-header), var(--lumi-color-surface-card);
		background-size: cover;
		background-position: center;
		border-bottom: var(--lumi-border-width-thin) solid var(--lumi-color-border-glass);
	}

	.lumi-sidebar__header::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 0;
		background: var(--lumi-sidebar-header-veil);
	}

	.lumi-sidebar__header-content {
		position: relative;
		z-index: 1;
		width: 100%;
	}

	.lumi-sidebar--collapsed .lumi-sidebar__header {
		min-height: var(--lumi-sidebar-width-collapsed);
		padding: var(--lumi-space-sm);
		align-items: center;
	}

	.lumi-sidebar__body {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		padding: var(--lumi-space-md);
	}

	/* Custom scrollbar */
	.lumi-sidebar__body::-webkit-scrollbar {
		width: var(--lumi-space-2xs);
	}

	.lumi-sidebar__body::-webkit-scrollbar-track {
		background: transparent;
	}

	.lumi-sidebar__body::-webkit-scrollbar-thumb {
		background: transparent;
		border-radius: var(--lumi-radius-full);
	}

	.lumi-sidebar:hover .lumi-sidebar__body::-webkit-scrollbar-thumb {
		background: var(--lumi-color-border);
	}

	.lumi-sidebar__items {
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-xs);
	}

	:global(.lumi-sidebar-subitems) {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-2xs);
		margin: calc(var(--lumi-space-2xs) * -1) 0 var(--lumi-space-xs)
			var(--lumi-sidebar-subitem-indent);
		padding-left: var(--lumi-space-sm);
	}

	:global(.lumi-sidebar-subitems)::before {
		content: '';
		position: absolute;
		inset-block: var(--lumi-space-2xs);
		left: 0;
		width: var(--lumi-border-width-thin);
		border-radius: var(--lumi-radius-full);
		background: linear-gradient(
			145deg,
			color-mix(in srgb, var(--lumi-color-primary) 16%, transparent),
			color-mix(in srgb, var(--lumi-color-primary) 4%, transparent)
		);
	}

	/* Mobile responsive behavior */
	@media (max-width: 1024px) {
		.lumi-sidebar {
			position: fixed;
			top: var(--lumi-sidebar-mobile-offset);
			left: var(--lumi-sidebar-mobile-offset);
			margin: 0;
			height: var(--lumi-sidebar-mobile-height);
			transform: translateX(var(--lumi-sidebar-mobile-closed-shift));
			width: var(--lumi-sidebar-mobile-width);
			--lumi-surface-radius-local: var(--lumi-layout-floating-radius-tablet);
			--lumi-surface-shadow: var(--lumi-shadow-lg);
		}

		.lumi-sidebar.lumi-sidebar--mobile-open {
			transform: translateX(0);
		}

		.lumi-sidebar--collapsed {
			width: var(--lumi-sidebar-mobile-width); /* No collapsed state on mobile */
		}
	}

	@media (max-width: 768px) {
		.lumi-sidebar {
			top: var(--lumi-layout-shell-padding-mobile);
			left: var(--lumi-layout-shell-padding-mobile);
			height: calc(100dvh - (var(--lumi-layout-shell-padding-mobile) * 2));
			width: min(
				var(--lumi-sidebar-width-mobile),
				calc(100vw - (var(--lumi-layout-shell-padding-mobile) * 2))
			);
			transform: translateX(calc(-100% - var(--lumi-layout-shell-padding-mobile)));
			--lumi-surface-radius-local: var(--lumi-layout-floating-radius-mobile);
		}

		.lumi-sidebar.lumi-sidebar--mobile-open {
			transform: translateX(0);
		}

		.lumi-sidebar--collapsed {
			width: min(
				var(--lumi-sidebar-width-mobile),
				calc(100vw - (var(--lumi-layout-shell-padding-mobile) * 2))
			);
		}
	}
</style>
