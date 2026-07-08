import { autoUpdate, computePosition, flip, offset as floatingOffset, shift, size } from '@floating-ui/dom';
export function createFloating(triggerElement, floatingElement, options = {}) {
    const optionsGetter = typeof options === 'function' ? options : () => options;
    const resolvedOptions = $derived(() => {
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
    let hasPosition = $state(false);
    let updateToken = 0;
    const floatingStyles = $derived(() => {
        const { strategy, zIndex, matchWidth } = resolvedOptions();
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
    async function calculatePosition() {
        const trigger = triggerElement();
        const floating = floatingElement();
        if (!trigger || !floating || !isOpen)
            return;
        const { offset, placement, matchWidth, maxHeight, viewportPadding, strategy } = resolvedOptions();
        const token = ++updateToken;
        let floatingMaxHeight = maxHeight;
        const { x, y } = await computePosition(trigger, floating, {
            placement: placement,
            strategy: strategy,
            middleware: [
                floatingOffset(offset),
                flip({ padding: viewportPadding }),
                shift({ padding: viewportPadding }),
                size({
                    padding: viewportPadding,
                    apply({ availableHeight }) {
                        floatingMaxHeight = Math.max(0, Math.min(maxHeight, availableHeight));
                    }
                })
            ]
        });
        if (token !== updateToken || !isOpen)
            return;
        position = {
            top: y,
            left: x,
            width: matchWidth ? trigger.getBoundingClientRect().width : undefined,
            maxHeight: floatingMaxHeight
        };
        hasPosition = true;
    }
    function open() {
        hasPosition = false;
        isOpen = true;
        updatePosition();
    }
    function close() {
        isOpen = false;
        hasPosition = false;
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
        get position() {
            return position;
        },
        get floatingStyles() {
            return floatingStyles();
        },
        open,
        close,
        toggle,
        updatePosition
    };
}
