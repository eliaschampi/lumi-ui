import type { ChartColor } from '../types/charts';

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
	const magnitude = 10 ** Math.floor(Math.log10(value));
	const normalized = value / magnitude;
	const nice =
		normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
	return nice * magnitude;
}

export function truncateAxisLabel(label: string, maxLength: number): string {
	if (label.length <= maxLength) return label;
	return `${label.slice(0, Math.max(1, maxLength - 3))}...`;
}

/** Stable SVG defs id (SSR-safe); unique per series and color on a page. */
export function chartGradientId(
	prefix: string,
	color: string,
	keys: readonly string[]
): string {
	const seed = keys.join('\0');
	let hash = 0;
	for (let index = 0; index < seed.length; index += 1) {
		hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
	}
	return `${prefix}-${color}-${hash.toString(36)}`;
}

export function computeSparseXLabels<T extends { key: string; label: string }>(
	data: readonly T[],
	xAtIndex: (index: number) => number,
	maxLabels = CHART_MAX_X_LABELS
): { x: number; label: string; key: string }[] {
	if (data.length === 0) return [];

	if (data.length <= maxLabels) {
		return data.map((point, index) => ({
			x: xAtIndex(index),
			label: point.label,
			key: point.key
		}));
	}

	const step = Math.ceil(data.length / (maxLabels - 1));
	return data
		.map((point, index) => ({ point, index }))
		.filter(({ index }) => index % step === 0 || index === data.length - 1)
		.map(({ point, index }) => ({
			x: xAtIndex(index),
			label: point.label,
			key: point.key
		}));
}
