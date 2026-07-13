import type { Snippet } from 'svelte';

export interface TableRow {
	id?: string | number;
	key?: string | number;
	[key: string]: unknown;
}

export interface TablePaginationData {
	currentPage: number;
	totalPages: number;
	itemsPerPage: number;
	totalItems: number;
}

export interface TableProps<TRow extends object = TableRow> {
	/** Table column sizing strategy */
	layout?: 'auto' | 'fixed';
	/** Compact row/cell padding */
	compact?: boolean;
	/** Alternate-row background striping */
	stripe?: boolean;
	/** Enable row hover highlight */
	hover?: boolean;
	/** Show search input in header */
	search?: boolean;
	/** Enable row checkbox selection */
	selectable?: boolean;
	/** Enable pagination controls */
	pagination?: boolean;
	/** Pagination strategy. Client slices local data; server expects current page data. */
	paginationMode?: 'client' | 'server';

	/* ── Localized text ── */
	/** Text shown when data is empty */
	noDataText?: string;
	/** Search input placeholder */
	searchPlaceholder?: string;
	/** Loading state text */
	loadingText?: string;
	/** Pagination: shown when filtered to zero */
	noResultsText?: string;
	/** Pagination: label before range (e.g. "Showing") */
	showingLabel?: string;
	/** Pagination: label between range and total (e.g. "of") */
	ofLabel?: string;

	/** Data array */
	data?: TRow[];
	/** Items per page when pagination is enabled */
	itemsPerPage?: number;
	/** Current page when paginationMode is server */
	currentPage?: number;
	/** Total items when paginationMode is server */
	totalItems?: number;
	/** Show loading state */
	loading?: boolean;
	/** Stable row identity when rows do not expose id or key */
	rowKey?: (row: TRow) => string | number;
	/** Selected rows (bindable); styling does not depend on checkbox controls */
	selected?: TRow[];
	/** Additional CSS class */
	class?: string;
	/** Accessible table name when no visible caption identifies it */
	'aria-label'?: string;
	/** Table body content when data is not supplied */
	children?: Snippet;
	/** Header toolbar content */
	header?: Snippet;
	/** Column header cells */
	thead?: Snippet;
	/** Cells rendered for each data row */
	row?: Snippet<[{ row: TRow; index: number }]>;
	/** Custom pagination content */
	paginationSlot?: Snippet<[TablePaginationData]>;

	/* ── Event handlers ── */
	'onrow-click'?: (row: TRow, index: number) => void;
	'onrow-dblclick'?: (row: TRow, index: number) => void;
	/** Complete-row context action; supports pointer, ContextMenu and Shift+F10 */
	'onrow-contextmenu'?: (event: MouseEvent, row: TRow, index: number) => void;
	'onrow-select'?: (row: TRow, selected: boolean) => void;
	onsearch?: (query: string) => void;
	'onpage-change'?: (page: number) => void;
}
