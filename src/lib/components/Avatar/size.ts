import type { AvatarSize } from './types';

/** Diameter per size, shared by Avatar, AvatarGroup and UserInfo. */
export const AVATAR_SIZES: Record<AvatarSize, string> = {
	sm: 'var(--lumi-space-xl)',
	md: 'var(--lumi-space-2xl)',
	lg: 'var(--lumi-space-3xl)',
	xl: 'var(--lumi-space-4xl)'
};
