export type SkeletonShape = 'text' | 'rect' | 'circle';

export interface SkeletonProps {
	/** `text` follows the font size, `circle` stays round
	 * @default "text"
	 */
	shape?: SkeletonShape;

	/** CSS length, e.g. `12rem` or `60%`; defaults to the available width */
	width?: string;

	/** CSS length; `text` follows the font size, `rect` a control height */
	height?: string;

	/** Text lines to draw; the last one is shorter
	 * @default 1
	 */
	lines?: number;

	class?: string;
}
