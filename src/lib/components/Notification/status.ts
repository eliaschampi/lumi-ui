import type { LumiColor } from '../config';

// Lucide glyph paths (24×24, stroke 2), inlined so status surfaces ship no
// icon runtime. A full circle is drawn as a path to keep one element type.
const CIRCLE = 'M22 12a10 10 0 1 1-20 0a10 10 0 1 1 20 0';
const INFO = [CIRCLE, 'M12 16v-4', 'M12 8h.01'];

/** One status glyph per semantic color, shared by Alert, Notification and Toaster. */
export const STATUS_GLYPHS: Record<LumiColor, string[]> = {
	primary: [
		'M10.268 21a2 2 0 0 0 3.464 0',
		'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326'
	],
	secondary: INFO,
	success: [CIRCLE, 'm9 12 2 2 4-4'],
	warning: [
		'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3',
		'M12 9v4',
		'M12 17h.01'
	],
	danger: [CIRCLE, 'm15 9-6 6', 'm9 9 6 6'],
	info: INFO
};

/** Urgent colors interrupt (`alert`); the rest wait their turn (`status`). */
export function statusRole(color: LumiColor): 'alert' | 'status' {
	return color === 'danger' || color === 'warning' ? 'alert' : 'status';
}
