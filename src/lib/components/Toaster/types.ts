import type { ToasterController } from './createToaster.svelte';

export type ToasterPlacement =
	'top-end' | 'top-center' | 'bottom-end' | 'bottom-center';

export interface ToasterProps {
	/** Queue from `createToaster()` */
	toaster: ToasterController;

	/** @default "top-end" */
	placement?: ToasterPlacement;

	class?: string;
}
