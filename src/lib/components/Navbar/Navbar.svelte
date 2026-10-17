<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { sidebarToggle: en.sidebarToggle };
</script>

<script lang="ts">
	import Menu from '@lucide/svelte/icons/menu';
	import { Button } from '../Button';
	import { useLumiLocale } from '../../i18n';
	import type { NavbarProps } from './types';

	const {
		class: className,
		ontogglesidebar,
		title,
		actions,
		user
	}: NavbarProps = $props();

	const i18n = useLumiLocale(COPY);
</script>

<nav class={['lumi-navbar', className]}>
	<div class="lumi-navbar__left">
		<Button
			variant="ghost"
			icon={Menu}
			aria-label={i18n.t.sidebarToggle}
			onclick={ontogglesidebar}
		/>
		{#if title}
			<div class="lumi-navbar__title">{@render title()}</div>
		{/if}
	</div>

	<div class="lumi-navbar__right">
		{#if actions}
			{@render actions()}
		{:else if user}
			<div class="lumi-navbar__actions">{@render user()}</div>
		{/if}
	</div>
</nav>

<style>
	.lumi-navbar {
		--lumi-surface-bg:
			var(--lumi-gradient-subtle), var(--lumi-color-surface-glass-strong);
		--lumi-surface-radius-local: var(--lumi-layout-floating-radius);
		grid-area: navbar;
		position: sticky;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: var(--lumi-navbar-height);
		width: 100%;
		min-width: 0;
		padding: 0 var(--lumi-space-lg);
		z-index: var(--lumi-z-fixed);
		transition: var(--lumi-transition-colors);
	}

	.lumi-navbar__left {
		display: flex;
		align-items: center;
		gap: var(--lumi-space-md);
	}

	.lumi-navbar__title {
		color: var(--lumi-color-text);
		font-size: var(--lumi-font-size-lg);
		font-weight: var(--lumi-font-weight-bold);
		white-space: nowrap;
	}

	.lumi-navbar__right {
		display: flex;
		align-items: center;
		gap: var(--lumi-space-md);
	}

	.lumi-navbar__actions {
		display: flex;
		align-items: center;
		gap: var(--lumi-space-xs);
	}

	/* Responsive adjustments */
	@media (max-width: 64rem) {
		.lumi-navbar {
			--lumi-surface-radius-local: var(--lumi-layout-floating-radius-tablet);
		}
	}

	@media (max-width: 48rem) {
		.lumi-navbar {
			padding: 0 var(--lumi-space-md);
			--lumi-surface-radius-local: var(--lumi-layout-floating-radius-mobile);
		}

		.lumi-navbar__title {
			display: none;
		}
	}
</style>
