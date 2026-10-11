<script lang="ts">
	import type { TagOptionProps } from './types';

	const {
		label,
		color = 'primary',
		active = false,
		disabled = false,
		onclick
	}: TagOptionProps = $props();
</script>

<button
	type="button"
	class="lumi-tag-option lumi-tag-option--{color}"
	class:lumi-tag-option--active={active}
	class:lumi-tag-option--disabled={disabled}
	style:--color="var(--lumi-color-{color})"
	aria-pressed={active}
	{disabled}
	{onclick}
>
	<span class="lumi-tag-option__dot"></span>
	<span class="lumi-tag-option__label">{label}</span>
</button>

<style>
	.lumi-tag-option {
		--color: var(--lumi-color-primary);
		--lumi-control-accent: var(--color);
		display: flex;
		align-items: center;
		gap: var(--lumi-space-sm);
		width: 100%;
		padding: var(--lumi-space-md);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border-light);
		border-radius: var(--lumi-radius-option);
		background: var(--lumi-color-surface);
		color: var(--lumi-color-text);
		font-family: inherit;
		font-size: var(--lumi-font-size-sm);
		cursor: pointer;
		text-align: start;
		transition: var(--lumi-transition-control);
	}

	.lumi-tag-option:hover {
		border-color: color-mix(
			in srgb,
			var(--color) 26%,
			var(--lumi-color-border)
		);
		background: color-mix(in srgb, var(--color) 4%, var(--lumi-color-surface));
	}

	.lumi-tag-option:focus-visible {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
	}

	.lumi-tag-option--active {
		border-color: color-mix(
			in srgb,
			var(--color) 40%,
			var(--lumi-color-border)
		);
		background: color-mix(in srgb, var(--color) 8%, var(--lumi-color-surface));
	}

	.lumi-tag-option--active:hover {
		background: color-mix(in srgb, var(--color) 14%, var(--lumi-color-surface));
	}

	.lumi-tag-option--disabled {
		opacity: var(--lumi-opacity-disabled);
		cursor: not-allowed;
		pointer-events: none;
	}

	.lumi-tag-option__dot {
		width: var(--lumi-icon-xs);
		height: var(--lumi-icon-xs);
		border-radius: var(--lumi-radius-full);
		flex-shrink: 0;
		background: var(--color);
		box-shadow: 0 0 0 var(--lumi-border-width-thick)
			color-mix(in srgb, var(--color) 20%, transparent);
	}

	.lumi-tag-option__label {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
