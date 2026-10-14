/**
 * Shared validation contract for form fields: `true` marks the field invalid,
 * a non-empty string also shows that message, and falsy values clear it.
 */
export type FieldError = boolean | string | null | undefined;

export interface FieldLabelProps {
	/** Id of the labelled control */
	for: string;
	label: string;
	/** Adds a decorative marker; the control carries the native requirement */
	required?: boolean;
}

export interface FieldMessageProps {
	/** Referenced by the control's aria-describedby while text is shown */
	id: string;
	/** Validation message; replaces the hint while present */
	error?: string;
	hint?: string;
}
