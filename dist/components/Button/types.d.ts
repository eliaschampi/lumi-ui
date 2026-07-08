/**
 * Lumi UI - Button Component Types
 * Professional, type-safe button component for Svelte 5
 */
import type { LumiColor, LumiDisplaySize } from '../config';
export interface ButtonProps {
    /** Button type variant */
    type?: 'filled' | 'border' | 'flat' | 'ghost' | 'gradient';
    /** Color variant */
    color?: LumiColor;
    /** Size variant */
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
    /** HTML button type */
    button?: 'button' | 'submit' | 'reset';
    /** Accessible label for icon-only buttons */
    'aria-label'?: string;
    /** Additional CSS classes */
    class?: string;
}
//# sourceMappingURL=types.d.ts.map