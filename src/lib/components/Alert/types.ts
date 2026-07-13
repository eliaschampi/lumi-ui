/**
 * Lumi UI - Alert Component Types
 */

import type { LumiColor } from '../config';

export type AlertColor = LumiColor;

export interface AlertProps {
	/** Whether alert is visible */
	active?: boolean;

	/** Semantic accent color */
	color?: AlertColor;

	/** Alert title */
	title?: string;

	/** Whether to show icon */
	icon?: boolean;

	/** Whether alert is closable */
	closable?: boolean;

	/** Additional CSS classes */
	class?: string;
}
