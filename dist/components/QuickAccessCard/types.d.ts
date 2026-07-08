import type { LumiColor } from '../config';
export interface QuickAccessCardProps {
    /** Card title */
    title: string;
    /** Description text */
    description: string;
    /** Lucide icon name */
    icon: string;
    /** Semantic color */
    color?: LumiColor;
    /** Whether card shows hover effects */
    hoverable?: boolean;
    /** Link href */
    href: string;
    /** Additional CSS classes */
    class?: string;
}
//# sourceMappingURL=types.d.ts.map