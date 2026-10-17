/**
 * Cached `Intl` formatters. Constructing a formatter costs far more than
 * formatting, so instances are shared per locale + options.
 */

/** Locale and currency used when an app sets none. */
export const DEFAULT_LOCALE = 'en-US';
export const DEFAULT_CURRENCY = 'USD';

// Bounded: request-derived locales must not grow a long-lived SSR process.
const CACHE_LIMIT = 100;
const numberFormats = new Map<string, Intl.NumberFormat>();
const dateFormats = new Map<string, Intl.DateTimeFormat>();

function cached<T>(
	cache: Map<string, T>,
	locale: string,
	options: object,
	create: () => T
): T {
	// Sorted keys: { a, b } and { b, a } share one formatter.
	// oxlint-disable-next-line unicorn/no-array-sort -- Object.keys returns a fresh array
	const key = `${locale}|${JSON.stringify(options, Object.keys(options).sort())}`;
	let formatter = cache.get(key);
	if (!formatter) {
		if (cache.size >= CACHE_LIMIT) cache.clear();
		cache.set(key, (formatter = create()));
	}
	return formatter;
}

/** Shared `Intl.NumberFormat` (numbers, currency, percent, compact). */
export function numberFormat(
	locale: string,
	options: Intl.NumberFormatOptions = {}
): Intl.NumberFormat {
	return cached(
		numberFormats,
		locale,
		options,
		() => new Intl.NumberFormat(locale, options)
	);
}

/** Shared `Intl.DateTimeFormat`. */
export function dateFormat(
	locale: string,
	options: Intl.DateTimeFormatOptions = {}
): Intl.DateTimeFormat {
	return cached(
		dateFormats,
		locale,
		options,
		() => new Intl.DateTimeFormat(locale, options)
	);
}

export type FormatNumberOptions = Intl.NumberFormatOptions & {
	/** BCP 47 tag. @default 'en-US' */
	locale?: string;
};

export type FormatDateOptions = Intl.DateTimeFormatOptions & {
	/** BCP 47 tag. @default 'en-US' */
	locale?: string;
};

/**
 * Format a number with a cached formatter.
 *
 * @example formatNumber(1250.5, { locale: 'es-PE', style: 'currency', currency: 'PEN' }) // "S/ 1,250.50"
 */
export function formatNumber(
	value: number,
	{ locale = DEFAULT_LOCALE, ...options }: FormatNumberOptions = {}
): string {
	return numberFormat(locale, options).format(value);
}

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Format a date; invalid input returns an empty string. Date-only strings
 * (`YYYY-MM-DD`, as native date inputs produce) are calendar dates: they
 * render the same day in every zone, on the server and in the browser.
 */
export function formatDate(
	value: Date | string | number,
	{ locale = DEFAULT_LOCALE, ...options }: FormatDateOptions = {}
): string {
	const day = typeof value === 'string' ? DATE_ONLY.exec(value) : null;
	if (day) {
		const [, year, month, date] = day.map(Number);
		value = new Date(Date.UTC(year, month - 1, date));
		options = { ...options, timeZone: 'UTC' };
	}
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime())
		? ''
		: dateFormat(locale, options).format(date);
}
