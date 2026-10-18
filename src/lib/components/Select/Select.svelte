<script module lang="ts">
	import * as en from '../../i18n/en';
	import type { SelectValue } from './types';

	const COPY = {
		selectPlaceholder: en.selectPlaceholder,
		selectEmpty: en.selectEmpty,
		selectLoading: en.selectLoading,
		selectClear: en.selectClear,
		selectOpen: en.selectOpen,
		selectClose: en.selectClose
	};

	interface NormalizedOption {
		value: SelectValue | null;
		label: string;
		disabled: boolean;
		key: number;
	}

	/** Structural equality for primitive and plain-object values. */
	function isEqual(
		a: unknown,
		b: unknown,
		seen?: WeakMap<object, unknown>
	): boolean {
		if (Object.is(a, b)) return true;
		if (!a || !b || typeof a !== 'object' || typeof b !== 'object')
			return false;
		seen ??= new WeakMap();
		if (seen.has(a)) return seen.get(a) === b;
		seen.set(a, b);
		if (Array.isArray(a) || Array.isArray(b)) {
			return (
				Array.isArray(a) &&
				Array.isArray(b) &&
				a.length === b.length &&
				a.every((entry, index) => isEqual(entry, b[index], seen))
			);
		}
		const proto = Object.getPrototypeOf(a);
		if (proto !== Object.getPrototypeOf(b)) return false;
		if (proto !== Object.prototype && proto !== null) return false;
		const keys = Object.keys(a);
		return (
			keys.length === Object.keys(b).length &&
			keys.every(
				(key) =>
					Object.hasOwn(b, key) &&
					isEqual(
						(a as Record<string, unknown>)[key],
						(b as Record<string, unknown>)[key],
						seen
					)
			)
		);
	}
</script>

<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import X from '@lucide/svelte/icons/x';
	import { tick } from 'svelte';
	import { portal } from '../../actions/portal';
	import { useLumiLocale } from '../../i18n';
	import { createFloating } from '../../utils/floating.svelte';
	import { FieldLabel, FieldMessage } from '../Field';
	import Icon from '../Icon/Icon.svelte';
	import type { SelectProps } from './types';

	let {
		value = $bindable(null),
		options = [],
		placeholder,
		label = '',
		name = '',
		'aria-label': ariaLabel,
		size = 'md',
		color = 'primary',
		disabled = false,
		required = false,
		searchable = false,
		searchMode = 'client',
		error = false,
		hint = '',
		noDataText,
		width = '100%',
		clearable = true,
		loading = false,
		class: className = '',
		onchange,
		onopen,
		onclose,
		onsearch
	}: SelectProps = $props();

	let root: HTMLDivElement | undefined = $state();
	let input: HTMLInputElement | undefined = $state();
	let listbox: HTMLDivElement | undefined = $state();
	let focusedIndex = $state(-1);
	let filterText = $state('');

	const i18n = useLumiLocale(COPY);
	const floating = createFloating(
		() => root?.querySelector<HTMLElement>('.lumi-field__control') ?? undefined,
		() => listbox,
		{
			offset: 4,
			maxHeight: 250,
			viewportPadding: 16,
			placement: 'bottom-start',
			matchWidth: true,
			zIndex: 'var(--lumi-z-dropdown)',
			strategy: 'fixed'
		}
	);

	const uid = $props.id();
	const inputId = `lumi-select-${uid}`;
	const listboxId = `${inputId}-listbox`;
	const messageId = `${inputId}-message`;
	const optionId = (index: number) => `${listboxId}-${index}`;

	const normalized = $derived(
		options.map((option, key): NormalizedOption => {
			if (typeof option !== 'object') {
				return { value: option, label: String(option), disabled: false, key };
			}
			return {
				value: option.value ?? null,
				label: String(option.label ?? option.value ?? ''),
				disabled: Boolean(option.disabled),
				key
			};
		})
	);

	const selected = $derived(
		normalized.find((opt) => isEqual(opt.value, value))
	);
	const selectedLabel = $derived(selected?.label ?? '');
	const open = $derived(floating.isOpen);
	const filtering = $derived(
		searchable &&
			open &&
			filterText !== '' &&
			filterText.toLowerCase() !== selectedLabel.toLowerCase()
	);
	const visible = $derived.by(() => {
		if (!filtering || searchMode === 'server') return normalized;
		const query = filterText.toLowerCase();
		return normalized.filter((opt) => opt.label.toLowerCase().includes(query));
	});
	const navigable = $derived(
		visible.flatMap((opt, index) => (opt.disabled ? [] : [index]))
	);
	const showClear = $derived(
		clearable && value != null && value !== '' && !disabled && !loading
	);
	const formValue = $derived.by(() => {
		if (value == null) return '';
		if (typeof value !== 'object') return String(value);
		try {
			return JSON.stringify(value);
		} catch {
			return '';
		}
	});
	const invalid = $derived(Boolean(error));
	const errorText = $derived(typeof error === 'string' ? error : '');
	// Repeated on the portaled listbox, which does not inherit from the root.
	const accent = $derived(`var(--lumi-color-${invalid ? 'danger' : color})`);
	const placeholderText = $derived(placeholder ?? i18n.t.selectPlaceholder);

	function openList(direction?: 1 | -1): void {
		if (disabled || open) return;
		floating.open();
		filterText = selectedLabel;
		const current = selected ? visible.indexOf(selected) : -1;
		focusedIndex =
			current >= 0
				? current
				: direction === 1
					? (navigable[0] ?? -1)
					: direction === -1
						? (navigable.at(-1) ?? -1)
						: -1;
		onopen?.();
	}

	function closeList(): void {
		if (!open) return;
		floating.close();
		focusedIndex = -1;
		filterText = '';
		onclose?.();
	}

	function choose(option: NormalizedOption): void {
		if (option.disabled || loading) return;
		value = option.value;
		onchange?.(option.value);
		closeList();
	}

	function clearValue(): void {
		value = null;
		onchange?.(null);
		filterText = '';
		input?.focus();
	}

	async function focusOption(index: number): Promise<void> {
		focusedIndex = index;
		await tick();
		listbox
			?.querySelector(`#${CSS.escape(optionId(index))}`)
			?.scrollIntoView({ block: 'nearest' });
	}

	function move(direction: 1 | -1): void {
		if (!navigable.length) return;
		const at = navigable.indexOf(focusedIndex);
		// Wrap so neither end of the list is a dead end.
		const next =
			at === -1
				? direction === 1
					? 0
					: navigable.length - 1
				: (at + direction + navigable.length) % navigable.length;
		void focusOption(navigable[next]);
	}

	function handleKeydown(event: KeyboardEvent): void {
		switch (event.key) {
			case ' ':
				// Space types in a searchable field; it opens a select-only one.
				if (searchable) break;
				event.preventDefault();
				if (!open) openList();
				else if (focusedIndex >= 0) choose(visible[focusedIndex]);
				break;
			case 'Enter':
				event.preventDefault();
				if (!open) openList();
				else if (focusedIndex >= 0) choose(visible[focusedIndex]);
				break;
			case 'Escape':
				if (open) event.preventDefault();
				closeList();
				break;
			case 'ArrowDown':
			case 'ArrowUp': {
				event.preventDefault();
				const direction = event.key === 'ArrowDown' ? 1 : -1;
				if (open) move(direction);
				else openList(direction);
				break;
			}
			case 'Home':
			case 'End':
				if (open && navigable.length) {
					event.preventDefault();
					void focusOption(
						event.key === 'Home' ? navigable[0] : navigable.at(-1)!
					);
				}
				break;
			case 'Tab':
				closeList();
				break;
		}
	}

	function handleInput(event: Event): void {
		if (!searchable) return;
		openList();
		filterText = (event.currentTarget as HTMLInputElement).value;
		focusedIndex = -1;
		onsearch?.(filterText);
	}

	function handleInputClick(): void {
		if (!open) openList();
		else if (!searchable) closeList();
	}

	function handleTrigger(): void {
		if (open) closeList();
		else openList();
		input?.focus();
	}

	function handleFocusOut(event: FocusEvent): void {
		const next = event.relatedTarget as Node | null;
		if (next && (root?.contains(next) || listbox?.contains(next))) return;
		closeList();
	}

	$effect(() => {
		if (!open) return;
		const onPointerDown = (event: PointerEvent) => {
			const target = event.target as Node;
			if (!root?.contains(target) && !listbox?.contains(target)) closeList();
		};
		document.addEventListener('pointerdown', onPointerDown, true);
		return () =>
			document.removeEventListener('pointerdown', onPointerDown, true);
	});

	$effect(() => {
		if (disabled) closeList();
	});
</script>

<div
	bind:this={root}
	class={[
		'lumi-field',
		'lumi-select',
		`lumi-field--${size}`,
		open && 'lumi-select--open',
		invalid && 'lumi-field--invalid',
		disabled && 'lumi-field--disabled',
		className
	]}
	style:width
	style:--lumi-control-accent={accent}
	onfocusout={handleFocusOut}
>
	{#if label}
		<FieldLabel for={inputId} {label} {required} />
	{/if}

	<div class="lumi-field__control">
		{#if name || required}
			<!-- Form proxy: a hidden input cannot be validated, so `required`
			     uses a visually hidden one that sends focus to the combobox. -->
			<input
				class="lumi-sr-only"
				tabindex="-1"
				aria-hidden="true"
				{name}
				value={formValue}
				{required}
				{disabled}
				oninvalid={() => input?.focus()}
			/>
		{/if}

		<input
			bind:this={input}
			id={inputId}
			type="text"
			class="lumi-field__input lumi-autofill"
			readonly={!searchable}
			{disabled}
			placeholder={placeholderText}
			value={open && searchable ? filterText : selectedLabel}
			role="combobox"
			autocomplete="off"
			aria-expanded={open}
			aria-controls={listboxId}
			aria-haspopup="listbox"
			aria-autocomplete={searchable ? 'list' : 'none'}
			aria-activedescendant={focusedIndex > -1
				? optionId(focusedIndex)
				: undefined}
			aria-label={ariaLabel ?? (label ? undefined : placeholderText)}
			aria-required={required || undefined}
			aria-invalid={invalid || undefined}
			aria-describedby={errorText || hint ? messageId : undefined}
			aria-busy={loading || undefined}
			onclick={handleInputClick}
			onkeydown={handleKeydown}
			oninput={handleInput}
		/>

		{#if loading}
			<span class="lumi-spinner lumi-select__spinner" aria-hidden="true"></span>
		{:else if showClear}
			<button
				type="button"
				class="lumi-field__button"
				aria-label={i18n.t.selectClear}
				onclick={clearValue}
			>
				<Icon icon={X} size="sm" />
			</button>
		{:else}
			<button
				type="button"
				class="lumi-field__button lumi-select__arrow"
				tabindex="-1"
				aria-label={open ? i18n.t.selectClose : i18n.t.selectOpen}
				onclick={handleTrigger}
			>
				<Icon icon={ChevronDown} size="sm" />
			</button>
		{/if}
	</div>

	{#if open}
		<div
			bind:this={listbox}
			use:portal
			id={listboxId}
			class="lumi-select__listbox lumi-select__listbox--{size} lumi-scrollbar"
			style={floating.styleString}
			style:--lumi-control-accent={accent}
			role={loading || visible.length === 0 ? 'status' : 'listbox'}
			aria-label={label || placeholderText}
			aria-busy={loading || undefined}
			onmousedown={(event) => event.preventDefault()}
		>
			{#if loading}
				<div class="lumi-select__empty">
					<span class="lumi-spinner lumi-select__spinner" aria-hidden="true"
					></span>
					{i18n.t.selectLoading}
				</div>
			{:else if visible.length === 0}
				<div class="lumi-select__empty">{noDataText ?? i18n.t.selectEmpty}</div>
			{:else}
				{#each visible as option, index (option.key)}
					{@const isSelected = option.key === selected?.key}
					<!-- The listbox keeps focus on the combobox (mousedown is prevented). -->
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<div
						id={optionId(index)}
						class={[
							'lumi-select__option',
							isSelected && 'lumi-select__option--selected',
							focusedIndex === index && 'lumi-select__option--focused',
							option.disabled && 'lumi-select__option--disabled'
						]}
						role="option"
						tabindex="-1"
						aria-selected={isSelected}
						aria-disabled={option.disabled || undefined}
						onclick={() => choose(option)}
						onpointerenter={() => {
							if (!option.disabled) focusedIndex = index;
						}}
					>
						<span class="lumi-select__label">{option.label}</span>
						{#if isSelected}
							<Icon icon={Check} size="sm" />
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	{/if}

	<FieldMessage id={messageId} error={errorText} {hint} />
</div>

<style>
	.lumi-select .lumi-field__control {
		cursor: pointer;
	}

	.lumi-select .lumi-field__input[readonly] {
		cursor: pointer;
		text-overflow: ellipsis;
	}

	.lumi-select__arrow :global(.lumi-icon) {
		transition: transform var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	.lumi-select--open .lumi-select__arrow :global(.lumi-icon) {
		transform: rotate(180deg);
	}

	.lumi-select__spinner {
		--lumi-spinner-size: var(--lumi-icon-sm);
		margin-inline: var(--lumi-field-pad-x);
		color: var(--lumi-control-accent);
	}

	/* Portaled listbox (floating glass surface). */
	.lumi-select__listbox {
		--lumi-select-font: var(--lumi-font-size-base);
		--lumi-select-pad: var(--lumi-space-xs) var(--lumi-space-sm);
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-2xs);
		padding: var(--lumi-space-xs);
		overflow-y: auto;
		overscroll-behavior: contain;
		font-family: var(--lumi-font-family-sans);
		font-size: var(--lumi-select-font);
		background: var(--lumi-floating-surface-bg);
		border: var(--lumi-border-width-thin) solid
			var(--lumi-floating-surface-border);
		border-radius: var(--lumi-surface-radius);
		box-shadow: var(--lumi-floating-surface-shadow);
		transform-origin: top center;
		animation: lumi-select-in var(--lumi-duration-fast)
			var(--lumi-easing-default);
	}

	.lumi-select__listbox--sm {
		--lumi-select-font: var(--lumi-font-size-sm);
		--lumi-select-pad: var(--lumi-space-2xs) var(--lumi-space-xs);
	}

	.lumi-select__listbox--lg {
		--lumi-select-font: var(--lumi-font-size-lg);
		--lumi-select-pad: var(--lumi-space-sm) var(--lumi-space-md);
	}

	@keyframes lumi-select-in {
		from {
			opacity: 0;
			transform: scaleY(0.96) translateY(calc(var(--lumi-space-2xs) * -1));
		}
	}

	.lumi-select__option {
		display: flex;
		align-items: center;
		gap: var(--lumi-space-xs);
		padding: var(--lumi-select-pad);
		color: var(--lumi-color-text);
		border-radius: var(--lumi-radius-option);
		cursor: pointer;
		user-select: none;
		transition: var(--lumi-transition-control);
	}

	.lumi-select__option--focused {
		background: color-mix(in srgb, var(--lumi-control-accent) 10%, transparent);
	}

	.lumi-select__option--selected {
		color: var(--lumi-control-accent);
		font-weight: var(--lumi-font-weight-semibold);
	}

	.lumi-select__option--disabled {
		opacity: var(--lumi-opacity-disabled);
		cursor: not-allowed;
	}

	.lumi-select__label {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.lumi-select__empty {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--lumi-space-sm);
		padding: var(--lumi-space-lg) var(--lumi-space-md);
		font-size: var(--lumi-font-size-sm);
		color: var(--lumi-color-text-muted);
	}
</style>
