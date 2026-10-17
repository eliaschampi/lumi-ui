<script lang="ts">
	import { FieldLabel, FieldMessage } from '../Field';
	import type { TextareaProps } from './types';

	let {
		value = $bindable(''),
		label = '',
		placeholder = '',
		error = false,
		hint = '',
		maxlength,
		disabled = false,
		required = false,
		rows = 3,
		size = 'md',
		color = 'primary',
		showCount = false,
		id: idProp,
		'aria-label': ariaLabel,
		class: className = '',
		...rest
	}: TextareaProps = $props();

	let textarea: HTMLTextAreaElement | undefined = $state();

	const uid = $props.id();
	const id = $derived(idProp ?? `lumi-textarea-${uid}`);
	const messageId = $derived(`${id}-message`);
	const invalid = $derived(Boolean(error));
	const errorText = $derived(typeof error === 'string' ? error : '');

	export function focus(): void {
		textarea?.focus();
	}
</script>

<div
	class={[
		'lumi-field',
		'lumi-textarea',
		`lumi-field--${size}`,
		invalid && 'lumi-field--invalid',
		disabled && 'lumi-field--disabled',
		showCount && maxlength && 'lumi-textarea--count',
		className
	]}
	style:--lumi-textarea-rows={rows}
	style:--lumi-control-accent="var(--lumi-color-{invalid ? 'danger' : color})"
>
	{#if label}
		<FieldLabel for={id} {label} required={!!required} />
	{/if}

	<div class="lumi-field__control">
		<textarea
			{...rest}
			bind:this={textarea}
			bind:value
			{id}
			{rows}
			{maxlength}
			{placeholder}
			{disabled}
			{required}
			class="lumi-field__input lumi-autofill"
			aria-label={ariaLabel ?? (label ? undefined : placeholder || undefined)}
			aria-invalid={invalid || undefined}
			aria-describedby={errorText || hint ? messageId : undefined}
		></textarea>

		{#if showCount && maxlength}
			<span class="lumi-textarea__count" aria-hidden="true">
				{value?.length ?? 0}/{maxlength}
			</span>
		{/if}
	</div>

	<FieldMessage id={messageId} error={errorText} {hint} />
</div>

<style>
	.lumi-textarea {
		--lumi-field-pad-y: var(--lumi-field-pad-x);
	}

	.lumi-textarea .lumi-field__control {
		align-items: stretch;
	}

	/* `rows` is the minimum height; the field grows with its content where
	   field-sizing is supported and is resizable everywhere else. */
	textarea {
		field-sizing: content;
		min-block-size: calc(
			var(--lumi-textarea-rows) * 1lh + 2 * var(--lumi-field-pad-y)
		);
		resize: none;
	}

	@supports not (field-sizing: content) {
		textarea {
			resize: vertical;
		}
	}

	.lumi-textarea--count textarea {
		padding-block-end: calc(var(--lumi-field-pad-y) + var(--lumi-space-md));
	}

	.lumi-textarea__count {
		position: absolute;
		inset-block-end: var(--lumi-space-2xs);
		inset-inline-end: var(--lumi-space-xs);
		padding-inline: var(--lumi-space-2xs);
		font-size: var(--lumi-font-size-xs);
		font-variant-numeric: tabular-nums;
		color: var(--lumi-color-text-muted);
		background: var(--lumi-color-control-fill);
		border-radius: var(--lumi-radius-sm);
		pointer-events: none;
	}
</style>
