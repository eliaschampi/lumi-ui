import type { LumiColor } from '../config';

export type EmptyStateColor = LumiColor | 'muted';

export interface EmptyStateProps {
	/** Title text */
	title?: string;

	/** Description text */
	description?: string;

	/** Image filename or URL */
	image?: string;

	/** Icon name (alternative to image) */
	icon?: string;

	/** Icon color */
	iconColor?: EmptyStateColor;

	/** Custom class */
	class?: string;
}
