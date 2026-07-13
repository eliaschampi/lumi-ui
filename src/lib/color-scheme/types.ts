export type ColorSchemePreference = 'system' | 'light' | 'dark';

export type ResolvedColorScheme = 'light' | 'dark';

export interface ColorSchemeOptions {
	/** localStorage key used to persist the user's preference. */
	storageKey?: string;
	/** Preference used when storage is empty or unavailable. */
	defaultPreference?: ColorSchemePreference;
}

export interface ColorSchemeController {
	readonly preference: ColorSchemePreference;
	readonly resolved: ResolvedColorScheme;
	setPreference(preference: ColorSchemePreference): void;
	cyclePreference(): void;
	/** Starts system-preference synchronization and returns an idempotent cleanup. */
	start(): () => void;
}

export interface ColorSchemeScriptProps extends ColorSchemeOptions {}
