import { tick } from 'svelte';

/**
 * Usage: <div use:portal={'css-selector'}> or <div use:portal={element}>
 * Default target is document.body
 */
export function portal(
	node: HTMLElement,
	target: HTMLElement | string = 'body'
) {
	let activeTarget: HTMLElement | null = null;
	let updateVersion = 0;
	let destroyed = false;

	async function resolveTarget(
		nextTarget: HTMLElement | string
	): Promise<HTMLElement | null> {
		const resolved =
			typeof nextTarget === 'string'
				? (document.querySelector(nextTarget) as HTMLElement | null)
				: nextTarget;

		if (resolved) return resolved;

		await tick();
		return typeof nextTarget === 'string'
			? (document.querySelector(nextTarget) as HTMLElement | null)
			: nextTarget;
	}

	async function update(nextTarget: HTMLElement | string) {
		const version = ++updateVersion;
		const resolved = await resolveTarget(nextTarget);
		if (
			destroyed ||
			version !== updateVersion ||
			!resolved ||
			resolved === activeTarget
		)
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
