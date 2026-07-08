import type { LumiColor, LumiControlSize } from '../config';

export type CollapseColor = LumiColor;
export type CollapseSize = LumiControlSize;
export type CollapseRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface CollapseProps {
	/** Title text */
	title?: string;

	/** Whether open by default */
	defaultOpen?: boolean;

	/** Color variant */
	color?: CollapseColor;

	/** Size variant */
	size?: CollapseSize;

	/** Border radius variant */
	radius?: CollapseRadius;

	/** Whether disabled */
	disabled?: boolean;

	/** Custom class */
	class?: string;

	/** Toggle event handler */
	ontoggle?: (isOpen: boolean) => void;

	/** Change event handler */
	onchange?: (isOpen: boolean) => void;
}
