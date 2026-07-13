<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';
	import {
		Avatar,
		Chip,
		Dropdown,
		DropdownItem,
		Icon,
		Navbar,
		Sidebar,
		SidebarHeader,
		SidebarItem
	} from '@lumi-ui/svelte';
	import { colorScheme } from '$lib/color-scheme.svelte';
	import { DEMO_NAVIGATION } from '$lib/navigation';

	interface Props {
		children: Snippet;
	}

	const MOBILE_MEDIA_QUERY = '(max-width: 64rem)';
	const THEME_LABELS = {
		system: { label: 'Sistema', icon: 'monitor' },
		light: { label: 'Claro', icon: 'sun' },
		dark: { label: 'Oscuro', icon: 'moon' }
	} as const;

	const { children }: Props = $props();

	let isMobile = $state(false);
	let sidebarCollapsed = $state(false);
	let sidebarMobileOpen = $state(false);

	const pathname = $derived(page.url.pathname);
	const resolvedSidebarCollapsed = $derived(sidebarCollapsed && !isMobile);
	const resolvedSidebarMobileOpen = $derived(sidebarMobileOpen && isMobile);
	const activeNavigation = $derived(
		DEMO_NAVIGATION.find((item) =>
			item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
		) ?? DEMO_NAVIGATION[0]
	);
	const activeTheme = $derived(THEME_LABELS[colorScheme.preference]);

	onMount(() => {
		const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
		const syncViewport = (): void => {
			isMobile = mediaQuery.matches;
			if (!isMobile) sidebarMobileOpen = false;
		};

		syncViewport();
		mediaQuery.addEventListener('change', syncViewport);

		return () => mediaQuery.removeEventListener('change', syncViewport);
	});

	function toggleSidebar(): void {
		if (isMobile) {
			sidebarMobileOpen = !sidebarMobileOpen;
			return;
		}

		sidebarCollapsed = !sidebarCollapsed;
	}

	function closeMobileSidebar(): void {
		sidebarMobileOpen = false;
	}
</script>

<svelte:head>
	<title>{activeNavigation.label} · Lumi UI Demo</title>
</svelte:head>

<div
	class="lumi-dashboard-layout"
	class:lumi-sidebar--is-collapsed={resolvedSidebarCollapsed}
	class:lumi-sidebar--mobile-open={resolvedSidebarMobileOpen}
>
	{#if resolvedSidebarMobileOpen}
		<button
			type="button"
			class="lumi-mobile-overlay lumi-border--none"
			aria-label="Cerrar navegación"
			onclick={closeMobileSidebar}
		></button>
	{/if}

	<Sidebar
		collapsed={resolvedSidebarCollapsed}
		mobileOpen={resolvedSidebarMobileOpen}
		ariaLabel="Navegación de la demostración"
	>
		{#snippet header()}
			<SidebarHeader
				collapsed={resolvedSidebarCollapsed}
				userName="Lumi Workspace"
				userMeta="Svelte 5 showcase"
				avatarText="LW"
			/>
		{/snippet}

		{#each DEMO_NAVIGATION as item (item.href)}
			<SidebarItem
				href={item.href}
				active={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)}
				collapsed={resolvedSidebarCollapsed}
				onclick={closeMobileSidebar}
			>
				{#snippet icon()}<Icon icon={item.icon} />{/snippet}
				{item.label}
			</SidebarItem>
		{/each}
	</Sidebar>

	<Navbar ontoggle-sidebar={toggleSidebar}>
		{#snippet title()}{activeNavigation.label}{/snippet}

		{#snippet actions()}
			<Chip icon="sparkles" color="secondary" size="sm" class="lumi-hidden-mobile">
				Lumi UI Demo
			</Chip>

			<Dropdown placement="bottom-end" aria-label="Menú de demostración">
				{#snippet triggerContent()}
					<Avatar text="Lumi Demo" size="sm" color="primary" />
				{/snippet}

				<DropdownItem icon={activeTheme.icon} onclick={colorScheme.cyclePreference}>
					Tema: {activeTheme.label}
				</DropdownItem>
				<DropdownItem icon="settings" href="/settings">Ajustes</DropdownItem>
				<DropdownItem icon="bookOpen" href="/components">Ver componentes</DropdownItem>
			</Dropdown>
		{/snippet}
	</Navbar>

	<main class="lumi-dashboard-layout__content">
		<div class="lumi-container lumi-container--ultrawide lumi-min-width--0">
			{@render children()}
		</div>
	</main>
</div>
