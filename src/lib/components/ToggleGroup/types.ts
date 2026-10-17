import type { LumiColor, LumiCompactSize } from '../config';
import type { LumiChoiceOption } from '../../types/choice';

export type ToggleGroupValue = string | number;

export interface ToggleGroupProps {
	/** Pressed option values (bindable) */
	value?: ToggleGroupValue[];

	/** Options rendered as toggle buttons */
	options: LumiChoiceOption[];

	/** Accent of pressed options
	 * @default "primary"
	 */
	color?: LumiColor;

	/** @default "md" */
	size?: LumiCompactSize;

	/** @default "horizontal" */
	orientation?: 'horizontal' | 'vertical';

	/** Disable every option */
	disabled?: boolean;

	/** Stretch options to the available width */
	fullWidth?: boolean;

	/** Accessible group name */
	'aria-label'?: string;

	class?: string;

	/** Called with the new pressed values after each toggle */
	onchange?: (value: ToggleGroupValue[]) => void;
}
