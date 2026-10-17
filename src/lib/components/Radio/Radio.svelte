<script lang="ts">
	import type { RadioProps } from './types';

	let {
		group = $bindable(),
		value,
		label = '',
		description = '',
		option = false,
		busy = false,
		name = '',
		size = 'md',
		color = 'primary',
		disabled = false,
		class: className = '',
		children,
		onchange,
		'aria-label': ariaLabel
	}: RadioProps = $props();

	const uid = $props.id();
	const labelId = `lumi-radio-${uid}-label`;
	const descriptionId = `lumi-radio-${uid}-description`;
	const checked = $derived(group === value);

	function handleChange(event: Event): void {
		group = value;
		onchange?.(value, event);
	}
</script>

<label
	class={[
		'lumi-radio',
		`lumi-radio--${size}`,
		(option || description) && 'lumi-radio-option',
		description && 'lumi-radio--card',
		busy && 'lumi-radio-option--busy',
		checked && 'lumi-radio--checked',
		disabled && 'lumi-radio--disabled',
		className
	]}
	style:--radio-color="var(--lumi-color-{color})"
	aria-busy={busy || undefined}
>
	<input
		type="radio"
		class="lumi-sr-only"
		{name}
		{value}
		{checked}
		disabled={disabled || busy}
		aria-label={ariaLabel}
		aria-labelledby={description && !ariaLabel ? labelId : undefined}
		aria-describedby={description ? descriptionId : undefined}
		onchange={handleChange}
	/>
	<span class="lumi-radio__visual" aria-hidden="true">
		<span class="lumi-radio__circle"></span>
	</span>
	{#if label || children}
		<span id={labelId} class="lumi-radio__label">
			{#if children}
				{@render children()}
			{:else}
				{label}
			{/if}
		</span>
	{/if}
	{#if description}
		<span id={descriptionId} class="lumi-radio__description">{description}</span
		>
	{/if}
</label>

<style>
	/* ── Base control ─────────────────────────────────────────── */
	.lumi-radio {
		--radio-size: var(--lumi-icon-md);
		--radio-dot-size: var(--lumi-space-sm);
		--radio-label-size: var(--lumi-font-size-base);
		--lumi-control-accent: var(--radio-color);

		position: relative;
		display: inline-flex;
		align-items: center;
		gap: var(--lumi-space-sm);
		cursor: pointer;
		user-select: none;
		font-family: var(--lumi-font-family-sans);
	}

	.lumi-radio__visual {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--radio-size);
		height: var(--radio-size);
		border: var(--lumi-border-width-base) solid var(--lumi-color-control-border);
		border-radius: var(--lumi-radius-full);
		background: var(--lumi-color-control-fill);
		box-shadow: var(--lumi-control-shadow);
		flex-shrink: 0;
		transition: var(--lumi-transition-control);
	}

	.lumi-radio__circle {
		width: var(--radio-dot-size);
		height: var(--radio-dot-size);
		border-radius: var(--lumi-radius-full);
		background: transparent;
		transform: scale(0);
		transition:
			transform var(--lumi-duration-fast) var(--lumi-easing-default),
			background-color var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	.lumi-radio__label {
		color: var(--lumi-color-text);
		font-size: var(--radio-label-size);
		font-weight: var(--lumi-font-weight-medium);
		line-height: var(--lumi-line-height-tight);
	}

	/* ── Option card (sidebar / dialog lists) ─────────────────── */
	.lumi-radio.lumi-radio-option {
		width: 100%;
		padding: var(--lumi-space-sm) var(--lumi-space-md);
		border-radius: var(--lumi-radius-option);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border-glass);
		background: var(--lumi-color-surface-card);
		transition: var(--lumi-transition-control);
	}

	.lumi-radio.lumi-radio-option:not(.lumi-radio--card) {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--lumi-space-sm);
	}

	/* Card: dot + label on the first row, description aligned under the label. */
	.lumi-radio.lumi-radio-option.lumi-radio--card {
		display: grid;
		grid-template-columns: var(--radio-size) minmax(0, 1fr);
		column-gap: var(--lumi-space-sm);
		row-gap: var(--lumi-space-2xs);
	}

	@media (hover: hover) {
		.lumi-radio.lumi-radio-option:not(.lumi-radio--disabled):not(
				.lumi-radio--checked
			):hover {
			border-color: var(--lumi-control-active-border);
			background: var(--lumi-control-active-fill);
		}
	}

	.lumi-radio.lumi-radio-option.lumi-radio--checked {
		border-color: var(--lumi-control-active-border);
		background: var(--lumi-control-active-fill);
		box-shadow: var(--lumi-control-active-shadow);
	}

	.lumi-radio.lumi-radio-option--busy {
		opacity: var(--lumi-opacity-disabled);
		pointer-events: none;
	}

	.lumi-radio__description {
		grid-column: 2;
		font-size: var(--lumi-font-size-xs);
		font-weight: var(--lumi-font-weight-normal);
		line-height: var(--lumi-line-height-normal);
		color: var(--lumi-color-text-muted);
	}

	/* ── Size variants ────────────────────────────────────────── */
	.lumi-radio--sm {
		--radio-size: var(--lumi-icon-sm);
		--radio-dot-size: var(--lumi-space-xs);
		--radio-label-size: var(--lumi-font-size-sm);
	}

	/* ── States ───────────────────────────────────────────────── */
	.lumi-radio:not(.lumi-radio--disabled):hover .lumi-radio__visual {
		border-color: var(--lumi-control-active-border);
		background: var(--lumi-control-active-fill);
	}

	.lumi-radio--checked .lumi-radio__visual {
		border-color: var(--lumi-control-active-border);
		background: var(--lumi-control-active-fill);
		box-shadow: var(--lumi-control-active-shadow);
	}

	.lumi-radio--checked .lumi-radio__circle {
		background: var(--radio-color);
		transform: scale(1);
	}

	input:focus-visible + .lumi-radio__visual {
		box-shadow: var(--lumi-control-focus-shadow);
	}

	.lumi-radio--disabled {
		cursor: not-allowed;
		opacity: var(--lumi-opacity-disabled);
	}

	.lumi-radio--disabled .lumi-radio__visual {
		background: var(--lumi-color-background-secondary);
		border-color: var(--lumi-color-border);
	}

	.lumi-radio--disabled.lumi-radio--checked .lumi-radio__visual {
		border-color: var(--lumi-color-border);
	}

	.lumi-radio--disabled.lumi-radio--checked .lumi-radio__circle {
		background: var(--lumi-color-text-muted);
	}

	/* ── Option list wrapper (pages use on parent div) ─────────── */
	:global(.lumi-radio-option-list) {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-sm);
	}

	:global(.lumi-radio-option-list--gap-2xs) {
		gap: var(--lumi-space-2xs);
	}
</style>
