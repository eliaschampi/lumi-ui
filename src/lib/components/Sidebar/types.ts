import type { Snippet } from 'svelte';

export interface SidebarProps {
	collapsed?: boolean;

	/** Slides the sidebar in on small screens */
	mobileOpen?: boolean;

	/** Navigation landmark name; defaults to the localized "Sidebar" */
	'aria-label'?: string;

	class?: string;

	/** Identity area, e.g. `SidebarHeader` */
	header?: Snippet;

	/** `SidebarItem`s */
	children?: Snippet;
}

export interface SidebarItemProps {
	/** Current page or section (`aria-current`) */
	current?: boolean;

	/** Icon-only rail mode */
	collapsed?: boolean;

	/** Renders a link; otherwise a button */
	href?: string;

	/** @default "root" */
	level?: 'root' | 'sub';

	/** For group toggles: whether the sub-items are shown */
	expanded?: boolean;

	class?: string;

	onclick?: (event: MouseEvent) => void;

	/** Leading icon */
	icon?: Snippet;

	/** Label */
	children?: Snippet;
}

export interface SidebarHeaderProps {
	collapsed?: boolean;

	coverSrc?: string;

	/** `""` (default) treats the cover as decoration */
	coverAlt?: string;

	/** Custom cover, replacing `coverSrc` */
	cover?: Snippet;

	userName: string;

	userMeta?: string;

	/** Initials or name for the avatar; defaults to `userName` */
	avatarText?: string;

	avatarSrc?: string;

	class?: string;
}
