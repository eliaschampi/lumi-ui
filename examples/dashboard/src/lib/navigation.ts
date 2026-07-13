import type { IconName } from '@lumi-ui/svelte';

export interface DemoNavigationItem {
	label: string;
	href: string;
	icon: IconName;
	description: string;
}

export const DEMO_NAVIGATION: readonly DemoNavigationItem[] = [
	{
		label: 'Dashboard',
		href: '/',
		icon: 'house',
		description: 'Resumen general y accesos rápidos'
	},
	{
		label: 'Componentes',
		href: '/components',
		icon: 'boxes',
		description: 'Acciones, estados y superficies'
	},
	{
		label: 'Formularios',
		href: '/forms',
		icon: 'clipboardPenLine',
		description: 'Controles y composición de formularios'
	},
	{
		label: 'Datos',
		href: '/data',
		icon: 'chartBar',
		description: 'Tablas, métricas y visualización'
	},
	{
		label: 'Ajustes',
		href: '/settings',
		icon: 'settings',
		description: 'Tema y preferencias de interfaz'
	}
];
