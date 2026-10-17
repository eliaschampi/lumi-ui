import type { Snippet } from 'svelte';
import type { AvatarColor, AvatarSize } from '../Avatar/types';

export interface UserInfoProps {
	/** Display name; also drives the avatar initials */
	name?: string;

	/** Secondary line (email, role, identifier) */
	description?: string;

	/** Avatar image URL */
	src?: string;

	/**
	 * Avatar and type scale together
	 * @default "md"
	 */
	size?: AvatarSize;

	/** Avatar color @default "primary" */
	color?: AvatarColor;

	/** Turns the whole identity into one link target */
	href?: string;

	/** Content after the identity, e.g. actions; stays independently clickable */
	trailing?: Snippet;

	class?: string;
}
