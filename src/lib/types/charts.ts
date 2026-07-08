import type { LumiColor } from '../components/config';

export type ChartColor = LumiColor;
export type ChartValueFormat = 'number' | 'currency' | 'score' | 'ratio';

export interface ChartSeriesPoint {
	key: string;
	label: string;
	value: number;
}
