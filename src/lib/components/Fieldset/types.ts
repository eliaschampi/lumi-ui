import type { Snippet } from 'svelte';

export interface FieldsetProps {
	/** Legend text */
	legend?: string;
	/** Custom class */
	class?: string;
	children?: Snippet;
}
