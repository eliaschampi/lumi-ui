<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { options: en.options };
</script>

<script lang="ts">
	import { Icon } from '../Icon';
	import { useLumiLocale } from '../../i18n';
	import type { LumiChoiceOption } from '../../types/choice';
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
		const group = button.parentElement as HTMLElement;
		const buttons = [
			...group.querySelectorAll<HTMLButtonElement>(':scope > button:enabled')
		];
		const current = buttons.indexOf(button);

		// Inline arrows follow the reading direction.
		const flip = () => (getComputedStyle(group).direction === 'rtl' ? -1 : 1);
		let target: number;
		switch (event.key) {
			case 'Home':
				target = 0;
				break;
			case 'End':
				target = buttons.length - 1;
				break;
			case vertical ? 'ArrowDown' : 'ArrowRight':
				target = current + (vertical ? 1 : flip());
				break;
			case vertical ? 'ArrowUp' : 'ArrowLeft':
				target = current - (vertical ? 1 : flip());
				break;
			default:
				return;
		}
		event.preventDefault();
		buttons[(target + buttons.length) % buttons.length].focus();
	}
</script>

<div
	class={[
		'lumi-switcher',
		'lumi-toggle-group',
		size === 'sm' && 'lumi-toggle-group--sm',
		vertical && 'lumi-switcher--vertical',
		fullWidth && 'lumi-toggle-group--full',
		disabled && 'lumi-toggle-group--disabled',
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
				<span class="lumi-toggle-group__label">{option.label}</span>
			{/if}
		</button>
	{/each}
</div>

<style>
	/* Shell, options and pressed pill come from the shared .lumi-switcher recipe. */
	.lumi-toggle-group--sm > .lumi-switcher__option {
		min-height: var(--lumi-control-height-xs);
		padding: var(--lumi-space-2xs) var(--lumi-space-sm);
		font-size: var(--lumi-font-size-xs);
	}

	.lumi-toggle-group > .lumi-toggle-group__option--icon {
		padding-inline: var(--lumi-segmented-control-icon-only-padding);
	}

	.lumi-toggle-group--full {
		display: flex;
		width: 100%;
	}

	.lumi-toggle-group--full > .lumi-switcher__option {
		flex: 1 1 0;
		min-width: 0;
	}

	.lumi-toggle-group__label {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.lumi-toggle-group--disabled {
		opacity: var(--lumi-opacity-disabled);
		pointer-events: none;
	}
</style>
