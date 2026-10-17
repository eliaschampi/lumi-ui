import type { LumiColor, LumiSize } from '../config';
import type { IconSource } from '../../utils/icons';

export type IconColor =
	LumiColor | 'muted' | 'inherit' | `var(--lumi-${string})`;

export interface IconProps {
	/** Lucide-compatible component, or a name registered with `registerIcons` */
	icon?: IconSource;

	/** Semantic color or Lumi color token */
	color?: IconColor;

	/** Icon size - predefined or custom CSS size */
	size?: LumiSize | string;

	/** Stroke width for the icon */
	stroke?: number;

	/** Additional CSS classes */
	class?: string;

	/** Accessible name for meaningful standalone icons; omitted icons are decorative */
	'aria-label'?: string;
}
