import type { HTMLAttributes } from 'svelte/elements';
import type { IconSource } from '../../utils/icons';
import type { LumiColor, LumiDisplaySize } from '../config';

export type ButtonVariant = 'filled' | 'border' | 'flat' | 'ghost' | 'gradient';

/**
 * Action or link. Any global HTML attribute (`title`, `id`, `data-*`,
 * `aria-*`, event handlers) passes through to the rendered element.
 */
export interface ButtonProps extends Omit<
	HTMLAttributes<HTMLElement>,
	'color'
> {
	/** Visual style @default 'filled' */
	variant?: ButtonVariant;
	/** Semantic accent color @default 'primary' */
	color?: LumiColor;
	/** Size on the shared display scale @default 'md' */
	size?: LumiDisplaySize;
	/** Icon component or registered icon name */
	icon?: IconSource;
	/** Place the icon after the label */
	iconAfter?: boolean;
	/** Shows a spinner and blocks activation */
	loading?: boolean;
	disabled?: boolean;
	/** Toggle-button state (`aria-pressed`); omit for plain actions */
	pressed?: boolean;
	/** Native button type @default 'button' */
	type?: 'button' | 'submit' | 'reset';
	/** Renders a crawlable link instead of a button */
	href?: string;
	/** Link target (only with `href`) */
	target?: string;
	/** Link relationship (only with `href`) */
	rel?: string;
	/** Download the linked resource (only with `href`) */
	download?: string | boolean;
	/**
	 * Renders the `<summary>` of the parent native `<details>`: a disclosure
	 * toggle that works without JavaScript and reads as pressed while open.
	 * Not with `href`.
	 */
	summary?: boolean;
}
