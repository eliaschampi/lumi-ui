// Browser APIs jsdom lacks; enough for components to mount and transition.
const noop = () => {};

window.scrollTo = noop as typeof window.scrollTo;

globalThis.matchMedia ??= (query: string) =>
	({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: noop,
		removeEventListener: noop,
		addListener: noop,
		removeListener: noop,
		dispatchEvent: () => false
	}) as MediaQueryList;

class Observer {
	observe = noop;
	unobserve = noop;
	disconnect = noop;
	takeRecords = () => [];
}
globalThis.ResizeObserver ??= Observer as unknown as typeof ResizeObserver;
globalThis.IntersectionObserver ??=
	Observer as unknown as typeof IntersectionObserver;

// Svelte transitions use the Web Animations API; finish immediately.
Element.prototype.animate ??= function () {
	const animation = {
		onfinish: null as null | (() => void),
		finished: Promise.resolve(),
		cancel: noop,
		finish: noop,
		play: noop,
		pause: noop
	};
	queueMicrotask(() => animation.onfinish?.());
	return animation as unknown as Animation;
};
Element.prototype.getAnimations ??= () => [];
