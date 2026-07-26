<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Minus from '@lucide/svelte/icons/minus';
	import type { CheckboxProps } from './types';

	let {
		checked = $bindable(false),
		indeterminate = $bindable(false),
		name = '',
		label = '',
		size = 'md',
		color = 'primary',
		disabled = false,
		required = false,
		class: className = '',
		children,
		onchange,
		'aria-label': ariaLabel = ''
	}: CheckboxProps = $props();

	const instanceId = $props.id();
	const checkboxId = `lumi-checkbox-${instanceId}`;

	// Computed classes
	const classes = $derived(
		[
			'lumi-checkbox',
			`lumi-checkbox--${size}`,
			`lumi-checkbox--${color}`,
			(checked || indeterminate) && 'lumi-checkbox--checked',
			disabled && 'lumi-checkbox--disabled',
			className
		]
			.filter(Boolean)
			.join(' ')
	);

	const handleChange = (event: Event) => {
		if (disabled) return;
		const target = event.target as HTMLInputElement;
		checked = target.checked;
		indeterminate = false; // Reset indeterminate on user interaction
		if (onchange) onchange(checked, event);
	};
</script>

<label
	for={checkboxId}
	class={classes}
	style:--checkbox-color="var(--lumi-color-{color})"
	style:--checkbox-solid="var(--lumi-color-{color}-solid)"
	style:--checkbox-foreground="var(--lumi-color-{color}-foreground)"
>
	<input
		id={checkboxId}
		type="checkbox"
		{name}
		{checked}
		{disabled}
		{required}
		aria-label={ariaLabel || label || undefined}
		class="lumi-checkbox__input"
		onchange={handleChange}
		bind:indeterminate
	/>

	<div class="lumi-checkbox__visual" aria-hidden="true">
		{#if indeterminate}
			<Minus
				class="lumi-checkbox__icon"
				size="var(--checkbox-icon-size)"
				strokeWidth={3}
			/>
		{:else if checked}
			<Check
				class="lumi-checkbox__icon"
				size="var(--checkbox-icon-size)"
				strokeWidth={3}
			/>
		{/if}
	</div>

	{#if label || children}
		<span class="lumi-checkbox__label">
			{#if children}
				{@render children()}
			{:else}
				{label}
			{/if}
		</span>
	{/if}
</label>

<style>
	.lumi-checkbox {
		--checkbox-size: var(--lumi-icon-md);
		--checkbox-icon-size: var(--lumi-icon-sm);
		--checkbox-label-size: var(--lumi-font-size-base);
		--checkbox-radius: var(--lumi-radius-base);
		--checkbox-color: var(--lumi-color-primary);
		--lumi-control-accent: var(--checkbox-color);
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: var(--lumi-space-sm);
		cursor: pointer;
		user-select: none;
		font-family: var(--lumi-font-family-sans);
		transition: var(--lumi-transition-opacity);
	}

	.lumi-checkbox__input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
		width: 0;
		height: 0;
	}

	.lumi-checkbox__visual {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--checkbox-size);
		height: var(--checkbox-size);
		border: var(--lumi-border-width-base) solid var(--lumi-color-control-border);
		border-radius: var(--checkbox-radius);
		background: var(--lumi-color-control-fill);
		box-shadow: var(--lumi-control-shadow);
		transition:
			background-color var(--lumi-duration-base) var(--lumi-easing-default),
			border-color var(--lumi-duration-base) var(--lumi-easing-default),
			box-shadow var(--lumi-duration-base) var(--lumi-easing-default),
			transform var(--lumi-duration-fast) var(--lumi-easing-default);
		flex-shrink: 0;
		overflow: hidden;
	}

	:global(.lumi-checkbox__icon) {
		color: var(--checkbox-foreground);
		opacity: 0;
		transform: scale(0.6);
		transition:
			opacity var(--lumi-duration-fast) var(--lumi-easing-default),
			transform var(--lumi-duration-base) var(--lumi-easing-default);
		pointer-events: none;
	}

	.lumi-checkbox__label {
		color: var(--lumi-color-text);
		font-size: var(--checkbox-label-size);
		font-weight: var(--lumi-font-weight-medium);
		line-height: var(--lumi-line-height-tight);
		cursor: pointer;
	}

	.lumi-checkbox--sm {
		--checkbox-size: var(--lumi-icon-sm);
		--checkbox-icon-size: var(--lumi-icon-xs);
		--checkbox-label-size: var(--lumi-font-size-sm);
		--checkbox-radius: var(--lumi-radius-sm);
	}

	.lumi-checkbox--md {
		--checkbox-size: var(--lumi-icon-md);
		--checkbox-label-size: var(--lumi-font-size-base);
	}

	.lumi-checkbox--checked .lumi-checkbox__visual {
		background: var(--checkbox-solid);
		border-color: var(--checkbox-solid);
		box-shadow: var(--lumi-control-active-shadow);
	}

	.lumi-checkbox--checked :global(.lumi-checkbox__icon) {
		opacity: 1;
		transform: scale(1);
	}

	.lumi-checkbox__input:focus-visible + .lumi-checkbox__visual {
		box-shadow: var(--lumi-control-focus-shadow);
	}

	.lumi-checkbox:not(.lumi-checkbox--checked):not(
			.lumi-checkbox--disabled
		):hover
		.lumi-checkbox__visual {
		border-color: var(--lumi-control-active-border);
		background: var(--lumi-control-active-fill);
	}

	.lumi-checkbox:not(.lumi-checkbox--disabled):active .lumi-checkbox__visual {
		transform: scale(var(--lumi-interactive-press-scale));
	}

	.lumi-checkbox--disabled {
		cursor: not-allowed;
		opacity: var(--lumi-opacity-disabled);
	}

	.lumi-checkbox--disabled .lumi-checkbox__visual {
		background: var(--lumi-color-background-secondary);
		border-color: var(--lumi-color-border);
	}

	.lumi-checkbox--disabled.lumi-checkbox--checked .lumi-checkbox__visual {
		background: var(--lumi-color-border);
		border-color: var(--lumi-color-border);
	}

	@media (prefers-reduced-motion: reduce) {
		.lumi-checkbox__visual,
		:global(.lumi-checkbox__icon) {
			transition: none;
		}
	}
</style>
