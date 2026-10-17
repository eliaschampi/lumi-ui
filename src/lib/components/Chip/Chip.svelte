<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { chipRemove: en.chipRemove };
</script>

<script lang="ts">
	import X from '@lucide/svelte/icons/x';
	import { Icon } from '../Icon';
	import { useLumiLocale } from '../../i18n';
	import type { ChipProps } from './types';

	const {
		color = 'primary',
		size = 'md',
		icon,
		closable = false,
		class: className,
		children,
		closeLabel,
		onclose,
		onclick
	}: ChipProps = $props();

	const i18n = useLumiLocale(COPY);
	const iconSize = $derived(size === 'sm' ? 'xs' : 'sm');
</script>

{#snippet content()}
	{#if icon}<Icon {icon} size={iconSize} />{/if}
	<span class="lumi-chip__text">{@render children?.()}</span>
{/snippet}

<!-- The action and the remove control are siblings, never nested. -->
<span
	class={[
		'lumi-chip',
		size === 'sm' && 'lumi-chip--sm',
		onclick && 'lumi-chip--interactive',
		className
	]}
	style:--lumi-control-accent="var(--lumi-color-{color})"
>
	{#if onclick}
		<button type="button" class="lumi-chip__action" {onclick}>
			{@render content()}
		</button>
	{:else}
		{@render content()}
	{/if}

	{#if closable}
		<button
			type="button"
			class="lumi-chip__close"
			aria-label={closeLabel ?? i18n.t.chipRemove}
			onclick={(event) => {
				event.stopPropagation();
				onclose?.(event);
			}}
		>
			<X aria-hidden="true" />
		</button>
	{/if}
</span>

<style>
	.lumi-chip__close :global(svg) {
		inline-size: var(--lumi-chip-close-icon);
		block-size: var(--lumi-chip-close-icon);
	}

	.lumi-chip {
		--lumi-chip-padding-block: var(--lumi-space-xs);
		--lumi-chip-padding-inline: var(--lumi-space-sm);
		--lumi-chip-gap: var(--lumi-space-xs);
		--lumi-chip-font-size: var(--lumi-font-size-sm);
		--lumi-chip-min-height: var(--lumi-control-height-sm);
		--lumi-chip-close-size: var(--lumi-space-md);
		--lumi-chip-close-icon: var(--lumi-icon-sm);
		display: inline-flex;
		align-items: center;
		align-self: flex-start;
		gap: var(--lumi-chip-gap);
		inline-size: fit-content;
		max-inline-size: 100%;
		min-height: var(--lumi-chip-min-height);
		padding: var(--lumi-chip-padding-block) var(--lumi-chip-padding-inline);
		border-radius: var(--lumi-radius-full);
		font-size: var(--lumi-chip-font-size);
		font-weight: var(--lumi-font-weight-medium);
		line-height: var(--lumi-line-height-tight);
		transition: var(--lumi-transition-control);
		white-space: nowrap;
		cursor: default;
		user-select: none;
		background: color-mix(
			in oklch,
			var(--lumi-control-accent) var(--lumi-state-bg-strength),
			var(--lumi-color-surface)
		);
		color: var(--lumi-control-accent);
		border: var(--lumi-border-width-thin) solid
			color-mix(in srgb, var(--lumi-control-accent) 24%, transparent);
		box-shadow: inset 0 var(--lumi-border-width-thin) 0
			color-mix(in srgb, var(--lumi-color-white) 18%, transparent);
	}

	/* Size variants */
	.lumi-chip--sm {
		--lumi-chip-padding-block: var(--lumi-space-2xs);
		--lumi-chip-padding-inline: var(--lumi-space-xs);
		--lumi-chip-gap: var(--lumi-space-2xs);
		--lumi-chip-font-size: var(--lumi-font-size-xs);
		--lumi-chip-min-height: var(--lumi-control-height-xs);
		--lumi-chip-close-size: var(--lumi-space-sm);
		--lumi-chip-close-icon: var(--lumi-icon-xs);
	}

	.lumi-chip__action {
		display: inline-flex;
		align-items: center;
		gap: var(--lumi-chip-gap);
		min-width: 0;
		padding: 0;
		background: transparent;
		border: none;
		color: inherit;
		font: inherit;
		cursor: pointer;
	}

	.lumi-chip__text {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.lumi-chip__close {
		display: inline-grid;
		place-items: center;
		width: var(--lumi-chip-close-size);
		height: var(--lumi-chip-close-size);
		padding: 0;
		margin-inline-start: var(--lumi-space-2xs);
		background: transparent;
		border: none;
		border-radius: var(--lumi-radius-full);
		color: currentColor;
		cursor: pointer;
		transition: var(--lumi-transition-control);
		flex-shrink: 0;
	}

	.lumi-chip__close:hover {
		background: color-mix(in srgb, currentColor 15%, transparent);
	}

	.lumi-chip__close:focus-visible,
	.lumi-chip__action:focus-visible {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
		border-radius: var(--lumi-radius-full);
	}

	.lumi-chip--interactive:hover {
		background: color-mix(
			in srgb,
			var(--lumi-control-accent) 16%,
			var(--lumi-color-surface-card)
		);
		border-color: color-mix(
			in srgb,
			var(--lumi-control-accent) 34%,
			transparent
		);
	}
</style>
