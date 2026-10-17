<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = {
		loading: en.loading,
		noData: en.noData,
		noResults: en.noResults,
		search: en.search,
		tableSelectAll: en.tableSelectAll,
		tableSelectRow: en.tableSelectRow,
		paginationRange: en.paginationRange
	};

	const SKELETON_ROWS = 3;
	const INTERACTIVE =
		'.lumi-table__td--select, button, a, label, input, select, textarea, summary, [role="button"], [role="link"], [contenteditable]:not([contenteditable="false"])';

	/** Whether an event started inside a nested control that owns it. */
	function fromControl(event: Event): boolean {
		return (
			event.target instanceof Element && !!event.target.closest(INTERACTIVE)
		);
	}

	function toInteger(value: unknown, min: number, fallback: number): number {
		return typeof value === 'number' && Number.isFinite(value)
			? Math.max(min, Math.floor(value))
			: fallback;
	}
</script>

<script lang="ts" generics="TRow extends object">
	import Inbox from '@lucide/svelte/icons/inbox';
	import Search from '@lucide/svelte/icons/search';
	import { useLumiLocale } from '../../i18n';
	import Checkbox from '../Checkbox/Checkbox.svelte';
	import Icon from '../Icon/Icon.svelte';
	import Input from '../Input/Input.svelte';
	import Pagination from '../Pagination/Pagination.svelte';
	import type { TableProps } from './types';

	let {
		layout = 'auto',
		compact = false,
		stripe = false,
		hover = false,
		search = false,
		selectable = false,
		pagination = false,
		paginationMode = 'client',
		noDataText,
		noResultsText,
		searchPlaceholder,
		data,
		itemsPerPage = 10,
		currentPage = 1,
		totalItems,
		loading = false,
		rowKey,
		selected = $bindable([]),
		class: className = '',
		'aria-label': ariaLabel,
		onrowclick,
		onrowdblclick,
		onrowcontextmenu,
		onrowselect,
		onsearch,
		onpagechange,
		children,
		header,
		thead,
		row
	}: TableProps<TRow> = $props();

	const i18n = useLumiLocale(COPY);
	let query = $state('');
	let localPage = $state(1);

	const server = $derived(pagination && paginationMode === 'server');
	const pageSize = $derived(toInteger(itemsPerPage, 1, 1));

	function identity(item: TRow): string | number | TRow {
		const custom = rowKey?.(item);
		if (custom != null) return custom;
		for (const field of ['id', 'key']) {
			const candidate = Reflect.get(item, field);
			if (typeof candidate === 'string' || typeof candidate === 'number') {
				return candidate;
			}
		}
		return item;
	}

	const filtered = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		if (!data || !needle || !search || server) return data ?? [];
		return data.filter((item) =>
			Object.values(item).some((cell) =>
				String(cell).toLowerCase().includes(needle)
			)
		);
	});
	const total = $derived(
		server && totalItems != null ? toInteger(totalItems, 0, 0) : filtered.length
	);
	const pages = $derived(Math.ceil(total / pageSize));
	const page = $derived(
		Math.min(
			Math.max(1, toInteger(server ? currentPage : localPage, 1, 1)),
			Math.max(1, pages)
		)
	);
	const rows = $derived(
		pagination && !server
			? filtered.slice((page - 1) * pageSize, page * pageSize)
			: filtered
	);

	const selectedKeys = $derived(new Set(selected.map(identity)));
	const isSelected = (item: TRow) => selectedKeys.has(identity(item));
	const pageSelected = $derived(
		selectable ? rows.filter(isSelected).length : 0
	);

	const primaryAction = $derived(onrowclick ?? onrowdblclick);
	const keyboardRows = $derived(!!primaryAction || !!onrowcontextmenu);
	const showSelection = $derived(selectable || selected.length > 0);
	const emptyText = $derived(
		search && query.trim()
			? (noResultsText ?? i18n.t.noResults)
			: (noDataText ?? i18n.t.noData)
	);

	function goTo(next: number): void {
		if (!server) localPage = next;
		onpagechange?.(next);
	}

	function handleSearch(): void {
		onsearch?.(query.trim());
		if (pagination && page !== 1) goTo(1);
	}

	function toggleAll(checked: boolean): void {
		const changed = rows.filter((item) => isSelected(item) !== checked);
		if (checked) {
			selected = [...selected, ...changed];
		} else {
			const keys = new Set(changed.map(identity));
			selected = selected.filter((item) => !keys.has(identity(item)));
		}
		for (const item of changed) onrowselect?.(item, checked);
	}

	function toggleRow(item: TRow, checked: boolean): void {
		const key = identity(item);
		selected = checked
			? [...selected, item]
			: selected.filter((entry) => identity(entry) !== key);
		onrowselect?.(item, checked);
	}

	function handleRowKeydown(event: KeyboardEvent, item: TRow, index: number) {
		if (event.defaultPrevented || fromControl(event)) return;
		if (
			onrowcontextmenu &&
			(event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10'))
		) {
			event.preventDefault();
			const target = event.currentTarget as HTMLElement;
			const rect = target.getBoundingClientRect();
			target.dispatchEvent(
				new MouseEvent('contextmenu', {
					bubbles: true,
					cancelable: true,
					clientX: rect.left,
					clientY: rect.bottom
				})
			);
		} else if (primaryAction && (event.key === 'Enter' || event.key === ' ')) {
			event.preventDefault();
			primaryAction(item, index);
		}
	}

	function handleContextMenu(event: MouseEvent, item: TRow, index: number) {
		if (!onrowcontextmenu || event.defaultPrevented || fromControl(event)) {
			return;
		}
		event.preventDefault();
		onrowcontextmenu(event, item, index);
	}

	// Server pages beyond the end (e.g. last row deleted) request the last one.
	$effect(() => {
		if (server && pages > 0 && page !== toInteger(currentPage, 1, 1)) {
			onpagechange?.(page);
		}
	});

	// Keep local paging inside the range as data shrinks.
	$effect(() => {
		if (pagination && !server && localPage !== page) localPage = page;
	});
</script>

<div
	class={[
		'lumi-table',
		layout === 'fixed' && 'lumi-table--layout-fixed',
		compact && 'lumi-table--compact',
		stripe && 'lumi-table--stripe',
		hover && 'lumi-table--hover',
		className
	]}
>
	{#if search || header}
		<div class="lumi-table__header">
			{@render header?.()}
			{#if search}
				<Input
					bind:value={query}
					type="search"
					size="sm"
					icon={Search}
					placeholder={searchPlaceholder ?? i18n.t.search}
					class="lumi-table__search"
					oninput={handleSearch}
				/>
			{/if}
		</div>
	{/if}

	<div class="lumi-table__wrapper" aria-busy={loading || undefined}>
		<table class="lumi-table__content" aria-label={ariaLabel}>
			{#if selectable || thead}
				<thead class="lumi-table__thead">
					<tr>
						{#if selectable}
							<th class="lumi-table__th lumi-table__th--select" scope="col">
								<Checkbox
									aria-label={i18n.t.tableSelectAll}
									checked={pageSelected > 0 && pageSelected === rows.length}
									indeterminate={pageSelected > 0 && pageSelected < rows.length}
									size="sm"
									disabled={loading}
									onchange={toggleAll}
								/>
							</th>
						{/if}
						{@render thead?.()}
					</tr>
				</thead>
			{/if}
			<tbody class="lumi-table__tbody">
				{#if loading}
					<!-- Skeleton rows render below the table, keeping column widths. -->
				{:else if data}
					{#each rows as item, index (identity(item))}
						{@const checked = isSelected(item)}
						<tr
							class={[
								'lumi-table__row',
								checked && 'lumi-table__row--selected',
								primaryAction && 'lumi-table__row--clickable'
							]}
							tabindex={keyboardRows ? 0 : undefined}
							aria-selected={showSelection ? checked : undefined}
							onclick={(event) => {
								if (!event.defaultPrevented && !fromControl(event)) {
									onrowclick?.(item, index);
								}
							}}
							ondblclick={(event) => {
								if (!event.defaultPrevented && !fromControl(event)) {
									onrowdblclick?.(item, index);
								}
							}}
							oncontextmenu={(event) => handleContextMenu(event, item, index)}
							onkeydown={(event) => handleRowKeydown(event, item, index)}
						>
							{#if selectable}
								<td class="lumi-table__td lumi-table__td--select">
									<Checkbox
										aria-label={i18n.t.tableSelectRow(index + 1)}
										{checked}
										size="sm"
										onchange={(next) => toggleRow(item, next)}
									/>
								</td>
							{/if}
							{#if row}
								{@render row({ row: item, index })}
							{:else}
								{#each Object.entries(item) as [field, cell] (field)}
									{#if field !== 'id' && field !== 'key'}
										<td class="lumi-table__td">{cell}</td>
									{/if}
								{/each}
							{/if}
						</tr>
					{/each}
				{:else}
					{@render children?.()}
				{/if}
			</tbody>
		</table>

		{#if loading}
			<div class="lumi-table__loading" role="status">
				<span class="lumi-sr-only">{i18n.t.loading}</span>
				{#each { length: SKELETON_ROWS }, index (index)}
					<span class="lumi-skeleton lumi-skeleton--text" aria-hidden="true"
					></span>
				{/each}
			</div>
		{:else if data && total === 0}
			<div class="lumi-table__empty" role="status">
				<span class="lumi-table__empty-icon" aria-hidden="true">
					<Icon icon={Inbox} size="xl" />
				</span>
				{emptyText}
			</div>
		{/if}
	</div>

	{#if pagination && total > 0}
		<div class="lumi-table__footer">
			<span class="lumi-table__range">
				{i18n.t.paginationRange(
					(page - 1) * pageSize + 1,
					Math.min(page * pageSize, total),
					total
				)}
			</span>
			{#if pages > 1}
				<Pagination
					{page}
					{pages}
					disabled={loading}
					class="lumi-table__pagination"
					onpagechange={goTo}
				/>
			{/if}
		</div>
	{/if}
</div>

<style>
	.lumi-table {
		--lumi-table-column-main-width: 48%;
		--lumi-table-column-main-min-width: 10rem;
		--lumi-table-column-actions-width: calc(
			var(--lumi-space-6xl) + var(--lumi-space-xl)
		);
		--lumi-table-column-compact-width: calc(
			var(--lumi-space-6xl) + var(--lumi-space-2xs)
		);
		--lumi-table-cell-padding: var(--lumi-space-md) var(--lumi-space-lg);
		--lumi-table-cell-font: var(--lumi-font-size-sm);
		--lumi-table-row-hover: color-mix(
			in srgb,
			var(--lumi-color-primary) 6%,
			var(--lumi-color-surface-card)
		);
		--lumi-table-row-selected: color-mix(
			in srgb,
			var(--lumi-color-primary) 11%,
			var(--lumi-color-surface-card)
		);
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-md);
		inline-size: 100%;
		min-inline-size: 0;
		font-family: var(--lumi-font-family-sans);
	}

	.lumi-table--compact {
		--lumi-table-cell-padding: var(--lumi-space-sm) var(--lumi-space-md);
		--lumi-table-cell-font: var(--lumi-font-size-xs);
	}

	/* Header toolbar: wraps to a column on its own when space runs out. */
	.lumi-table__header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--lumi-space-md);
	}

	.lumi-table__header :global(.lumi-table__search) {
		flex: 1 1 var(--lumi-min-width-md);
		max-inline-size: var(--lumi-centered-card-width-sm);
	}

	.lumi-table__wrapper {
		position: relative;
		inline-size: 100%;
		overflow-x: auto;
		background: var(--lumi-gradient-subtle), var(--lumi-color-surface-card);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border-glass);
		border-radius: var(--lumi-surface-radius);
		box-shadow: var(--lumi-shadow-sm);
	}

	.lumi-table__content {
		inline-size: 100%;
		border-collapse: collapse;
	}

	.lumi-table--layout-fixed .lumi-table__content {
		table-layout: fixed;
		/* Honor column minimums; the wrapper scrolls past 100%. */
		min-inline-size: max(100%, min-content);
	}

	.lumi-table--layout-fixed :global(.lumi-table-column--main) {
		inline-size: var(--lumi-table-column-main-width);
		min-inline-size: var(--lumi-table-column-main-min-width);
	}

	.lumi-table--layout-fixed :global(th.lumi-table-column--actions) {
		inline-size: var(--lumi-table-column-actions-width);
	}

	.lumi-table--layout-fixed :global(th.lumi-table-column--compact) {
		inline-size: var(--lumi-table-column-compact-width);
	}

	.lumi-table__thead {
		background:
			linear-gradient(
				145deg,
				color-mix(
					in srgb,
					var(--lumi-color-surface-glass-strong) 88%,
					transparent
				),
				color-mix(in srgb, var(--lumi-color-background-hover) 68%, transparent)
			),
			var(--lumi-color-surface-glass-strong);
		border-block-end: var(--lumi-border-width-thin) solid
			var(--lumi-color-border-strong);
	}

	.lumi-table__th,
	.lumi-table__thead :global(th) {
		padding: var(--lumi-table-cell-padding);
		font-size: var(--lumi-font-size-xs);
		font-weight: var(--lumi-font-weight-semibold);
		letter-spacing: var(--lumi-letter-spacing-wide);
		color: color-mix(
			in srgb,
			var(--lumi-color-text) 72%,
			var(--lumi-color-primary)
		);
		text-align: start;
		white-space: nowrap;
	}

	.lumi-table__td,
	.lumi-table__tbody :global(td) {
		padding: var(--lumi-table-cell-padding);
		font-size: var(--lumi-table-cell-font);
		color: var(--lumi-color-text);
		vertical-align: middle;
	}

	.lumi-table__th--select,
	.lumi-table__td--select {
		inline-size: var(--lumi-space-3xl);
		padding-inline-end: var(--lumi-space-xs);
		text-align: center;
	}

	/* Rows: hairline separators and an inline-start accent (mirrors in RTL). */
	.lumi-table__row {
		border-block-end: var(--lumi-border-width-thin) solid
			color-mix(in srgb, var(--lumi-color-border) 72%, transparent);
		border-inline-start: var(--lumi-border-width-thick) solid transparent;
		transition: var(--lumi-transition-control);
	}

	.lumi-table__row:last-child {
		border-block-end: 0;
	}

	.lumi-table__row--clickable {
		cursor: pointer;
	}

	.lumi-table__row:focus-visible {
		outline: var(--lumi-focus-outline);
		outline-offset: calc(var(--lumi-border-width-thick) * -1);
	}

	.lumi-table--hover .lumi-table__row:hover {
		background: var(--lumi-table-row-hover);
		border-inline-start-color: color-mix(
			in srgb,
			var(--lumi-color-primary) 18%,
			var(--lumi-color-border)
		);
	}

	.lumi-table--stripe .lumi-table__row:nth-child(even) {
		background: color-mix(
			in srgb,
			var(--lumi-color-text) 4%,
			var(--lumi-color-surface-card)
		);
	}

	.lumi-table .lumi-table__row.lumi-table__row--selected {
		background: var(--lumi-table-row-selected);
		border-inline-start-color: var(--lumi-color-primary);
	}

	.lumi-table__loading {
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-md);
		padding: var(--lumi-table-cell-padding);
	}

	/* Empty state */
	.lumi-table__empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--lumi-space-md);
		padding: var(--lumi-space-4xl) var(--lumi-space-lg);
		font-size: var(--lumi-font-size-sm);
		font-weight: var(--lumi-font-weight-medium);
		color: var(--lumi-color-text-muted);
	}

	.lumi-table__empty-icon {
		display: inline-grid;
		place-items: center;
		padding: var(--lumi-space-sm);
		color: var(--lumi-color-primary);
		background: var(--lumi-color-primary-bg);
		border-radius: var(--lumi-radius-full);
	}

	/* Footer: range on the start edge, pages on the end edge; wraps naturally. */
	.lumi-table__footer {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--lumi-space-sm) var(--lumi-space-md);
	}

	.lumi-table__range {
		font-size: var(--lumi-font-size-xs);
		color: var(--lumi-color-text-muted);
	}

	.lumi-table__footer :global(.lumi-table__pagination) {
		flex: 1 1 auto;
		inline-size: auto;
		justify-content: flex-end;
	}
</style>
