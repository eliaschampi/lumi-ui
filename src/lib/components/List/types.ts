// Lumi UI - List Component Types
import type { Snippet } from 'svelte';

import type { LumiColor, LumiCompactSize } from '../config';

export type ListSize = LumiCompactSize;
export type ListColor = LumiColor;
export type ListMaxHeight = 'sm' | 'md' | 'lg';

export interface ListProps {
	/** Size variant */
	size?: ListSize;

	/** Color variant */
	color?: ListColor;

	/** Disabled state */
	disabled?: boolean;

	/**
	 * Bounded scroll area max height (token-based).
	 * `sm` = 9rem, `md` = 12rem, `lg` = 15rem
	 */
	maxHeight?: ListMaxHeight;

	/** Custom class */
	class?: string;
}

export interface ListItemProps {
	/** Item title */
	title?: string;

	/** Item subtitle */
	subtitle?: string;

	/** Icon name */
	icon?: string;

	/** Avatar snippet */
	avatar?: Snippet;

	/** Disabled state */
	disabled?: boolean;

	/** Whether item is clickable */
	clickable?: boolean;

	/** Active state */
	active?: boolean;

	/** Custom class */
	class?: string;

	/** Click handler */
	onclick?: (event: MouseEvent) => void;

	/** Right-side actions snippet */
	children?: Snippet;

	/** Custom title snippet */
	titleSlot?: Snippet;

	/** Custom subtitle snippet */
	subtitleSlot?: Snippet;
}

export interface ListHeaderProps {
	/** Header title */
	title?: string;

	/** Color variant */
	color?: ListColor;

	/** Icon name */
	icon?: string;

	/** Custom class */
	class?: string;

	/** Actions snippet */
	actions?: Snippet;

	/** Alternative actions snippet */
	children?: Snippet;
}
