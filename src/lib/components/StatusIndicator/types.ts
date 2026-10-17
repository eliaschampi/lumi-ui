export type StatusIndicatorStatus =
	| 'default'
	| 'active'
	| 'inactive'
	| 'pending'
	| 'primary'
	| 'secondary'
	| 'success'
	| 'warning'
	| 'danger'
	| 'info';

export interface StatusIndicatorProps {
	/** @default "default" */
	status?: StatusIndicatorStatus;

	/** Shorthand for `status="active"` / `"inactive"`; wins over `status` */
	active?: boolean;

	/** Gentle breathing animation (static under reduced motion) */
	pulse?: boolean;

	/** Accessible name and native tooltip; without it the dot is decorative */
	tooltip?: string;

	class?: string;
}
