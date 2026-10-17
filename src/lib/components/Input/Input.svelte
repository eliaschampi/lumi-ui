<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { clear: en.clear };
</script>

<script lang="ts">
	import CircleX from '@lucide/svelte/icons/circle-x';
	import X from '@lucide/svelte/icons/x';
	import { useLumiLocale } from '../../i18n';
	import { FieldLabel, FieldMessage } from '../Field';
	import Icon from '../Icon/Icon.svelte';
	import type { InputProps } from './types';

	let {
		type = 'text',
		value = $bindable(''),
		label = '',
		placeholder = '',
		icon,
		actionIcon,
		actionLabel,
		clearable = false,
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
		onactionclick,
		...rest
	}: InputProps = $props();

	let input: HTMLInputElement | undefined = $state();

	const i18n = useLumiLocale(COPY);
	const uid = $props.id();
	const id = $derived(idProp ?? `lumi-input-${uid}`);
	const messageId = $derived(`${id}-message`);
	const invalid = $derived(Boolean(error));
	const errorText = $derived(typeof error === 'string' ? error : '');
	const iconSize = $derived(
		size === 'xs' ? 'xs' : size === 'lg' || size === 'xl' ? 'md' : 'sm'
	);
	const showClear = $derived(
		clearable && !disabled && !readonly && value != null && value !== ''
	);

	function clear(): void {
		if (!input) return;
		// Native input event so bindings, handlers and forms all observe it.
		input.value = '';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		input.focus();
	}

	function action(event: MouseEvent): void {
		input?.focus();
		onactionclick?.(event);
	}

	export function focus(): void {
		input?.focus();
	}
</script>

<div
	class={[
		'lumi-field',
		'lumi-input-container',
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
		{#if icon}
			<span class="lumi-input__icon" aria-hidden="true">
				<Icon {icon} size={iconSize} />
			</span>
		{/if}

		<input
			{...rest}
			bind:this={input}
			bind:value
			{id}
			{type}
			{placeholder}
			{disabled}
			{readonly}
			{required}
			class="lumi-field__input lumi-autofill"
			aria-label={ariaLabel ?? (label ? undefined : placeholder || undefined)}
			aria-invalid={invalid || undefined}
			aria-describedby={errorText || hint ? messageId : undefined}
		/>

		{#if invalid}
			<span class="lumi-input__invalid" aria-hidden="true">
				<Icon icon={CircleX} size={iconSize} />
			</span>
		{/if}

		{#if showClear}
			<button
				type="button"
				class="lumi-field__button"
				aria-label={i18n.t.clear}
				onclick={clear}
			>
				<Icon icon={X} size={iconSize} />
			</button>
		{/if}

		{#if actionIcon}
			<button
				type="button"
				class="lumi-field__button"
				aria-label={actionLabel}
				{disabled}
				onclick={action}
			>
				<Icon icon={actionIcon} size={iconSize} />
			</button>
		{/if}
	</div>

	<FieldMessage id={messageId} error={errorText} {hint} />
</div>

<style>
	.lumi-input__icon {
		display: inline-flex;
		padding-inline-start: var(--lumi-field-pad-x);
	}

	.lumi-input__icon + .lumi-field__input {
		padding-inline-start: var(--lumi-space-xs);
	}

	.lumi-input__invalid {
		display: inline-flex;
		padding-inline: var(--lumi-space-2xs);
		color: var(--lumi-control-accent);
	}

	.lumi-input__invalid:last-child {
		padding-inline-end: var(--lumi-field-pad-x);
	}

	/* Native date/time pickers: theme-aware (inherits color-scheme), quiet
	   indicator that wakes on hover and focus, no layout jump in WebKit. */
	.lumi-field__input::-webkit-calendar-picker-indicator {
		margin: 0;
		opacity: 0.55;
		cursor: pointer;
		transition: opacity var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	.lumi-field__control:is(:hover, :focus-within)
		.lumi-field__input::-webkit-calendar-picker-indicator {
		opacity: 1;
	}

	.lumi-field__input::-webkit-datetime-edit {
		padding: 0;
	}

	.lumi-field__input::-webkit-date-and-time-value {
		text-align: start;
	}

	/* The clearable button replaces WebKit's search cancel glyph. */
	.lumi-field__input::-webkit-search-cancel-button {
		appearance: none;
	}
</style>
