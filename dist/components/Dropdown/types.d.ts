import type { FloatingPlacement } from '../../utils/floating.svelte';
import type { LumiColor, LumiCompactSize } from '../config';
export type DropdownPlacement = FloatingPlacement;
/** @deprecated Use `DropdownPlacement` instead. */
export type DropdownPosition = DropdownPlacement;
export type DropdownSize = LumiCompactSize;
export type DropdownTrigger = 'click' | 'hover';
export interface DropdownProps {
    /** Whether dropdown is open (bindable) */
    open?: boolean;
    /** Dropdown placement relative to trigger */
    placement?: DropdownPlacement;
    /** @deprecated Use `placement` instead. */
    position?: DropdownPlacement;
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
    /** Open event handler */
    onopen?: () => void;
    /** Close event handler */
    onclose?: () => void;
}
export interface DropdownItemProps {
    /** Optional leading icon */
    icon?: string;
    /** Link destination; renders an anchor when provided */
    href?: string;
    /** Semantic accent color */
    color?: LumiColor;
    /** Whether the item is unavailable */
    disabled?: boolean;
    /** Whether a button item submits its containing form */
    submit?: boolean;
    /** Whether the item represents the current selection */
    selected?: boolean;
    /** Custom class */
    class?: string;
    /** Activation handler */
    onclick?: (event: MouseEvent) => void;
}
//# sourceMappingURL=types.d.ts.map