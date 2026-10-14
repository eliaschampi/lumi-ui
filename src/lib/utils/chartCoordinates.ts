import type {
	ChartColor,
	ChartSeriesPoint,
	ChartValueFormat
} from '../types/charts';
import { CHART_AXIS_STEP } from './chartFormat';

/** Most value-axis intervals; nice steps may need fewer. */
export const CHART_Y_TICKS = 4;
export const CHART_MAX_X_LABELS = 7;
export const CHART_PADDING = {
	top: 20,
	right: 12,
	bottom: 32,
	left: 48
} as const;
/** Space between a value-axis label and the plot. */
export const CHART_LABEL_GAP = 8;
const ELLIPSIS = '\u2026';

export const CHART_COLOR_VARS: Record<ChartColor, string> = {
	primary: 'var(--lumi-color-primary)',
	secondary: 'var(--lumi-color-secondary)',
	success: 'var(--lumi-color-success)',
	warning: 'var(--lumi-color-warning)',
	danger: 'var(--lumi-color-danger)',
	info: 'var(--lumi-color-info)'
};

/** Smallest 1-2-5 step at or above `value`, never finer than `minimum`. */
function niceStep(value: number, minimum: number): number {
	const step = Math.max(value, minimum);
	const magnitude = 10 ** Math.floor(Math.log10(step));
	const nice =
		step <= magnitude
			? 1
			: step <= 2 * magnitude
				? 2
				: step <= 5 * magnitude
					? 5
					: 10;
	return nice * magnitude;
}

/**
 * Shared zero baseline and overflow-safe scale for finite cartesian values.
 * Ticks land on round steps the axis format can print exactly.
 */
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
	const top =
		format === 'score' ? Math.max(20, max) : max > 0 || min < 0 ? max : 10;
	const minimum = CHART_AXIS_STEP[format];
	// Divide before subtracting so opposite extremes cannot overflow.
	let step = niceStep(top / CHART_Y_TICKS - min / CHART_Y_TICKS, minimum);
	let upper = Math.ceil(top / step);
	let lower = Math.floor(min / step);
	while (upper - lower > CHART_Y_TICKS) {
		step = niceStep(step * 1.5, minimum);
		upper = Math.ceil(top / step);
		lower = Math.floor(min / step);
	}
	// Positions use step indices; only labels need values, clamped at the float limit.
	const span = upper - lower;
	return {
		hasValues: count > 0,
		ratio: (value: number) => (upper - value / step) / span,
		ticks: Array.from({ length: span + 1 }, (_, offset) => {
			const index = lower + offset;
			return {
				value:
					Math.max(
						-Number.MAX_VALUE,
						Math.min(Number.MAX_VALUE, index * step)
					) || 0,
				ratio: (upper - index) / span
			};
		})
	};
}

/** Code-point-safe prefix plus ellipsis; an empty prefix hides the label. */
export function ellipsize(
	characters: readonly string[],
	count: number
): string {
	return count > 0
		? `${characters.slice(0, count).join('').trimEnd()}${ELLIPSIS}`
		: '';
}

/** Optional hard cap in code points, ellipsis included; unbounded by default. */
export function truncateAxisLabel(label: string, maxLength = Infinity): string {
	const limit = Math.max(0, Math.floor(maxLength));
	if (!Number.isFinite(limit) || label.length <= limit) return label;
	const characters = Array.from(label);
	return characters.length <= limit ? label : ellipsize(characters, limit - 1);
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
