import { getPortalOrigin } from '../actions/portal';

interface ModalEntry {
	node: HTMLElement;
	onEscape: () => boolean | void;
	ancestors: HTMLElement[];
	order: number;
	lastFocus?: HTMLElement;
}

interface ModalScope {
	entries: ModalEntry[];
	order: number;
	restore: () => void;
}

// Browser resources belong to their document; SSR never creates a scope.
const scopes = new WeakMap<Document, ModalScope>();
const focusableSelector =
	'a[href], area[href], button, input, select, textarea, [tabindex], [contenteditable="true"], summary, audio[controls], video[controls]';

function focusable(node: HTMLElement): HTMLElement[] {
	const elements = Array.from(
		node.querySelectorAll<HTMLElement>(focusableSelector)
	).filter(
		(element) =>
			element.tabIndex >= 0 &&
			!element.matches(':disabled') &&
			!element.closest('[inert]') &&
			element.getClientRects().length > 0 &&
			element.ownerDocument.defaultView?.getComputedStyle(element)
				.visibility !== 'hidden'
	);
	const groups = new Map<
		HTMLFormElement | null,
		Map<string, HTMLInputElement>
	>();
	for (const element of elements) {
		if (!element.matches('input[type="radio"]')) continue;
		const radio = element as HTMLInputElement;
		if (!radio.name) continue;
		const group = groups.get(radio.form) ?? new Map<string, HTMLInputElement>();
		if (radio.checked || !group.has(radio.name)) group.set(radio.name, radio);
		groups.set(radio.form, group);
	}
	// `elements` is a local array; sorting in place avoids another copy per Tab.
	const ordered = elements.filter((element) => {
		if (!element.matches('input[type="radio"]')) return true;
		const radio = element as HTMLInputElement;
		return !radio.name || groups.get(radio.form)?.get(radio.name) === radio;
	});
	// eslint-disable-next-line unicorn/no-array-sort
	ordered.sort((a, b) => (a.tabIndex || Infinity) - (b.tabIndex || Infinity));
	return ordered;
}

function focus(entry: ModalEntry): void {
	const candidates = focusable(entry.node);
	const target =
		entry.lastFocus && candidates.includes(entry.lastFocus)
			? entry.lastFocus
			: (candidates[0] ?? entry.node);
	target.focus({ preventScroll: true });
}

function modalAncestors(node: HTMLElement): HTMLElement[] {
	const ancestors: HTMLElement[] = [];
	let origin = getPortalOrigin(node);
	while (origin) {
		const ancestor = origin.closest<HTMLElement>('[role="dialog"]');
		if (!ancestor || ancestors.includes(ancestor)) break;
		ancestors.push(ancestor);
		origin = getPortalOrigin(ancestor);
	}
	return ancestors;
}

function lockScroll(document: Document): () => void {
	const view = document.defaultView!;
	const body = document.body.style;
	const root = document.documentElement.style;
	const { scrollX, scrollY } = view;
	const scrollbar = view.innerWidth - document.documentElement.clientWidth;
	const padding = view.getComputedStyle(document.body).paddingRight;
	const changes: [CSSStyleDeclaration, string, string][] = [
		[root, 'overflow', 'hidden'],
		[body, 'position', 'fixed'],
		[body, 'top', `${-scrollY}px`],
		[body, 'left', `${-scrollX}px`],
		[body, 'width', '100%'],
		[body, 'padding-right', `calc(${padding} + ${scrollbar}px)`],
		[body, 'overflow', 'hidden']
	];
	const restore = changes.map(([style, property, value]) => {
		const previous = style.getPropertyValue(property);
		const priority = style.getPropertyPriority(property);
		style.setProperty(property, value);
		return () => style.setProperty(property, previous, priority);
	});
	return () => {
		restore.forEach((reset) => reset());
		view.scrollTo({ left: scrollX, top: scrollY, behavior: 'auto' });
	};
}

function createScope(document: Document): ModalScope {
	const entries: ModalEntry[] = [];
	const previousFocus = document.activeElement as HTMLElement | null;
	const unlock = lockScroll(document);
	function handleKeydown(event: KeyboardEvent): void {
		const entry = entries.at(-1);
		if (!entry || event.defaultPrevented) return;
		if (event.key === 'Escape') {
			if (entry.onEscape() !== false) event.preventDefault();
			return;
		}
		if (event.key !== 'Tab') return;
		const elements = focusable(entry.node);
		const first = elements[0] ?? entry.node;
		const last = elements.at(-1) ?? entry.node;
		const active = document.activeElement;
		if (
			entry.node.contains(active) &&
			active !== entry.node &&
			active !== (event.shiftKey ? first : last)
		)
			return;
		event.preventDefault();
		(event.shiftKey ? last : first).focus({ preventScroll: true });
	}
	function rememberFocus(event: FocusEvent): void {
		const entry = entries.at(-1);
		if (entry?.node.contains(event.target as Node)) {
			entry.lastFocus = event.target as HTMLElement;
		}
	}
	document.addEventListener('keydown', handleKeydown);
	document.addEventListener('focusin', rememberFocus);
	return {
		entries,
		order: 0,
		restore() {
			document.removeEventListener('keydown', handleKeydown);
			document.removeEventListener('focusin', rememberFocus);
			unlock();
			if (previousFocus?.isConnected)
				previousFocus.focus({ preventScroll: true });
		}
	};
}

/** Register a portaled dialog root. The returned release is idempotent. */
export function registerModal(
	node: HTMLElement,
	onEscape: () => boolean | void
): () => void {
	const document = node.ownerDocument;
	const scope = scopes.get(document) ?? createScope(document);
	scopes.set(document, scope);
	const { entries } = scope;
	const ancestors = modalAncestors(node);
	const entry = {
		node,
		onEscape,
		ancestors,
		order: scope.order++
	};
	function synchronize(): void {
		const top = entries.at(-1);
		for (const item of entries) {
			const active = item === top;
			item.node.inert = !active;
			item.node.setAttribute('aria-modal', String(active));
		}
	}
	entries.push(entry);
	// Nested dialogs outrank registration order when mounted in the same update.
	// eslint-disable-next-line unicorn/no-array-sort
	entries.sort((a, b) =>
		a.ancestors.includes(b.node)
			? 1
			: b.ancestors.includes(a.node)
				? -1
				: a.order - b.order
	);
	synchronize();
	// Raise the latest modal after portal placement, below separately portaled menus.
	queueMicrotask(() => {
		if (entries.at(-1) !== entry || !node.isConnected) return;
		node.parentNode?.appendChild(node);
		focus(entry);
	});
	return () => {
		const index = entries.indexOf(entry);
		if (index < 0) return;
		const wasTop = entry === entries.at(-1);
		entries.splice(index, 1);
		node.inert = true;
		node.removeAttribute('aria-modal');
		synchronize();
		const top = entries.at(-1);
		if (!top) {
			scopes.delete(document);
			scope.restore();
		} else if (wasTop) focus(top);
	};
}
