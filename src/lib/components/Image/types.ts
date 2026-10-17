export interface ImageProps {
	src: string;

	/** Required for meaningful images; `""` marks a decorative image */
	alt?: string;

	/** Intrinsic width in px; with `height` the frame keeps that ratio and shrinks to fit (no layout shift) */
	width?: number;

	/** Intrinsic height in pixels */
	height?: number;

	srcset?: string;

	sizes?: string;

	/** CSS aspect ratio of the frame, e.g. `"16 / 9"` or `"1"`; the frame fills its container's width */
	ratio?: string;

	/** How the image fills its frame @default "cover" */
	fit?: 'cover' | 'contain';

	/** @default "lg" */
	radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';

	/** Use `"eager"` with `fetchpriority="high"` for the LCP image @default "lazy" */
	loading?: 'eager' | 'lazy';

	fetchpriority?: 'high' | 'low' | 'auto';

	/** Subtle zoom on hover */
	zoom?: boolean;

	/** Message shown when the image fails to load */
	errorLabel?: string;

	class?: string;

	onload?: (event: Event) => void;

	onerror?: (event: Event) => void;
}
