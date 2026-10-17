/**
 * Locale context for built-in copy and formatting.
 *
 * English is the default and is never shipped as one dictionary: each
 * component declares the keys it renders, so bundles keep only those strings.
 * Spanish ships as `lumiEs` (+ `lumiDriveEs`) and costs nothing until imported.
 * Context keeps SSR requests isolated.
 *
 * The one component pattern (static `en.key` reads keep tree-shaking exact):
 *
 *   <script module lang="ts">
 *     import * as en from '../../i18n/en';
 *     const COPY = { close: en.close };
 *   </script>
 *   <script lang="ts">
 *     const i18n = useLumiLocale(COPY);
 *     // markup: aria-label={closeLabel ?? i18n.t.close}
 *   </script>
 *
 * Drive is the exception: its helpers also run outside components (e.g. server
 * name validation) and need a complete default, and the subpath is admin-only,
 * so it ships `lumiDriveEn` / `lumiDriveEs` as whole dictionaries.
 */

import { getContext, setContext } from 'svelte';
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '../utils/format';
import * as en from './en';
import type {
	LumiDriveMessages,
	LumiLocale,
	LumiLocaleOptions,
	LumiMessages
} from './types';

export { lumiDriveEn, lumiDriveEs } from './drive';
export { lumiEs } from './es';
export type {
	LumiDriveMessages,
	LumiFormatLocale,
	LumiLocale,
	LumiLocaleOptions,
	LumiMessages
} from './types';

/**
 * Complete English dictionary (a read-only module namespace). The second
 * half of the type rejects `en.ts` exports that are not message keys.
 */
export const lumiEn: Readonly<LumiMessages> &
	Record<Exclude<keyof typeof en, keyof LumiMessages>, never> = en;

type AnyMessages = Partial<LumiMessages & LumiDriveMessages>;
type LocaleSource = () => LumiLocaleOptions;

const KEY = Symbol('lumi-locale');
const NO_COPY = {};

// Merged copy per (overrides, defaults) pair so reads stay allocation-free.
const merged = new WeakMap<object, WeakMap<object, object>>();

function withOverrides<T extends object>(defaults: T, overrides?: object): T {
	if (!overrides) return defaults;
	let byDefaults = merged.get(overrides);
	if (!byDefaults) merged.set(overrides, (byDefaults = new WeakMap()));
	let result = byDefaults.get(defaults) as T | undefined;
	if (!result) {
		// Explicit `undefined` overrides keep the English default.
		const copy = { ...defaults } as Record<string, unknown>;
		for (const [key, value] of Object.entries(overrides)) {
			if (value !== undefined) copy[key] = value;
		}
		result = copy as T;
		byDefaults.set(defaults, result);
	}
	return result;
}

/**
 * Set copy and formatting for every Lumi component below the calling
 * component — usually the root layout. Pass a function to follow reactive
 * state. Hoist `messages` objects to module scope: merged copy is cached per
 * object, so a fresh object per call re-merges on every read.
 *
 * @example
 * const spanish = { ...lumiEs, ...lumiDriveEs };
 * setLumiLocale(() => ({
 * 	locale: lang === 'es' ? 'es-PE' : 'en-US',
 * 	timeZone: 'America/Lima',
 * 	messages: lang === 'es' ? spanish : undefined
 * }));
 */
export function setLumiLocale(
	options: LumiLocaleOptions | (() => LumiLocaleOptions)
): void {
	setContext<LocaleSource>(
		KEY,
		typeof options === 'function' ? options : () => options
	);
}

/**
 * Internal: copy and formatting for the current component. Call during
 * component initialisation with the English defaults it renders (a stable
 * module-level object); read fields in markup or `$derived` to stay reactive.
 */
export function useLumiLocale<T extends AnyMessages = AnyMessages>(
	defaults: T = NO_COPY as T
): LumiLocale<T> {
	const read = getContext<LocaleSource | undefined>(KEY);
	if (!read) {
		return { t: defaults, locale: DEFAULT_LOCALE, currency: DEFAULT_CURRENCY };
	}
	return {
		get t() {
			return withOverrides(defaults, read().messages);
		},
		get locale() {
			return read().locale ?? DEFAULT_LOCALE;
		},
		get currency() {
			return read().currency ?? DEFAULT_CURRENCY;
		},
		get timeZone() {
			return read().timeZone;
		}
	};
}
