<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = {
		pageSidebarTitle: en.pageSidebarTitle,
		pageSidebarClose: en.pageSidebarClose
	};
</script>

<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import { portal } from '../../actions/portal';
	import { registerModal } from '../../utils/modal';
	import { Card } from '../Card';
	import { CloseButton } from '../CloseButton';
	import { useLumiLocale } from '../../i18n';
	import type { PageSidebarProps } from './types';

	let {
		mobileOpen = $bindable(false),
		mobileTitle,
		mobileAriaLabel,
		hideMobileHeader = false,
		class: className,
		variant,
		sidebar,
		drawer,
		onclose
	}: PageSidebarProps = $props();

	const i18n = useLumiLocale(COPY);
	// Below the layout breakpoint the sidebar becomes a portaled modal drawer.
	const mobile = new MediaQuery('max-width: 64rem', false);
	const title = $derived(mobileTitle ?? i18n.t.pageSidebarTitle);
	const closeLabel = $derived(mobileAriaLabel ?? i18n.t.pageSidebarClose);
	const cardClass = $derived(
		className
			? `lumi-page-sidebar__card ${className}`
			: 'lumi-page-sidebar__card'
	);
	let modalElement: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (mobileOpen && mobile.current && modalElement)
			return registerModal(modalElement, closeMobileSidebar);
	});

	function closeMobileSidebar(): void {
		mobileOpen = false;
		onclose?.();
	}
</script>

<aside
	class="lumi-layout--sidebar-left lumi-page-sidebar__desktop"
	data-variant={variant || undefined}
>
	<Card spaced class={cardClass}>
		<div class="lumi-page-sidebar__content">{@render sidebar?.()}</div>
	</Card>
</aside>

{#if mobileOpen && mobile.current}
	<div
		use:portal={'body'}
		bind:this={modalElement}
		class="lumi-page-sidebar__modal"
		role="dialog"
		aria-modal="true"
		aria-label={title || closeLabel}
		tabindex="-1"
	>
		<button
			type="button"
			class="lumi-page-sidebar__backdrop"
			onclick={closeMobileSidebar}
			aria-label={closeLabel}
			tabindex="-1"
		></button>
		<aside
			class="lumi-page-sidebar__drawer"
			data-variant={variant || undefined}
		>
			<Card spaced class={cardClass}>
				{#if !hideMobileHeader}
					<div class="lumi-page-sidebar__drawer-header">
						<p class="lumi-page-sidebar__drawer-title">{title}</p>
						<CloseButton label={closeLabel} onclick={closeMobileSidebar} />
					</div>
				{/if}
				<div class="lumi-page-sidebar__content">
					{@render (drawer ?? sidebar)?.()}
				</div>
			</Card>
		</aside>
	</div>
{/if}

<style>
	.lumi-page-sidebar__drawer-title {
		font-weight: var(--lumi-font-weight-semibold);
	}
</style>
