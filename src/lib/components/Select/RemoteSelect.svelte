<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = {
		noResults: en.noResults,
		selectMinQuery: en.selectMinQuery,
		selectSearchError: en.selectSearchError
	};
</script>

<script lang="ts" generics="TItem">
	import { useLumiLocale } from '../../i18n';
	import Select from './Select.svelte';
	import type { SelectOption, SelectProps } from './types';

	export type RemoteSelectSearchParamValue =
		string | number | boolean | null | undefined;
	export type RemoteSelectSearchParams = Record<
		string,
		RemoteSelectSearchParamValue
	>;

	/** Field props forwarded to the underlying Select. */
	type FieldProps = Pick<
		SelectProps,
		| 'label'
		| 'placeholder'
		| 'name'
		| 'aria-label'
		| 'size'
		| 'color'
		| 'disabled'
		| 'required'
		| 'clearable'
		| 'error'
		| 'hint'
		| 'width'
		| 'class'
	>;

	export interface RemoteSelectProps<TItem> extends FieldProps {
		/** Selected option value (bindable) */
		value?: string;
		/** Selected item (bindable); its label shows without a search */
		selected?: TItem | null;
		/** GET endpoint answering `{ items: TItem[] }` (or `{ message }` on error) */
		endpoint: string;
		/** Characters required before searching @default 1 */
		minQueryLength?: number;
		/** Delay before a request @default 250 */
		debounceMs?: number;
		/** Sent as the `limit` parameter @default 20 */
		limit?: number;
		/** Query parameter name @default 'q' */
		searchParam?: string;
		noResultsText?: string;
		/** Shown when a request fails without a server `message` */
		errorMessageFallback?: string;
		getOptionValue: (item: TItem) => string;
		getOptionLabel: (item: TItem) => string;
		getOptionDisabled?: (item: TItem) => boolean;
		/** Extra query parameters, read on every request */
		getSearchParams?: () => RemoteSelectSearchParams;
		onchange?: (item: TItem | null) => void;
	}

	let {
		value = $bindable(''),
		selected = $bindable(null),
		endpoint,
		error,
		minQueryLength = 1,
		debounceMs = 250,
		limit = 20,
		searchParam = 'q',
		noResultsText,
		errorMessageFallback,
		getOptionValue,
		getOptionLabel,
		getOptionDisabled,
		getSearchParams,
		onchange,
		...field
	}: RemoteSelectProps<TItem> = $props();

	const i18n = useLumiLocale(COPY);
	let loading = $state(false);
	let errorMessage = $state('');
	let results = $state<TItem[]>([]);
	let query = $state('');
	let timer: ReturnType<typeof setTimeout> | undefined;
	let request: AbortController | undefined;

	const emptyText = $derived(
		query.length < minQueryLength
			? i18n.t.selectMinQuery(minQueryLength)
			: (noResultsText ?? i18n.t.noResults)
	);
	const options = $derived.by<SelectOption[]>(() => {
		const current = selected ? getOptionValue(selected) : null;
		const items = selected
			? [
					selected,
					...results.filter((item) => getOptionValue(item) !== current)
				]
			: results;
		return items.map((item) => ({
			value: getOptionValue(item),
			label: getOptionLabel(item),
			disabled: getOptionDisabled?.(item) ?? false
		}));
	});

	function cancel(): void {
		clearTimeout(timer);
		request?.abort();
	}

	function select(item: TItem | null): void {
		selected = item;
		value = item ? getOptionValue(item) : '';
		onchange?.(item);
	}

	function handleSearch(text: string): void {
		query = text.trim();
		errorMessage = '';
		cancel();
		if (selected && query !== getOptionLabel(selected).trim()) select(null);
		if (query.length < minQueryLength) {
			loading = false;
			results = [];
			return;
		}
		loading = true;
		timer = setTimeout(() => void search(query), debounceMs);
	}

	function fail(message: string): void {
		errorMessage = message || errorMessageFallback || i18n.t.selectSearchError;
		results = [];
	}

	async function search(text: string): Promise<void> {
		const controller = (request = new AbortController());
		const params = new URLSearchParams();
		for (const [key, entry] of Object.entries({
			...getSearchParams?.(),
			[searchParam]: text,
			limit
		})) {
			if (entry != null) params.set(key, String(entry));
		}

		try {
			const response = await fetch(`${endpoint}?${params}`, {
				signal: controller.signal
			});
			const payload = (await response.json().catch(() => ({}))) as {
				message?: unknown;
				items?: TItem[];
			};
			if (!response.ok) {
				// Only a server-provided message is user-facing copy.
				fail(typeof payload.message === 'string' ? payload.message : '');
			} else if (text === query) {
				results = payload.items ?? [];
			}
		} catch {
			// Network and parse failures never surface their raw text.
			if (!controller.signal.aborted) fail('');
		} finally {
			if (!controller.signal.aborted) loading = false;
		}
	}

	function handleChange(next: unknown): void {
		if (typeof next !== 'string') {
			results = [];
			select(null);
			return;
		}
		const match = (item: TItem | null) =>
			item && getOptionValue(item) === next ? item : null;
		select(match(selected) ?? results.find(match) ?? null);
	}

	$effect(() => cancel);
</script>

<Select
	{...field}
	value={selected ? getOptionValue(selected) : value}
	{options}
	searchable
	searchMode="server"
	{loading}
	error={errorMessage || error}
	noDataText={emptyText}
	onsearch={handleSearch}
	onchange={handleChange}
/>
