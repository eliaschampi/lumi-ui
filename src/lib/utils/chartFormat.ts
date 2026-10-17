import type { LumiFormatLocale } from '../i18n/types';
import type { ChartValueFormat } from '../types/charts';
import { numberFormat } from './format';

type ChartValueRole = 'axis' | 'tooltip';

/**
 * Finest value-axis step each format prints exactly. Compact axis labels keep
 * one fraction digit, enough for every 1-2-5 tick at or above one thousand.
 */
export const CHART_AXIS_STEP: Record<ChartValueFormat, number> = {
	number: 1,
	currency: 1,
	score: 0.1,
	ratio: 0.01
};

const DECIMAL = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

export function formatChartPercent(
	value: number,
	{ locale }: LumiFormatLocale
): string {
	return numberFormat(locale, {
		style: 'percent',
		maximumFractionDigits: 0
	}).format(value);
}

export function formatChartValue(
	value: number,
	valueFormat: ChartValueFormat,
	role: ChartValueRole,
	{ locale, currency }: LumiFormatLocale
): string {
	const large = Math.abs(value) >= 1000;

	if (valueFormat === 'currency') {
		const money = { style: 'currency', currency } as const;
		if (role === 'tooltip') {
			return numberFormat(locale, { ...money, ...DECIMAL }).format(value);
		}
		// Compact currency otherwise pads to the fraction maximum ("S/ 1.0 K").
		return numberFormat(
			locale,
			large
				? {
						...money,
						notation: 'compact',
						minimumFractionDigits: 0,
						maximumFractionDigits: 1
					}
				: { ...money, maximumFractionDigits: 0 }
		).format(value);
	}

	if (valueFormat === 'score') {
		return numberFormat(
			locale,
			role === 'axis' ? { maximumFractionDigits: 1 } : DECIMAL
		).format(value);
	}

	if (valueFormat === 'ratio') {
		const formatted = numberFormat(
			locale,
			role === 'axis' ? { maximumFractionDigits: 2 } : DECIMAL
		).format(value);
		return `${formatted}x`;
	}

	if (role === 'tooltip') return numberFormat(locale).format(value);

	return numberFormat(
		locale,
		large
			? { maximumFractionDigits: 1, notation: 'compact' }
			: { maximumFractionDigits: 0 }
	).format(value);
}
