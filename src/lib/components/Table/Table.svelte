	<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '../Button/Button.svelte';
	import Checkbox from '../Checkbox/Checkbox.svelte';
	import Input from '../Input/Input.svelte';
	import Icon from '../Icon/Icon.svelte';
	import type { TableProps, TableRow } from './types';

	interface Props extends TableProps {
		children?: Snippet;
		header?: Snippet;
		thead?: Snippet;
		row?: Snippet<[{ row: TableRow; index: number }]>;
		paginationSlot?: Snippet<
			[{ currentPage: number; totalPages: number; itemsPerPage: number; totalItems: number }]
		>;
	}

	let {
		layout = 'auto',
		compact = false,
		stripe = false,
		hover = false,
		search = false,
		selectable = false,
		pagination = false,
		paginationMode = 'client',
		noDataText = 'No hay datos disponibles',
		searchPlaceholder = 'Buscar...',
		loadingText = 'Cargando...',
		noResultsText = 'Sin resultados',
		showingLabel = 'Mostrando',
		ofLabel = 'de',
		data = undefined,
		itemsPerPage = 10,
		currentPage: controlledPage = 1,
		totalItems: totalItemsProp,
		loading = false,
		rowKey,
		selected = $bindable([]),
		class: className = '',
		'onrow-click': onRowClick,
		'onrow-dblclick': onRowDblClick,
		'onrow-contextmenu': onRowContextMenu,
		'onrow-select': onRowSelect,
		onsearch,
		'onpage-change': onPageChange,
		children,
		header,
		thead,
		row,
		paginationSlot
	}: Props = $props();

	let searchQuery = $state('');
	let currentPageState = $state(1);
	const isServerPagination = $derived(pagination && paginationMode === 'server');
	const pageSize = $derived(
		Number.isFinite(itemsPerPage) && itemsPerPage > 0 ? Math.floor(itemsPerPage) : 1
	);

	// ── Row identity ──────────────────────────
	type TableRowIdentity = string | number | TableRow;

	function getRowIdentity(row: TableRow): TableRowIdentity {
		const customKey = rowKey?.(row);
		if (customKey != null) return customKey;
		if (row.id != null) return String(row.id);
		if (row.key != null) return String(row.key);
		return row;
	}

	// ── Processed data ────────────────────────
	const processedData = $derived.by(() => {
		if (!data) return [];

		let result = [...data];

		if (searchQuery && search && !isServerPagination) {
			const query = searchQuery
				.toLowerCase()
				.trim(); /* FIX(S1): trim for filtering, not for mutation */
			result = result.filter((item) =>
				Object.values(item).some((val) => String(val).toLowerCase().includes(query))
			);
		}

		return result;
	});

	const totalItems = $derived(
		isServerPagination ? (totalItemsProp ?? processedData.length) : processedData.length
	);
	const totalPages = $derived(totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize));
	const activePage = $derived.by(() => {
		if (totalPages === 0) return 1;
		const requestedPage = isServerPagination ? controlledPage : currentPageState;
		return Math.min(Math.max(1, requestedPage), totalPages);
	});

	const currentPageData = $derived.by(() => {
		if (!pagination) return processedData;
		if (isServerPagination) return processedData;
		const start = (activePage - 1) * pageSize;
		return processedData.slice(start, start + pageSize);
	});

	const isAllSelected = $derived.by(() => {
		if (!data || !selectable || currentPageData.length === 0) return false;
		return currentPageData.every((item) => isRowSelected(item));
	});

	const isPartiallySelected = $derived.by(() => {
		if (!data || !selectable) return false;
		const count = currentPageData.filter((item) => isRowSelected(item)).length;
		return count > 0 && count < currentPageData.length;
	});

	const paginationData = $derived({
		currentPage: activePage,
		totalPages,
		itemsPerPage: pageSize,
		totalItems
	});

	const pageNumbers = $derived.by(() => {
		if (totalPages <= 5) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}
		if (activePage <= 3) return [1, 2, 3, 4, 5];
		if (activePage >= totalPages - 2) {
			return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
		}
		return [activePage - 2, activePage - 1, activePage, activePage + 1, activePage + 2];
	});

	const hasRowInteraction = $derived(!!onRowClick || !!onRowDblClick || !!onRowContextMenu);
	const hasKeyboardRowAction = $derived(!!onRowClick);

	const tableClasses = $derived(
		[
			'lumi-table',
			layout === 'fixed' && 'lumi-table--layout-fixed',
			compact && 'lumi-table--compact',
			stripe && 'lumi-table--stripe',
			hover && 'lumi-table--hover',
			className
		]
			.filter(Boolean)
			.join(' ')
	);

	// ── Event handlers ────────────────────────

	/* FIX(S1): Don't mutate searchQuery — let user type freely including spaces */
	function handleSearch(): void {
		onsearch?.(searchQuery.trim());
		if (!pagination) return;
		if (isServerPagination) {
			onPageChange?.(1);
		} else {
			currentPageState = 1;
		}
	}

	function toggleSelectAll(checked: boolean): void {
		if (!data || !selectable) return;

		if (checked) {
			const selectedKeys = new Set(selected.map((r) => getRowIdentity(r)));
			const newSelections = currentPageData.filter(
				(r) => !selectedKeys.has(getRowIdentity(r))
			);
			selected = [...selected, ...newSelections];
		} else {
			const pageKeys = new Set(currentPageData.map((r) => getRowIdentity(r)));
			selected = selected.filter((item) => !pageKeys.has(getRowIdentity(item)));
		}
	}

	function handleSelectCellClick(event: MouseEvent): void {
		event.stopPropagation();
	}

	function isInteractiveTarget(target: EventTarget | null): boolean {
		if (typeof Element === 'undefined' || !(target instanceof Element)) return false;
		return Boolean(
			target.closest(
				'button, a, input, select, textarea, summary, [role="button"], [role="link"], [contenteditable="true"]'
			)
		);
	}

	function handleRowClick(event: MouseEvent, row: TableRow, index: number): void {
		if (isInteractiveTarget(event.target)) return;
		onRowClick?.(row, index);
	}

	function handleRowDblClick(event: MouseEvent, row: TableRow, index: number): void {
		if (isInteractiveTarget(event.target)) return;
		onRowDblClick?.(row, index);
	}

	function handleRowContextMenu(event: MouseEvent, row: TableRow, index: number): void {
		if (!onRowContextMenu) return;
		if (isInteractiveTarget(event.target)) return;
		event.preventDefault();
		onRowContextMenu(event, row, index);
	}

	function handleRowKeydown(event: KeyboardEvent, row: TableRow, index: number): void {
		if (!onRowClick) return;
		if (isInteractiveTarget(event.target)) return;
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onRowClick?.(row, index);
		}
	}

	function handleRowSelect(row: TableRow, checked: boolean): void {
		if (!selectable) return;

		const identity = getRowIdentity(row);
		const index = selected.findIndex((item) => getRowIdentity(item) === identity);

		if (checked && index === -1) {
			selected = [...selected, row];
		} else if (!checked && index > -1) {
			selected = selected.filter((_, i) => i !== index);
		}

		onRowSelect?.(row, checked);
	}

	function isRowSelected(row: TableRow): boolean {
		if (!selectable) return false;
		const identity = getRowIdentity(row);
		return selected.some((item) => getRowIdentity(item) === identity);
	}

	function goToPage(page: number): void {
		if (page < 1 || page > totalPages) return;
		if (!isServerPagination) currentPageState = page;
		onPageChange?.(page);
	}

	// ── Effects ───────────────────────────────
	$effect(() => {
		if (!pagination) return;
		if (isServerPagination) return;
		if (totalPages === 0 && currentPageState !== 1) {
			currentPageState = 1;
		} else if (totalPages > 0 && currentPageState > totalPages) {
			currentPageState = totalPages;
		}
	});
</script>

<div class={tableClasses}>
	{#if search || header}
		<header class="lumi-table__header">
			{#if header}
				{@render header()}
			{/if}
			{#if search}
				<div class="lumi-table__search">
					<Input
						bind:value={searchQuery}
						placeholder={searchPlaceholder}
						size="sm"
						icon="search"
						oninput={handleSearch}
					/>
				</div>
			{/if}
		</header>
	{/if}

	<div class="lumi-table__wrapper" aria-busy={loading}>
		{#if loading}
			<div class="lumi-table__loading" role="status">
				<div class="lumi-table__spinner"></div>
				<span>{loadingText}</span>
			</div>
		{:else}
			<table class="lumi-table__content">
				{#if selectable || thead}
					<thead class="lumi-table__thead">
						<tr>
							{#if selectable}
								<th class="lumi-table__th lumi-table__th--select" scope="col">
									<Checkbox
										aria-label="Select all rows"
										checked={isAllSelected}
										indeterminate={isPartiallySelected}
										size="sm"
										onchange={toggleSelectAll}
									/>
								</th>
							{/if}
							{#if thead}
								{@render thead()}
							{/if}
						</tr>
					</thead>
				{/if}
				<tbody class="lumi-table__tbody">
					{#if data && currentPageData.length > 0}
						{#each currentPageData as rowData, index (getRowIdentity(rowData))}
							{@const isSelected = isRowSelected(rowData)}
							<tr
								class="lumi-table__row"
								class:lumi-table__row--selected={isSelected}
								class:lumi-table__row--clickable={hasRowInteraction}
								tabindex={hasKeyboardRowAction ? 0 : undefined}
								aria-selected={selectable ? isSelected : undefined}
								onclick={(event) => handleRowClick(event, rowData, index)}
								ondblclick={(event) => handleRowDblClick(event, rowData, index)}
								oncontextmenu={(event) => handleRowContextMenu(event, rowData, index)}
								onkeydown={(e) => handleRowKeydown(e, rowData, index)}
							>
								{#if selectable}
									<td class="lumi-table__td lumi-table__td--select" onclick={handleSelectCellClick}>
										<Checkbox
											aria-label={`Select row ${index + 1}`}
											checked={isSelected}
											size="sm"
											onchange={(checked) => handleRowSelect(rowData, checked)}
										/>
									</td>
								{/if}
								{#if row}
									{@render row({ row: rowData, index })}
								{:else}
									{#each Object.entries(rowData) as [key, cellValue], cellIndex (`cell-${cellIndex}`)}
										{#if key !== 'id' && key !== 'key'}
											<td class="lumi-table__td">{cellValue}</td>
										{/if}
									{/each}
								{/if}
							</tr>
						{/each}
					{:else if !data}
						{#if children}
							{@render children()}
						{/if}
					{/if}
				</tbody>
			</table>

			{#if data && totalItems === 0}
				<div class="lumi-table__empty" role="status" aria-live="polite">
					<div class="lumi-table__empty-icon" aria-hidden="true">
						<Icon icon="inbox" size="2xl" />
					</div>
					<span class="lumi-table__empty-text">{noDataText}</span>
				</div>
			{/if}
		{/if}
	</div>

	{#if pagination && !loading}
		<div class="lumi-table__pagination" aria-label="Table pagination">
			{#if paginationSlot}
				{@render paginationSlot(paginationData)}
			{:else}
				<div class="lumi-table__pagination-info">
					<span class="lumi-table__pagination-text">
						{#if totalItems === 0}
							{noResultsText}
						{:else}
							{showingLabel}
								{(activePage - 1) * pageSize + 1}–{Math.min(
									activePage * pageSize,
								totalItems
							)}
							{ofLabel}
							{totalItems}
						{/if}
					</span>
				</div>

				{#if totalPages > 1}
					<nav class="lumi-table__pagination-controls" aria-label="Page navigation">
						<Button
							size="sm"
							type="border"
							icon="chevronLeft"
							disabled={activePage === 1}
							onclick={() => goToPage(activePage - 1)}
							aria-label="Previous page"
						/>

						<div class="lumi-table__pagination-pages">
							{#each pageNumbers as page (page)}
								<!-- FIX(M1): explicit type="button" prevents form submission -->
								<button
									type="button"
									class="lumi-table__pagination-page"
									class:lumi-table__pagination-page--active={activePage === page}
									aria-current={activePage === page ? 'page' : undefined}
									aria-label={`Page ${page}`}
									onclick={() => goToPage(page)}
								>
									{page}
								</button>
							{/each}
						</div>

						<Button
							size="sm"
							type="border"
							icon="chevronRight"
							disabled={activePage === totalPages}
							onclick={() => goToPage(activePage + 1)}
							aria-label="Next page"
						/>
					</nav>
				{/if}
			{/if}
		</div>
	{/if}
</div>

<style>
	/* ============================================================================
	 * TABLE COMPONENT — Lumi UI
	 * All values reference design tokens for 100% system coherence.
	 * ============================================================================ */

	.lumi-table {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-md);
		font-family: var(--lumi-font-family-sans);
		/* FIX(C8): removed --table-row-lift (transform on <tr> is undefined per CSS spec) */
		--table-row-hover-bg: color-mix(
			in srgb,
			var(--lumi-color-primary) 2%,
			var(--lumi-color-surface-card)
		);
		--table-row-active-bg: color-mix(
			in srgb,
			var(--lumi-color-primary) 6%,
			var(--lumi-color-surface-card)
		);
	}

	/* ── Header ───────────────────────────────── */

	.lumi-table__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--lumi-space-md);
		flex-wrap: wrap;
	}

	/* FIX(C4): rem instead of px */
	.lumi-table__search {
		flex: 1;
		max-width: var(--lumi-centered-card-width-sm);
		min-width: var(--lumi-min-width-md);
	}

	/* ── Table wrapper ────────────────────────── */

	.lumi-table__wrapper {
		position: relative;
		width: 100%;
		background: var(--lumi-gradient-subtle), var(--lumi-color-surface-card);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border-glass);
		border-radius: var(--lumi-radius-2xl);
		overflow-x: auto;
	}

	/* ── Table content ────────────────────────── */

	.lumi-table__content {
		width: 100%;
		border-collapse: collapse;
		min-width: 100%;
	}

	.lumi-table--layout-fixed .lumi-table__content {
		table-layout: fixed;
		/* Honor column min-widths; grow past 100% when needed — wrapper scrolls horizontally */
		min-width: max(100%, min-content);
	}

	.lumi-table--layout-fixed .lumi-table__thead :global(.lumi-table-column--main),
	.lumi-table--layout-fixed .lumi-table__tbody :global(.lumi-table-column--main) {
		width: var(--lumi-table-column-main-width, 48%);
		min-width: var(--lumi-table-column-main-min-width);
	}

	.lumi-table--layout-fixed .lumi-table__thead :global(.lumi-table-column--actions) {
		width: var(--lumi-table-column-actions-width, calc(var(--lumi-space-6xl) * 1.35));
	}

	.lumi-table--layout-fixed .lumi-table__thead :global(.lumi-table-column--compact) {
		width: var(--lumi-table-column-compact-width, calc(var(--lumi-space-6xl) * 1.05));
	}

	/* ── Table header ─────────────────────────── */

	.lumi-table__thead {
		background:
			linear-gradient(
				145deg,
				color-mix(in srgb, var(--lumi-color-surface-glass-strong) 88%, transparent) 0%,
				color-mix(in srgb, var(--lumi-color-background-hover) 68%, transparent) 100%
			),
			var(--lumi-color-surface-glass-strong);
		border-bottom: var(--lumi-border-width-thin) solid var(--lumi-color-border-strong);
		position: sticky;
		top: 0;
		z-index: var(--lumi-z-base); /* FIX(C5) */
	}

	/* FIX(C6): letter-spacing uses token */
	.lumi-table__th,
	.lumi-table__thead :global(th) {
		padding: var(--lumi-space-md) var(--lumi-space-lg);
		text-align: left;
		font-size: var(--lumi-font-size-xs);
		font-weight: var(--lumi-font-weight-bold);
		color: color-mix(in srgb, var(--lumi-color-text) 72%, var(--lumi-color-primary));
		text-transform: uppercase;
		letter-spacing: var(--lumi-letter-spacing-wider);
		white-space: nowrap;
		background: transparent;
	}

	/* ── Body rows ────────────────────────────── */

	/* FIX(C1): tokenized transitions; FIX(C8): removed transform from transition */
	.lumi-table__tbody .lumi-table__row {
		border-bottom: var(--lumi-border-width-thin) solid
			color-mix(in srgb, var(--lumi-color-border) 72%, transparent);
		border-left: var(--lumi-border-width-thick) solid transparent;
		transition:
			background-color var(--lumi-duration-fast) var(--lumi-easing-default),
			border-left-color var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	.lumi-table__tbody .lumi-table__row:last-child {
		border-bottom: none;
	}

	.lumi-table__row--clickable {
		cursor: pointer;
	}

	/* FIX(C9): tokenized outline-offset */
	.lumi-table__row--clickable:focus-visible {
		outline: var(--lumi-border-width-thick) solid
			color-mix(in srgb, var(--lumi-color-primary) 35%, transparent);
		outline-offset: calc(var(--lumi-border-width-thick) * -1);
		border-radius: var(--lumi-radius-sm);
	}

	/* Hover — FIX(C8): removed transform, background + border accent only */
	.lumi-table--hover .lumi-table__tbody .lumi-table__row:hover {
		background: var(--table-row-hover-bg);
		border-left-color: color-mix(in srgb, var(--lumi-color-primary) 18%, var(--lumi-color-border));
	}

	.lumi-table__tbody .lumi-table__row.lumi-table__row--selected {
		background: var(--table-row-active-bg);
		border-left-color: var(--lumi-color-primary);
		box-shadow: inset 0 0 0 var(--lumi-border-width-thin)
			color-mix(in srgb, var(--lumi-color-primary) 18%, transparent);
	}

	.lumi-table--hover .lumi-table__tbody .lumi-table__row.lumi-table__row--selected:hover {
		background: var(--table-row-active-bg);
	}

	/* Stripe */
	.lumi-table--stripe
		.lumi-table__tbody
		.lumi-table__row:nth-child(even):not(.lumi-table__row--selected) {
		background: color-mix(in srgb, var(--lumi-color-background-hover) 44%, transparent);
	}

	/* ── Table cells ──────────────────────────── */

	.lumi-table__td,
	.lumi-table__tbody :global(td) {
		padding: var(--lumi-space-md) var(--lumi-space-lg);
		font-size: var(--lumi-font-size-sm);
		color: var(--lumi-color-text);
		vertical-align: middle;
		min-width: 0;
	}

	/* FIX(C2): tokenized width */
	.lumi-table__th--select,
	.lumi-table__td--select {
		width: var(--lumi-space-3xl);
		padding-right: var(--lumi-space-xs);
		text-align: center;
	}

	/* Compact */
	.lumi-table--compact .lumi-table__th,
	.lumi-table--compact .lumi-table__thead :global(th),
	.lumi-table--compact .lumi-table__td,
	.lumi-table--compact .lumi-table__tbody :global(td) {
		padding: var(--lumi-space-sm) var(--lumi-space-md);
		font-size: var(--lumi-font-size-xs);
	}

	/* ── Loading ──────────────────────────────── */

	.lumi-table__loading {
		padding: var(--lumi-space-4xl);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--lumi-space-md);
		color: var(--lumi-color-text-muted);
		font-size: var(--lumi-font-size-sm);
	}

	/* FIX(C3): tokenized spinner size */
	.lumi-table__spinner {
		width: var(--lumi-icon-lg);
		height: var(--lumi-icon-lg);
		border: var(--lumi-border-width-thick) solid var(--lumi-color-border);
		border-top-color: var(--lumi-color-primary);
		border-radius: var(--lumi-radius-full);
		animation: lumi-table-spin var(--lumi-duration-slower) linear infinite;
	}

	@keyframes lumi-table-spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* ── Empty state ──────────────────────────── */

	.lumi-table__empty {
		padding: var(--lumi-space-4xl);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--lumi-space-md);
	}

	/* FIX(C7): tokenized opacity */
	.lumi-table__empty-icon {
		color: var(--lumi-color-text-muted);
		opacity: var(--lumi-opacity-muted);
	}

	.lumi-table__empty-text {
		font-size: var(--lumi-font-size-sm);
		color: var(--lumi-color-text-muted);
		font-weight: var(--lumi-font-weight-medium);
	}

	/* ── Pagination ───────────────────────────── */

	.lumi-table__pagination {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--lumi-space-md);
		padding-top: var(--lumi-space-sm);
	}

	.lumi-table__pagination-info {
		display: flex;
		align-items: center;
	}

	.lumi-table__pagination-text {
		font-size: var(--lumi-font-size-xs);
		color: var(--lumi-color-text-muted);
	}

	.lumi-table__pagination-controls {
		display: flex;
		align-items: center;
		gap: var(--lumi-space-xs);
	}

	.lumi-table__pagination-pages {
		display: flex;
		align-items: center;
		gap: var(--lumi-space-2xs);
	}

	/* FIX(C1): tokenized transitions */
	.lumi-table__pagination-page {
		min-width: var(--lumi-space-xl);
		height: var(--lumi-space-xl);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-family: var(--lumi-font-family-sans);
		font-size: var(--lumi-font-size-xs);
		font-weight: var(--lumi-font-weight-medium);
		color: var(--lumi-color-text-muted);
		background: transparent;
		border: var(--lumi-border-width-thin) solid transparent;
		border-radius: var(--lumi-radius-md);
		cursor: pointer;
		transition:
			background-color var(--lumi-duration-fast) var(--lumi-easing-default),
			color var(--lumi-duration-fast) var(--lumi-easing-default),
			border-color var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	.lumi-table__pagination-page:hover:not(.lumi-table__pagination-page--active) {
		background: var(--lumi-color-background-hover);
		color: var(--lumi-color-text);
	}

	/* FIX(C9): tokenized outline-offset */
	.lumi-table__pagination-page:focus-visible {
		outline: var(--lumi-border-width-thick) solid
			color-mix(in srgb, var(--lumi-color-primary) 35%, transparent);
		outline-offset: var(--lumi-border-width-thin);
	}

	.lumi-table__pagination-page--active {
		background: var(--lumi-color-primary);
		color: var(--lumi-color-primary-foreground);
		font-weight: var(--lumi-font-weight-semibold);
		border-color: var(--lumi-color-primary);
	}

	/* ── Responsive ───────────────────────────── */
	/* NOTE(C10): 48rem is the tablet breakpoint; CSS vars can't be used in @media */
	@media (max-width: 48rem) {
		.lumi-table__header {
			flex-direction: column;
			align-items: stretch;
		}

		.lumi-table__search {
			max-width: none;
			min-width: 0;
		}

		.lumi-table__pagination {
			flex-direction: column;
			gap: var(--lumi-space-sm);
		}

		.lumi-table__pagination-pages {
			display: none;
		}

		.lumi-table--layout-fixed .lumi-table__thead :global(.lumi-table-column--compact) {
			width: var(--lumi-table-column-compact-width-sm);
		}
	}

	/* ── Reduced motion ───────────────────────── */

	@media (prefers-reduced-motion: reduce) {
		.lumi-table__tbody .lumi-table__row,
		.lumi-table__pagination-page {
			transition: none;
		}

		.lumi-table__spinner {
			animation: none;
		}
	}
</style>
