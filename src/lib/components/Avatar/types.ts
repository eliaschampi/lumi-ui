import type { Snippet } from 'svelte';
import type { LumiColor, LumiDisplaySize } from '../config';

export type AvatarColor = LumiColor;
export type AvatarSize = LumiDisplaySize;

export interface AvatarProps {
	/**
	 * Person or entity name: drives the initials and the accessible name.
	 * Up to two characters without spaces are shown as given ("AL").
	 */
	name?: string;

	/** Image URL; initials or the icon show when it is missing or fails */
	src?: string;

	/**
	 * Fallback content instead of initials, e.g. an icon sized `60%`:
	 * `<Avatar><User size="60%" /></Avatar>`
	 */
	children?: Snippet;

	/**
	 * Accessible name override. `""` marks the avatar decorative, e.g. next
	 * to a visible name.
	 */
	alt?: string;

	/** @default "primary" */
	color?: AvatarColor;

	/** @default "md" */
	size?: AvatarSize;

	class?: string;
}
