import type { ChartColor, ChartValueFormat } from '../../types/charts';

export interface DashboardDonutSlice {
	key: string;
	label: string;
	value: number;
	color: ChartColor;
}

export interface DashboardDonutChartProps {
	data: DashboardDonutSlice[];
	/** Ring area height in px; the legend adds its own height below. */
	height?: number;
	/** Quiet caption above the centered value. */
	centerLabel?: string;
	/** Pre-formatted headline rendered inside the ring. */
	centerValue?: string;
	valueFormat?: ChartValueFormat;
	emptyMessage?: string;
	'aria-label'?: string;
	class?: string;
}
