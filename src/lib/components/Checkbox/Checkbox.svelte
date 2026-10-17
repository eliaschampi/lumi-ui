<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Minus from '@lucide/svelte/icons/minus';
	import type { CheckboxProps } from './types';

	let {
		checked = $bindable(false),
		indeterminate = $bindable(false),
		name,
		value,
		label = '',
		size = 'md',
		color = 'primary',
		disabled = false,
		required = false,
		class: className = '',
		children,
		onchange,
		'aria-label': ariaLabel
	}: CheckboxProps = $props();

	function handleChange(event: Event): void {
		checked = (event.currentTarget as HTMLInputElement).checked;
		indeterminate = false;
		onchange?.(checked, event);
	}
</script>

<label
	class={[
		'lumi-checkbox',
		`lumi-checkbox--${size}`,
		(checked || indeterminate) && 'lumi-checkbox--checked',
		disabled && 'lumi-checkbox--disabled',
		className
	]}
	style:--checkbox-color="var(--lumi-color-{color})"
	style:--checkbox-solid="var(--lumi-color-{color}-solid)"
	style:--checkbox-foreground="var(--lumi-color-{color}-foreground)"
>
	<input
		type="checkbox"
		class="lumi-sr-only"
		{name}
		{value}
		{checked}
		{disabled}
		{required}
		aria-label={ariaLabel}
		onchange={handleChange}
		bind:indeterminate
	/>

	<span class="lumi-checkbox__visual" aria-hidden="true">
		{#if indeterminate}
			<Minus
				class="lumi-checkbox__icon lumi-checkbox__icon--minus"
				strokeWidth={3}
			/>
		{:else if checked}
			<Check
				class="lumi-checkbox__icon lumi-checkbox__icon--check"
				strokeWidth={3}
			/>
		{/if}
	</span>

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
		--checkbox-radius: var(--lumi-radius-xs);
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
		transition: var(--lumi-transition-interactive);
		flex-shrink: 0;
		overflow: hidden;
	}

	/* Icons mount with their state, so keyframes (not transitions) animate them.
	   The check draws like a pen stroke from its short arm; the dash exceeds
	   both glyphs' length in Lucide's 24-unit viewBox. */
	:global(.lumi-checkbox__icon) {
		inline-size: var(--checkbox-icon-size);
		block-size: var(--checkbox-icon-size);
		color: var(--checkbox-foreground);
		pointer-events: none;
	}

	:global(.lumi-checkbox__icon--check) {
		stroke-dasharray: 24;
		animation: lumi-checkbox-draw var(--lumi-duration-base)
			var(--lumi-easing-default);
	}

	:global(.lumi-checkbox__icon--minus) {
		animation: lumi-checkbox-grow var(--lumi-duration-fast)
			var(--lumi-easing-default);
	}

	@keyframes -global-lumi-checkbox-draw {
		from {
			stroke-dashoffset: -24;
		}
	}

	@keyframes -global-lumi-checkbox-grow {
		from {
			transform: scaleX(0);
		}
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
		--checkbox-radius: var(--lumi-radius-2xs);
	}

	.lumi-checkbox--checked .lumi-checkbox__visual {
		background: var(--checkbox-solid);
		border-color: var(--checkbox-solid);
		box-shadow: var(--lumi-control-active-shadow);
	}

	input:focus-visible + .lumi-checkbox__visual {
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

	.lumi-checkbox--disabled:not(.lumi-checkbox--checked) .lumi-checkbox__visual {
		background: var(--lumi-color-background-secondary);
		border-color: var(--lumi-color-border);
	}
</style>
