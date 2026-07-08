import type { ChartColor, ChartSeriesPoint, ChartValueFormat } from '../../types/charts';
export type DashboardChartValueFormat = ChartValueFormat;
export interface DashboardChartSeries {
    key: string;
    label: string;
    color: ChartColor;
    data: ChartSeriesPoint[];
}
export interface DashboardChartProps {
    series?: DashboardChartSeries[];
    data?: ChartSeriesPoint[];
    color?: ChartColor;
    height?: number;
    valueFormat?: DashboardChartValueFormat;
    xLabelMaxLength?: number;
    emptyMessage?: string;
    'aria-label'?: string;
    class?: string;
}
//# sourceMappingURL=types.d.ts.map