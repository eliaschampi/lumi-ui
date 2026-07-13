import type {
	ColorSchemeOptions,
	ColorSchemePreference,
	ResolvedColorScheme
} from './types';

export const DEFAULT_COLOR_SCHEME_STORAGE_KEY = 'lumi-color-scheme';
export const DEFAULT_COLOR_SCHEME_PREFERENCE: ColorSchemePreference = 'system';
export const COLOR_SCHEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';
export const COLOR_SCHEME_DOM_ATTRIBUTE = 'data-theme';
export const COLOR_SCHEME_PREFERENCES = ['system', 'light', 'dark'] as const;

const VALID_PREFERENCES: ReadonlySet<string> = new Set(
	COLOR_SCHEME_PREFERENCES
);

export function parseColorSchemePreference(
	value: string | null | undefined
): ColorSchemePreference | null {
	return value != null && VALID_PREFERENCES.has(value)
		? (value as ColorSchemePreference)
		: null;
}

export function resolveColorScheme(
	preference: ColorSchemePreference,
	systemPrefersDark: boolean
): ResolvedColorScheme {
	if (preference === 'dark') return 'dark';
	if (preference === 'light') return 'light';
	return systemPrefersDark ? 'dark' : 'light';
}

export function normalizeColorSchemeOptions(
	options: ColorSchemeOptions = {}
): Required<ColorSchemeOptions> {
	return {
		storageKey: options.storageKey ?? DEFAULT_COLOR_SCHEME_STORAGE_KEY,
		defaultPreference:
			options.defaultPreference ?? DEFAULT_COLOR_SCHEME_PREFERENCE
	};
}
