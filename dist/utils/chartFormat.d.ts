import type { ChartValueFormat } from '../types/charts';
type ChartValueRole = 'axis' | 'tooltip';
interface ChartValueFormatOptions {
    scoreAxisFractionDigits?: 1 | 2;
}
export declare function formatChartValue(value: number, valueFormat: ChartValueFormat, role: ChartValueRole, options?: ChartValueFormatOptions): string;
export {};
//# sourceMappingURL=chartFormat.d.ts.map