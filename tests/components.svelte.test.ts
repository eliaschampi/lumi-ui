import { flushSync, mount, tick, unmount, type Component } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import {
	Button,
	createToaster,
	NumberInput,
	Tabs,
	ToggleGroup
} from '../src/lib';
import DialogToaster from './fixtures/DialogToaster.svelte';
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

afterEach(() => {
	while (mounted.length) unmount(mounted.pop()!);
	document.body.innerHTML = '';
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
