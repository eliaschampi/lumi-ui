import type { Snippet } from 'svelte';
import type { IconSource } from '../../utils/icons';
import type { LumiColor } from '../config';

export type EmptyStateColor = LumiColor | 'muted';

export interface EmptyStateProps {
	/** Defaults to the localized "Nothing here yet" */
	title?: string;

	description?: string;

	/** Illustration URL (decorative); takes precedence over `icon` */
	image?: string;

	/** @default Inbox */
	icon?: IconSource;

	/** @default "muted" */
	iconColor?: EmptyStateColor;

	class?: string;

	/** Custom visual, replacing image and icon */
	visual?: Snippet;

	/** Calls to action under the text */
	actions?: Snippet;
}
