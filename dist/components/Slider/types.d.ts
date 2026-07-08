import type { LumiColor, LumiControlSize } from '../config';
export type SliderColor = LumiColor;
export type SliderSize = LumiControlSize;
export interface SliderProps {
    /** Form field name */
    name?: string;
    /** Input id; falls back to a stable id derived from name/label */
    id?: string;
    /** Current value of the slider (bindable) */
    value?: number;
    /** Minimum value */
    min?: number;
    /** Maximum value */
    max?: number;
    /** Step increment */
    step?: number;
    /** Label text */
    label?: string;
    /** Color variant */
    color?: SliderColor;
    /** Size variant */
    size?: SliderSize;
    /** Whether the slider is disabled */
    disabled?: boolean;
    /** Whether to show the value below the slider */
    showValue?: boolean;
    /** Whether to show tooltip on hover */
    showTooltip?: boolean;
    /** Custom class */
    class?: string;
    /** Change handler */
    onchange?: (value: number) => void;
}
//# sourceMappingURL=types.d.ts.map