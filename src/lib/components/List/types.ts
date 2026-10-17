import type { Snippet } from 'svelte';
import type { IconSource } from '../../utils/icons';
import type { LumiColor, LumiCompactSize } from '../config';

export type ListSize = LumiCompactSize;
export type ListColor = LumiColor;
export type ListMaxHeight = 'sm' | 'md' | 'lg';

/** Plain text or a snippet for rich content. */
export type ListText = string | Snippet;

export interface ListProps {
	/** @default "md" */
	size?: ListSize;

	/** Accent for selection, focus and header (inherits when omitted) */
	color?: ListColor;

	/** Makes every item inert */
	disabled?: boolean;

	/**
	 * Caps the height with an inner scroller: `sm` 9rem, `md` 12rem, `lg` 15rem.
	 * Omit to grow with the parent scroller.
	 */
	maxHeight?: ListMaxHeight;

	class?: string;

	/** `ListItem`s, optionally led by a `ListHeader` */
	children?: Snippet;
}

export interface ListItemProps {
	title?: ListText;

	/** Secondary line */
	description?: ListText;

	/** Leading icon (ignored when `leading` is set) */
	icon?: IconSource;

	/** Leading media, e.g. an `Avatar` */
	leading?: Snippet;

	/** Content after the text, e.g. actions — never nested in the item target */
	trailing?: Snippet;

	/** Renders the item as a link */
	href?: string;

	/** Renders the item as a button */
	onclick?: (event: MouseEvent) => void;

	/** Current item in the set (`aria-current`) */
	selected?: boolean;

	disabled?: boolean;

	class?: string;
}

export interface ListHeaderProps {
	title?: string;

	icon?: IconSource;

	/** Header actions */
	actions?: Snippet;

	class?: string;
}
