import type { Snippet } from 'svelte';
import type { IconSource } from '../../utils/icons';
import type { LumiColor } from '../config';

export type InfoItemLayout = 'horizontal' | 'vertical';
export type InfoItemColor = LumiColor;

export interface InfoItemProps {
	/** Layout orientation */
	layout?: InfoItemLayout;

	/** Icon name */
	icon?: IconSource;

	/** Icon color */
	iconColor?: InfoItemColor;

	/** Label text */
	label?: string;

	/** Value text */
	value?: string;

	/** Custom class */
	class?: string;

	/** Rich value content, replacing `value` */
	children?: Snippet;
}
