import type { LumiColor, LumiControlSize } from '../config';
import type { FieldError } from '../Field';

export type SelectValue = string | number | Record<string, unknown>;

export interface SelectOption {
	value: SelectValue | null;
	label: string;
	disabled?: boolean;
	/** Extra data travels with the option untouched */
	[key: string]: unknown;
}

/** An option object, or a primitive used as both value and label. */
export type SelectOptionInput = SelectOption | string | number;

export type SelectSize = LumiControlSize;
export type SelectSearchMode = 'client' | 'server';

export interface SelectProps {
	/** Selected value (bindable); objects compare structurally */
	value?: SelectValue | null;
	options?: SelectOptionInput[];
	/** @default locale "Select…" */
	placeholder?: string;
	/** Submits the value (objects as JSON) through a hidden input */
	name?: string;
	/** Visible label above the field */
	label?: string;
	/** Accessible name when no visible label is present */
	'aria-label'?: string;
	/** @default 'md' */
	size?: SelectSize;
	/** Accent while focused @default 'primary' */
	color?: LumiColor;
	disabled?: boolean;
	required?: boolean;
	/** Type to filter the options */
	searchable?: boolean;
	/** `server` leaves filtering to `onsearch` (see RemoteSelect) */
	searchMode?: SelectSearchMode;
	/** Invalid state; a string is also shown as the message */
	error?: FieldError;
	/** Helper text below the field; an error message replaces it */
	hint?: string;
	/** Shown when no option matches @default locale "No options available" */
	noDataText?: string;
	/** CSS width of the field @default '100%' */
	width?: string;
	/** Show a clear button while a value is selected @default true */
	clearable?: boolean;
	/** Shows a spinner and blocks selection */
	loading?: boolean;
	class?: string;
	onchange?: (value: SelectValue | null) => void;
	onopen?: () => void;
	onclose?: () => void;
	/** Query typed in searchable mode */
	onsearch?: (query: string) => void;
}
