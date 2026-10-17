import type { Snippet } from 'svelte';
import type { TitleProps } from '../Title/types';

/** `level` defaults to 1: a page header names the page. */
export interface PageHeaderProps extends TitleProps {
	class?: string;

	/** Page-level actions, end-aligned */
	actions?: Snippet;
}
