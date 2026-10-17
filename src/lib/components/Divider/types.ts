export type DividerAlign = 'start' | 'center' | 'end';
export type DividerSpacing = 'none' | 'sm' | 'md' | 'lg';

export interface DividerProps {
	/** @default "horizontal" */
	orientation?: 'horizontal' | 'vertical';

	/** Label position along the line (logical) @default "center" */
	align?: DividerAlign;

	/** Text on a horizontal line; also the separator's accessible name */
	label?: string;

	/** @default "solid" */
	variant?: 'solid' | 'dashed';

	/** Outer margin along the separated axis @default "md" */
	spacing?: DividerSpacing;

	class?: string;
}
