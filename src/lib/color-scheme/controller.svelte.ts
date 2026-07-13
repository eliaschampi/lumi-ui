import {
	COLOR_SCHEME_DOM_ATTRIBUTE,
	COLOR_SCHEME_MEDIA_QUERY,
	COLOR_SCHEME_PREFERENCES,
	normalizeColorSchemeOptions,
	parseColorSchemePreference,
	resolveColorScheme
} from './core';
import type {
	ColorSchemeController,
	ColorSchemeOptions,
	ColorSchemePreference,
	ResolvedColorScheme
} from './types';

const noop = (): void => {};

function isBrowser(): boolean {
	return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function readPreference(storageKey: string): ColorSchemePreference | null {
	try {
		return parseColorSchemePreference(window.localStorage.getItem(storageKey));
	} catch {
		return null;
	}
}

function persistPreference(
	storageKey: string,
	preference: ColorSchemePreference
): void {
	try {
		window.localStorage.setItem(storageKey, preference);
	} catch {
		// The visual preference still applies when storage is blocked or unavailable.
	}
}

function applyResolvedColorScheme(resolved: ResolvedColorScheme): void {
	document.documentElement.setAttribute(COLOR_SCHEME_DOM_ATTRIBUTE, resolved);
}

export function createColorScheme(
	options: ColorSchemeOptions = {}
): ColorSchemeController {
	const { storageKey, defaultPreference } =
		normalizeColorSchemeOptions(options);

	let preference = $state<ColorSchemePreference>(defaultPreference);
	let resolved = $state<ResolvedColorScheme>(
		resolveColorScheme(defaultPreference, false)
	);
	let mediaQuery: MediaQueryList | null = null;
	let activeConsumers = 0;
	let removeMediaListener: (() => void) | null = null;

	function synchronize(
		nextPreference: ColorSchemePreference,
		systemPrefersDark: boolean
	): void {
		preference = nextPreference;
		resolved = resolveColorScheme(nextPreference, systemPrefersDark);
		applyResolvedColorScheme(resolved);
	}

	function currentSystemPreference(): boolean {
		return (mediaQuery ?? window.matchMedia(COLOR_SCHEME_MEDIA_QUERY)).matches;
	}

	function setPreference(nextPreference: ColorSchemePreference): void {
		if (!isBrowser()) return;

		persistPreference(storageKey, nextPreference);
		synchronize(nextPreference, currentSystemPreference());
	}

	function cyclePreference(): void {
		const index = COLOR_SCHEME_PREFERENCES.indexOf(preference);
		const nextPreference =
			COLOR_SCHEME_PREFERENCES[(index + 1) % COLOR_SCHEME_PREFERENCES.length] ??
			defaultPreference;
		setPreference(nextPreference);
	}

	function connect(): void {
		mediaQuery = window.matchMedia(COLOR_SCHEME_MEDIA_QUERY);
		const storedPreference = readPreference(storageKey) ?? defaultPreference;
		synchronize(storedPreference, mediaQuery.matches);

		const handleSystemChange = (event: MediaQueryListEvent): void => {
			if (preference === 'system') {
				synchronize(preference, event.matches);
			}
		};

		mediaQuery.addEventListener('change', handleSystemChange);
		removeMediaListener = () =>
			mediaQuery?.removeEventListener('change', handleSystemChange);
	}

	function disconnect(): void {
		removeMediaListener?.();
		removeMediaListener = null;
		mediaQuery = null;
	}

	function start(): () => void {
		if (!isBrowser()) return noop;

		activeConsumers += 1;
		if (activeConsumers === 1) connect();

		let active = true;
		return () => {
			if (!active) return;
			active = false;
			activeConsumers -= 1;
			if (activeConsumers === 0) disconnect();
		};
	}

	return {
		get preference() {
			return preference;
		},
		get resolved() {
			return resolved;
		},
		setPreference,
		cyclePreference,
		start
	};
}
