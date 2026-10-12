import type {
	ChartColor,
	ChartSeriesPoint,
	ChartValueFormat
} from '../types/charts';

export const CHART_Y_TICKS = 4;
export const CHART_MAX_X_LABELS = 7;
export const CHART_PADDING = {
	top: 20,
	right: 12,
	bottom: 32,
	left: 48
} as const;

export const CHART_COLOR_VARS: Record<ChartColor, string> = {
	primary: 'var(--lumi-color-primary)',
	secondary: 'var(--lumi-color-secondary)',
	success: 'var(--lumi-color-success)',
	warning: 'var(--lumi-color-warning)',
	danger: 'var(--lumi-color-danger)',
	info: 'var(--lumi-color-info)'
};

/** Nice upper bound on a 1-2-5 ladder. Non-finite or non-positive → 10. */
export function ceilNice(value: number): number {
	if (!Number.isFinite(value) || value <= 0) return 10;
	const magnitude = Math.max(
		Number.MIN_VALUE,
		10 ** Math.floor(Math.log10(value))
	);
	const normalized = value / magnitude;
	const nice =
		normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
	return Math.max(value, Math.min(Number.MAX_VALUE, nice * magnitude));
}

/** Shared zero baseline and overflow-safe scale for finite cartesian values. */
export function chartScale(
	series: readonly { data: readonly ChartSeriesPoint[] }[],
	format: ChartValueFormat,
	length = Infinity
) {
	let min = 0;
	let max = 0;
	let count = 0;
	for (const { data } of series) {
		for (let index = 0; index < Math.min(data.length, length); index++) {
			const value = data[index]?.value;
			if (value === undefined || !Number.isFinite(value)) continue;
			min = Math.min(min, value);
			max = Math.max(max, value);
			count++;
		}
	}
	const upper =
		format === 'score'
			? Math.max(20, ceilNice(max))
			: max > 0
				? ceilNice(max)
				: min < 0
					? 0
					: 10;
	const lower = min < 0 ? -ceilNice(-min) : 0;
	const magnitude = Math.max(
		Math.abs(upper),
		Math.abs(lower),
		Number.MIN_VALUE
	);
	const range = upper / magnitude - lower / magnitude;
	return {
		hasValues: count > 0,
		ratio: (value: number) => (upper / magnitude - value / magnitude) / range,
		ticks: Array.from(
			{ length: CHART_Y_TICKS + 1 },
			(_, index) =>
				(lower / magnitude + (range / CHART_Y_TICKS) * index) * magnitude
		)
	};
}

export function truncateAxisLabel(label: string, maxLength: number): string {
	const limit = Math.max(0, Math.floor(maxLength));
	if (!Number.isFinite(limit) || label.length <= limit) return label;
	let end = 0;
	let prefixEnd = 0;
	let count = 0;
	for (const character of label) {
		if (count === limit) {
			return limit > 3
				? `${label.slice(0, prefixEnd)}...`
				: label.slice(0, end);
		}
		if (count === limit - 3) prefixEnd = end;
		end += character.length;
		count++;
	}
	return label;
}

export function computeSparseXLabels(
	data: readonly { label: string }[],
	xAtIndex: (index: number) => number,
	maxLabels = CHART_MAX_X_LABELS
): { x: number; label: string }[] {
	if (data.length === 0) return [];

	const limit = Number.isFinite(maxLabels)
		? Math.max(2, Math.floor(maxLabels))
		: CHART_MAX_X_LABELS;
	const count = Math.min(data.length, limit);
	const labels: { x: number; label: string }[] = [];
	for (let slot = 0; slot < count; slot++) {
		const index =
			count === 1 ? 0 : Math.round((slot * (data.length - 1)) / (count - 1));
		const point = data[index];
		if (point) {
			labels.push({
				x: xAtIndex(index),
				label: point.label
			});
		}
	}
	return labels;
}
