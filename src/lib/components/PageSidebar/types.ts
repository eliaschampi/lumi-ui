import type { Snippet } from 'svelte';

export interface PageSidebarProps {
	/** Whether the mobile drawer is currently open */
	mobileOpen?: boolean;

	/** Mobile drawer heading */
	mobileTitle?: string;

	/** Backdrop aria-label for accessibility */
	mobileAriaLabel?: string;

	/** Hides the built-in mobile drawer header when true */
	hideMobileHeader?: boolean;

	/** Additional class names applied to the internal card */
	class?: string;

	/**
	 * Optional semantic variant applied as `data-variant` on the root aside.
	 * Consumers can target `[data-variant="..."]` for per-section styling.
	 */
	variant?: string;

	/** Sidebar content rendered in desktop and mobile (fallback) */
	sidebar?: Snippet;

	/** Optional mobile-specific content */
	drawer?: Snippet;

	/** Called when the drawer is closed from inside this component */
	onclose?: () => void;
}
