/**
 * Overlay geometry: where a floating surface goes around its anchor. Pure on
 * purpose (no DOM, no runes), so every rule is unit-tested. `createFloating`
 * feeds it measurements; surfaces are always `position: fixed`, which makes
 * anchor, surface and viewport share one coordinate space.
 */

export type FloatingPlacement =
	| 'top'
	| 'bottom'
	| 'left'
	| 'right'
	| 'top-start'
	| 'top-end'
	| 'bottom-start'
	| 'bottom-end'
	| 'left-start'
	| 'left-end'
	| 'right-start'
	| 'right-end';

export interface Box {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface PlaceInput {
	anchor: Box;
	/** Surface size before `maxHeight` applies */
	width: number;
	height: number;
	/** Area the surface must stay inside */
	viewport: Box;
	placement: FloatingPlacement;
	/** Gap between anchor and surface */
	offset: number;
	/** Margin kept from the viewport edges */
	padding: number;
	maxHeight: number;
	rtl: boolean;
	/** Arrow length, and how close it may get to the surface's corners */
	arrow?: { size: number; padding: number };
}

export interface Placement {
	x: number;
	y: number;
	placement: FloatingPlacement;
	maxHeight: number;
	/** Arrow position along the surface edge that faces the anchor */
	arrowX?: number;
	arrowY?: number;
}

type Side = 'top' | 'bottom' | 'left' | 'right';
type Align = 'start' | 'end';

const OPPOSITE = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left',
	start: 'end',
	end: 'start'
} as const;

const isBlock = (side: Side) => side === 'top' || side === 'bottom';
const clamp = (value: number, min: number, max: number) =>
	Math.max(min, Math.min(value, max));
const excess = (value: number) => Math.max(0, value);

// Above any real overflow, so a candidate that fits its side always ranks first.
const SIDE_OVERFLOWS = 1e6;

/**
 * Tries the requested placement, then its mirrored alignment, then the opposite
 * side with both alignments. The first that fits wins; if none does, one that
 * at least clears its side, else whichever overflows least. The surface then
 * slides along the anchor to stay on screen, and its height is capped by the
 * room left on the chosen side.
 */
export function place(input: PlaceInput): Placement {
	const { anchor, width, viewport, offset, padding, rtl, arrow } = input;
	const height = Math.min(input.height, input.maxHeight);
	const left = viewport.x + padding;
	const top = viewport.y + padding;
	const right = viewport.x + viewport.width - padding;
	const bottom = viewport.y + viewport.height - padding;

	function locate(side: Side, align?: Align) {
		let x: number;
		let y: number;
		if (isBlock(side)) {
			// Logical alignment: `start` follows the reading direction.
			const leading = (align === 'start') !== rtl;
			x = !align
				? anchor.x + (anchor.width - width) / 2
				: leading
					? anchor.x
					: anchor.x + anchor.width - width;
			y =
				side === 'top'
					? anchor.y - height - offset
					: anchor.y + anchor.height + offset;
		} else {
			x =
				side === 'left'
					? anchor.x - width - offset
					: anchor.x + anchor.width + offset;
			y = !align
				? anchor.y + (anchor.height - height) / 2
				: align === 'start'
					? anchor.y
					: anchor.y + anchor.height - height;
		}
		const over = {
			top: top - y,
			bottom: y + height - bottom,
			left: left - x,
			right: x + width - right
		};
		const main = excess(over[side]);
		const cross = isBlock(side)
			? excess(over.left) + excess(over.right)
			: excess(over.top) + excess(over.bottom);
		const rank = main ? SIDE_OVERFLOWS + main + cross : cross;
		return { side, align, x, y, rank };
	}

	const [side, align] = input.placement.split('-') as [Side, Align?];
	const far = OPPOSITE[side];
	const other = align && OPPOSITE[align];
	const best = (
		align
			? [
					locate(side, align),
					locate(side, other),
					locate(far, align),
					locate(far, other)
				]
			: [locate(side), locate(far)]
	).reduce((winner, next) => (next.rank < winner.rank ? next : winner));

	const vertical = isBlock(best.side);
	const x = vertical ? clamp(best.x, left, right - width) : best.x;
	let y = vertical ? best.y : clamp(best.y, top, bottom - height);

	// A surface beside its anchor slides vertically, so it has the full height.
	const room = !vertical
		? bottom - top
		: best.side === 'top'
			? y + height - top
			: bottom - y;
	const maxHeight = Math.max(0, Math.min(input.maxHeight, room));
	// Above the anchor the bottom edge stays put as the surface gets shorter.
	if (best.side === 'top') y += height - Math.min(height, maxHeight);

	const result: Placement = {
		x,
		y,
		placement: (best.align
			? `${best.side}-${best.align}`
			: best.side) as FloatingPlacement,
		maxHeight
	};

	if (arrow) {
		const length = vertical ? width : Math.min(height, maxHeight);
		const center = vertical
			? anchor.x + anchor.width / 2 - x
			: anchor.y + anchor.height / 2 - y;
		const inset = Math.min(arrow.padding, length / 2 - arrow.size / 2 - 1);
		const at = clamp(
			center - arrow.size / 2,
			inset,
			length - arrow.size - inset
		);
		result[vertical ? 'arrowX' : 'arrowY'] = at;
	}

	return result;
}

/** Surfaces grow out of their trigger: the facing edge, at the aligned end. */
export function transformOrigin(
	placement: FloatingPlacement,
	rtl: boolean
): string {
	const [side, align] = placement.split('-') as [Side, Align?];
	const vertical = isBlock(side);
	const start = vertical ? (rtl ? 'right' : 'left') : 'top';
	const end = vertical ? (rtl ? 'left' : 'right') : 'bottom';
	const along = !align ? 'center' : align === 'start' ? start : end;
	return vertical ? `${along} ${OPPOSITE[side]}` : `${OPPOSITE[side]} ${along}`;
}
