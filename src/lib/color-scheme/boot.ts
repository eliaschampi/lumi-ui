import {
	COLOR_SCHEME_DOM_ATTRIBUTE,
	COLOR_SCHEME_MEDIA_QUERY,
	normalizeColorSchemeOptions
} from './core';
import type { ColorSchemeOptions } from './types';

function serializeScriptValue(value: string): string {
	return JSON.stringify(value)
		.replaceAll('<', '\\u003c')
		.replaceAll('\u2028', '\\u2028')
		.replaceAll('\u2029', '\\u2029');
}

/**
 * Creates the tiny synchronous script that applies the resolved scheme before
 * the first paint. Values are serialized defensively for safe inline output.
 */
export function createColorSchemeBootScript(
	options: ColorSchemeOptions = {}
): string {
	const { storageKey, defaultPreference } =
		normalizeColorSchemeOptions(options);
	const key = serializeScriptValue(storageKey);
	const fallback = serializeScriptValue(defaultPreference);
	const mediaQuery = serializeScriptValue(COLOR_SCHEME_MEDIA_QUERY);
	const attribute = serializeScriptValue(COLOR_SCHEME_DOM_ATTRIBUTE);

	return `(()=>{let p=${fallback};try{const v=localStorage.getItem(${key});if(v==='system'||v==='light'||v==='dark')p=v}catch{}const d=p==='dark'||(p==='system'&&matchMedia(${mediaQuery}).matches)?'dark':'light';document.documentElement.setAttribute(${attribute},d)})()`;
}
