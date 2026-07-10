import type { FloatingPlacement } from '../../utils/floating.svelte';
import type { LumiControlSize } from '../config';
export type SelectValue = string | number | Record<string, unknown>;
export type SelectOptionInput = SelectOption | Record<string, unknown> | string | number;
export interface SelectOption {
    /** Option value */
    value: SelectValue | null;
    /** Option label */
    label: string;
    /** Whether option is disabled */
    disabled?: boolean;
    /** Additional option data */
    [key: string]: unknown;
}
export type SelectSize = LumiControlSize;
export type SelectSearchMode = 'client' | 'server';
export interface SelectProps {
    /** Selected value */
    value?: SelectValue | null;
    /** Available options */
    options?: SelectOptionInput[];
    /** Placeholder text */
    placeholder?: string;
    /** Name attribute */
    name?: string;
    /** Accessible label when visual label is omitted */
    'aria-label'?: string;
    /** Label text */
    label?: string;
    /** Size variant */
    size?: SelectSize;
    /** Whether select is disabled */
    disabled?: boolean;
    /** Whether select has autocomplete */
    autocomplete?: boolean;
    /** Where autocomplete filtering is resolved */
    searchMode?: SelectSearchMode;
    /** Whether select has error state */
    error?: boolean;
    /** Error message text */
    errorMessage?: string;
    /** Text to show when no data */
    noDataText?: string;
    /** Select width */
    width?: string;
    /** Key name used for option value in object options */
    valueKey?: string;
    /** Key name used for option label in object options */
    labelKey?: string;
    /** Key name used for option disabled state in object options */
    disabledKey?: string;
    /** Whether to show clear button */
    clearable?: boolean;
    /** Loading state */
    loading?: boolean;
    /** Dropdown placement */
    placement?: FloatingPlacement;
    /** Maximum height for dropdown */
    maxHeight?: number;
    /** Offset from trigger element */
    offset?: number;
    /** Minimum distance from viewport edges */
    viewportPadding?: number;
    /** Custom form serialization for object values */
    serializeValue?: (value: SelectValue) => string;
    /** Custom class */
    class?: string;
    /** Change event handler */
    onchange?: (value: SelectValue | null) => void;
    /** Open event handler */
    onopen?: () => void;
    /** Close event handler */
    onclose?: () => void;
    /** Search event handler */
    onsearch?: (query: string) => void;
}
//# sourceMappingURL=types.d.ts.map