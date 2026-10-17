import {
	arrow as floatingArrow,
	autoUpdate,
	computePosition,
	flip,
	offset as floatingOffset,
	shift,
	size,
	type Placement,
	type ReferenceElement,
	type Strategy
} from '@floating-ui/dom';

export interface FloatingPosition {
	top: number;
	left: number;
	width?: number;
	maxHeight?: number;
	arrowX?: number;
	arrowY?: number;
}

export type FloatingPlacement =
	| 'top'
	| 'bottom'
	| 'left'
	| 'right'
	| 'top-start'
	| 'top-end'
	| 'bottom-start'
	| 'bottom-end'
	| 'left-start'
	| 'left-end'
	| 'right-start'
	| 'right-end';

export interface UseFloatingOptions {
	offset?: number;
	placement?: FloatingPlacement;
	matchWidth?: boolean;
	maxHeight?: number;
	viewportPadding?: number;
	zIndex?: string;
	strategy?: 'fixed' | 'absolute';
	arrow?: {
		element: HTMLElement;
		padding?: number;
	};
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
	updatePosition: () => void;
};

export type FloatingOptionsInput =
	UseFloatingOptions | (() => UseFloatingOptions);

export type FloatingReference = ReferenceElement;

export function createFloating(
	triggerElement: () => ReferenceElement | undefined,
	floatingElement: () => HTMLElement | undefined,
	options: FloatingOptionsInput = {}
): FloatingController {
	const optionsGetter: () => UseFloatingOptions =
		typeof options === 'function' ? options : () => options;
	const resolvedOptions = $derived.by(() => {
		const current = optionsGetter() ?? {};
		return {
			offset: 8,
			placement: 'bottom-start',
			matchWidth: false,
			maxHeight: 300,
			viewportPadding: 16,
			zIndex: 'var(--lumi-z-dropdown)',
			strategy: 'fixed',
			...current
		};
	});

	let isOpen = $state(false);
	let position = $state<FloatingPosition>({ top: 0, left: 0 });
	let resolvedPlacement = $state<FloatingPlacement>('bottom-start');
	let hasPosition = $state(false);
	let updateToken = 0;

	const styleString = $derived.by(() => {
		const { strategy, zIndex, matchWidth } = resolvedOptions;
		let style = `position: ${strategy}; top: ${position.top}px; left: ${position.left}px; z-index: ${zIndex}; visibility: ${hasPosition ? 'visible' : 'hidden'}`;
		if (matchWidth && position.width !== undefined)
			style += `; width: ${position.width}px`;
		if (position.maxHeight !== undefined)
			style += `; max-height: ${position.maxHeight}px`;
		return style;
	});

	async function calculatePosition(): Promise<void> {
		const trigger = triggerElement();
		const floating = floatingElement();
		if (!trigger || !floating || !isOpen) return;

		const {
			offset,
			placement,
			matchWidth,
			maxHeight,
			viewportPadding,
			strategy,
			arrow
		} = resolvedOptions;
		const token = ++updateToken;
		let floatingMaxHeight = maxHeight;

		const middleware: NonNullable<
			Parameters<typeof computePosition>[2]
		>['middleware'] = [
			floatingOffset(offset),
			flip({ padding: viewportPadding }),
			shift({ padding: viewportPadding })
		];

		if (typeof maxHeight === 'number') {
			middleware.push(
				size({
					padding: viewportPadding,
					apply({ availableHeight }) {
						floatingMaxHeight = Math.max(
							0,
							Math.min(maxHeight, availableHeight)
						);
					}
				})
			);
		}

		if (arrow?.element) {
			middleware.push(
				floatingArrow({ element: arrow.element, padding: arrow.padding })
			);
		}

		const {
			x,
			y,
			placement: computedPlacement,
			middlewareData
		} = await computePosition(trigger, floating, {
			placement: placement as Placement,
			strategy: strategy as Strategy,
			middleware
		});

		if (token !== updateToken || !isOpen) return;

		position = {
			top: y,
			left: x,
			width: matchWidth ? trigger.getBoundingClientRect().width : undefined,
			maxHeight: floatingMaxHeight,
			arrowX: middlewareData.arrow?.x,
			arrowY: middlewareData.arrow?.y
		};
		resolvedPlacement = computedPlacement as FloatingPlacement;
		hasPosition = true;
	}

	function open(): void {
		hasPosition = false;
		isOpen = true;
		updatePosition();
	}

	function close(): void {
		isOpen = false;
		updateToken += 1;
	}

	function updatePosition(): void {
		if (isOpen) {
			void calculatePosition();
		}
	}

	$effect(() => {
		if (!isOpen) return;

		const trigger = triggerElement();
		const floating = floatingElement();
		if (!trigger || !floating) return;

		return autoUpdate(trigger, floating, updatePosition);
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
		close,
		updatePosition
	};
}
