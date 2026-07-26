import type { LumiColor } from '../config';

export type TooltipColor = LumiColor;
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
/** @deprecated Use `TooltipPlacement` instead. */
export type TooltipPosition = TooltipPlacement;

export interface TooltipProps {
	/** Tooltip text */
	text?: string;

	/** Tooltip color */
	color?: TooltipColor;

	/** Tooltip placement relative to trigger */
	placement?: TooltipPlacement;

	/** @deprecated Use `placement` instead. */
	position?: TooltipPosition;

	/** Delay before showing (ms) */
	delay?: number;

	/** Custom class */
	class?: string;
}
