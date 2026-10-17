import type { Snippet } from 'svelte';
import type { LumiColor } from '../config';

export type MessageAlign = 'start' | 'end';
export type MessageVariant = 'soft' | 'filled' | 'outline' | 'ghost';

export interface MessageProps {
	/** `end` for the current user's messages
	 * @default "start"
	 */
	align?: MessageAlign;

	/** Bubble treatment; `ghost` drops the frame and spans the full row
	 * @default "filled" when aligned to the end, otherwise "soft"
	 */
	variant?: MessageVariant;

	/** Bubble accent
	 * @default "primary" when aligned to the end, otherwise neutral
	 */
	color?: LumiColor;

	/** Sender name shown above the bubble */
	name?: string;

	/** Formatted time shown next to the name */
	time?: string;

	/** Continues the previous message from the same sender: hides the
	 * header and avatar but keeps their column */
	grouped?: boolean;

	class?: string;

	/** Sender avatar, e.g. `<Avatar size="sm" />` */
	avatar?: Snippet;

	/** Bubble content */
	children?: Snippet;

	/** Status or actions below the bubble */
	footer?: Snippet;
}

export interface MessageListProps {
	/** Accessible name of the scroll region
	 * @default localized "Messages"
	 */
	'aria-label'?: string;

	/** A reply is still streaming: assistive tech waits for the finished row */
	busy?: boolean;

	/** Earlier messages are loading (shows a status row at the top) */
	loading?: boolean;

	/** Called when the reader nears the top; omit when there is no more history */
	onloadmore?: () => void;

	class?: string;

	/** Messages in chronological order */
	children?: Snippet;
}
