import type { LumiColor, LumiCompactSize } from '../config';
export type ChipColor = LumiColor;
export type ChipSize = LumiCompactSize;
export interface ChipProps {
    /**
     * Color variant of the chip
     * @default "primary"
     */
    color?: ChipColor;
    /**
     * Size variant of the chip
     * @default "md"
     */
    size?: ChipSize;
    /**
     * Icon to display before the text
     */
    icon?: string;
    /**
     * Whether the chip can be closed
     * @default false
     */
    closable?: boolean;
    /**
     * Custom CSS class
     */
    class?: string;
    /**
     * Close event handler
     */
    onclose?: (event: MouseEvent) => void;
    /**
     * Click event handler
     */
    onclick?: (event: MouseEvent) => void;
}
//# sourceMappingURL=types.d.ts.map