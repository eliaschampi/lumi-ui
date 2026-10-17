<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = {
		numberDecrease: en.numberDecrease,
		numberIncrease: en.numberIncrease
	};

	function decimals(number: number): number {
		const [coefficient, exponent = '0'] = String(number).split('e');
		return Math.max(
			0,
			(coefficient.split('.')[1]?.length ?? 0) - Number(exponent)
		);
	}
</script>

<script lang="ts">
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';
	import { useLumiLocale } from '../../i18n';
	import { FieldLabel, FieldMessage } from '../Field';
	import Icon from '../Icon/Icon.svelte';
	import type { NumberInputProps } from './types';

	let {
		value = $bindable(0),
		min,
		max,
		step = 1,
		label = '',
		placeholder = '',
		color = 'primary',
		error = false,
		hint = '',
		size = 'md',
		disabled = false,
		readonly = false,
		required = false,
		id: idProp,
		'aria-label': ariaLabel,
		class: className = '',
		onchange,
		...rest
	}: NumberInputProps = $props();

	const i18n = useLumiLocale(COPY);
	const uid = $props.id();
	const id = $derived(idProp ?? `lumi-number-${uid}`);
	const messageId = $derived(`${id}-message`);
	const invalid = $derived(Boolean(error));
	const errorText = $derived(typeof error === 'string' ? error : '');
	const stride = $derived(Number.isFinite(step) && step > 0 ? step : 1);
	const origin = $derived(min ?? 0);
	// toFixed accepts at most 100 digits, including scientific steps.
	const digits = $derived(
		Math.min(Math.max(decimals(stride), decimals(origin)), 100)
	);
	const current = $derived(Number.isFinite(value) ? value : origin);
	const canDecrease = $derived(clamp(current - stride) < current);
	const canIncrease = $derived(clamp(current + stride) > current);

	function clamp(next: number): number {
		const bounded = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, next));
		const snapped = Number(
			(origin + Math.round((bounded - origin) / stride) * stride).toFixed(
				digits
			)
		);
		return max !== undefined && snapped > max
			? Number((snapped - stride).toFixed(digits))
			: snapped;
	}

	function stepBy(direction: 1 | -1): void {
		const next = clamp(current + direction * stride);
		if (disabled || readonly || next === value) return;
		value = next;
		onchange?.(next);
	}

	// Native change fires once a typed edit is committed (blur or Enter).
	function handleChange(): void {
		value = clamp(current);
		onchange?.(value);
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
		event.preventDefault();
		stepBy(event.key === 'ArrowUp' ? 1 : -1);
	}
</script>

<div
	class={[
		'lumi-field',
		'lumi-number-input',
		`lumi-field--${size}`,
		invalid && 'lumi-field--invalid',
		disabled && 'lumi-field--disabled',
		className
	]}
	style:--lumi-control-accent="var(--lumi-color-{invalid ? 'danger' : color})"
>
	{#if label}
		<FieldLabel for={id} {label} required={!!required} />
	{/if}

	<div class="lumi-field__control">
		<button
			type="button"
			class="lumi-field__button"
			tabindex="-1"
			aria-label={i18n.t.numberDecrease}
			disabled={disabled || readonly || !canDecrease}
			onclick={() => stepBy(-1)}
		>
			<Icon icon={Minus} size="sm" />
		</button>

		<input
			{...rest}
			bind:value
			{id}
			type="number"
			{min}
			{max}
			step={stride}
			{placeholder}
			{disabled}
			{readonly}
			{required}
			class="lumi-field__input lumi-autofill"
			aria-label={ariaLabel ?? (label ? undefined : placeholder || undefined)}
			aria-invalid={invalid || undefined}
			aria-describedby={errorText || hint ? messageId : undefined}
			onchange={handleChange}
			onkeydown={handleKeydown}
		/>

		<button
			type="button"
			class="lumi-field__button"
			tabindex="-1"
			aria-label={i18n.t.numberIncrease}
			disabled={disabled || readonly || !canIncrease}
			onclick={() => stepBy(1)}
		>
			<Icon icon={Plus} size="sm" />
		</button>
	</div>

	<FieldMessage id={messageId} error={errorText} {hint} />
</div>

<style>
	.lumi-number-input .lumi-field__input {
		text-align: center;
		font-variant-numeric: tabular-nums;
		appearance: textfield;
	}

	.lumi-number-input .lumi-field__input::-webkit-inner-spin-button,
	.lumi-number-input .lumi-field__input::-webkit-outer-spin-button {
		appearance: none;
		margin: 0;
	}

	/* Square steppers set off by hairlines. */
	.lumi-number-input .lumi-field__button {
		inline-size: var(--lumi-field-height);
		padding: 0;
		border-inline: var(--lumi-border-width-thin) solid
			var(--lumi-color-border-glass);
	}

	.lumi-number-input .lumi-field__button:first-child {
		border-inline-start: 0;
	}

	.lumi-number-input .lumi-field__button:last-child {
		border-inline-end: 0;
	}

	.lumi-number-input .lumi-field__button:hover {
		background: color-mix(in srgb, var(--lumi-control-accent) 8%, transparent);
	}

	.lumi-number-input .lumi-field__button:disabled {
		opacity: var(--lumi-opacity-disabled);
		cursor: not-allowed;
	}
</style>
