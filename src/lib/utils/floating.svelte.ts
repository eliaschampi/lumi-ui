import {
	place,
	transformOrigin,
	type Box,
	type FloatingPlacement
} from './position';

export type { FloatingPlacement } from './position';

export interface FloatingPosition {
	top: number;
	left: number;
	width?: number;
	maxHeight?: number;
	arrowX?: number;
	arrowY?: number;
}

export interface UseFloatingOptions {
	offset?: number;
	placement?: FloatingPlacement;
	matchWidth?: boolean;
	maxHeight?: number;
	viewportPadding?: number;
	zIndex?: string;
	arrow?: { element: HTMLElement; padding?: number };
	/** Dismissal: called for a press outside the surface and `inside` */
	onoutside?: () => void;
	/** Element that counts as inside besides the surface (default: the anchor) */
	inside?: () => Node | undefined;
	/** Scrolling anything but the surface also counts as outside */
	closeOnScroll?: boolean;
}

export type FloatingController = {
	isOpen: boolean;
	hasPosition: boolean;
	position: FloatingPosition;
	resolvedPlacement: FloatingPlacement;
	/** Inline style for the floating element (position, offsets, max height) */
	styleString: string;
	open: () => void;
	close: () => void;
};

export type FloatingOptionsInput =
	UseFloatingOptions | (() => UseFloatingOptions);

/** An element, or a point built by hand (context menus). */
export type FloatingReference = { getBoundingClientRect(): Box };

/** What the user can see: mobile keyboards and pinch zoom shrink it. */
function visibleArea(view: Window): Box {
	const visual = view.visualViewport;
	if (visual) {
		return {
			x: visual.offsetLeft,
			y: visual.offsetTop,
			width: visual.width,
			height: visual.height
		};
	}
	const { clientWidth, clientHeight } = view.document.documentElement;
	return { x: 0, y: 0, width: clientWidth, height: clientHeight };
}

export function createFloating(
	triggerElement: () => FloatingReference | undefined,
	floatingElement: () => HTMLElement | undefined,
	options: FloatingOptionsInput = {}
): FloatingController {
	const readOptions = typeof options === 'function' ? options : () => options;
	const settings = $derived({
		offset: 8,
		placement: 'bottom-start' as FloatingPlacement,
		matchWidth: false,
		maxHeight: 300,
		viewportPadding: 16,
		zIndex: 'var(--lumi-z-dropdown)',
		...readOptions()
	});

	let isOpen = $state(false);
	let position = $state<FloatingPosition>({ top: 0, left: 0 });
	let resolvedPlacement = $state<FloatingPlacement>('bottom-start');
	let origin = $state('');
	let hasPosition = $state(false);

	const styleString = $derived.by(() => {
		let style = `position: fixed; top: ${position.top}px; left: ${position.left}px; z-index: ${settings.zIndex}; visibility: ${hasPosition ? 'visible' : 'hidden'}; transform-origin: ${origin}`;
		if (settings.matchWidth && position.width !== undefined)
			style += `; width: ${position.width}px`;
		if (position.maxHeight !== undefined)
			style += `; max-height: ${position.maxHeight}px`;
		return style;
	});

	function update(): void {
		const trigger = triggerElement();
		const floating = floatingElement();
		if (!trigger || !floating || !isOpen) return;

		const { offset, placement, matchWidth, maxHeight, arrow } = settings;
		const anchor = trigger.getBoundingClientRect();
		const view = floating.ownerDocument.defaultView as Window;
		const rtl = view.getComputedStyle(floating).direction === 'rtl';
		const placed = place({
			anchor,
			// Layout size: an entrance transition may be scaling the surface.
			width: matchWidth ? anchor.width : floating.offsetWidth,
			height: floating.offsetHeight,
			viewport: visibleArea(view),
			placement,
			offset,
			padding: settings.viewportPadding,
			maxHeight,
			rtl,
			arrow: arrow && {
				size: arrow.element.offsetWidth,
				padding: arrow.padding ?? 0
			}
		});

		position = {
			top: placed.y,
			left: placed.x,
			width: matchWidth ? anchor.width : undefined,
			maxHeight: placed.maxHeight,
			arrowX: placed.arrowX,
			arrowY: placed.arrowY
		};
		resolvedPlacement = placed.placement;
		origin = transformOrigin(placed.placement, rtl);
		hasPosition = true;
	}

	function open(): void {
		hasPosition = false;
		isOpen = true;
		update();
	}

	function close(): void {
		isOpen = false;
	}

	// Follow the anchor while open. Comparing its geometry each frame catches all
	// that moves it, including what raises no event: a transform such as a Dialog's
	// entrance, or content appearing above it. Overlays are short-lived and a frame
	// reads two boxes, so a still page costs next to nothing.
	$effect(() => {
		const trigger = triggerElement();
		const floating = floatingElement();
		if (!isOpen || !trigger || !floating) return;

		const view = floating.ownerDocument.defaultView as Window;
		let frame = 0;
		let seen = '';
		const follow = () => {
			const { x, y, width, height } = (
				triggerElement() ?? trigger
			).getBoundingClientRect();
			const area = visibleArea(view);
			const now = [
				x,
				y,
				width,
				height,
				floating.offsetWidth,
				floating.offsetHeight,
				area.x,
				area.y,
				area.width,
				area.height
			].join();
			if (now !== seen) {
				seen = now;
				update();
			}
			frame = view.requestAnimationFrame(follow);
		};

		follow();
		return () => view.cancelAnimationFrame(frame);
	});

	// One dismissal model for every overlay; listeners exist only while open.
	$effect(() => {
		if (!isOpen || !settings.onoutside) return;
		const onpress = (event: Event) => {
			const target = event.target as Node;
			const inside = settings.inside?.() ?? triggerElement();
			if (
				isOpen &&
				!floatingElement()?.contains(target) &&
				!(inside as Partial<Node> | undefined)?.contains?.(target)
			)
				settings.onoutside?.();
		};
		const onscroll = (event: Event) => {
			if (!floatingElement()?.contains(event.target as Node))
				settings.onoutside?.();
		};
		const scrolling = settings.closeOnScroll;
		document.addEventListener('pointerdown', onpress, true);
		document.addEventListener('contextmenu', onpress, true);
		if (scrolling)
			document.addEventListener('scroll', onscroll, {
				capture: true,
				passive: true
			});
		return () => {
			document.removeEventListener('pointerdown', onpress, true);
			document.removeEventListener('contextmenu', onpress, true);
			if (scrolling) document.removeEventListener('scroll', onscroll, true);
		};
	});

	return {
		get isOpen() {
			return isOpen;
		},
		get hasPosition() {
			return hasPosition;
		},
		get position() {
			return position;
		},
		get resolvedPlacement() {
			return resolvedPlacement;
		},
		get styleString() {
			return styleString;
		},
		open,
		close
	};
}
