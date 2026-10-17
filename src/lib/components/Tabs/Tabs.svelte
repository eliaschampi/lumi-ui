<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { tabs: en.tabs };
</script>

<script lang="ts">
	import { useLumiLocale } from '../../i18n';
	import Icon from '../Icon/Icon.svelte';
	import type { TabsProps } from './types';

	let {
		value = $bindable(),
		tabs = [],
		color = 'primary',
		orientation = 'horizontal',
		'aria-label': ariaLabel,
		class: className = '',
		children,
		onchange
	}: TabsProps = $props();

	const i18n = useLumiLocale(COPY);
	const uid = $props.id();
	const tabId = (index: number) => `lumi-tabs-${uid}-tab-${index}`;
	const panelId = (index: number) => `lumi-tabs-${uid}-panel-${index}`;

	// Falls back to the first enabled tab, so SSR renders a selected tab.
	const active = $derived(value ?? tabs.find((tab) => !tab.disabled)?.value);
	const activeIndex = $derived(tabs.findIndex((tab) => tab.value === active));
	const managedPanels = $derived(tabs.some((tab) => tab.content));

	function selectTab(next: string | number): void {
		if (active === next) return;
		const previous = active;
		value = next;
		onchange?.(next, previous);
	}

	function handleKeydown(event: KeyboardEvent): void {
		const enabled = tabs.flatMap((tab, index) => (tab.disabled ? [] : [index]));
		if (!enabled.length) return;
		const rtl =
			getComputedStyle(event.currentTarget as Element).direction === 'rtl';
		const horizontal = orientation === 'horizontal';
		const back = horizontal ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
		const forward = horizontal
			? rtl
				? 'ArrowLeft'
				: 'ArrowRight'
			: 'ArrowDown';
		const at = enabled.indexOf(activeIndex);
		let next: number | undefined;
		if (event.key === back) next = enabled.at(at - 1);
		else if (event.key === forward) next = enabled[(at + 1) % enabled.length];
		else if (event.key === 'Home') next = enabled[0];
		else if (event.key === 'End') next = enabled.at(-1);
		if (next === undefined) return;

		event.preventDefault();
		selectTab(tabs[next].value);
		document.getElementById(tabId(next))?.focus();
	}
</script>

<div
	class={['lumi-tabs', `lumi-tabs--${orientation}`, className]}
	style:--lumi-control-accent="var(--lumi-color-{color})"
>
	<div
		class={[
			'lumi-switcher',
			'lumi-tabs__nav',
			orientation === 'vertical' && 'lumi-switcher--vertical'
		]}
		role="tablist"
		aria-orientation={orientation}
		aria-label={ariaLabel ?? i18n.t.tabs}
	>
		{#each tabs as tab, index (tab.value)}
			<button
				id={tabId(index)}
				type="button"
				role="tab"
				class={[
					'lumi-switcher__option',
					'lumi-tabs__tab',
					active === tab.value && 'lumi-switcher__option--active',
					tab.disabled && 'lumi-switcher__option--disabled'
				]}
				aria-controls={managedPanels || index === activeIndex
					? panelId(index)
					: undefined}
				disabled={tab.disabled}
				aria-selected={active === tab.value}
				tabindex={active === tab.value ? 0 : -1}
				onclick={() => selectTab(tab.value)}
				onkeydown={handleKeydown}
			>
				{#if tab.icon}
					<Icon icon={tab.icon} size="md" />
				{/if}
				{#if tab.label}
					<span>{tab.label}</span>
				{/if}
			</button>
		{/each}
	</div>

	<div
		id={!managedPanels && activeIndex >= 0 ? panelId(activeIndex) : undefined}
		class="lumi-tabs__content"
		role={!managedPanels ? 'tabpanel' : undefined}
		aria-labelledby={!managedPanels && activeIndex >= 0
			? tabId(activeIndex)
			: undefined}
	>
		{#if managedPanels}
			{#each tabs as tab, index (tab.value)}
				<div
					id={panelId(index)}
					role="tabpanel"
					aria-labelledby={tabId(index)}
					hidden={active !== tab.value}
				>
					{@render tab.content?.()}
				</div>
			{/each}
		{:else if children}
			{@render children()}
		{/if}
	</div>
</div>

<style>
	/* Nav shell, tabs and active pill come from the shared .lumi-switcher recipe. */
	.lumi-tabs {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.lumi-tabs--horizontal .lumi-tabs__nav {
		display: flex;
		width: 100%;
		min-width: 0;
	}

	.lumi-tabs--horizontal .lumi-tabs__tab {
		flex: 1 1 0;
	}

	.lumi-tabs--vertical {
		flex-direction: row;
		gap: var(--lumi-space-md);
	}

	.lumi-tabs--vertical .lumi-tabs__nav {
		min-width: calc(var(--lumi-space-5xl) * 2 + var(--lumi-space-md));
	}

	.lumi-tabs__content {
		flex: 1;
		padding-top: var(--lumi-space-md);
	}

	.lumi-tabs--vertical .lumi-tabs__content {
		padding-top: var(--lumi-space-2xs);
	}

	@media (max-width: 48rem) {
		.lumi-tabs--vertical {
			flex-direction: column;
		}

		.lumi-tabs--vertical .lumi-tabs__nav {
			min-width: auto;
			margin-bottom: var(--lumi-space-sm);
		}

		.lumi-tabs--vertical .lumi-tabs__content {
			padding-top: var(--lumi-space-sm);
		}

		.lumi-tabs__tab {
			padding: var(--lumi-space-xs) var(--lumi-space-sm);
		}
	}
</style>
