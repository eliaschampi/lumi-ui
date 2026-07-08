import type { ChartColor, ChartSeriesPoint, ChartValueFormat } from '../../types/charts';

export interface DashboardBarChartProps {
	data: ChartSeriesPoint[];
	color?: ChartColor;
	height?: number;
	valueFormat?: ChartValueFormat;
	xLabelMaxLength?: number;
	emptyMessage?: string;
	'aria-label'?: string;
	class?: string;
}
