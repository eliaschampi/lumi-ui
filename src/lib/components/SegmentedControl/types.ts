import type { LumiChoiceOption } from '../../types/choice';
import type { LumiColor } from '../config';

/** One segment; shares its shape with ToggleGroup options. */
export type SegmentedControlOption = LumiChoiceOption;

export type SegmentedControlColor = LumiColor;

export interface SegmentedControlProps {
	/** Selected value (bindable); `''` when cleared */
	value?: string | number;
	options: SegmentedControlOption[];
	/** Accent of the active segment @default 'primary' */
	color?: SegmentedControlColor;
	disabled?: boolean;
	/** Stretch segments across the available width */
	fullWidth?: boolean;
	/** @default 'horizontal' */
	orientation?: 'horizontal' | 'vertical';
	/** Compact padding for icon-only options */
	iconOnly?: boolean;
	/** Activating the selected option again clears it */
	clearable?: boolean;
	class?: string;
	/** Accessible group name */
	'aria-label'?: string;
	onchange?: (value: string | number) => void;
}
