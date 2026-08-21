<script lang="ts">
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
	// error: boolean → invalid only; string → invalid + message.
	const errorText = $derived(typeof error === 'string' ? error : '');
	const hasError = $derived(errorText.length > 0);
	const isInvalid = $derived(Boolean(error));
	const activeColor = $derived(isInvalid ? 'danger' : color);
	const describedBy = $derived.by(() => {
		const ids: string[] = [];
		if (hasError) ids.push(`${id}-error`);
		if (hint) ids.push(`${id}-hint`);
		return ids.join(' ');
	});

	const classes = $derived(
		[
			'lumi-textarea',
			`lumi-textarea--${size}`,
			isInvalid && 'lumi-textarea--error',
			disabled && 'lumi-textarea--disabled',
			readonly && 'lumi-textarea--readonly',
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

	function handleKeydown(event: KeyboardEvent): void {
		onkeydown?.(event);
	}

	// Public methods (exposed via bind:this)
	export const focus = () => textareaRef?.focus();
	export const blur = () => textareaRef?.blur();
</script>

<div class={classes} style:--textarea-color="var(--lumi-color-{activeColor})">
	{#if label}
		<label for={id} class="lumi-textarea__label">
			{label}
			{#if required}
				<span class="lumi-textarea__required">*</span>
			{/if}
		</label>
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
			aria-label={ariaLabel || label || placeholder || undefined}
			aria-invalid={isInvalid || undefined}
			aria-describedby={describedBy || undefined}
			class="lumi-textarea__input lumi-autofill"
			oninput={handleInput}
			{onfocus}
			{onblur}
			onkeydown={handleKeydown}
		></textarea>

		{#if maxlength && showCount}
			<div class="lumi-textarea__counter">{charCount}/{maxlength}</div>
		{/if}
	</div>

	{#if hasError}
		<div id={`${id}-error`} class="lumi-textarea__error" aria-live="polite">
			{errorText}
		</div>
	{/if}

	{#if hint}
		<div id={`${id}-hint`} class="lumi-textarea__hint">{hint}</div>
	{/if}
</div>

<style>
	.lumi-textarea {
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-xs);
		width: 100%;
		--textarea-color: var(--lumi-color-primary);
		--lumi-control-accent: var(--textarea-color);
		--textarea-bg: var(--lumi-color-control-fill);
		--textarea-bg-focus: var(--lumi-color-control-focus-fill);
		--lumi-control-autofill-bg: var(--textarea-bg);
	}

	.lumi-textarea:focus-within {
		--lumi-control-autofill-bg: var(--textarea-bg-focus);
	}

	.lumi-textarea__label {
		font-size: var(--lumi-font-size-sm);
		font-weight: var(--lumi-font-weight-semibold);
		color: var(--lumi-color-text);
		cursor: pointer;
		transition: color var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	.lumi-textarea__required {
		color: var(--lumi-color-danger);
		margin-left: var(--lumi-space-2xs);
	}

	.lumi-textarea:focus-within .lumi-textarea__label,
	.lumi-textarea--error .lumi-textarea__label {
		color: var(--textarea-color);
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
		border-radius: var(--lumi-control-radius);
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
		border-color: var(--textarea-color);
		background: var(--textarea-bg-focus);
		box-shadow: var(--lumi-control-focus-shadow);
	}

	.lumi-textarea__input:hover:not(:focus):not(:disabled) {
		border-color: var(--lumi-color-border-strong);
		background: var(--lumi-color-control-hover-fill);
	}

	.lumi-textarea__input:read-only {
		cursor: default;
		background: var(--textarea-bg);
	}

	.lumi-textarea__counter {
		position: absolute;
		bottom: var(--lumi-space-xs);
		right: var(--lumi-space-xs);
		font-size: var(--lumi-font-size-xs);
		color: var(--lumi-color-text-muted);
		background: var(--lumi-color-surface-glass-strong);
		padding: var(--lumi-space-2xs);
		border-radius: var(--lumi-radius-panel);
		pointer-events: none;
	}

	.lumi-textarea__error {
		font-size: var(--lumi-font-size-xs);
		color: var(--lumi-color-danger);
		margin-top: var(--lumi-space-2xs);
	}

	.lumi-textarea__hint {
		font-size: var(--lumi-font-size-xs);
		color: var(--lumi-color-text-muted);
		margin-top: var(--lumi-space-2xs);
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

	.lumi-textarea--md .lumi-textarea__input {
		padding: var(--lumi-space-sm) var(--lumi-space-md);
		font-size: var(--lumi-font-size-base);
	}

	.lumi-textarea--lg .lumi-textarea__input {
		padding: var(--lumi-space-md) var(--lumi-space-lg);
		font-size: var(--lumi-font-size-lg);
	}

	/* State variants */
	.lumi-textarea--error .lumi-textarea__input {
		border-color: var(--textarea-color);
	}

	.lumi-textarea--disabled .lumi-textarea__input {
		cursor: not-allowed;
	}

	.lumi-textarea--disabled {
		opacity: var(--lumi-opacity-disabled);
		pointer-events: none;
	}

	.lumi-textarea--readonly .lumi-textarea__input {
		cursor: default;
		background: var(--textarea-bg);
	}
</style>
