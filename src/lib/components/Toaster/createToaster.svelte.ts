import type { NotificationColor } from '../Notification/types';

export interface ToastOptions {
	title?: string;
	message?: string;
	/** @default "primary" */
	color?: NotificationColor;
	/** Auto-dismiss delay in ms; `0` keeps it until closed. Defaults to the toaster's. */
	duration?: number;
	/** @default true */
	closable?: boolean;
}

export interface Toast extends ToastOptions {
	readonly id: number;
}

export interface ToasterController {
	/** Visible toasts, oldest first */
	readonly items: readonly Toast[];
	/** Queue a toast and return its id */
	show(options: ToastOptions): number;
	dismiss(id: number): void;
	clear(): void;
}

export interface ToasterOptions {
	/** Default auto-dismiss delay in ms @default 5000 */
	duration?: number;
	/** Oldest toasts drop once the stack exceeds this @default 5 */
	max?: number;
}

/**
 * Create a toast queue. Explicit by design: create one per app (or per
 * request on the server) and pass it to `<Toaster>`; timers live in each
 * rendered notification, so the queue itself holds no resources.
 *
 * @example
 * export const toaster = createToaster();
 * toaster.show({ title: 'Saved', color: 'success' });
 */
export function createToaster({
	duration = 5000,
	max = 5
}: ToasterOptions = {}): ToasterController {
	let items = $state.raw<Toast[]>([]);
	let lastId = 0;

	return {
		get items() {
			return items;
		},
		show(options) {
			const toast: Toast = {
				...options,
				duration: options.duration ?? duration,
				id: ++lastId
			};
			items = [...items, toast].slice(-Math.max(1, max));
			return toast.id;
		},
		dismiss(id) {
			items = items.filter((toast) => toast.id !== id);
		},
		clear() {
			items = [];
		}
	};
}
