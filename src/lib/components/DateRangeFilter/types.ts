export interface DateRangeFilterProps {
	/** Start date, `YYYY-MM-DD` (bindable) */
	fromValue?: string;
	/** End date, `YYYY-MM-DD` (bindable) */
	toValue?: string;
	/** @default locale "From" */
	fromLabel?: string;
	/** @default locale "To" */
	toLabel?: string;
	/** Accessible name of the apply button @default locale "Apply" */
	applyLabel?: string;
	disabled?: boolean;
	/** Smaller fields for toolbars and dense panels */
	compact?: boolean;
	class?: string;
	/** Shows the apply button; omit it when bound values apply immediately */
	onapply?: () => void;
}
