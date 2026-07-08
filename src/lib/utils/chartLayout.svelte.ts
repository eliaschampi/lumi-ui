export const MIN_CHART_WIDTH = 320;

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
