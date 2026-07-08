export interface FloatingPosition {
    top: number;
    left: number;
    width?: number;
    maxHeight?: number;
}
export type FloatingPlacement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
export interface UseFloatingOptions {
    offset?: number;
    placement?: FloatingPlacement;
    matchWidth?: boolean;
    maxHeight?: number;
    viewportPadding?: number;
    zIndex?: string;
    strategy?: 'fixed' | 'absolute';
}
export type FloatingController = {
    isOpen: boolean;
    hasPosition: boolean;
    position: FloatingPosition;
    floatingStyles: Record<string, string>;
    styleString: string;
    open: () => void;
    close: () => void;
    toggle: () => void;
    updatePosition: () => void;
};
export type FloatingOptionsInput = UseFloatingOptions | (() => UseFloatingOptions);
export declare function createFloating(triggerElement: () => HTMLElement | undefined, floatingElement: () => HTMLElement | undefined, options?: FloatingOptionsInput): FloatingController;
//# sourceMappingURL=floating.svelte.d.ts.map