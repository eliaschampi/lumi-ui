<script lang="ts">
	import { FieldLabel, FieldMessage } from '../Field';
	import { Icon } from '../Icon';
	import type { InputProps } from './types';

	let {
		type = 'text',
		name = '',
		value = $bindable(''),
		min,
		max,
		maxlength,
		step,
		label = '',
		labelPlaceholder = '',
		placeholder = '',
		icon = '',
		iconLabel = '',
		actionIcon = '',
		actionLabel = '',
		iconAfter = false,
		color = 'primary',
		error = false,
		hint = '',
		size = 'md',
		disabled = false,
		readonly = false,
		required = false,
		'aria-label': ariaLabel = '',
		class: className = '',
		oninput,
		onfocus,
		onblur,
		'onicon-click': onIconClick,
		'onaction-click': onActionClick
	}: InputProps = $props();

	// Set by validate() from native constraints; cleared once the value is valid.
	let nativeError = $state('');
	let inputElement: HTMLInputElement | undefined = $state();

	const instanceId = $props.id();
	const inputId = `lumi-input-${instanceId}`;
	const messageId = `${inputId}-message`;

	const invalid = $derived(Boolean(error) || nativeError !== '');
	const errorText = $derived(
		(typeof error === 'string' && error) || nativeError
	);
	const showLabel = $derived(Boolean(label) && !labelPlaceholder);
	const hasPrefix = $derived(Boolean(icon) && !iconAfter);
	const hasTrailingIcon = $derived(Boolean(icon) && iconAfter);
	const hasSuffix = $derived(invalid || Boolean(actionIcon) || hasTrailingIcon);

	function handleIconClick(event: MouseEvent): void {
		inputElement?.focus();
		onIconClick?.(event);
	}

	function handleActionClick(event: MouseEvent): void {
		inputElement?.focus();
		onActionClick?.(event);
	}

	function handleInput(event: Event): void {
		if (nativeError && inputElement) {
			nativeError = inputElement.validity.valid
				? ''
				: inputElement.validationMessage;
		}
		oninput?.(event);
	}

	export function validate(): boolean {
		if (!inputElement) return true;
		const { valid } = inputElement.validity;
		nativeError = valid ? '' : inputElement.validationMessage;
		return valid;
	}

	export function focus(): void {
		inputElement?.focus();
	}
	export function blur(): void {
		inputElement?.blur();
	}
	export function select(): void {
		inputElement?.select();
	}
</script>

{#snippet iconSlot(position: 'before' | 'after')}
	{#if onIconClick}
		<button
			type="button"
			class="lumi-input__icon lumi-input__icon--{position}"
			aria-label={iconLabel || 'Input icon'}
			{disabled}
			onclick={handleIconClick}
		>
			<Icon {icon} {size} />
		</button>
	{:else}
		<span
			class="lumi-input__icon lumi-input__icon--{position}"
			aria-hidden="true"
		>
			<Icon {icon} {size} />
		</span>
	{/if}
{/snippet}

<div
	class="lumi-input-container lumi-input-container--{size} {className}"
	class:lumi-input-container--invalid={invalid}
	class:lumi-input-container--disabled={disabled}
	style:--lumi-control-accent="var(--lumi-color-{invalid ? 'danger' : color})"
>
	{#if showLabel}
		<FieldLabel for={inputId} {label} {required} />
	{/if}

	<div class="lumi-input__wrapper">
		{#if hasPrefix}
			{@render iconSlot('before')}
		{/if}

		<input
			bind:this={inputElement}
			id={inputId}
			{name}
			{type}
			{min}
			{max}
			{maxlength}
			{step}
			bind:value
			{disabled}
			{readonly}
			{required}
			placeholder={labelPlaceholder || placeholder}
			aria-label={ariaLabel ||
				(showLabel ? undefined : labelPlaceholder || placeholder) ||
				undefined}
			aria-invalid={invalid || undefined}
			aria-describedby={errorText || hint ? messageId : undefined}
			class="lumi-input lumi-autofill"
			class:lumi-input--has-prefix={hasPrefix}
			class:lumi-input--has-suffix={hasSuffix}
			oninput={handleInput}
			{onfocus}
			{onblur}
		/>

		{#if hasSuffix}
			<div class="lumi-input__suffix">
				{#if invalid}
					<span
						class="lumi-input__validation-icon lumi-input__suffix-item"
						aria-hidden="true"
					>
						<Icon icon="xCircle" {size} />
					</span>
				{/if}

				{#if actionIcon}
					<button
						type="button"
						class="lumi-input__action lumi-input__suffix-item"
						aria-label={actionLabel || 'Input action'}
						{disabled}
						onclick={handleActionClick}
					>
						<Icon icon={actionIcon} {size} />
					</button>
				{/if}

				{#if hasTrailingIcon}
					{@render iconSlot('after')}
				{/if}
			</div>
		{/if}
	</div>

	<FieldMessage id={messageId} error={errorText} {hint} />
</div>

<style>
	.lumi-input-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		--input-border: var(--lumi-color-control-border);
		--input-bg: var(--lumi-color-control-fill);
		--input-bg-focus: var(--lumi-color-control-focus-fill);
		--input-height: var(--lumi-control-height-md);
		--input-padding-block: var(--lumi-space-xs);
		--input-padding-inline: var(--lumi-space-sm);
		--input-font-size: var(--lumi-font-size-base);
		--input-icon-padding: var(--lumi-space-sm);
		--lumi-control-autofill-bg: var(--input-bg);
	}

	.lumi-input-container:focus-within {
		--lumi-control-autofill-bg: var(--input-bg-focus);
	}

	.lumi-input-container--invalid {
		--input-border: var(--lumi-control-accent);
	}

	.lumi-input-container--disabled {
		opacity: var(--lumi-opacity-disabled);
		pointer-events: none;
	}

	/* ── Wrapper ──────────────────────────────── */
	.lumi-input__wrapper {
		display: flex;
		align-items: center;
		position: relative;
		min-height: var(--input-height);
		background: var(--input-bg);
		border: var(--lumi-border-width-thin) solid var(--input-border);
		border-radius: var(--lumi-radius-control);
		box-shadow: var(--lumi-control-shadow);
		transition: var(--lumi-transition-control);
		overflow: hidden;
	}

	.lumi-input-container:not(.lumi-input-container--invalid)
		.lumi-input__wrapper:hover:not(:focus-within) {
		border-color: var(--lumi-color-border-strong);
		background: var(--lumi-color-control-hover-fill);
	}

	.lumi-input__wrapper:focus-within {
		border-color: var(--lumi-control-accent);
		background: var(--input-bg-focus);
		box-shadow: var(--lumi-control-focus-shadow);
	}

	/* ── Input ────────────────────────────────── */
	.lumi-input {
		flex: 1;
		width: 100%;
		min-width: 0;
		padding: var(--input-padding-block) var(--input-padding-inline);
		background: transparent;
		border: none;
		outline: none;
		color: var(--lumi-color-text);
		font-family: inherit;
		font-size: var(--input-font-size);
		line-height: var(--lumi-line-height-normal);
	}

	.lumi-input--has-prefix {
		padding-inline-start: var(--lumi-space-2xs);
	}
	.lumi-input--has-suffix {
		padding-inline-end: var(--lumi-space-2xs);
	}

	.lumi-input::placeholder {
		color: var(--lumi-color-placeholder);
	}

	/* ── Sizes ────────────────────────────────── */
	.lumi-input-container--xs {
		--input-height: var(--lumi-control-height-xs);
		--input-padding-block: var(--lumi-space-2xs);
		--input-padding-inline: var(--lumi-space-xs);
		--input-font-size: var(--lumi-font-size-xs);
		--input-icon-padding: var(--lumi-space-2xs);
	}

	.lumi-input-container--sm {
		--input-height: var(--lumi-control-height-sm);
		--input-font-size: var(--lumi-font-size-sm);
		--input-icon-padding: var(--lumi-space-xs);
	}

	.lumi-input-container--lg {
		--input-height: var(--lumi-control-height-lg);
		--input-padding-block: var(--lumi-space-md);
		--input-padding-inline: var(--lumi-space-md);
		--input-font-size: var(--lumi-font-size-lg);
		--input-icon-padding: var(--lumi-space-md);
	}

	.lumi-input-container--xl {
		--input-height: var(--lumi-control-height-xl);
		--input-padding-block: var(--lumi-space-md);
		--input-padding-inline: var(--lumi-space-lg);
		--input-font-size: var(--lumi-font-size-xl);
		--input-icon-padding: var(--lumi-space-lg);
	}

	/* ── Suffix ───────────────────────────────── */
	.lumi-input__suffix {
		display: inline-flex;
		align-items: center;
		gap: var(--lumi-space-xs);
		padding-inline-end: var(--lumi-space-sm);
		flex-shrink: 0;
	}

	.lumi-input__suffix-item {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	/* ── Icons & Actions ──────────────────────── */
	.lumi-input__icon,
	.lumi-input__action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0 var(--input-icon-padding);
		color: var(--lumi-color-text-muted);
		background: transparent;
		border: none;
		cursor: pointer;
		transition: color var(--lumi-duration-fast) var(--lumi-easing-default);
		flex-shrink: 0;
	}

	.lumi-input__icon[aria-hidden='true'] {
		cursor: default;
	}

	.lumi-input-container:focus-within .lumi-input__icon,
	.lumi-input-container:focus-within .lumi-input__action {
		color: var(--lumi-control-accent);
	}

	.lumi-input__icon:hover,
	.lumi-input__action:hover {
		color: var(--lumi-control-accent);
	}

	.lumi-input__icon:focus-visible,
	.lumi-input__action:focus-visible {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
	}

	.lumi-input__icon--before {
		border-inline-end: var(--lumi-border-width-thin) solid
			var(--lumi-color-border-light);
	}
	.lumi-input__icon--after {
		border-inline-start: var(--lumi-border-width-thin) solid
			var(--lumi-color-border-light);
	}

	.lumi-input__validation-icon {
		display: inline-flex;
		align-items: center;
		color: var(--lumi-control-accent);
	}
</style>
