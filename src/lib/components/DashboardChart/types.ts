import type {
	ChartColor,
	ChartSeriesPoint,
	ChartValueFormat
} from '../../types/charts';

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
	/**
	 * Optional hard cap in characters, ellipsis included. Labels otherwise keep
	 * their full text and shorten only when wider than the measured axis allows.
	 */
	xLabelMaxLength?: number;
	emptyMessage?: string;
	'aria-label'?: string;
	class?: string;
}
