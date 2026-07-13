import type { LumiColor } from '../config';

export type TooltipColor = LumiColor;
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
	/** Tooltip text */
	text?: string;

	/** Tooltip color */
	color?: TooltipColor;

	/** Tooltip placement relative to trigger */
	placement?: TooltipPlacement;

	/** Delay before showing (ms) */
	delay?: number;

	/** Custom class */
	class?: string;
}
