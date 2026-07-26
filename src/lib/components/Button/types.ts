/**
 * Lumi UI - Button Component Types
 * Professional, type-safe button component for Svelte 5
 */

import type { LumiColor, LumiDisplaySize } from '../config';

export type ButtonVariant = 'filled' | 'border' | 'flat' | 'ghost' | 'gradient';

export interface ButtonProps {
	/** Visual style variant */
	variant?: ButtonVariant;
	/** Native button type, or legacy visual variant when `variant` is omitted */
	type?: 'button' | 'submit' | 'reset' | ButtonVariant;

	/** Legacy native button type used with the visual `type` API */
	button?: 'button' | 'submit' | 'reset';

	/** Semantic accent color */
	color?: LumiColor;

	/** Size on the shared display scale */
	size?: LumiDisplaySize;

	/** Icon name to display */
	icon?: string;

	/** Whether to show icon after text */
	iconAfter?: boolean;

	/** Whether to use rounded corners */
	radius?: boolean;

	/** Whether to show loading state */
	loading?: boolean;

	/** Whether button is disabled */
	disabled?: boolean;

	/** Accessible label for icon-only buttons */
	'aria-label'?: string;
	/** Additional CSS classes */
	class?: string;
}
