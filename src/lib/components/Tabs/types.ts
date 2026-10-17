import type { IconSource } from '../../utils/icons';
import type { Snippet } from 'svelte';
import type { LumiColor } from '../config';

export type TabsColor = LumiColor;
export type TabsOrientation = 'horizontal' | 'vertical';

export interface Tab {
	/**
	 * Tab value (unique identifier)
	 */
	value: string | number;

	/**
	 * Tab label text
	 */
	label?: string;

	/**
	 * Tab icon name
	 */
	icon?: IconSource;

	/**
	 * Whether tab is disabled
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * Optional panel content. When used, Tabs keeps every panel mounted and
	 * hides inactive panels so local state and form controls are preserved.
	 */
	content?: Snippet;
}

export interface TabsProps {
	/**
	 * Active tab value (bindable)
	 */
	value?: string | number;

	/**
	 * Available tabs
	 */
	tabs?: Tab[];

	/**
	 * Tab color variant
	 * @default "primary"
	 */
	color?: TabsColor;

	/**
	 * Tab orientation
	 * @default "horizontal"
	 */
	orientation?: TabsOrientation;

	/**
	 * Custom CSS class
	 */
	class?: string;

	/**
	 * Single panel for navigation-only tabs (when no tab has `content`)
	 */
	children?: Snippet;

	/**
	 * Tab change event handler
	 */
	onchange?: (
		value: string | number,
		previousValue: string | number | undefined
	) => void;

	/**
	 * Accessible label for the tablist
	 */
	'aria-label'?: string;
}
