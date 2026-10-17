/**
 * Lumi UI - AvatarPicker Component Types
 */

export interface AvatarOption {
	/** Avatar image source */
	src: string;

	/** Avatar value (used for form submission) */
	value: string;

	/** Avatar label (for accessibility) */
	label: string;
}

export interface AvatarPickerProps {
	/** Available avatar options */
	options: AvatarOption[];

	/** Selected avatar value (bindable) */
	value?: string;

	/** Input name attribute */
	name?: string;

	/** Name of the choice group, e.g. "Profile picture" */
	'aria-label'?: string;

	/** Additional CSS classes */
	class?: string;
}
