<script lang="ts">
	import { onMount } from 'svelte';
	import { portal } from '../../actions/portal';
	import { registerModal } from '../../utils/modal';
	import { Button } from '../Button';
	import { Card } from '../Card';
	import type { PageSidebarProps } from './types';

	let {
		mobileOpen = $bindable(false),
		mobileTitle = 'Filtros',
		mobileAriaLabel = 'Cerrar panel lateral',
		hideMobileHeader = false,
		class: className = '',
		variant = '',
		sidebar,
		drawer,
		onclose
	}: PageSidebarProps = $props();

	const cardClasses = $derived(
		['lumi-page-sidebar__card', className].filter(Boolean).join(' ')
	);
	let isMobile = $state(false);
	let modalElement: HTMLDivElement | undefined = $state();
	onMount(() => {
		const query = window.matchMedia('(max-width: 64rem)');
		const update = () => (isMobile = query.matches);
		update();
		query.addEventListener('change', update);
		return () => query.removeEventListener('change', update);
	});
	$effect(() => {
		if (mobileOpen && isMobile && modalElement)
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
	<Card spaced class={cardClasses}>
		<div class="lumi-page-sidebar__content">
			{#if sidebar}
				{@render sidebar()}
			{/if}
		</div>
	</Card>
</aside>

{#if mobileOpen && isMobile}
	<div
		use:portal
		bind:this={modalElement}
		class="lumi-page-sidebar__modal"
		role="dialog"
		aria-label={mobileTitle || mobileAriaLabel}
		tabindex="-1"
	>
		<button
			type="button"
			class="lumi-page-sidebar__backdrop"
			onclick={closeMobileSidebar}
			aria-label={mobileAriaLabel}
			tabindex="-1"
		></button>
		<aside
			class="lumi-page-sidebar__drawer"
			data-variant={variant || undefined}
		>
			<Card spaced class={cardClasses}>
				{#if !hideMobileHeader}
					<div class="lumi-page-sidebar__drawer-header">
						<p class="lumi-margin--none lumi-font--semibold">{mobileTitle}</p>
						<Button
							variant="flat"
							size="sm"
							icon="x"
							aria-label={mobileAriaLabel}
							onclick={closeMobileSidebar}
						/>
					</div>
				{/if}
				<div class="lumi-page-sidebar__content">
					{#if drawer}
						{@render drawer()}
					{:else if sidebar}
						{@render sidebar()}
					{/if}
				</div>
			</Card>
		</aside>
	</div>
{/if}
