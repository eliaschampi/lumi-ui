import type { IconSource } from '../../utils/icons';
import type { Snippet } from 'svelte';
import type { TitleColor } from '../Title/types';

export interface DashboardSectionProps {
	title: string;
	subtitle?: string;
	icon?: IconSource;
	titleColor?: TitleColor;
	spaced?: boolean;
	children?: Snippet;
	actions?: Snippet;
	footer?: Snippet;
	class?: string;
}
