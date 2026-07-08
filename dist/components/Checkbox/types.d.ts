import type { Snippet } from 'svelte';
import type { LumiColor, LumiCompactSize } from '../config';
export type CheckboxSize = LumiCompactSize;
export type CheckboxColor = LumiColor;
export interface CheckboxProps {
    /** Checked state (bindable) */
    checked?: boolean;
    /** Indeterminate state (for partial selection) */
    indeterminate?: boolean;
    /** Form field name */
    name?: string;
    /** Label text */
    label?: string;
    /** Size variant */
    size?: CheckboxSize;
    /** Color variant */
    color?: CheckboxColor;
    /** Disabled state */
    disabled?: boolean;
    /** Required field indicator */
    required?: boolean;
    /** Custom CSS class */
    class?: string;
    /** Children snippet for custom label */
    children?: Snippet;
    /** Change event handler */
    onchange?: (checked: boolean, event: Event) => void;
    /** Accessible label for screen readers when visual label is custom/hidden */
    'aria-label'?: string;
}
//# sourceMappingURL=types.d.ts.map