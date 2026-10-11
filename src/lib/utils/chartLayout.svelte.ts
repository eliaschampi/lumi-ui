import { portal } from '../actions/portal';

export const MIN_CHART_WIDTH = 320;

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

/** Observes a chart container and keeps SVG viewBox width in sync with layout. */
export function useChartWidth(minWidth = MIN_CHART_WIDTH) {
	let root = $state<HTMLDivElement | undefined>();
	let chartW = $state(minWidth);

	$effect(() => {
		const el = root;
		if (!el) return;

		const observer = new ResizeObserver(([entry]) => {
			chartW = Math.max(minWidth, Math.floor(entry.contentRect.width));
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
