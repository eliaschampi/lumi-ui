import type { HTMLInputAttributes } from 'svelte/elements';
import type { IconSource } from '../../utils/icons';
import type { LumiColor, LumiExtendedSize } from '../config';
import type { FieldError } from '../Field';

export type InputType =
	| 'text'
	| 'password'
	| 'email'
	| 'number'
	| 'tel'
	| 'url'
	| 'search'
	| 'date'
	| 'time'
	| 'datetime-local'
	| 'month'
	| 'week';

export type InputSize = LumiExtendedSize;

export type InputColor = LumiColor;

/**
 * Text field. Native input attributes (`name`, `autocomplete`, `inputmode`,
 * `min`, `max`, `step`, `maxlength`, `pattern`, `readonly`, events…) pass
 * through to the `<input>`; `class` styles the field root.
 */
export interface InputProps extends Omit<
	HTMLInputAttributes,
	'type' | 'value' | 'size' | 'color' | 'class' | 'children'
> {
	/** @default 'text' */
	type?: InputType;
	/** Bindable value */
	value?: string | number | null;
	/** Visible label above the field */
	label?: string;
	/** Decorative leading icon */
	icon?: IconSource;
	/** Trailing action button icon (e.g. password toggle) */
	actionIcon?: IconSource;
	/** Accessible name of the action button */
	actionLabel?: string;
	/** Show a clear button while the field has a value */
	clearable?: boolean;
	/** Accent while focused @default 'primary' */
	color?: InputColor;
	/** Invalid state; a string is also shown as the message */
	error?: FieldError;
	/** Helper text below the field; an error message replaces it */
	hint?: string;
	/** @default 'md' */
	size?: InputSize;
	/** Field root class */
	class?: string;
	/** Action button click */
	onactionclick?: (event: MouseEvent) => void;
}
