/**
 * The one list-navigation model: Home/End jump, arrows move and wrap, and
 * inline arrows follow the reading direction. Returns the next index among
 * `count` items, or `undefined` when the key is not a navigation key. From
 * `current = -1` (nothing active yet) both arrows land on an end of the list.
 */
export function rovingIndex(
	event: KeyboardEvent,
	current: number,
	count: number,
	vertical: boolean
): number | undefined {
	if (!count) return undefined;
	const { key } = event;
	if (key === 'Home') return 0;
	if (key === 'End') return count - 1;

	const forward = vertical ? 'ArrowDown' : 'ArrowRight';
	const back = vertical ? 'ArrowUp' : 'ArrowLeft';
	if (key !== forward && key !== back) return undefined;

	const rtl =
		!vertical &&
		getComputedStyle(event.currentTarget as Element).direction === 'rtl';
	if ((key === forward) !== rtl) return (current + 1) % count;
	return current > 0 ? current - 1 : count - 1;
}
