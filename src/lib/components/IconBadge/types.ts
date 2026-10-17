import type { IconSource } from '../../utils/icons';
import type { LumiColor, LumiDisplaySize } from '../config';

export interface IconBadgeProps {
	/** Icon name from the icon registry */
	icon: IconSource;

	/** Badge color variant */
	color?: LumiColor;

	/** Badge size */
	size?: LumiDisplaySize;

	/** Additional CSS classes */
	class?: string;
}
