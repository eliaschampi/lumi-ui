import type { LumiColor, LumiControlSize } from '../config';
export type NumberInputColor = LumiColor;
export type NumberInputSize = LumiControlSize;
export interface NumberInputProps {
    /** Current value (bindable) */
    value?: number;
    /** Form field name */
    name?: string;
    /** Minimum value */
    min?: number;
    /** Maximum value */
    max?: number;
    /** Step increment */
    step?: number;
    /** Label text */
    label?: string;
    /** Placeholder text */
    placeholder?: string;
    /** Color variant */
    color?: NumberInputColor;
    /** Size variant */
    size?: NumberInputSize;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Required field indicator */
    required?: boolean;
    /** Accessible label when visible label is not provided */
    'aria-label'?: string;
    /** Custom class */
    class?: string;
    /** Change handler */
    onchange?: (value: number) => void;
}
//# sourceMappingURL=types.d.ts.map