import {
	autoUpdate,
	computePosition,
	flip,
	offset as floatingOffset,
	shift,
	size,
	type Placement,
	type Strategy
} from '@floating-ui/dom';

export interface FloatingPosition {
	top: number;
	left: number;
	width?: number;
	maxHeight?: number;
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
}

export type FloatingController = {
	isOpen: boolean;
	hasPosition: boolean;
	position: FloatingPosition;
	floatingStyles: Record<string, string>;
	styleString: string;
	open: () => void;
	close: () => void;
	toggle: () => void;
	updatePosition: () => void;
};

export type FloatingOptionsInput =
	UseFloatingOptions | (() => UseFloatingOptions);

export function createFloating(
	triggerElement: () => HTMLElement | undefined,
	floatingElement: () => HTMLElement | undefined,
	options: FloatingOptionsInput = {} as UseFloatingOptions
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
	let hasPosition = $state(false);
	let updateToken = 0;

	const floatingStyles = $derived.by(() => {
		const { strategy, zIndex, matchWidth } = resolvedOptions;
		const styles: Record<string, string> = {
			position: strategy,
			top: `${position.top}px`,
			left: `${position.left}px`,
			zIndex,
			visibility: hasPosition ? 'visible' : 'hidden'
		};

		if (position.width !== undefined && matchWidth) {
			styles.width = `${position.width}px`;
		}

		if (position.maxHeight !== undefined) {
			styles.maxHeight = `${position.maxHeight}px`;
		}

		return styles;
	});

	// Convert camelCase to kebab-case for valid CSS in a raw style attribute.
	const styleString = $derived(
		Object.entries(floatingStyles)
			.map(
				([key, value]) =>
					`${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${value}`
			)
			.join('; ')
	);

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
			strategy
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

		const { x, y } = await computePosition(trigger, floating, {
			placement: placement as Placement,
			strategy: strategy as Strategy,
			middleware
		});

		if (token !== updateToken || !isOpen) return;

		position = {
			top: y,
			left: x,
			width: matchWidth ? trigger.getBoundingClientRect().width : undefined,
			maxHeight: floatingMaxHeight
		};
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

	function toggle(): void {
		if (isOpen) {
			close();
		} else {
			open();
		}
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

		updatePosition();
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
		get floatingStyles() {
			return floatingStyles;
		},
		get styleString() {
			return styleString;
		},
		open,
		close,
		toggle,
		updatePosition
	};
}
