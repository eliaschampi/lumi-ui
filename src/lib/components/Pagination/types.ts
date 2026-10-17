import type { LumiCompactSize } from '../config';

export interface PaginationProps {
	/** Current page, 1-based (bindable) */
	page?: number;
	/** Total page count */
	pages: number;
	/** Page numbers shown on each side of the current page @default 1 */
	siblings?: number;
	/** Previous/next with a "2 / 5" status instead of page numbers */
	compact?: boolean;
	/** @default 'sm' */
	size?: LumiCompactSize;
	/** Blocks navigation, e.g. while a page loads */
	disabled?: boolean;
	/**
	 * Render crawlable links instead of buttons, e.g.
	 * `href={(page) => `?page=${page}`}`; adds `rel="prev|next"`.
	 */
	href?: (page: number) => string;
	/** Landmark name @default locale "Pagination" */
	'aria-label'?: string;
	class?: string;
	/** Requested page (buttons and links) */
	onpagechange?: (page: number) => void;
}
