import type { LumiColor } from '../config';

export type TooltipColor = LumiColor;
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
	/** Tooltip text */
	text?: string;

	/** Tooltip color */
	color?: TooltipColor;

	/** Tooltip position */
	position?: TooltipPosition;

	/** Delay before showing (ms) */
	delay?: number;

	/** Custom class */
	class?: string;
}
