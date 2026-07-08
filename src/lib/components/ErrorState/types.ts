import type { IconName } from '../../utils/icons';

export type ErrorStateStatus = 400 | 404 | 500;

export type ErrorStateVariant = 'bad-request' | 'not-found' | 'server-error';
export type ErrorStateHomeHref = string;

export interface ErrorStateContent {
	status: ErrorStateStatus;
	variant: ErrorStateVariant;
	icon: IconName;
	color: 'warning' | 'info' | 'danger';
	kicker: string;
	title: string;
	description: string;
	primaryAction: string;
	secondaryAction: string;
}

export interface ErrorStateProps {
	status?: number;
	message?: string;
	homeHref?: ErrorStateHomeHref;
	class?: string;
}
