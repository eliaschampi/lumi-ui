import { describe, expect, it } from 'vitest';
import {
	formatDate,
	formatNumber,
	getIcon,
	getInitials,
	hasIcon,
	registerIcons
} from '../src/lib';
import { lumiIcons } from '../src/lib/icons';

describe('icons', () => {
	it('starts empty and resolves names once registered', () => {
		expect(getIcon('search')).toBeNull();
		registerIcons({ search: lumiIcons.search });
		expect(hasIcon('search')).toBe(true);
		expect(getIcon('search')).toBe(lumiIcons.search);
	});
});

describe('format', () => {
	it('keeps date-only strings on their calendar day in any zone', () => {
		expect(
			formatDate('2024-05-01', { locale: 'en-US', timeZone: 'America/Lima' })
		).toBe('5/1/2024');
	});

	it('formats currency with cached formatters', () => {
		const text = formatNumber(1250.5, {
			locale: 'es-PE',
			style: 'currency',
			currency: 'PEN'
		});
		expect(text).toMatch(/S\/\s?1[,.]250[.,]50/);
	});

	it('builds initials from letters and digits only', () => {
		expect(getInitials('Ada Lovelace')).toBe('AL');
		expect(getInitials('(ada) love')).toBe('AL');
		expect(getInitials(null)).toBe('');
	});
});
