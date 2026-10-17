import { tick } from 'svelte';

const origins = new WeakMap<HTMLElement, HTMLElement | null>();

/** Return where a portaled element was declared before it moved to its target. */
export function getPortalOrigin(node: HTMLElement): HTMLElement | null {
	return origins.get(node) ?? null;
}

/**
 * Inside an open modal, layers must stay in its subtree: `aria-modal` hides
 * everything else from assistive tech. A modal that is a containing block
 * for fixed descendants (transform, filter, contain…) would offset fixed
 * layers, so those fall back to the body.
 */
function containsFixed(element: HTMLElement): boolean {
	const style = getComputedStyle(element);
	const set = (value: string | undefined) => (value || 'none') !== 'none';
	return (
		set(style.transform) ||
		set(style.perspective) ||
		set(style.filter) ||
		set(style.backdropFilter) ||
		/paint|layout|strict|content/.test(style.contain ?? '') ||
		/transform|perspective|filter/.test(style.willChange ?? '')
	);
}

function defaultTarget(node: HTMLElement): HTMLElement {
	const modal = node.parentElement?.closest<HTMLElement>('[aria-modal="true"]');
	return modal && !containsFixed(modal) ? modal : node.ownerDocument.body;
}

/**
 * Move a node out of clipped or stacked ancestors:
 * `use:portal`, `use:portal={'css-selector'}` or `use:portal={element}`.
 * Without a target it joins the nearest open modal, else `document.body`.
 * Modal roots themselves pass `'body'`.
 */
export function portal(node: HTMLElement, target?: HTMLElement | string) {
	origins.set(node, node.parentElement);
	let activeTarget: HTMLElement | null = null;
	let updateVersion = 0;
	let destroyed = false;

	function query(next: HTMLElement | string | undefined): HTMLElement | null {
		if (next === undefined) return defaultTarget(node);
		return typeof next === 'string'
			? node.ownerDocument.querySelector<HTMLElement>(next)
			: next;
	}

	async function update(next?: HTMLElement | string) {
		const version = ++updateVersion;
		let resolved = query(next);
		if (!resolved) {
			await tick();
			resolved = query(next);
		}
		if (destroyed || version !== updateVersion || !resolved) return;
		if (resolved === activeTarget) return;
		activeTarget = resolved;
		resolved.appendChild(node);
	}

	update(target);

	return {
		update,
		destroy() {
			destroyed = true;
			updateVersion += 1;
			node.remove();
			origins.delete(node);
			activeTarget = null;
		}
	};
}
