<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { options: en.options };
</script>

<script lang="ts">
	import { useLumiLocale } from '../../i18n';
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
		'aria-label': ariaLabel,
		onchange
	}: SegmentedControlProps = $props();

	let root: HTMLDivElement | undefined = $state();

	const i18n = useLumiLocale(COPY);
	const uid = $props.id();
	const name = `lumi-sc-${uid}`;

	function select(next: string | number): void {
		value = next;
		onchange?.(next);
	}

	function handleClick(event: MouseEvent, optionValue: string | number): void {
		if (!clearable || value !== optionValue) return;
		event.preventDefault();
		select('');
	}

	// Keep the active segment visible inside an overflowing track only;
	// scrollIntoView would also scroll the page.
	$effect(() => {
		void value;
		const track = root;
		const option = track?.querySelector<HTMLElement>(
			'.lumi-switcher__option--active'
		);
		if (!track || !option || track.scrollWidth <= track.clientWidth) return;
		const box = option.getBoundingClientRect();
		const offset = box.left - track.getBoundingClientRect().left;
		track.scrollTo({
			left: track.scrollLeft + offset - (track.clientWidth - box.width) / 2
		});
	});
</script>

<div
	bind:this={root}
	class={[
		'lumi-switcher',
		'lumi-segmented-control',
		orientation === 'vertical' && 'lumi-switcher--vertical',
		disabled && 'lumi-segmented-control--disabled',
		fullWidth && 'lumi-segmented-control--full',
		iconOnly && 'lumi-segmented-control--icon-only',
		className
	]}
	style:--lumi-control-accent="var(--lumi-color-{color})"
	role="radiogroup"
	aria-label={ariaLabel ?? i18n.t.options}
	aria-orientation={orientation}
>
	{#each options as option (option.value)}
		<label
			class={[
				'lumi-switcher__option',
				value === option.value && 'lumi-switcher__option--active',
				option.disabled && 'lumi-switcher__option--disabled'
			]}
		>
			<input
				type="radio"
				class="lumi-sr-only"
				{name}
				value={option.value}
				checked={value === option.value}
				disabled={disabled || option.disabled}
				aria-label={option.ariaLabel ??
					(option.label ? undefined : String(option.value))}
				onclick={(event) => handleClick(event, option.value)}
				onchange={() => select(option.value)}
			/>
			{#if option.icon}
				<Icon icon={option.icon} size="sm" />
			{/if}
			{#if option.label}
				<span class="lumi-segmented-control__label">{option.label}</span>
			{/if}
		</label>
	{/each}
</div>

<style>
	/* Shell, options and active pill come from the shared .lumi-switcher recipe. */
	.lumi-segmented-control--full {
		display: flex;
		width: 100%;
	}

	.lumi-segmented-control--full > .lumi-switcher__option {
		flex: 1 1 0;
		min-width: 0;
	}

	.lumi-segmented-control--icon-only > .lumi-switcher__option {
		padding: var(--lumi-segmented-control-icon-only-padding);
	}

	.lumi-segmented-control__label {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.lumi-segmented-control--disabled {
		opacity: var(--lumi-opacity-disabled);
		pointer-events: none;
	}

	@media (max-width: 48rem) {
		.lumi-segmented-control--full:not(.lumi-switcher--vertical)
			> .lumi-switcher__option {
			flex: 1 0 max-content;
			min-width: max-content;
			padding: var(--lumi-space-xs) var(--lumi-space-sm);
		}
	}
</style>
