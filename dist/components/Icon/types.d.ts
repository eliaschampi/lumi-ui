import type { LumiColor, LumiSize } from '../config';
import type { IconComponent } from '../../utils/icons';
export type IconColor = LumiColor | 'muted' | 'inherit' | `var(--lumi-${string})`;
export type IconSource = string | IconComponent;
export interface IconProps {
    /** Registry name or a directly imported Lucide-compatible component */
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
//# sourceMappingURL=types.d.ts.map