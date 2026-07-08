import type { LumiColor } from '../config';
export interface StatCardProps {
    /** Card title */
    title: string;
    /** Numeric or string value to display */
    value: number | string;
    /** Lucide icon name */
    icon: string;
    /** Semantic color */
    color?: LumiColor;
    /** Whether card shows hover effects */
    hoverable?: boolean;
    /** Optional link href */
    href?: string;
    /** Optional subtitle text */
    subtitle?: string;
    /** Additional CSS classes */
    class?: string;
}
//# sourceMappingURL=types.d.ts.map