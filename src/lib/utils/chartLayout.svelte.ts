import { portal } from '../actions/portal';
import { CHART_LABEL_GAP, CHART_PADDING } from './chartCoordinates';

const INITIAL_CHART_WIDTH = 320;
const MAX_GUTTER_RATIO = 1 / 3;

const TOOLTIP_PAD = 8;
const TOOLTIP_OFFSET_X = 14;
const TOOLTIP_OFFSET_Y = 12;

/** Portal and remeasure tooltips after mount, content changes, and viewport resize. */
export function chartTooltip(
	node: HTMLElement,
	anchor: Pick<PointerEvent, 'clientX' | 'clientY'>
) {
	const portaled = portal(node);
	let width = 0;
	let height = 0;
	function position() {
		const x = Math.max(
			TOOLTIP_PAD,
			Math.min(
				anchor.clientX + TOOLTIP_OFFSET_X,
				window.innerWidth - width - TOOLTIP_PAD
			)
		);
		const y = Math.max(
			TOOLTIP_PAD,
			Math.min(
				anchor.clientY - TOOLTIP_OFFSET_Y,
				window.innerHeight - height - TOOLTIP_PAD
			)
		);
		node.style.left = `${x}px`;
		node.style.top = `${y}px`;
	}
	const observer = new ResizeObserver(() => {
		width = node.offsetWidth;
		height = node.offsetHeight;
		position();
	});
	observer.observe(node, { box: 'border-box' });
	window.addEventListener('resize', position);
	return {
		update(next: typeof anchor) {
			anchor = next;
			position();
		},
		destroy() {
			observer.disconnect();
			window.removeEventListener('resize', position);
			portaled.destroy();
		}
	};
}

/** One interaction state for pointer, keyboard, and focus across chart shapes. */
export function useChartInteraction() {
	let index = $state<number | null>(null);
	let anchor = $state({ clientX: 0, clientY: 0 });
	const clear = () => {
		index = null;
	};
	const set = (next: number, position: typeof anchor) => {
		index = next;
		anchor = { clientX: position.clientX, clientY: position.clientY };
	};
	return {
		get index() {
			return index;
		},
		get anchor() {
			return anchor;
		},
		set,
		clear,
		keyboard(node: SVGSVGElement, count: number) {
			const select = (next: number) => {
				if (!count) return clear();
				const bounds = node.getBoundingClientRect();
				set(Math.max(0, Math.min(count - 1, next)), {
					clientX: bounds.left + bounds.width / 2,
					clientY: bounds.top + bounds.height / 2
				});
			};
			const focus = () => select(index ?? 0);
			const keydown = (event: KeyboardEvent) => {
				let next = index ?? -1;
				switch (event.key) {
					case 'ArrowRight':
					case 'ArrowDown':
						next++;
						break;
					case 'ArrowLeft':
					case 'ArrowUp':
						next = index === null ? count - 1 : index - 1;
						break;
					case 'Home':
						next = 0;
						break;
					case 'End':
						next = count - 1;
						break;
					case 'Escape':
						if (index !== null) event.stopPropagation();
						clear();
						return;
					default:
						return;
				}
				event.preventDefault();
				select(next);
			};
			node.addEventListener('focus', focus);
			node.addEventListener('blur', clear);
			node.addEventListener('keydown', keydown);
			return {
				update(next: number) {
					count = next;
				},
				destroy() {
					node.removeEventListener('focus', focus);
					node.removeEventListener('blur', clear);
					node.removeEventListener('keydown', keydown);
					clear();
				}
			};
		}
	};
}

/**
 * Widens the value-axis gutter to its widest rendered label so none clips,
 * capped so pathological magnitudes cannot collapse the plot.
 */
export function useChartGutter(chartWidth: () => number) {
	let labelWidth = $state(0);
	const left = $derived(
		Math.max(
			CHART_PADDING.left,
			Math.min(
				Math.ceil(labelWidth) + CHART_LABEL_GAP,
				chartWidth() * MAX_GUTTER_RATIO
			)
		)
	);
	return {
		get left() {
			return left;
		},
		measure(node: SVGGElement) {
			const read = () => {
				if (node.ownerSVGElement?.getBoundingClientRect().width)
					labelWidth = node.getBBox().width;
			};
			// Measure before first paint; the observer follows ticks and fonts.
			read();
			const observer = new ResizeObserver(read);
			observer.observe(node);
			return { destroy: () => observer.disconnect() };
		}
	};
}

/** Observes a chart container and keeps SVG viewBox width in sync with layout. */
export function useChartWidth() {
	let root = $state<HTMLDivElement | undefined>();
	let chartW = $state(INITIAL_CHART_WIDTH);

	$effect(() => {
		const el = root;
		if (!el) return;

		const observer = new ResizeObserver(([entry]) => {
			if (entry.contentRect.width > 0)
				chartW = Math.max(1, Math.floor(entry.contentRect.width));
		});
		observer.observe(el);
		return () => observer.disconnect();
	});

	return {
		get root() {
			return root;
		},
		set root(value: HTMLDivElement | undefined) {
			root = value;
		},
		get chartW() {
			return chartW;
		}
	};
}
