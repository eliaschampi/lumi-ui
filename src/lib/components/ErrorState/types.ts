export type ErrorStateStatus = 400 | 404 | 500;

export interface ErrorStateProps {
	/** HTTP status; other 4xx map to 400 and everything else to 500 @default 500 */
	status?: number;

	/** Replaces the default description, e.g. the server's message */
	message?: string;

	/** Target of the "home" action @default "/" */
	homeHref?: string;

	class?: string;
}
