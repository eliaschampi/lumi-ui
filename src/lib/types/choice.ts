import type { IconSource } from '../utils/icons';

/** One visible choice in an option group (SegmentedControl, ToggleGroup). */
export interface LumiChoiceOption {
	/** Unique value */
	value: string | number;

	/** Visible label — omit for icon-only options */
	label?: string;

	/** Accessible name; required for icon-only options */
	ariaLabel?: string;

	/** Icon component, or a registered icon name */
	icon?: IconSource;

	/** Whether this option is disabled */
	disabled?: boolean;
}
