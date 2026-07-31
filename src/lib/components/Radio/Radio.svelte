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
		'aria-label': ariaLabel = ''
	}: RadioProps = $props();

	const instanceId = $props.id();
	const radioId = `lumi-radio-${instanceId}`;

	const isChecked = $derived(group === value);
	const isOptionCard = $derived(!!description || option);

	function handleChange(event: Event): void {
		if (disabled || busy || group === value) return;
		group = value;
		onchange?.(value, event);
	}
</script>

<label
	class="lumi-radio lumi-radio--{size} lumi-radio--{color} {className}"
	class:lumi-radio-option={isOptionCard}
	class:lumi-radio-option--busy={busy}
	class:lumi-radio--checked={isChecked}
	class:lumi-radio--disabled={disabled}
	class:lumi-radio--card={!!description}
	style:--radio-color="var(--lumi-color-{color})"
	aria-busy={busy || undefined}
>
	<input
		id={radioId}
		type="radio"
		{name}
		{value}
		checked={isChecked}
		disabled={disabled || busy}
		aria-label={ariaLabel || label || description || undefined}
		class="lumi-radio__input"
		onchange={handleChange}
	/>

	{#if description}
		<div class="lumi-radio__header">
			<div class="lumi-radio__visual">
				<div class="lumi-radio__circle"></div>
			</div>
			{#if label || children}
				<span class="lumi-radio__label">
					{#if children}
						{@render children()}
					{:else}
						{label}
					{/if}
				</span>
			{/if}
		</div>
		<span class="lumi-radio__description">{description}</span>
	{:else}
		<div class="lumi-radio__visual">
			<div class="lumi-radio__circle"></div>
		</div>

		{#if label || children}
			<span class="lumi-radio__label">
				{#if children}
					{@render children()}
				{:else}
					{label}
				{/if}
			</span>
		{/if}
	{/if}
</label>

<style>
	/* ── Base control ─────────────────────────────────────────── */
	.lumi-radio {
		--radio-size: var(--lumi-icon-md);
		--radio-dot-size: var(--lumi-space-sm);
		--radio-label-size: var(--lumi-font-size-base);
		--radio-color: var(--lumi-color-primary);
		--lumi-control-accent: var(--radio-color);

		position: relative;
		display: inline-flex;
		align-items: center;
		gap: var(--lumi-space-sm);
		cursor: pointer;
		user-select: none;
		font-family: var(--lumi-font-family-sans);
	}

	.lumi-radio__input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
		width: 0;
		height: 0;
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
		border-radius: var(--lumi-radius-lg);
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

	.lumi-radio.lumi-radio-option.lumi-radio--card {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: var(--lumi-space-2xs);
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
		opacity: 0.65;
		pointer-events: none;
	}

	.lumi-radio__header {
		display: flex;
		align-items: center;
		gap: var(--lumi-space-sm);
		width: 100%;
		min-width: 0;
	}

	.lumi-radio__description {
		display: block;
		width: 100%;
		margin: 0;
		padding: 0 0 0 calc(var(--radio-size) + var(--lumi-space-sm));
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

	.lumi-radio--lg {
		--radio-size: var(--lumi-icon-lg);
		--radio-dot-size: var(--lumi-space-md);
		--radio-label-size: var(--lumi-font-size-lg);
	}

	/* ── States ───────────────────────────────────────────────── */
	.lumi-radio:not(.lumi-radio--disabled):hover .lumi-radio__visual {
		border-color: var(--lumi-control-active-border);
		background: var(--lumi-control-active-fill);
	}

	.lumi-radio--checked:not(.lumi-radio--disabled):hover .lumi-radio__visual {
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

	.lumi-radio__input:focus-visible + .lumi-radio__visual,
	.lumi-radio__input:focus-visible ~ .lumi-radio__header .lumi-radio__visual {
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

	@media (prefers-reduced-motion: reduce) {
		.lumi-radio__visual,
		.lumi-radio__circle,
		.lumi-radio.lumi-radio-option {
			transition: none;
		}
	}
</style>
