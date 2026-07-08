import type { Snippet } from 'svelte';
import type { LumiColor, LumiCompactSize } from '../config';

export type RadioSize = LumiCompactSize;
export type RadioColor = LumiColor;

export interface RadioProps {
	/** Selected value (bindable) */
	group?: unknown;
	/** Radio value */
	value: unknown;
	/** Label text */
	label?: string;
	/** Secondary line (inside label — full card stays clickable) */
	description?: string;
	/** Bordered card row (auto when `description` is set) */
	option?: boolean;
	/** Disables interaction on option cards (e.g. while saving) */
	busy?: boolean;
	/** Radio name (for grouping) */
	name?: string;
	/** Size variant */
	size?: RadioSize;
	/** Color variant */
	color?: RadioColor;
	/** Disabled state */
	disabled?: boolean;
	/** Custom CSS class */
	class?: string;
	/** Children snippet for custom label */
	children?: Snippet;
	/** Change event handler */
	onchange?: (value: unknown, event: Event) => void;
	/** Accessible label for screen readers when visual label is custom/hidden */
	'aria-label'?: string;
}
