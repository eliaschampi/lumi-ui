import { describe, expect, it } from 'vitest';
import {
	place,
	transformOrigin,
	type PlaceInput
} from '../src/lib/utils/position';

const viewport = { x: 0, y: 0, width: 1000, height: 800 };

function at(x: number, y: number, overrides: Partial<PlaceInput> = {}) {
	return place({
		anchor: { x, y, width: 100, height: 40 },
		width: 200,
		height: 150,
		viewport,
		placement: 'bottom-start',
		offset: 8,
		padding: 12,
		maxHeight: 300,
		rtl: false,
		...overrides
	});
}

describe('place', () => {
	it('honors the requested side and alignment when there is room', () => {
		expect(at(300, 300)).toEqual({
			x: 300,
			y: 348,
			placement: 'bottom-start',
			maxHeight: 300
		});
	});

	it('flips to the opposite side when the surface does not fit', () => {
		const placed = at(300, 700);
		expect(placed.placement).toBe('top-start');
		expect(placed.y).toBe(700 - 8 - 150);
	});

	it('mirrors the alignment before sliding along the anchor', () => {
		const placed = at(880, 300);
		expect(placed.placement).toBe('bottom-end');
		expect(placed.x).toBe(880 + 100 - 200);
	});

	it('slides a surface that fits no alignment back into the viewport', () => {
		const placed = at(400, 300, { placement: 'bottom', width: 990 });
		expect(placed.x).toBe(12);
	});

	it('picks the roomier side and caps the height to what is left', () => {
		const placed = at(300, 200, {
			height: 900,
			viewport: { x: 0, y: 0, width: 1000, height: 500 }
		});
		expect(placed.placement).toBe('bottom-start');
		expect(placed.maxHeight).toBe(500 - 12 - 248);
	});

	it('keeps the bottom edge on the anchor when a surface above is capped', () => {
		const placed = at(300, 200, { placement: 'top-start', height: 280 });
		expect(placed.placement).toBe('bottom-start');
		const above = at(300, 500, { placement: 'top-start', height: 600 });
		expect(above.placement).toBe('top-start');
		expect(above.y + above.maxHeight).toBe(500 - 8);
	});

	it('measures a capped surface, so a tall list does not flip for nothing', () => {
		const placed = at(300, 300, { height: 2000, maxHeight: 250 });
		expect(placed.placement).toBe('bottom-start');
		expect(placed.maxHeight).toBe(250);
	});

	it('reads start as the reading direction on the block sides', () => {
		expect(at(300, 300, { rtl: true }).x).toBe(300 + 100 - 200);
	});

	it('gives a surface beside its anchor the whole viewport height', () => {
		const placed = at(300, 600, { placement: 'right' });
		expect(placed.placement).toBe('right');
		expect(placed.maxHeight).toBe(300);
		expect(
			at(300, 600, { placement: 'right', maxHeight: 2000 }).maxHeight
		).toBe(776);
	});

	it('points the arrow at the anchor and keeps it off the corners', () => {
		const arrow = { size: 8, padding: 12 };
		expect(at(300, 300, { placement: 'bottom', arrow }).arrowX).toBe(96);
		expect(at(4, 300, { placement: 'bottom', arrow }).arrowX).toBe(38);
		expect(at(-90, 300, { placement: 'bottom', arrow }).arrowX).toBe(12);
		expect(at(300, 300, { placement: 'right', arrow }).arrowY).toBe(71);
	});

	it('stays inside a shrunken visual viewport', () => {
		const placed = at(300, 90, {
			viewport: { x: 0, y: 80, width: 1000, height: 300 }
		});
		expect(placed.placement).toBe('bottom-start');
		expect(placed.y + Math.min(150, placed.maxHeight)).toBeLessThanOrEqual(
			80 + 300 - 12
		);
	});
});

describe('transformOrigin', () => {
	it('grows from the edge that faces the trigger, at the aligned end', () => {
		expect(transformOrigin('bottom-start', false)).toBe('left top');
		expect(transformOrigin('bottom-start', true)).toBe('right top');
		expect(transformOrigin('top-end', false)).toBe('right bottom');
		expect(transformOrigin('right', false)).toBe('left center');
		expect(transformOrigin('left-end', false)).toBe('right bottom');
	});
});
