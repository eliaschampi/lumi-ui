// Lumi UI - Sidebar Component Types

export interface SidebarProps {
	/** Whether sidebar is collapsed */
	collapsed?: boolean;

	/** Whether sidebar is open on mobile */
	mobileOpen?: boolean;

	/** Accessible label for the navigation landmark */
	ariaLabel?: string;

	/** Custom class */
	class?: string;
}

export interface SidebarItemProps {
	/** Whether item is active */
	active?: boolean;

	/** Whether sidebar is collapsed */
	collapsed?: boolean;

	/** Link href */
	href?: string;

	/** Visual hierarchy inside the sidebar */
	level?: 'root' | 'sub';

	/** Expanded state for items that control nested navigation */
	expanded?: boolean;

	/** Custom class */
	class?: string;

	/** Click event handler */
	onclick?: (event: MouseEvent) => void;
}

export interface SidebarHeaderProps {
	/** Whether sidebar is collapsed */
	collapsed?: boolean;

	/** Header cover image source */
	coverSrc?: string;

	/** Header cover image alternative text */
	coverAlt?: string;

	/** Primary user or account label */
	userName: string;

	/** Secondary user/account metadata */
	userMeta?: string;

	/** Avatar fallback text */
	avatarText?: string;

	/** Avatar image source */
	avatarSrc?: string;

	/** Custom class */
	class?: string;
}
