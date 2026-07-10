// Lumi UI — Table Component Types

export interface TableRow {
	id?: string | number;
	key?: string | number;
	[key: string]: unknown;
}

export interface TableProps {
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

	/* ── i18n text props (FIX: was hardcoded Spanish) ── */
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
	data?: TableRow[];
	/** Items per page when pagination is enabled */
	itemsPerPage?: number;
	/** Current page when paginationMode is server */
	currentPage?: number;
	/** Total items when paginationMode is server */
	totalItems?: number;
	/** Show loading state */
	loading?: boolean;
	/** Stable row identity when rows do not expose id or key */
	rowKey?: (row: TableRow) => string | number;
	/** Currently selected rows (bindable) */
	selected?: TableRow[];
	/** Additional CSS class */
	class?: string;

	/* ── Event handlers ── */
	'onrow-click'?: (row: TableRow, index: number) => void;
	'onrow-dblclick'?: (row: TableRow, index: number) => void;
	'onrow-contextmenu'?: (
		event: MouseEvent,
		row: TableRow,
		index: number
	) => void;
	'onrow-select'?: (row: TableRow, selected: boolean) => void;
	onsearch?: (query: string) => void;
	'onpage-change'?: (page: number) => void;
}
