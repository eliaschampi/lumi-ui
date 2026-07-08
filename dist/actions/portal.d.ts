/**
 * Usage: <div use:portal={'css-selector'}> or <div use:portal={element}>
 * Default target is document.body
 */
export declare function portal(node: HTMLElement, target?: HTMLElement | string): {
    update: (nextTarget: HTMLElement | string) => Promise<void>;
    destroy: () => void;
};
//# sourceMappingURL=portal.d.ts.map