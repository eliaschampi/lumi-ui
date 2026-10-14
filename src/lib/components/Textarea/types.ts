import type { LumiColor, LumiControlSize } from '../config';
import type { FieldError } from '../Field';

export type TextareaSize = LumiControlSize;
export type TextareaColor = LumiColor;

export interface TextareaProps {
	/** Textarea value (bindable) */
	value?: string;
	/** Form field name */
	name?: string;
	/** Label text */
	label?: string;
	/** Placeholder text */
	placeholder?: string;
	/** Invalid state; a string is also shown as the message */
	error?: FieldError;
	/** Helper text below the field; an error message replaces it */
	hint?: string;
	/** Maximum character length */
	maxlength?: number;
	/** Disabled state */
	disabled?: boolean;
	/** Readonly state */
	readonly?: boolean;
	/** Number of visible rows */
	rows?: number;
	/** Size variant */
	size?: TextareaSize;
	/** Accent color while focused */
	color?: TextareaColor;
	/** Required field indicator */
	required?: boolean;
	/** Accessible label when visible label is not provided */
	'aria-label'?: string;
	/** Show character counter */
	showCount?: boolean;
	/** Custom CSS class */
	class?: string;
	/** Input event handler */
	oninput?: (event: Event) => void;
	/** Focus event handler */
	onfocus?: (event: FocusEvent) => void;
	/** Blur event handler */
	onblur?: (event: FocusEvent) => void;
	/** Keydown event handler */
	onkeydown?: (event: KeyboardEvent) => void;
}
