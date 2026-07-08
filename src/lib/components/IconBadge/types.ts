import type { LumiColor, LumiDisplaySize } from '../config';

export interface IconBadgeProps {
	/** Icon name from the icon registry */
	icon: string;

	/** Badge color variant */
	color?: LumiColor;

	/** Badge size */
	size?: LumiDisplaySize;

	/** Additional CSS classes */
	class?: string;
}
