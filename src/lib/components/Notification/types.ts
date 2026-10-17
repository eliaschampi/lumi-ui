import type { LumiColor } from '../config';

export type NotificationColor = Exclude<LumiColor, 'secondary'>;

export interface NotificationProps {
	/** @default "primary" */
	color?: NotificationColor;

	title?: string;

	message?: string;

	/** @default true */
	closable?: boolean;

	/**
	 * Auto-dismiss after this many milliseconds; pauses while hovered or
	 * focused. `0` keeps it until closed.
	 * @default 0
	 */
	duration?: number;

	/** Visible state (bindable) */
	active?: boolean;

	class?: string;

	/** Fires once the notification has left (after its exit transition) */
	onclose?: () => void;
}
