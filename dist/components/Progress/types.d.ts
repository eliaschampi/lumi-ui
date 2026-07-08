import type { LumiColor, LumiExtendedSize } from '../config';
export type ProgressColor = LumiColor;
export type ProgressSize = LumiExtendedSize;
export interface ProgressProps {
    /** Progress value (0-100) */
    value?: number;
    /** Progress color variant */
    color?: ProgressColor;
    /** Progress size */
    size?: ProgressSize;
    /** Whether to show progress text */
    showLabel?: boolean;
    /** Whether progress is striped */
    striped?: boolean;
    /** Whether progress is animated */
    animated?: boolean;
    /** Custom progress text */
    label?: string;
    /** Whether progress is indeterminate */
    indeterminate?: boolean;
    /** Custom class */
    class?: string;
    /** Complete event handler */
    oncomplete?: () => void;
    /** Accessible label for progressbar */
    'aria-label'?: string;
}
//# sourceMappingURL=types.d.ts.map