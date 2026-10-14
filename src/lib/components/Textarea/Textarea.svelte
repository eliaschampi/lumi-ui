<script lang="ts">
	import { FieldLabel, FieldMessage } from '../Field';
	import type { TextareaProps } from './types';

	let {
		value = $bindable(''),
		name = '',
		label = '',
		placeholder = '',
		error = false,
		hint = '',
		maxlength = undefined,
		disabled = false,
		readonly = false,
		rows = 3,
		size = 'md',
		color = 'primary',
		required = false,
		'aria-label': ariaLabel = '',
		showCount = false,
		class: className = '',
		oninput,
		onfocus,
		onblur,
		onkeydown
	}: TextareaProps = $props();

	let textareaRef: HTMLTextAreaElement | undefined = $state();

	const instanceId = $props.id();
	const id = `lumi-textarea-${instanceId}`;
	const messageId = `${id}-message`;
	const invalid = $derived(Boolean(error));
	const errorText = $derived(typeof error === 'string' ? error : '');

	const classes = $derived(
		[
			'lumi-textarea',
			`lumi-textarea--${size}`,
			invalid && 'lumi-textarea--invalid',
			disabled && 'lumi-textarea--disabled',
			className
		]
			.filter(Boolean)
			.join(' ')
	);

	const charCount = $derived(value?.length || 0);

	function handleInput(event: Event): void {
		value = (event.target as HTMLTextAreaElement).value;
		oninput?.(event);
	}

	// Public methods (exposed via bind:this)
	export const focus = () => textareaRef?.focus();
	export const blur = () => textareaRef?.blur();
</script>

<div
	class={classes}
	style:--lumi-control-accent="var(--lumi-color-{invalid ? 'danger' : color})"
>
	{#if label}
		<FieldLabel for={id} {label} {required} />
	{/if}

	<div class="lumi-textarea__wrapper">
		<textarea
			{id}
			bind:this={textareaRef}
			{name}
			{placeholder}
			{disabled}
			{readonly}
			{required}
			{rows}
			{maxlength}
			{value}
			aria-label={ariaLabel || (label ? undefined : placeholder) || undefined}
			aria-invalid={invalid || undefined}
			aria-describedby={errorText || hint ? messageId : undefined}
			class="lumi-textarea__input lumi-autofill"
			oninput={handleInput}
			{onfocus}
			{onblur}
			{onkeydown}
		></textarea>

		{#if maxlength && showCount}
			<div class="lumi-textarea__counter">{charCount}/{maxlength}</div>
		{/if}
	</div>

	<FieldMessage id={messageId} error={errorText} {hint} />
</div>

<style>
	.lumi-textarea {
		display: flex;
		flex-direction: column;
		width: 100%;
		--textarea-bg: var(--lumi-color-control-fill);
		--textarea-bg-focus: var(--lumi-color-control-focus-fill);
		--lumi-control-autofill-bg: var(--textarea-bg);
	}

	.lumi-textarea:focus-within {
		--lumi-control-autofill-bg: var(--textarea-bg-focus);
	}

	.lumi-textarea__wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.lumi-textarea__input {
		width: 100%;
		padding: var(--lumi-space-sm) var(--lumi-space-md);
		background: var(--textarea-bg);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-control-border);
		border-radius: var(--lumi-radius-control);
		box-shadow: var(--lumi-control-shadow);
		font-family: inherit;
		font-size: var(--lumi-font-size-base);
		line-height: var(--lumi-line-height-normal);
		color: var(--lumi-color-text);
		resize: none;
		field-sizing: content;
		min-height: calc(var(--lumi-space-3xl) + var(--lumi-space-sm));
		overflow-y: hidden;
		transition: var(--lumi-transition-control);
	}

	.lumi-textarea__input::placeholder {
		color: var(--lumi-color-placeholder);
	}

	.lumi-textarea__input:focus {
		outline: none;
		border-color: var(--lumi-control-accent);
		background: var(--textarea-bg-focus);
		box-shadow: var(--lumi-control-focus-shadow);
	}

	.lumi-textarea__input:hover:not(:focus):not(:disabled):not(
			[aria-invalid='true']
		) {
		border-color: var(--lumi-color-border-strong);
		background: var(--lumi-color-control-hover-fill);
	}

	.lumi-textarea__input:read-only {
		cursor: default;
		background: var(--textarea-bg);
	}

	.lumi-textarea__counter {
		position: absolute;
		inset-block-end: var(--lumi-space-xs);
		inset-inline-end: var(--lumi-space-xs);
		font-size: var(--lumi-font-size-xs);
		color: var(--lumi-color-text-muted);
		background: var(--lumi-color-surface-glass-strong);
		padding: var(--lumi-space-2xs);
		border-radius: var(--lumi-radius-panel);
		pointer-events: none;
	}

	/* Size variants */
	.lumi-textarea--sm .lumi-textarea__input {
		padding: var(--lumi-space-xs) var(--lumi-space-sm);
		font-size: var(--lumi-font-size-sm);
	}

	.lumi-textarea--sm .lumi-textarea__counter {
		font-size: var(--lumi-font-size-xs);
		padding: calc(var(--lumi-space-2xs) / 2) var(--lumi-space-2xs);
	}

	.lumi-textarea--lg .lumi-textarea__input {
		padding: var(--lumi-space-md) var(--lumi-space-lg);
		font-size: var(--lumi-font-size-lg);
	}

	/* State variants */
	.lumi-textarea--invalid .lumi-textarea__input {
		border-color: var(--lumi-control-accent);
	}

	.lumi-textarea--disabled .lumi-textarea__input {
		cursor: not-allowed;
	}

	.lumi-textarea--disabled {
		opacity: var(--lumi-opacity-disabled);
		pointer-events: none;
	}
</style>
