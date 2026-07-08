import type { LumiColor, LumiControlSize } from '../config';
export type LoadingColor = LumiColor;
export type LoadingSize = LumiControlSize;
export interface LoadingProps {
    /** Size variant */
    size?: LoadingSize;
    /** Color variant */
    color?: LoadingColor;
    /** Loading text */
    text?: string;
    /** Additional CSS classes */
    class?: string;
}
//# sourceMappingURL=types.d.ts.map