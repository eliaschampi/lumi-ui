/**
 * Lumi UI - Shared Component Configuration
 * Central configuration for all component defaults
 * Ensures consistency across the entire design system
 */
export declare const LUMI_CONFIG: {
    /**
     * Standard size scale used across all components
     */
    readonly sizes: {
        readonly xs: "xs";
        readonly sm: "sm";
        readonly md: "md";
        readonly lg: "lg";
        readonly xl: "xl";
        readonly '2xl': "2xl";
    };
    /**
     * Semantic color palette
     */
    readonly colors: {
        readonly primary: "primary";
        readonly secondary: "secondary";
        readonly success: "success";
        readonly warning: "warning";
        readonly danger: "danger";
        readonly info: "info";
    };
    /**
     * Icon size mapping (in pixels)
     * Maps size scale to actual pixel values
     */
    readonly iconSizes: {
        readonly xs: 12;
        readonly sm: 16;
        readonly md: 20;
        readonly lg: 24;
        readonly xl: 32;
        readonly '2xl': 40;
    };
    /**
     * Transition durations (in milliseconds)
     */
    readonly transitions: {
        readonly fast: 150;
        readonly base: 220;
        readonly slow: 300;
        readonly slower: 500;
    };
    /**
     * Semantic geometry for portaled floating components.
     * Values are consumed by Floating UI and therefore remain numeric.
     */
    readonly floating: {
        readonly menu: {
            readonly offset: 8;
            readonly maxHeight: 320;
            readonly viewportPadding: 12;
        };
        readonly select: {
            readonly offset: 4;
            readonly maxHeight: 250;
            readonly viewportPadding: 16;
        };
        readonly context: {
            readonly offset: 0;
            readonly maxHeight: 300;
            readonly viewportPadding: 12;
        };
        readonly tooltip: {
            readonly offset: 10;
            readonly maxHeight: 300;
            readonly viewportPadding: 8;
            readonly arrowPadding: 12;
        };
    };
    /**
     * Default component props
     */
    readonly defaults: {
        readonly size: "md";
        readonly color: "primary";
    };
};
export type LumiSize = keyof typeof LUMI_CONFIG.sizes;
export type LumiColor = keyof typeof LUMI_CONFIG.colors;
export type LumiCompactSize = Extract<LumiSize, 'sm' | 'md'>;
export type LumiControlSize = Extract<LumiSize, 'sm' | 'md' | 'lg'>;
export type LumiDisplaySize = Extract<LumiSize, 'sm' | 'md' | 'lg' | 'xl'>;
export type LumiExtendedSize = Extract<LumiSize, 'xs' | 'sm' | 'md' | 'lg' | 'xl'>;
export type LumiIconSize = keyof typeof LUMI_CONFIG.iconSizes;
export type LumiTransition = keyof typeof LUMI_CONFIG.transitions;
/**
 * Helper function to get icon size in pixels
 */
export declare function getIconSize(size: LumiSize): number;
//# sourceMappingURL=config.d.ts.map