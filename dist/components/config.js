/**
 * Lumi UI - Shared Component Configuration
 * Central configuration for all component defaults
 * Ensures consistency across the entire design system
 */
export const LUMI_CONFIG = {
    /**
     * Standard size scale used across all components
     */
    sizes: {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
        '2xl': '2xl'
    },
    /**
     * Semantic color palette
     */
    colors: {
        primary: 'primary',
        secondary: 'secondary',
        success: 'success',
        warning: 'warning',
        danger: 'danger',
        info: 'info'
    },
    /**
     * Icon size mapping (in pixels)
     * Maps size scale to actual pixel values
     */
    iconSizes: {
        xs: 12,
        sm: 16,
        md: 20,
        lg: 24,
        xl: 32,
        '2xl': 40
    },
    /**
     * Transition durations (in milliseconds)
     */
    transitions: {
        fast: 150,
        base: 220,
        slow: 300,
        slower: 500
    },
    /**
     * Semantic geometry for portaled floating components.
     * Values are consumed by Floating UI and therefore remain numeric.
     */
    floating: {
        menu: {
            offset: 8,
            maxHeight: 320,
            viewportPadding: 12
        },
        select: {
            offset: 4,
            maxHeight: 250,
            viewportPadding: 16
        },
        context: {
            offset: 0,
            maxHeight: 300,
            viewportPadding: 12
        },
        tooltip: {
            offset: 10,
            maxHeight: 300,
            viewportPadding: 8,
            arrowPadding: 12
        }
    },
    /**
     * Default component props
     */
    defaults: {
        size: 'md',
        color: 'primary'
    }
};
/**
 * Helper function to get icon size in pixels
 */
export function getIconSize(size) {
    return LUMI_CONFIG.iconSizes[size] ?? LUMI_CONFIG.iconSizes.md;
}
