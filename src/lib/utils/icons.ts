/**
 * Icon registry for string icon names.
 *
 * Empty by default so a component that renders an icon ships only the Lucide
 * components it imports. Pass components directly (`icon={Search}`), or
 * register names once at the app root (`registerIcons(lumiIcons)` from
 * `@lumi-ui/svelte/icons`, or any `{ name: Component }` map) for data-driven
 * string names.
 *
 * Library code deep-imports Lucide (`@lucide/svelte/icons/<name>`), never the
 * barrel, which re-exports every icon.
 */

import type { Component } from 'svelte';
import { DEV } from 'esm-env'; // export conditions: production bundles drop the warning

/**
 * Svelte icon component: Lucide icons, or any component that renders an SVG
 * and accepts these props.
 */
export type IconComponent = Component<{
	class?: string;
	style?: string;
	size?: number | string;
	strokeWidth?: number | string;
	role?: 'img';
	'aria-label'?: string;
}>;

/** An icon component, or the name of a registered icon. */
export type IconSource = IconComponent | string;

const registry = new Map<string, IconComponent>();
const reported = new Set<string>();

/**
 * Make icons available by name. Idempotent and SSR-safe (static app config);
 * call it before the first render, e.g. in the root layout script.
 */
export function registerIcons(
	icons: Readonly<Record<string, IconComponent>>
): void {
	for (const [name, icon] of Object.entries(icons)) registry.set(name, icon);
}

/** Whether `name` has been registered. */
export function hasIcon(name: string): boolean {
	return registry.has(name);
}

/** Registered icon for `name`; in development, warns once per unknown name. */
export function getIcon(name: string): IconComponent | null {
	const icon = registry.get(name);
	if (DEV && !icon && !reported.has(name) && reported.size < 100) {
		reported.add(name);
		console.warn(
			`[lumi-ui] Icon "${name}" is not registered. Pass the component or call registerIcons().`
		);
	}
	return icon ?? null;
}

/** Resolve an icon prop to a component; empty values resolve to null. */
export function resolveIcon(
	icon: IconSource | null | undefined
): IconComponent | null {
	if (!icon) return null;
	return typeof icon === 'string' ? getIcon(icon) : icon;
}
