import type { Snippet } from 'svelte';
import type { LumiDisplaySize } from '../config';

export type DialogSize = LumiDisplaySize;

export interface DialogProps {
	/** Visible state (bindable) */
	open?: boolean;

	/** Heading text; also the dialog's accessible name */
	title?: string;

	/** @default "md" */
	size?: DialogSize;

	/** Ignore backdrop clicks */
	persistent?: boolean;

	/** Scroll the body instead of the page when content is tall */
	scrollable?: boolean;

	fullScreen?: boolean;

	hideClose?: boolean;

	/** Close button name; defaults to the localized "Close dialog" */
	closeLabel?: string;

	/** @default true */
	closeOnEscape?: boolean;

	class?: string;

	/** Custom header, replacing `title` */
	header?: Snippet;

	/** Actions row */
	footer?: Snippet;

	children?: Snippet;

	/** User dismissed it (close button, Escape or backdrop) */
	onclose?: () => void;

	/** Opening started */
	onopen?: () => void;

	/** Enter transition finished */
	onafteropen?: () => void;

	/** Exit transition finished */
	onafterclose?: () => void;
}
