import type { Snippet } from 'svelte';

export interface TableRow {
	id?: string | number;
	key?: string | number;
	[key: string]: unknown;
}

export interface TableProps<TRow extends object = TableRow> {
	/** Column sizing strategy; `fixed` honors `.lumi-table-column--*` widths */
	layout?: 'auto' | 'fixed';
	/** Compact row/cell padding */
	compact?: boolean;
	/** Alternate-row background striping */
	stripe?: boolean;
	/** Row hover highlight */
	hover?: boolean;
	/** Search field in the header (filters locally unless paginating on the server) */
	search?: boolean;
	/** Row checkbox selection */
	selectable?: boolean;
	/** Pagination footer */
	pagination?: boolean;
	/** `client` slices `data`; `server` expects the current page in `data` */
	paginationMode?: 'client' | 'server';

	/** @default locale "No data available" */
	noDataText?: string;
	/** Empty text while a search filters everything out @default locale "No results" */
	noResultsText?: string;
	/** @default locale "Search…" */
	searchPlaceholder?: string;

	data?: TRow[];
	/** Page size, rounded down to an integer with a minimum of 1 */
	itemsPerPage?: number;
	/** Server page, rounded down and clamped to the available pages */
	currentPage?: number;
	/** Server total, normalized to a non-negative integer; defaults to data.length */
	totalItems?: number;
	/** Skeleton rows while data loads */
	loading?: boolean;
	/** Unique row identity when rows lack id or key; strings and numbers are distinct */
	rowKey?: (row: TRow) => string | number;
	/** Selected rows (bindable) */
	selected?: TRow[];
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

	onrowclick?: (row: TRow, index: number) => void;
	/** Also invoked by Enter/Space when no onrowclick handler is supplied */
	onrowdblclick?: (row: TRow, index: number) => void;
	/** Complete-row context action; supports pointer, ContextMenu and Shift+F10 */
	onrowcontextmenu?: (event: MouseEvent, row: TRow, index: number) => void;
	onrowselect?: (row: TRow, selected: boolean) => void;
	onsearch?: (query: string) => void;
	onpagechange?: (page: number) => void;
}
