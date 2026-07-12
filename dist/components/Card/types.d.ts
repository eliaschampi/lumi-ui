/**
 * Lumi UI - Card Component Types
 */
export interface CardProps {
    /** Renders the card as a button. Children must not contain interactive controls. */
    clickable?: boolean;
    /** Optional link destination; renders the card as an anchor */
    href?: string;
    /** Link browsing context */
    target?: string;
    /** Link relationship metadata */
    rel?: string;
    /** Whether card shows hover effects (shadow/transform) */
    hoverable?: boolean;
    /** Whether card is visually selected */
    selected?: boolean;
    /** Image URL */
    image?: string;
    /** Image height in pixels */
    imageHeight?: number;
    /** Image alt text. Omit for decorative card media. */
    imageAlt?: string;
    /** Card title */
    title?: string;
    /** Card subtitle */
    subtitle?: string;
    /** Whether to add spacing between content items */
    spaced?: boolean;
    /** Additional CSS classes */
    class?: string;
    /** Inline styles */
    style?: string;
}
//# sourceMappingURL=types.d.ts.map