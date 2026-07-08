<script lang="ts" generics="TItem">
	import { onDestroy } from 'svelte';
	import Select from './Select.svelte';
	import type { SelectOption } from './types';

	export type RemoteSelectSearchParamValue = string | number | boolean | null | undefined;
	export type RemoteSelectSearchParams = Record<string, RemoteSelectSearchParamValue>;

	export interface RemoteSelectProps<TItem> {
		value?: string;
		selected?: TItem | null;
		endpoint: string;
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		clearable?: boolean;
		minQueryLength: number;
		debounceMs: number;
		limit: number;
		noResultsText?: string;
		searchParam?: string;
		errorMessageFallback: string;
		getOptionValue: (item: TItem) => string;
		getOptionLabel: (item: TItem) => string;
		getOptionDisabled?: (item: TItem) => boolean;
		getSearchParams?: () => RemoteSelectSearchParams;
		onchange?: (item: TItem | null) => void;
	}

	let {
		value = $bindable(''),
		selected = $bindable(null),
		endpoint,
		label = '',
		placeholder = '',
		disabled = false,
		clearable = true,
		minQueryLength,
		debounceMs,
		limit,
		noResultsText,
		searchParam = 'q',
		errorMessageFallback,
		getOptionValue,
		getOptionLabel,
		getOptionDisabled,
		getSearchParams,
		onchange
	}: RemoteSelectProps<TItem> = $props();

	let loading = $state(false);
	let errorMessage = $state('');
	let results = $state<TItem[]>([]);
	let appliedQuery = $state('');
	let searchTimer: number | null = null;
	let abortSearch: AbortController | null = null;

	const selectedLabel = $derived(selected ? getOptionLabel(selected) : '');
	const emptyText = $derived(
		appliedQuery.length < minQueryLength
			? `Ingresa ${minQueryLength} caracteres`
			: (noResultsText ?? 'Sin resultados')
	);
	const options = $derived.by<SelectOption[]>(() => {
		const selectedItem = selected;
		const items = selectedItem
			? [
					selectedItem,
					...results.filter((item) => getOptionValue(item) !== getOptionValue(selectedItem))
				]
			: results;

		return items.map((item) => ({
			value: getOptionValue(item),
			label: getOptionLabel(item),
			disabled: getOptionDisabled?.(item) ?? false
		}));
	});

	function clearTimer(): void {
		if (!searchTimer) return;
		window.clearTimeout(searchTimer);
		searchTimer = null;
	}

	function cancelSearch(): void {
		abortSearch?.abort();
		abortSearch = null;
	}

	function clearSelection(): void {
		value = '';
		selected = null;
		results = [];
		onchange?.(null);
	}

	function serializeSearchParams(query: string): string {
			const params: RemoteSelectSearchParams = {
			...getSearchParams?.(),
			[searchParam]: query,
			limit
		};

		return Object.entries(params)
			.flatMap(([key, entryValue]) =>
				entryValue == null
					? []
					: [`${encodeURIComponent(key)}=${encodeURIComponent(String(entryValue))}`]
			)
			.join('&');
	}

	function handleSearch(query: string): void {
		const nextQuery = query.trim();
		appliedQuery = nextQuery;
		errorMessage = '';
		clearTimer();
		cancelSearch();

		if (selected && nextQuery !== selectedLabel.trim()) {
			value = '';
			selected = null;
			onchange?.(null);
		}

		if (nextQuery.length < minQueryLength) {
			loading = false;
			results = [];
			return;
		}

		loading = true;
		searchTimer = window.setTimeout(() => {
			void searchItems(nextQuery);
		}, debounceMs);
	}

	async function searchItems(query: string): Promise<void> {
		abortSearch = new AbortController();
		const signal = abortSearch.signal;

		try {
			const response = await fetch(`${endpoint}?${serializeSearchParams(query)}`, { signal });
			const payload = (await response.json()) as {
				message?: string;
				items?: TItem[];
			};

			if (!response.ok) {
				throw new Error(payload.message || errorMessageFallback);
			}
			if (signal.aborted || query !== appliedQuery) return;

			results = payload.items ?? [];
		} catch (caught) {
			if (signal.aborted || (caught instanceof Error && caught.name === 'AbortError')) return;
			errorMessage = caught instanceof Error ? caught.message : errorMessageFallback;
			results = [];
		} finally {
			if (!signal.aborted) loading = false;
		}
	}

	function handleChange(nextValue: string | number | object | null): void {
		if (typeof nextValue !== 'string') {
			clearSelection();
			return;
		}

		const currentSelected = selected && getOptionValue(selected) === nextValue ? selected : null;
		value = nextValue;
		selected =
			currentSelected ?? results.find((item) => getOptionValue(item) === nextValue) ?? null;
		onchange?.(selected);
	}

	onDestroy(() => {
		clearTimer();
		cancelSearch();
	});
</script>

<Select
	bind:value
	{label}
	{options}
	{placeholder}
	autocomplete
	searchMode="server"
	{loading}
	error={Boolean(errorMessage)}
	{errorMessage}
	noDataText={emptyText}
	{disabled}
	{clearable}
	onsearch={handleSearch}
	onchange={handleChange}
/>
