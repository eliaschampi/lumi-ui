import type { Snippet } from 'svelte';
import type { IconSource } from '../../utils/icons';
import type { FloatingPlacement } from '../../utils/floating.svelte';
import type { LumiColor, LumiCompactSize } from '../config';

export type DropdownPlacement = FloatingPlacement;
export type DropdownSize = LumiCompactSize;

/** Spread onto a custom trigger element: `<Button {...props}>`. */
export interface DropdownTriggerProps {
	id: string;
	'aria-haspopup': 'menu';
	'aria-expanded': boolean;
	'aria-controls': string | undefined;
	disabled: boolean;
	onclick: (event: MouseEvent) => void;
	onkeydown: (event: KeyboardEvent) => void;
}

export interface DropdownProps {
	/** Visible state (bindable) */
	open?: boolean;

	/** Preferred menu side; flips when space runs out @default "bottom-start" */
	placement?: DropdownPlacement;

	/** @default "md" */
	size?: DropdownSize;

	disabled?: boolean;

	class?: string;

	/** Name of the built-in trigger when its content has no text */
	'aria-label'?: string;

	onopen?: () => void;

	onclose?: () => void;

	/**
	 * Custom interactive trigger; spread the props on it (it must forward
	 * `id`, which focus restore and `aria-labelledby` rely on):
	 * `{#snippet trigger(props)}<Button {...props}>Menu</Button>{/snippet}`
	 */
	trigger?: Snippet<[DropdownTriggerProps]>;

	/** Non-interactive content (Avatar, icon, text) for the built-in trigger button */
	triggerContent?: Snippet;

	/** Menu content (`DropdownItem`s) */
	content?: Snippet;

	/** Menu content when a trigger snippet is set; otherwise the trigger content */
	children?: Snippet;
}

export interface DropdownItemProps {
	icon?: IconSource;

	/** Renders a link item */
	href?: string;

	/** Semantic accent, e.g. `danger` for destructive items */
	color?: LumiColor;

	disabled?: boolean;

	/** Submit the surrounding form; the menu closes after the event bubbles */
	submit?: boolean;

	/** Checked choice in a set: renders `menuitemradio` with `aria-checked` */
	selected?: boolean;

	class?: string;

	children?: Snippet;

	onclick?: (event: MouseEvent) => void;
}
