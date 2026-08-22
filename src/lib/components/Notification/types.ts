/**
 * Notification Component Types
 * Toast notification; placement is owned by the consumer stack
 * (`.lumi-toast-portal` in core.css).
 */

export type NotificationColor =
	'success' | 'warning' | 'danger' | 'info' | 'primary';
/** @deprecated Use `NotificationColor`; legacy `error` maps to `danger`. */
export type NotificationType =
	'success' | 'warning' | 'error' | 'info' | 'primary';

export interface NotificationProps {
	/**
	 * Semantic accent color
	 * @default "primary"
	 */
	color?: NotificationColor;

	/** @deprecated Use `color` instead. */
	type?: NotificationType;

	/**
	 * Notification title
	 */
	title?: string;

	/**
	 * Notification message
	 */
	message?: string;

	/**
	 * Whether notification can be closed
	 * @default true
	 */
	closable?: boolean;

	/**
	 * Auto-dismiss duration in milliseconds (0 = no auto-dismiss)
	 * @default 0
	 */
	duration?: number;

	/**
	 * Whether notification is active/visible (bindable)
	 */
	active?: boolean;

	/**
	 * Custom CSS class
	 */
	class?: string;

	/**
	 * Close event handler
	 */
	onclose?: () => void;
}
