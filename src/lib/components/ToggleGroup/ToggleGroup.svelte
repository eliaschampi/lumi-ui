<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { options: en.options };
</script>

<script lang="ts">
	import '../../styles/switcher.css';
	import '../../styles/switcher-group.css';
	import { Icon } from '../Icon';
	import { useLumiLocale } from '../../i18n';
	import type { LumiChoiceOption } from '../../types/choice';
	import { rovingIndex } from '../../utils/roving';
	import type { ToggleGroupProps } from './types';

	let {
		value = $bindable([]),
		options,
		color = 'primary',
		size = 'md',
		orientation = 'horizontal',
		disabled = false,
		fullWidth = false,
		'aria-label': ariaLabel,
		class: className = '',
		onchange
	}: ToggleGroupProps = $props();

	const i18n = useLumiLocale(COPY);
	const vertical = $derived(orientation === 'vertical');
	const pressed = $derived(new Set(value));

	// Roving tabindex: the last focused option keeps the single tab stop,
	// otherwise the first pressed option, otherwise the first enabled one.
	let focused = $state(-1);
	const enabled = (index: number) =>
		!disabled && index in options && !options[index].disabled;
	const tabStop = $derived.by(() => {
		if (enabled(focused)) return focused;
		const first = options.findIndex(
			(option, index) => enabled(index) && pressed.has(option.value)
		);
		return first >= 0 ? first : options.findIndex((_, index) => enabled(index));
	});

	function toggle(option: LumiChoiceOption): void {
		value = pressed.has(option.value)
			? value.filter((item) => item !== option.value)
			: [...value, option.value];
		onchange?.(value);
	}

	function handleKeydown(event: KeyboardEvent): void {
		const button = event.currentTarget as HTMLButtonElement;
		const buttons = [
			...(
				button.parentElement as HTMLElement
			).querySelectorAll<HTMLButtonElement>(':scope > button:enabled')
		];
		const at = rovingIndex(
			event,
			buttons.indexOf(button),
			buttons.length,
			vertical
		);
		if (at === undefined) return;
		event.preventDefault();
		buttons[at].focus();
	}
</script>

<div
	class={[
		'lumi-switcher',
		'lumi-toggle-group',
		size === 'sm' && 'lumi-switcher--sm',
		vertical && 'lumi-switcher--vertical',
		fullWidth && 'lumi-switcher--full',
		disabled && 'lumi-switcher--disabled',
		className
	]}
	style:--lumi-control-accent="var(--lumi-color-{color})"
	role="group"
	aria-label={ariaLabel || i18n.t.options}
>
	{#each options as option, index (option.value)}
		{@const isPressed = pressed.has(option.value)}
		<button
			type="button"
			class={[
				'lumi-switcher__option',
				isPressed && 'lumi-switcher__option--active',
				option.disabled && 'lumi-switcher__option--disabled',
				!option.label && 'lumi-toggle-group__option--icon'
			]}
			aria-pressed={isPressed}
			aria-label={option.ariaLabel ??
				(option.label ? undefined : String(option.value))}
			disabled={disabled || option.disabled}
			tabindex={index === tabStop ? 0 : -1}
			onclick={() => toggle(option)}
			onkeydown={handleKeydown}
			onfocus={() => (focused = index)}
		>
			{#if option.icon}
				<Icon icon={option.icon} size="sm" />
			{/if}
			{#if option.label}
				<span class="lumi-switcher__label">{option.label}</span>
			{/if}
		</button>
	{/each}
</div>

<style>
	/* Shell, options and pressed pill come from the shared .lumi-switcher recipe. */
	.lumi-toggle-group > .lumi-toggle-group__option--icon {
		padding-inline: var(--lumi-segmented-control-icon-only-padding);
	}
</style>
