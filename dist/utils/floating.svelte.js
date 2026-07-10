import { arrow as floatingArrow, autoUpdate, computePosition, flip, offset as floatingOffset, shift, size } from '@floating-ui/dom';
export function createFloating(triggerElement, floatingElement, options = {}) {
    const optionsGetter = typeof options === 'function' ? options : () => options;
    const resolvedOptions = $derived.by(() => {
        const current = optionsGetter() ?? {};
        return {
            offset: 8,
            placement: 'bottom-start',
            matchWidth: false,
            maxHeight: 300,
            viewportPadding: 16,
            zIndex: 'var(--lumi-z-dropdown)',
            strategy: 'fixed',
            ...current
        };
    });
    let isOpen = $state(false);
    let position = $state({ top: 0, left: 0 });
    let resolvedPlacement = $state('bottom-start');
    let hasPosition = $state(false);
    let updateToken = 0;
    const floatingStyles = $derived.by(() => {
        const { strategy, zIndex, matchWidth } = resolvedOptions;
        const styles = {
            position: strategy,
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex,
            visibility: hasPosition ? 'visible' : 'hidden'
        };
        if (position.width !== undefined && matchWidth) {
            styles.width = `${position.width}px`;
        }
        if (position.maxHeight !== undefined) {
            styles.maxHeight = `${position.maxHeight}px`;
        }
        return styles;
    });
    // Convert camelCase to kebab-case for valid CSS in a raw style attribute.
    const styleString = $derived(Object.entries(floatingStyles)
        .map(([key, value]) => `${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${value}`)
        .join('; '));
    async function calculatePosition() {
        const trigger = triggerElement();
        const floating = floatingElement();
        if (!trigger || !floating || !isOpen)
            return;
        const { offset, placement, matchWidth, maxHeight, viewportPadding, strategy, arrow } = resolvedOptions;
        const token = ++updateToken;
        let floatingMaxHeight = maxHeight;
        const middleware = [
            floatingOffset(offset),
            flip({ padding: viewportPadding }),
            shift({ padding: viewportPadding })
        ];
        if (typeof maxHeight === 'number') {
            middleware.push(size({
                padding: viewportPadding,
                apply({ availableHeight }) {
                    floatingMaxHeight = Math.max(0, Math.min(maxHeight, availableHeight));
                }
            }));
        }
        if (arrow?.element) {
            middleware.push(floatingArrow({ element: arrow.element, padding: arrow.padding }));
        }
        const { x, y, placement: computedPlacement, middlewareData } = await computePosition(trigger, floating, {
            placement: placement,
            strategy: strategy,
            middleware
        });
        if (token !== updateToken || !isOpen)
            return;
        position = {
            top: y,
            left: x,
            width: matchWidth ? trigger.getBoundingClientRect().width : undefined,
            maxHeight: floatingMaxHeight,
            arrowX: middlewareData.arrow?.x,
            arrowY: middlewareData.arrow?.y
        };
        resolvedPlacement = computedPlacement;
        hasPosition = true;
    }
    function open() {
        hasPosition = false;
        isOpen = true;
        updatePosition();
    }
    function close() {
        isOpen = false;
        updateToken += 1;
    }
    function toggle() {
        if (isOpen) {
            close();
        }
        else {
            open();
        }
    }
    function updatePosition() {
        if (isOpen) {
            void calculatePosition();
        }
    }
    $effect(() => {
        if (!isOpen)
            return;
        const trigger = triggerElement();
        const floating = floatingElement();
        if (!trigger || !floating)
            return;
        updatePosition();
        return autoUpdate(trigger, floating, updatePosition);
    });
    return {
        get isOpen() {
            return isOpen;
        },
        get hasPosition() {
            return hasPosition;
        },
        get position() {
            return position;
        },
        get resolvedPlacement() {
            return resolvedPlacement;
        },
        get floatingStyles() {
            return floatingStyles;
        },
        get styleString() {
            return styleString;
        },
        open,
        close,
        toggle,
        updatePosition
    };
}
