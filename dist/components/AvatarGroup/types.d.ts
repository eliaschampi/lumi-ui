import type { AvatarColor, AvatarSize } from '../Avatar/types';
export interface AvatarGroupItem {
    /**
     * Text to display in the avatar (will generate initials)
     */
    text?: string;
    /**
     * Image source for the avatar
     */
    src?: string;
    /**
     * Alt text for the avatar
     */
    alt?: string;
}
export interface AvatarGroupProps {
    /**
     * List of members to render as avatars
     */
    items: AvatarGroupItem[];
    /**
     * Maximum number of avatars to display before collapsing into an overflow chip
     * @default 4
     */
    max?: number;
    /**
     * Avatar size variant
     * @default "sm"
     */
    size?: AvatarSize;
    /**
     * Avatar color variant
     * @default "primary"
     */
    color?: AvatarColor;
    /**
     * Custom CSS class
     */
    class?: string;
}
//# sourceMappingURL=types.d.ts.map