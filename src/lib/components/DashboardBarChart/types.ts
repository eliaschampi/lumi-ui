import type {
	ChartColor,
	ChartSeriesPoint,
	ChartValueFormat
} from '../../types/charts';

export interface DashboardBarChartProps {
	data: ChartSeriesPoint[];
	color?: ChartColor;
	height?: number;
	valueFormat?: ChartValueFormat;
	/**
	 * Optional hard cap in characters, ellipsis included. Labels otherwise keep
	 * their full text and shorten only when wider than the measured axis allows.
	 */
	xLabelMaxLength?: number;
	emptyMessage?: string;
	'aria-label'?: string;
	class?: string;
}
