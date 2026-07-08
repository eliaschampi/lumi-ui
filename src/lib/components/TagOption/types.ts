import type { LumiColor } from '../config';

export type TagOptionColor = LumiColor;

export interface TagOptionProps {
	/** Display label */
	label: string;

	/** Semantic Lumi color for the dot indicator
	 * @default "primary"
	 */
	color?: TagOptionColor;

	/** Whether this option is currently selected */
	active?: boolean;

	/** Whether the option is non-interactive */
	disabled?: boolean;

	/** Click handler */
	onclick?: () => void;
}
