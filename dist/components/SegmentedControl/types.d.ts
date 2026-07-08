import type { LumiColor } from '../config';
export interface SegmentedControlOption {
    /** Unique value */
    value: string | number;
    /** Visible label — omit for icon-only options */
    label?: string;
    /** Accessible label for icon-only options */
    ariaLabel?: string;
    /** Optional icon name */
    icon?: string;
    /** Whether disabled */
    disabled?: boolean;
}
export type SegmentedControlColor = LumiColor;
export interface SegmentedControlProps {
    /** Selected value */
    value?: string | number;
    /** Array of options */
    options: SegmentedControlOption[];
    /** Color variant */
    color?: SegmentedControlColor;
    /** Whether disabled */
    disabled?: boolean;
    /** Stretch to available width */
    fullWidth?: boolean;
    /** Layout orientation */
    orientation?: 'horizontal' | 'vertical';
    /** Compact padding for icon-only options (no labels) */
    iconOnly?: boolean;
    /** Allow selecting the active option again to clear it */
    clearable?: boolean;
    /** Custom class */
    class?: string;
    /** Change event handler */
    onchange?: (value: string | number) => void;
    /** Accessible group label */
    'aria-label'?: string;
}
//# sourceMappingURL=types.d.ts.map