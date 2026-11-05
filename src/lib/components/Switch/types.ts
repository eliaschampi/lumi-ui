import type { Snippet } from 'svelte';
import type { LumiColor, LumiControlSize } from '../config';

export type SwitchSize = LumiControlSize;
export type SwitchColor = LumiColor;

export interface SwitchProps {
	/** Checked state (bindable) */
	checked?: boolean;
	/** Id of the input, to point a `<label for>` at it */
	id?: string;
	/** Form field name */
	name?: string;
	/** Submitted value when checked @default 'on' */
	value?: string;
	/** Label text */
	label?: string;
	/** Size variant */
	size?: SwitchSize;
	/** Color variant */
	color?: SwitchColor;
	/** Disabled state */
	disabled?: boolean;
	/** Must be on before the form submits */
	required?: boolean;
	/** Custom CSS class */
	class?: string;
	/** Children snippet for custom label */
	children?: Snippet;
	/** Change event handler */
	onchange?: (checked: boolean, event: Event) => void;

	/** Accessible label when visible label is not provided */
	'aria-label'?: string;
}
