import type { HTMLTextareaAttributes } from 'svelte/elements';
import type { LumiColor, LumiControlSize } from '../config';
import type { FieldError } from '../Field';

export type TextareaSize = LumiControlSize;
export type TextareaColor = LumiColor;

/**
 * Multiline field that grows with its content. Native textarea attributes
 * (`name`, `rows`, `maxlength`, `readonly`, events…) pass through to the
 * `<textarea>`; `class` styles the field root.
 */
export interface TextareaProps extends Omit<
	HTMLTextareaAttributes,
	'value' | 'class' | 'children'
> {
	/** Bindable value */
	value?: string | null;
	/** Visible label above the field */
	label?: string;
	/** Invalid state; a string is also shown as the message */
	error?: FieldError;
	/** Helper text below the field; an error message replaces it */
	hint?: string;
	/** @default 'md' */
	size?: TextareaSize;
	/** Accent while focused @default 'primary' */
	color?: TextareaColor;
	/** Show a `length/maxlength` counter (requires `maxlength`) */
	showCount?: boolean;
	/** Field root class */
	class?: string;
}
