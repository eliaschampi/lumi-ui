import type { ChartValueFormat } from '../types/charts';

type ChartValueRole = 'axis' | 'tooltip';

const currencyAxisFormatter = new Intl.NumberFormat('es-PE', {
	style: 'currency',
	currency: 'PEN',
	maximumFractionDigits: 0
});
const currencyTooltipFormatter = new Intl.NumberFormat('es-PE', {
	style: 'currency',
	currency: 'PEN',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});
const scoreAxisFormatter = new Intl.NumberFormat('es-PE', {
	maximumFractionDigits: 1
});
const decimalFormatter = new Intl.NumberFormat('es-PE', {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});
const ratioAxisFormatter = new Intl.NumberFormat('es-PE', {
	maximumFractionDigits: 2
});
const integerAxisFormatter = new Intl.NumberFormat('es-PE', {
	maximumFractionDigits: 0,
	notation: 'standard'
});
const compactIntegerAxisFormatter = new Intl.NumberFormat('es-PE', {
	maximumFractionDigits: 0,
	notation: 'compact'
});
const numberTooltipFormatter = new Intl.NumberFormat('es-PE');
const percentFormatter = new Intl.NumberFormat('es-PE', {
	style: 'percent',
	maximumFractionDigits: 0
});

export function formatChartPercent(value: number): string {
	return percentFormatter.format(value);
}

export function formatChartValue(
	value: number,
	valueFormat: ChartValueFormat,
	role: ChartValueRole
): string {
	if (valueFormat === 'currency') {
		return role === 'axis'
			? currencyAxisFormatter.format(value)
			: currencyTooltipFormatter.format(value);
	}

	if (valueFormat === 'score') {
		return role === 'axis'
			? scoreAxisFormatter.format(value)
			: decimalFormatter.format(value);
	}

	if (valueFormat === 'ratio') {
		const formatted =
			role === 'axis'
				? ratioAxisFormatter.format(value)
				: decimalFormatter.format(value);
		return `${formatted}x`;
	}

	if (role === 'tooltip') return numberTooltipFormatter.format(value);

	return Math.abs(value) >= 1000
		? compactIntegerAxisFormatter.format(value)
		: integerAxisFormatter.format(value);
}
