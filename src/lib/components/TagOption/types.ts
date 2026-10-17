import type { LumiColor } from '../config';

export type TagOptionColor = LumiColor;

export interface TagOptionProps {
	/** Display label */
	label: string;

	/** Semantic Lumi color for the dot indicator
	 * @default "primary"
	 */
	color?: TagOptionColor;

	/** Selected (pressed) state */
	selected?: boolean;

	/** Whether the option is non-interactive */
	disabled?: boolean;

	/** Custom class */
	class?: string;

	/** Click handler */
	onclick?: () => void;
}
