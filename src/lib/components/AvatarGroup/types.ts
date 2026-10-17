import type { AvatarColor, AvatarSize } from '../Avatar/types';

export interface AvatarGroupItem {
	/** Name for the initials and the group's accessible summary */
	name?: string;

	/** Image URL */
	src?: string;
}

export interface AvatarGroupProps {
	/** Members rendered as avatars, in order */
	items: AvatarGroupItem[];

	/**
	 * Avatars shown before the rest collapse into a "+N" badge
	 * @default 4
	 */
	max?: number;

	/** Total members when `items` is a partial (e.g. server) page */
	total?: number;

	/** @default "sm" */
	size?: AvatarSize;

	/** @default "primary" */
	color?: AvatarColor;

	class?: string;
}
