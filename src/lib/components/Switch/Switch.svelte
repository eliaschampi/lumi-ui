<script lang="ts">
	import type { SwitchProps } from './types';

	let {
		checked = $bindable(false),
		name = '',
		label = '',
		size = 'md',
		color = 'primary',
		disabled = false,
		class: className = '',
		children,
		onchange,
		'aria-label': ariaLabel
	}: SwitchProps = $props();

	function handleChange(event: Event): void {
		checked = (event.currentTarget as HTMLInputElement).checked;
		onchange?.(checked, event);
	}
</script>

<label
	class={[
		'lumi-switch',
		`lumi-switch--${size}`,
		checked && 'lumi-switch--checked',
		disabled && 'lumi-switch--disabled',
		className
	]}
	style:--switch-color="var(--lumi-color-{color})"
	style:--switch-solid="var(--lumi-color-{color}-solid)"
	style:--switch-foreground="var(--lumi-color-{color}-foreground)"
>
	<input
		type="checkbox"
		role="switch"
		class="lumi-sr-only"
		{name}
		{checked}
		{disabled}
		aria-label={ariaLabel}
		onchange={handleChange}
	/>

	<span class="lumi-switch__track" aria-hidden="true">
		<span class="lumi-switch__thumb"></span>
	</span>

	{#if label || children}
		<span class="lumi-switch__label">
			{#if children}
				{@render children()}
			{:else}
				{label}
			{/if}
		</span>
	{/if}
</label>

<style>
	.lumi-switch {
		--switch-track-w: calc(var(--lumi-space-xxl) + var(--lumi-space-2xs));
		--switch-track-h: var(--lumi-space-lg);
		--switch-inset: var(--lumi-border-width-thick);
		--switch-thumb: calc(var(--switch-track-h) - var(--switch-inset) * 2);
		--switch-travel: calc(var(--switch-track-w) - var(--switch-track-h));
		--switch-stretch: var(--lumi-space-2xs);
		--switch-label-size: var(--lumi-font-size-base);
		--lumi-control-accent: var(--switch-color);

		position: relative;
		display: inline-flex;
		align-items: center;
		gap: var(--lumi-space-sm);
		cursor: pointer;
		user-select: none;
		font-family: var(--lumi-font-family-sans);
	}

	.lumi-switch__track {
		display: flex;
		align-items: center;
		width: var(--switch-track-w);
		height: var(--switch-track-h);
		padding: var(--switch-inset);
		box-sizing: border-box;
		background: var(--lumi-color-control-fill);
		box-shadow:
			inset 0 0 0 var(--lumi-border-width-base) var(--lumi-color-control-border),
			var(--lumi-control-shadow);
		border-radius: var(--lumi-radius-full);
		transition: var(--lumi-transition-control);
		flex-shrink: 0;
	}

	.lumi-switch__thumb {
		width: var(--switch-thumb);
		height: var(--switch-thumb);
		background: var(--lumi-color-white);
		box-sizing: border-box;
		border: var(--lumi-border-width-thin) solid
			color-mix(in srgb, var(--lumi-color-text) 10%, transparent);
		border-radius: var(--lumi-radius-full);
		box-shadow: var(--lumi-shadow-sm);
		flex-shrink: 0;
		transition:
			transform var(--lumi-duration-fast) var(--lumi-easing-default),
			width var(--lumi-duration-fast) var(--lumi-easing-default);
	}

	.lumi-switch__label {
		color: var(--lumi-color-text);
		font-size: var(--switch-label-size);
		font-weight: var(--lumi-font-weight-medium);
		line-height: var(--lumi-line-height-tight);
	}

	/* Checked pairs the role's solid with its foreground thumb (≥ 3:1). */
	.lumi-switch--checked .lumi-switch__track {
		background: var(--switch-solid);
		box-shadow: var(--lumi-control-active-shadow);
	}

	.lumi-switch--checked .lumi-switch__thumb {
		background: var(--switch-foreground);
		border-color: transparent;
		transform: translateX(var(--switch-travel));
	}

	.lumi-switch:not(.lumi-switch--checked):not(.lumi-switch--disabled):hover
		.lumi-switch__track {
		box-shadow:
			inset 0 0 0 var(--lumi-border-width-base)
				var(--lumi-control-active-border),
			var(--lumi-control-shadow);
		background: var(--lumi-control-active-fill);
	}

	.lumi-switch:not(.lumi-switch--disabled):hover .lumi-switch__thumb {
		box-shadow: var(--lumi-shadow-md);
	}

	.lumi-switch:not(.lumi-switch--disabled):active .lumi-switch__thumb {
		width: calc(var(--switch-thumb) + var(--switch-stretch));
	}

	.lumi-switch--checked:not(.lumi-switch--disabled):active .lumi-switch__thumb {
		transform: translateX(calc(var(--switch-travel) - var(--switch-stretch)));
	}

	input:focus-visible + .lumi-switch__track {
		box-shadow: var(--lumi-control-focus-shadow);
	}

	.lumi-switch--sm {
		--switch-track-w: calc(var(--lumi-space-xl) + var(--lumi-space-2xs));
		--switch-track-h: var(--lumi-icon-md);
		--switch-label-size: var(--lumi-font-size-sm);
		gap: var(--lumi-space-xs);
	}

	.lumi-switch--lg {
		--switch-track-w: calc(var(--lumi-space-3xl) + var(--lumi-space-2xs));
		--switch-track-h: calc(var(--lumi-space-lg) + var(--lumi-space-2xs));
		--switch-label-size: var(--lumi-font-size-lg);
		gap: var(--lumi-space-md);
	}

	.lumi-switch--disabled {
		cursor: not-allowed;
		opacity: var(--lumi-opacity-disabled);
	}

	.lumi-switch--disabled .lumi-switch__label {
		cursor: not-allowed;
	}

	.lumi-switch--disabled:not(.lumi-switch--checked) .lumi-switch__track {
		background: var(--lumi-color-border);
		box-shadow: none;
	}
</style>
