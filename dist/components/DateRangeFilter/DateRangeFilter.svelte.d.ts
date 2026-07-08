interface Props {
    fromValue?: string;
    toValue?: string;
    fromLabel?: string;
    toLabel?: string;
    applyLabel?: string;
    resetLabel?: string | null;
    disabled?: boolean;
    /** Smaller inputs; tighter gaps (toolbars, dense panels). */
    compact?: boolean;
    /** Omit the primary action; bind changes apply immediately (client-side filters). */
    hideApply?: boolean;
    onapply?: () => void;
    onreset?: () => void;
}
declare const DateRangeFilter: import("svelte").Component<Props, {}, "fromValue" | "toValue">;
type DateRangeFilter = ReturnType<typeof DateRangeFilter>;
export default DateRangeFilter;
//# sourceMappingURL=DateRangeFilter.svelte.d.ts.map