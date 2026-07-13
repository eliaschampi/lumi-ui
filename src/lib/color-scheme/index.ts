export { createColorSchemeBootScript } from './boot';
export { default as ColorSchemeScript } from './ColorSchemeScript.svelte';
export { createColorScheme } from './controller.svelte';
export {
	COLOR_SCHEME_PREFERENCES,
	DEFAULT_COLOR_SCHEME_PREFERENCE,
	DEFAULT_COLOR_SCHEME_STORAGE_KEY,
	parseColorSchemePreference,
	resolveColorScheme
} from './core';
export type {
	ColorSchemeController,
	ColorSchemeOptions,
	ColorSchemePreference,
	ColorSchemeScriptProps,
	ResolvedColorScheme
} from './types';
