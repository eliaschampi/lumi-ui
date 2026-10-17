import type { Snippet } from 'svelte';
import type { LumiColor } from '../config';

export type TooltipColor = LumiColor;
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
	/** Plain tooltip text */
	text?: string;

	/** @default "primary" */
	color?: TooltipColor;

	/** Preferred side; flips when space runs out @default "top" */
	placement?: TooltipPlacement;

	/** Show delay in ms @default 0 */
	delay?: number;

	class?: string;

	/** The described trigger */
	children?: Snippet;

	/** Rich tooltip content, replacing `text` */
	content?: Snippet;
}
