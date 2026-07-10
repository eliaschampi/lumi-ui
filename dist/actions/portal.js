import { tick } from 'svelte';
/**
 * Usage: <div use:portal={'css-selector'}> or <div use:portal={element}>
 * Default target is document.body
 */
export function portal(node, target = 'body') {
    let activeTarget = null;
    let updateVersion = 0;
    let destroyed = false;
    async function resolveTarget(nextTarget) {
        const resolved = typeof nextTarget === 'string'
            ? document.querySelector(nextTarget)
            : nextTarget;
        if (resolved)
            return resolved;
        await tick();
        return typeof nextTarget === 'string'
            ? document.querySelector(nextTarget)
            : nextTarget;
    }
    async function update(nextTarget) {
        const version = ++updateVersion;
        const resolved = await resolveTarget(nextTarget);
        if (destroyed ||
            version !== updateVersion ||
            !resolved ||
            resolved === activeTarget)
            return;
        activeTarget = resolved;
        resolved.appendChild(node);
        node.hidden = false;
    }
    function destroy() {
        destroyed = true;
        updateVersion += 1;
        node.parentNode?.removeChild(node);
        activeTarget = null;
    }
    update(target);
    return {
        update,
        destroy
    };
}
