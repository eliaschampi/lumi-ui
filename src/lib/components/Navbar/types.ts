import type { Snippet } from 'svelte';

export interface NavbarProps {
	class?: string;

	/** The menu button was pressed */
	ontogglesidebar?: () => void;

	/** Title area after the menu button (hidden on small screens) */
	title?: Snippet;

	/** End-aligned content; replaces `user` */
	actions?: Snippet;

	/** End-aligned account area */
	user?: Snippet;
}
