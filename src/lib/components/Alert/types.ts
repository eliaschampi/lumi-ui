import type { Snippet } from 'svelte';
import type { LumiColor } from '../config';

export type AlertColor = LumiColor;

export interface AlertProps {
	/** @default "info" */
	color?: AlertColor;

	title?: string;

	/** Show the status icon @default true */
	icon?: boolean;

	/** Show a dismiss button @default false */
	closable?: boolean;

	/** Visible state (bindable) */
	active?: boolean;

	class?: string;

	/** Message content */
	children?: Snippet;

	/** Fires once the alert has left (after its exit transition) */
	onclose?: () => void;
}
