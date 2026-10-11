<script lang="ts">
	import { Icon } from '../Icon';
	import type { NumberInputProps } from './types';

	let {
		value = $bindable(0),
		name = '',
		min = 0,
		max = undefined,
		step = 1,
		label = '',
		placeholder = '',
		color = 'primary',
		size = 'md',
		disabled = false,
		required = false,
		'aria-label': ariaLabel = '',
		class: className = '',
		onchange
	}: NumberInputProps = $props();

	const instanceId = $props.id();
	const inputId = `lumi-number-${instanceId}`;
	const styleVars = $derived(`--input-accent: var(--lumi-color-${color});`);
	const normalizedStep = $derived(Number.isFinite(step) && step > 0 ? step : 1);
	const precision = $derived(
		Math.max(decimalPlaces(normalizedStep), decimalPlaces(min))
	);
	const incrementDisabled = $derived(
		disabled ||
			(max !== undefined && value >= max) ||
			clamp((value ?? 0) + normalizedStep) === value
	);

	const classes = $derived(
		[
			'lumi-number-input',
			`lumi-number-input--${size}`,
			disabled && 'lumi-number-input--disabled',
			className
		]
			.filter(Boolean)
			.join(' ')
	);

	function decimalPlaces(number: number): number {
		const [coefficient, exponent = '0'] = String(number).split('e');
		return Math.max(
			0,
			(coefficient.split('.')[1]?.length ?? 0) - Number(exponent)
		);
	}

	function clamp(val: number): number {
		const bounded = Math.min(max ?? Infinity, Math.max(min, val));
		const snapped =
			min + Math.round((bounded - min) / normalizedStep) * normalizedStep;
		// toFixed accepts at most 100 decimal places, including scientific steps.
		const digits = Math.min(precision, 100);
		const rounded = Number(snapped.toFixed(digits));
		return max !== undefined && rounded > max
			? Number((rounded - normalizedStep).toFixed(digits))
			: rounded;
	}

	function stepValue(direction: number): void {
		if (
			disabled ||
			(direction > 0 && incrementDisabled) ||
			(direction < 0 && value <= min)
		)
			return;
		const newVal = clamp((value ?? 0) + direction * normalizedStep);
		if (newVal !== value) {
			value = newVal;
			onchange?.(value);
		}
	}

	function handleBlur(): void {
		value = clamp(Number.isFinite(value) ? value : min);
		onchange?.(value);
	}

	function handleKeyDown(e: KeyboardEvent): void {
		if (disabled) return;
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			stepValue(1);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			stepValue(-1);
		}
	}
</script>

<div class={classes} style={styleVars}>
	{#if label}
		<label class="lumi-number-input__label" for={inputId}>{label}</label>
	{/if}

	<div class="lumi-number-input__wrapper">
		<button
			type="button"
			class="lumi-number-input__btn lumi-number-input__btn--decrement"
			onclick={() => stepValue(-1)}
			disabled={disabled || (min !== undefined && value <= min)}
			aria-label="Disminuir valor"
			tabindex="-1"
		>
			<Icon icon="minus" {size} />
		</button>

		<input
			id={inputId}
			type="number"
			{name}
			bind:value
			{min}
			{max}
			step={normalizedStep}
			{placeholder}
			{disabled}
			{required}
			onblur={handleBlur}
			onkeydown={handleKeyDown}
			class="lumi-number-input__field lumi-autofill"
			aria-label={ariaLabel || label || placeholder || undefined}
		/>

		<button
			type="button"
			class="lumi-number-input__btn lumi-number-input__btn--increment"
			onclick={() => stepValue(1)}
			disabled={incrementDisabled}
			aria-label="Aumentar valor"
			tabindex="-1"
		>
			<Icon icon="plus" {size} />
		</button>
	</div>
</div>

<style>
	.lumi-number-input {
		display: flex;
		flex-direction: column;
		width: 100%;
		--input-accent: var(--lumi-color-primary);
		--lumi-control-accent: var(--input-accent);
		--number-border: var(--lumi-color-control-border);
		--number-bg: var(--lumi-color-control-fill);
		--number-bg-focus: var(--lumi-color-control-focus-fill);
		--number-btn-size: var(--lumi-control-height-md);
		--lumi-control-autofill-bg: var(--number-bg);
	}

	.lumi-number-input:focus-within {
		--lumi-control-autofill-bg: var(--number-bg-focus);
	}

	.lumi-number-input__label {
		font-family: var(--lumi-font-family-sans);
		font-size: var(--lumi-font-size-sm);
		font-weight: var(--lumi-font-weight-semibold);
		color: var(--lumi-color-text);
		margin-block-end: var(--lumi-space-xs);
		transition: color var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	.lumi-number-input:focus-within .lumi-number-input__label {
		color: var(--input-accent);
	}

	.lumi-number-input__wrapper {
		position: relative;
		display: flex;
		align-items: stretch;
		min-height: var(--lumi-control-height-md);
		background: var(--number-bg);
		border: var(--lumi-border-width-thin) solid var(--number-border);
		border-radius: var(--lumi-radius-control);
		box-shadow: var(--lumi-control-shadow);
		overflow: hidden;
		transition: var(--lumi-transition-control);
	}

	.lumi-number-input__wrapper:hover:not(:focus-within) {
		border-color: var(--lumi-color-border-strong);
		background: var(--lumi-color-control-hover-fill);
	}

	.lumi-number-input__wrapper:focus-within {
		border-color: var(--input-accent);
		background: var(--number-bg-focus);
		box-shadow: var(--lumi-control-focus-shadow);
	}

	.lumi-number-input__field {
		flex: 1;
		min-width: 0;
		padding: 0 var(--lumi-space-sm);
		background: transparent;
		border: none;
		font-family: inherit;
		font-size: var(--lumi-font-size-base);
		color: var(--lumi-color-text);
		text-align: center;
		outline: none;
		line-height: var(--lumi-line-height-normal);
		appearance: textfield;
	}

	.lumi-number-input__field::placeholder {
		color: var(--lumi-color-placeholder);
	}

	.lumi-number-input__btn {
		flex: 0 0 var(--number-btn-size);
		inline-size: var(--number-btn-size);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: color-mix(
			in srgb,
			var(--number-bg) 88%,
			var(--lumi-color-surface) 12%
		);
		border: none;
		color: var(--lumi-color-text-muted);
		cursor: pointer;
		transition: var(--lumi-transition-control);
		flex-shrink: 0;
	}

	.lumi-number-input__btn--decrement {
		border-inline-end: var(--lumi-border-width-thin) solid
			var(--lumi-color-border-glass);
	}

	.lumi-number-input__btn--increment {
		border-inline-start: var(--lumi-border-width-thin) solid
			var(--lumi-color-border-glass);
	}

	.lumi-number-input__btn:hover:not(:disabled) {
		color: var(--input-accent);
		background: color-mix(
			in srgb,
			var(--input-accent) 8%,
			color-mix(in srgb, var(--number-bg) 90%, var(--lumi-color-surface) 10%)
		);
	}

	.lumi-number-input__btn:active:not(:disabled) {
		background: color-mix(in srgb, var(--input-accent) 14%, transparent);
	}

	.lumi-number-input__btn:focus-visible {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
	}

	.lumi-number-input--sm .lumi-number-input__wrapper {
		min-height: var(--lumi-control-height-sm);
	}

	.lumi-number-input--sm .lumi-number-input__field {
		font-size: var(--lumi-font-size-sm);
		padding: 0 var(--lumi-space-xs);
	}

	.lumi-number-input--sm {
		--number-btn-size: var(--lumi-control-height-sm);
	}

	.lumi-number-input--lg .lumi-number-input__wrapper {
		min-height: var(--lumi-control-height-lg);
	}

	.lumi-number-input--lg .lumi-number-input__field {
		font-size: var(--lumi-font-size-lg);
		padding: 0 var(--lumi-space-md);
	}

	.lumi-number-input--lg {
		--number-btn-size: var(--lumi-control-height-lg);
	}

	.lumi-number-input--disabled {
		opacity: var(--lumi-opacity-disabled);
		pointer-events: none;
	}

	.lumi-number-input__field::-webkit-inner-spin-button,
	.lumi-number-input__field::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
