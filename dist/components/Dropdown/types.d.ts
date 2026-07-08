import type { FloatingPlacement } from '../../utils/floating.svelte';
import type { LumiCompactSize } from '../config';
export type DropdownPosition = FloatingPlacement;
export type DropdownSize = LumiCompactSize;
export type DropdownTrigger = 'click' | 'hover';
export interface DropdownProps {
    /** Whether dropdown is open */
    open?: boolean;
    /** Dropdown position relative to trigger */
    position?: DropdownPosition;
    /** Size variant */
    size?: DropdownSize;
    /** Whether dropdown is disabled */
    disabled?: boolean;
    /** Trigger type */
    trigger?: DropdownTrigger;
    /** Whether to close on outside click */
    closeOnClickOutside?: boolean;
    /** Maximum height for dropdown */
    maxHeight?: number;
    /** Offset from trigger element */
    offset?: number;
    /** Minimum distance from viewport edges */
    viewportPadding?: number;
    /** Custom class */
    class?: string;
    /** Accessible label for trigger when trigger content has no text */
    'aria-label'?: string;
    /** Show event handler */
    onshow?: () => void;
    /** Hide event handler */
    onhide?: () => void;
}
//# sourceMappingURL=types.d.ts.map