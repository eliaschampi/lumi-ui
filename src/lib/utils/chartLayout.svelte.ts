export const MIN_CHART_WIDTH = 320;

const TOOLTIP_PAD = 8;
const TOOLTIP_OFFSET_X = 14;
const TOOLTIP_OFFSET_Y = 12;
const TOOLTIP_FALLBACK_WIDTH = 176;
const TOOLTIP_FALLBACK_HEIGHT = 64;

/** Keep the portaled chart tooltip inside the viewport. */
export function placeChartTooltip(
	event: PointerEvent,
	tooltipEl?: HTMLElement
): { x: number; y: number } {
	if (typeof window === 'undefined') {
		return { x: event.clientX, y: event.clientY };
	}

	const width = tooltipEl?.offsetWidth || TOOLTIP_FALLBACK_WIDTH;
	const height = tooltipEl?.offsetHeight || TOOLTIP_FALLBACK_HEIGHT;
	return {
		x: Math.min(
			Math.max(TOOLTIP_PAD, event.clientX + TOOLTIP_OFFSET_X),
			window.innerWidth - width - TOOLTIP_PAD
		),
		y: Math.min(
			Math.max(TOOLTIP_PAD, event.clientY - TOOLTIP_OFFSET_Y),
			window.innerHeight - height - TOOLTIP_PAD
		)
	};
}

/** Observes a chart container and keeps SVG viewBox width in sync with layout. */
export function useChartWidth(minWidth = MIN_CHART_WIDTH) {
	let root = $state<HTMLDivElement | undefined>();
	let chartW = $state(minWidth);

	$effect(() => {
		const el = root;
		if (!el) return;

		const syncWidth = () => {
			chartW = Math.max(minWidth, Math.floor(el.clientWidth));
		};

		syncWidth();
		const observer = new ResizeObserver(syncWidth);
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
