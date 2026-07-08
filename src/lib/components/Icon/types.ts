import type { LumiColor, LumiSize } from '../config';

export interface IconProps {
	/** Icon name from the icon registry */
	icon?: string;

	/** Icon color - semantic or custom CSS color */
	color?: LumiColor | 'muted' | string;

	/** Icon size - predefined or custom CSS size */
	size?: LumiSize | string;

	/** Stroke width for the icon */
	stroke?: number;

	/** Additional CSS classes */
	class?: string;

	/** Click handler */
	onclick?: (event: MouseEvent) => void;
}
