<script lang="ts">
	import Icon from '../Icon/Icon.svelte';
	import type { SegmentedControlProps } from './types';

	let {
		value = $bindable(),
		options,
		color = 'primary',
		disabled = false,
		fullWidth = false,
		orientation = 'horizontal',
		iconOnly = false,
		clearable = false,
		class: className = '',
		onchange,
		'aria-label': ariaLabel = ''
	}: SegmentedControlProps = $props();

	let containerRef: HTMLDivElement | undefined = $state();
	const optionRefs: (HTMLElement | null)[] = $state([]);

	const instanceId = $props.id();
	const uniqueName = `lumi-sc-${instanceId}`;

	const containerClasses = $derived(
		[
			'lumi-segmented-control',
			`lumi-segmented-control--${color}`,
			`lumi-segmented-control--${orientation}`,
			disabled && 'lumi-segmented-control--disabled',
			fullWidth && 'lumi-segmented-control--full',
			iconOnly && 'lumi-segmented-control--icon-only',
			className
		]
			.filter(Boolean)
			.join(' ')
	);

	function scrollActiveOptionIntoView(activeIndex: number): void {
		if (!containerRef || activeIndex < 0) return;
		const activeEl = activeIndex >= 0 ? optionRefs[activeIndex] : null;
		if (!activeEl) return;

		activeEl.scrollIntoView({
			block: 'nearest',
			inline: 'nearest',
			behavior: 'auto'
		});
	}

	function handleChange(newValue: string | number): void {
		if (disabled) return;
		value = newValue;
		onchange?.(newValue);
	}

	function handleOptionClick(
		event: MouseEvent,
		optionValue: string | number
	): void {
		if (!clearable) return;
		event.preventDefault();
		handleChange(value === optionValue ? '' : optionValue);
	}

	$effect(() => {
		const activeIndex = options.findIndex((option) => option.value === value);
		const frame = requestAnimationFrame(() =>
			scrollActiveOptionIntoView(activeIndex)
		);
		return () => cancelAnimationFrame(frame);
	});
</script>

<div
	bind:this={containerRef}
	class={containerClasses}
	style:--seg-color="var(--lumi-color-{color})"
	role="radiogroup"
	aria-label={ariaLabel || 'Segmented control'}
	aria-orientation={orientation}
>
	{#each options as option, index (option.value)}
		<label
			bind:this={optionRefs[index]}
			class="lumi-segmented-control__option"
			class:lumi-segmented-control__option--active={value === option.value}
			class:lumi-segmented-control__option--disabled={option.disabled}
		>
			<input
				type="radio"
				class="lumi-segmented-control__input"
				name={uniqueName}
				value={option.value}
				checked={value === option.value}
				disabled={disabled || option.disabled}
				onclick={(event) => handleOptionClick(event, option.value)}
				onchange={() => handleChange(option.value)}
				aria-label={option.ariaLabel ??
					option.label ??
					option.icon ??
					String(option.value)}
			/>
			<span class="lumi-segmented-control__content">
				{#if option.icon}
					<Icon icon={option.icon} size="sm" />
				{/if}
				{#if option.label}
					<span class="lumi-segmented-control__label">{option.label}</span>
				{/if}
			</span>
		</label>
	{/each}
</div>

<style>
	.lumi-segmented-control {
		position: relative;
		display: inline-flex;
		align-items: stretch;
		--seg-hover-bg: color-mix(in srgb, var(--seg-color) 9%, transparent);
		--lumi-control-accent: var(--seg-color);
		--seg-shell-bg: color-mix(
			in srgb,
			var(--lumi-color-surface-glass-strong) 78%,
			var(--lumi-color-background-hover) 22%
		);
		--seg-shell-border: color-mix(
			in srgb,
			var(--lumi-color-border-glass) 72%,
			var(--lumi-color-border-strong) 28%
		);
		background: var(--seg-shell-bg);
		border: var(--lumi-border-width-thin) solid var(--seg-shell-border);
		border-radius: var(--lumi-radius-panel);
		padding: var(--lumi-space-2xs);
		gap: var(--lumi-space-2xs);
		user-select: none;
		isolation: isolate;
		max-width: 100%;
		box-shadow: var(--lumi-control-shadow);
		overflow-x: auto;
		overflow-y: hidden;
		overscroll-behavior-inline: contain;
		scrollbar-width: thin;
		scrollbar-color: var(--lumi-color-border-strong) transparent;
		transition: var(--lumi-transition-control);
	}

	.lumi-segmented-control--vertical {
		flex-direction: column;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.lumi-segmented-control:hover:not(.lumi-segmented-control--disabled) {
		border-color: var(--lumi-color-border-strong);
	}

	.lumi-segmented-control:focus-within {
		border-color: color-mix(
			in srgb,
			var(--seg-color) 30%,
			var(--lumi-color-border-strong)
		);
	}

	.lumi-segmented-control::-webkit-scrollbar {
		height: var(--lumi-space-2xs);
	}

	.lumi-segmented-control::-webkit-scrollbar-thumb {
		background: var(--lumi-color-border-strong);
		border-radius: var(--lumi-radius-full);
	}

	.lumi-segmented-control::-webkit-scrollbar-track {
		background: transparent;
	}

	.lumi-segmented-control--full {
		display: flex;
		width: 100%;
	}

	.lumi-segmented-control__option {
		position: relative;
		z-index: var(--lumi-z-base);
		cursor: pointer;
		display: flex;
		min-width: max-content;
		min-height: var(--lumi-control-height-sm);
		text-align: center;
	}

	.lumi-segmented-control--full .lumi-segmented-control__option {
		flex: 1 1 0;
		min-width: 0;
	}

	.lumi-segmented-control--vertical .lumi-segmented-control__option {
		width: 100%;
		min-width: 0;
		text-align: left;
	}

	.lumi-segmented-control__option--disabled {
		opacity: var(--lumi-opacity-disabled);
		cursor: not-allowed;
	}

	.lumi-segmented-control__input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.lumi-segmented-control__content {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--lumi-space-xs);
		padding: var(--lumi-space-xs) var(--lumi-space-md);
		color: var(--lumi-color-text-muted);
		font-weight: var(--lumi-font-weight-medium);
		font-size: var(--lumi-font-size-sm);
		white-space: nowrap;
		transition: var(--lumi-transition-interactive);
		border-radius: var(--lumi-radius-control);
		min-width: 0;
	}

	.lumi-segmented-control--full .lumi-segmented-control__content {
		flex: 1 1 auto;
	}

	.lumi-segmented-control--vertical .lumi-segmented-control__content {
		justify-content: flex-start;
		width: 100%;
	}

	.lumi-segmented-control--icon-only .lumi-segmented-control__content {
		padding: var(--lumi-segmented-control-icon-only-padding);
	}

	.lumi-segmented-control__label {
		display: block;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Elevated active pill — same recipe as the active Tabs tab. */
	.lumi-segmented-control__option--active .lumi-segmented-control__content {
		color: var(--seg-color);
		font-weight: var(--lumi-font-weight-semibold);
		background: linear-gradient(
			145deg,
			color-mix(
					in srgb,
					var(--lumi-color-surface-card-hover) 88%,
					var(--seg-color) 12%
				)
				0%,
			var(--lumi-color-surface-card) 100%
		);
		box-shadow:
			inset 0 0 0 var(--lumi-border-width-thin)
				color-mix(in srgb, var(--seg-color) 28%, var(--lumi-color-border)),
			var(--lumi-shadow-sm);
	}

	.lumi-segmented-control__option:not(
			.lumi-segmented-control__option--disabled
		):not(.lumi-segmented-control__option--active):hover
		.lumi-segmented-control__content {
		color: var(--lumi-color-text);
		background-color: var(--seg-hover-bg);
	}

	.lumi-segmented-control__input:focus-visible
		+ .lumi-segmented-control__content {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
	}

	.lumi-segmented-control--disabled {
		opacity: var(--lumi-opacity-disabled);
		cursor: not-allowed;
		pointer-events: none;
	}

	@media (max-width: 48rem) {
		.lumi-segmented-control--full {
			justify-content: flex-start;
		}

		.lumi-segmented-control--full .lumi-segmented-control__option {
			flex: 1 0 max-content;
			min-width: max-content;
		}

		.lumi-segmented-control--full .lumi-segmented-control__content {
			flex: 1 1 auto;
			width: 100%;
			padding: var(--lumi-space-xs) var(--lumi-space-sm);
		}

		.lumi-segmented-control--vertical.lumi-segmented-control--full
			.lumi-segmented-control__option,
		.lumi-segmented-control--vertical.lumi-segmented-control--full
			.lumi-segmented-control__content {
			flex: 1 1 auto;
			min-width: 0;
		}
	}
</style>
