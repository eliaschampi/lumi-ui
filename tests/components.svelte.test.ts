import {
	createRawSnippet,
	flushSync,
	mount,
	tick,
	unmount,
	type Component
} from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	Alert,
	Button,
	Checkbox,
	createToaster,
	Notification,
	NumberInput,
	Radio,
	Select,
	Slider,
	Switch,
	Tabs,
	ToggleGroup,
	Tooltip
} from '../src/lib';
import { solidAccent } from '../src/lib/components/config';
import { rovingIndex } from '../src/lib/utils/roving';
import ContextMenu from './fixtures/ContextMenu.svelte';
import DialogToaster from './fixtures/DialogToaster.svelte';
import Menu from './fixtures/Menu.svelte';
import SelectForm from './fixtures/SelectForm.svelte';
import Spanish from './fixtures/Spanish.svelte';

const mounted: ReturnType<typeof mount>[] = [];

function render<Props extends Record<string, any>>(
	component: Component<Props, any, any>,
	props: Props
) {
	const target = document.body.appendChild(document.createElement('div'));
	const instance = mount(component, { target, props });
	mounted.push(instance);
	flushSync();
	return target;
}

/** jsdom has no layout, so a zero-sized viewport would clamp every surface. */
function stubViewport(): void {
	for (const [side, value] of [
		['clientWidth', 1000],
		['clientHeight', 800]
	] as const) {
		Object.defineProperty(document.documentElement, side, {
			configurable: true,
			value
		});
	}
}

afterEach(() => {
	while (mounted.length) unmount(mounted.pop()!);
	document.body.innerHTML = '';
	const root = document.documentElement as unknown as Record<string, unknown>;
	delete root.clientWidth;
	delete root.clientHeight;
});

describe('Toaster', () => {
	it('joins the open dialog and survives the dialog unmounting while open', async () => {
		const toaster = createToaster();
		const props = $state({ toaster, dialog: true });
		render(DialogToaster, props);
		await tick();

		const region = document.querySelector('.lumi-toaster')!;
		expect(region.closest('[aria-modal="true"]')).not.toBeNull();

		props.dialog = false;
		flushSync();
		await tick();

		toaster.show({ title: 'Saved' });
		flushSync();
		expect(region.isConnected).toBe(true);
		expect(region.parentElement).toBe(document.body);
		expect(region.textContent).toContain('Saved');
	});
});

describe('Button', () => {
	it('renders a link for href and never names itself after its icon', () => {
		const target = render(Button, { href: '/docs', children: undefined });
		const link = target.querySelector('a');
		expect(link?.getAttribute('href')).toBe('/docs');
		expect(target.querySelector('button')).toBeNull();
	});

	it('renders a disclosure summary that needs no script', () => {
		const target = render(Button, { summary: true, children: undefined });
		expect(target.querySelector('summary.lumi-button')).not.toBeNull();
		expect(target.querySelector('button, a')).toBeNull();
	});
});

describe('Tabs', () => {
	it('keeps one tab stop when value matches no tab', () => {
		const target = render(Tabs, {
			value: 'missing',
			tabs: [
				{ value: 'a', label: 'A' },
				{ value: 'b', label: 'B' }
			]
		});
		const stops = target.querySelectorAll('[role="tab"][tabindex="0"]');
		expect(stops).toHaveLength(1);
		expect(stops[0].textContent).toContain('A');
	});
});

describe('NumberInput', () => {
	it('leaves an emptied required field empty so the form is invalid', () => {
		const target = render(NumberInput, {
			value: 4,
			required: true,
			label: 'Qty'
		});
		const input = target.querySelector<HTMLInputElement>(
			'input[type="number"]'
		)!;
		input.value = '';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		input.dispatchEvent(new Event('change', { bubbles: true }));
		flushSync();
		expect(input.value).toBe('');
		expect(input.checkValidity()).toBe(false);
	});
});

describe('Select', () => {
	it('blocks submission while required and empty, and submits its value', () => {
		const props = $state({ value: '' });
		const target = render(SelectForm, props);
		const form = target.querySelector('form')!;
		expect(form.checkValidity()).toBe(false);

		props.value = 'b';
		flushSync();
		expect(form.checkValidity()).toBe(true);
		expect(new FormData(form).get('fruit')).toBe('b');
	});
});

describe('ToggleGroup', () => {
	it('exposes pressed state and a single tab stop', () => {
		const target = render(ToggleGroup, {
			value: ['b'],
			options: [
				{ value: 'a', label: 'A' },
				{ value: 'b', label: 'B' }
			]
		});
		const buttons = target.querySelectorAll('button');
		expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
		expect(target.querySelectorAll('button[tabindex="0"]')).toHaveLength(1);
	});
});

describe('i18n', () => {
	it('renders Spanish copy and crawlable links through setLumiLocale', () => {
		const target = render(Spanish, {});
		const nav = target.querySelector('nav')!;
		expect(nav.getAttribute('aria-label')).toBe('Paginación');
		expect(target.querySelector('a[rel="next"]')?.getAttribute('href')).toBe(
			'?page=3'
		);
	});
});

function press(element: Element, key: string): void {
	element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
	flushSync();
}

describe('rovingIndex', () => {
	const key = (name: string) => new KeyboardEvent('keydown', { key: name });

	it('wraps both ways and jumps with Home and End', () => {
		expect(rovingIndex(key('ArrowDown'), 2, 3, true)).toBe(0);
		expect(rovingIndex(key('ArrowUp'), 0, 3, true)).toBe(2);
		expect(rovingIndex(key('Home'), 2, 3, true)).toBe(0);
		expect(rovingIndex(key('End'), 0, 3, true)).toBe(2);
	});

	it('lands on an end of the list when nothing is active yet', () => {
		expect(rovingIndex(key('ArrowDown'), -1, 3, true)).toBe(0);
		expect(rovingIndex(key('ArrowUp'), -1, 3, true)).toBe(2);
	});

	it('leaves other keys and empty lists alone', () => {
		expect(rovingIndex(key('a'), 0, 3, true)).toBeUndefined();
		expect(rovingIndex(key('ArrowLeft'), 0, 3, true)).toBeUndefined();
		expect(rovingIndex(key('ArrowDown'), 0, 0, true)).toBeUndefined();
	});

	it('ignores a keydown without a key, as autofill dispatches', () => {
		const event = new Event('keydown') as KeyboardEvent;
		expect(rovingIndex(event, 0, 3, true)).toBeUndefined();
	});

	it('moves with the inline arrows on a horizontal list', () => {
		expect(rovingIndex(key('ArrowRight'), 1, 3, false)).toBe(2);
		expect(rovingIndex(key('ArrowLeft'), 1, 3, false)).toBe(0);
		expect(rovingIndex(key('ArrowDown'), 1, 3, false)).toBeUndefined();
	});
});

describe('menus', () => {
	it('moves from the surface to the last enabled item on ArrowUp', async () => {
		render(Menu, { open: true });
		await tick();
		const surface = document.querySelector<HTMLElement>('[role="menu"]')!;
		surface.focus();
		press(surface, 'ArrowUp');
		expect(document.activeElement?.textContent).toContain('Three');
	});

	it('moves keyboard focus in only once the surface is visible', async () => {
		const target = render(Menu, {});
		const trigger = target.querySelector('[aria-haspopup="menu"]')!;
		const styles: (string | null | undefined)[] = [];
		const focus = vi
			.spyOn(HTMLElement.prototype, 'focus')
			.mockImplementation(function (this: HTMLElement) {
				styles.push(this.closest('[role="menu"]')?.getAttribute('style'));
			});
		press(trigger, 'ArrowDown');
		await vi.waitFor(() => expect(styles.length).toBeGreaterThan(0));
		focus.mockRestore();
		expect(styles[0]).toContain('visibility: visible');
	});

	it('follows an anchor that moves without raising any event', async () => {
		stubViewport();
		const target = render(Menu, { open: true });
		await tick();
		const anchor = target.querySelector<HTMLElement>('.lumi-dropdown')!;
		const at = (y: number) => ({ x: 20, y, width: 100, height: 40 }) as DOMRect;
		const style = () =>
			document.querySelector('[role="menu"]')?.getAttribute('style');

		anchor.getBoundingClientRect = () => at(100);
		await vi.waitFor(() => expect(style()).toContain('top: 148px'));
		anchor.getBoundingClientRect = () => at(300);
		await vi.waitFor(() => expect(style()).toContain('top: 348px'));
	});

	it('skips disabled items', async () => {
		render(Menu, { open: true });
		await tick();
		const items = document.querySelectorAll<HTMLElement>('[role="menuitem"]');
		items[0].focus();
		press(items[0], 'ArrowDown');
		expect(document.activeElement).toBe(items[2]);
	});

	it('closes on a press outside and stays open on a press inside', async () => {
		const target = render(Menu, { open: true });
		await tick();
		const menu = () => document.querySelector('[role="menu"]');
		menu()!.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
		flushSync();
		expect(menu()).not.toBeNull();
		target
			.querySelector('#outside')!
			.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
		flushSync();
		expect(target.querySelector('[aria-expanded="true"]')).toBeNull();
		await vi.waitFor(() => expect(menu()).toBeNull());
	});
});

describe('Tooltip', () => {
	it('anchors to its child when the wrapper stretches', async () => {
		stubViewport();
		const target = render(Tooltip, {
			text: 'Tip',
			children: createRawSnippet(() => ({
				render: () => '<button>Go</button>'
			}))
		});
		const wrapper = target.querySelector<HTMLElement>('.lumi-tooltip')!;
		const button = wrapper.querySelector('button')!;
		const rect = (width: number) =>
			({ x: 0, y: 100, width, height: 40 }) as DOMRect;
		wrapper.getBoundingClientRect = () => rect(400);
		button.getBoundingClientRect = () => rect(100);
		button.getClientRects = () => [rect(100)] as unknown as DOMRectList;

		wrapper.dispatchEvent(new PointerEvent('pointerenter'));
		await vi.waitFor(() =>
			expect(
				document.querySelector('.lumi-tooltip__content')?.getAttribute('style')
			).toContain('left: 50px')
		);
	});
});

describe('Context', () => {
	async function opened() {
		const target = document.body.appendChild(document.createElement('div'));
		const instance = mount(ContextMenu, { target });
		mounted.push(instance);
		flushSync();
		(instance as { open(event: MouseEvent): void }).open(
			new MouseEvent('contextmenu', { clientX: 10, clientY: 10 })
		);
		flushSync();
		await tick();
		return document.querySelector<HTMLElement>('[role="menu"]')!;
	}

	it('stays open while its own list scrolls, closes when the page does', async () => {
		const menu = await opened();
		const list = menu.firstElementChild!;
		list.dispatchEvent(new Event('scroll'));
		flushSync();
		expect(menu.isConnected).toBe(true);
		expect(menu.getAttribute('style')).toContain('visibility: visible');

		document.querySelector('#page')!.dispatchEvent(new Event('scroll'));
		flushSync();
		await vi.waitFor(() =>
			expect(document.querySelector('[role="menu"]')).toBeNull()
		);
	});
});

describe('Select', () => {
	it('points aria-controls at the listbox only while it exists', async () => {
		const target = render(Select, {
			id: 'fruit',
			label: 'Fruit',
			options: ['Apple', 'Pear']
		});
		const input = target.querySelector<HTMLInputElement>('#fruit')!;
		expect(input.getAttribute('role')).toBe('combobox');
		expect(input.hasAttribute('aria-controls')).toBe(false);
		input.click();
		flushSync();
		await tick();
		const id = input.getAttribute('aria-controls')!;
		expect(document.getElementById(id)?.getAttribute('role')).toBe('listbox');
	});
});

describe('Select keyboard', () => {
	it('keeps arrows off the caret while an open list has no options', async () => {
		const target = render(Select, { searchable: true, options: [] });
		const input = target.querySelector<HTMLInputElement>('input')!;
		input.click();
		flushSync();
		await tick();
		const event = new KeyboardEvent('keydown', {
			key: 'ArrowUp',
			bubbles: true,
			cancelable: true
		});
		input.dispatchEvent(event);
		expect(event.defaultPrevented).toBe(true);
	});
});

describe('control contract', () => {
	it('gives every binary peer the same form props', () => {
		const common = { id: 'x', name: 'n', required: true };
		for (const [component, props] of [
			[Checkbox, { ...common, value: 'v' }],
			[Switch, { ...common, value: 'v' }],
			[Radio, { ...common, value: 'v', group: 'v' }]
		] as [Component<any>, Record<string, unknown>][]) {
			const target = render(component, props);
			const input = target.querySelector('input')!;
			expect(input.id).toBe('x');
			expect(input.name).toBe('n');
			expect(input.value).toBe('v');
			expect(input.required).toBe(true);
			target.remove();
		}
	});

	it('lets explicit dismiss labels win over the locale', () => {
		const alert = render(Alert, { closable: true, closeLabel: 'Hide' });
		expect(alert.querySelector('button')?.getAttribute('aria-label')).toBe(
			'Hide'
		);
		const toast = render(Notification, { closeLabel: 'Hide too' });
		expect(toast.querySelector('button')?.getAttribute('aria-label')).toBe(
			'Hide too'
		);
	});

	it('names a slider from aria-label when no label is visible', () => {
		const target = render(Slider, { 'aria-label': 'Volume' });
		expect(target.querySelector('input')?.getAttribute('aria-label')).toBe(
			'Volume'
		);
	});

	it('writes no inline accent for the primary default', () => {
		expect(solidAccent('primary')).toBeUndefined();
		expect(solidAccent('danger')).toContain(
			'--lumi-control-solid:var(--lumi-color-danger-solid)'
		);
		const target = render(Switch, { label: 'On' });
		expect(target.querySelector('label')?.hasAttribute('style')).toBe(false);
	});
});
