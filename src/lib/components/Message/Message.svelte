<script lang="ts">
	import type { MessageProps } from './types';

	const {
		align = 'start',
		variant,
		color,
		name,
		time,
		grouped = false,
		class: className = '',
		avatar,
		children,
		footer
	}: MessageProps = $props();

	const end = $derived(align === 'end');
	const accent = $derived(color ?? (end ? 'primary' : undefined));
	const showHeader = $derived(!grouped && Boolean(name || time));
</script>

<div
	class={[
		'lumi-message',
		end && 'lumi-message--end',
		`lumi-message--${variant ?? (end ? 'filled' : 'soft')}`,
		grouped && 'lumi-message--grouped',
		className
	]}
	style={accent
		? `--lumi-message-accent: var(--lumi-color-${accent}); --lumi-message-tint: var(--lumi-color-${accent}-bg); --lumi-message-solid: var(--lumi-color-${accent}-solid); --lumi-message-on-solid: var(--lumi-color-${accent}-foreground)`
		: undefined}
>
	{#if avatar}
		<div class="lumi-message__avatar" aria-hidden={grouped || undefined}>
			{#if !grouped}{@render avatar()}{/if}
		</div>
	{/if}

	<div class="lumi-message__content">
		{#if showHeader}
			<div class="lumi-message__header">
				{#if name}<span class="lumi-message__name">{name}</span>{/if}
				{#if time}<span class="lumi-message__time">{time}</span>{/if}
			</div>
		{:else if grouped && name}
			<span class="lumi-sr-only">{name}</span>
		{/if}

		<div class="lumi-message__bubble">
			{@render children?.()}
		</div>

		{#if footer}
			<div class="lumi-message__footer">{@render footer()}</div>
		{/if}
	</div>
</div>

<style>
	.lumi-message {
		/* Neutral defaults; a `color` re-points these four. */
		--lumi-message-accent: var(--lumi-color-border-strong);
		--lumi-message-tint: var(--lumi-color-background-secondary);
		--lumi-message-solid: var(--lumi-color-surface-elevated);
		--lumi-message-on-solid: var(--lumi-color-text);
		--lumi-message-avatar-size: var(--lumi-space-xl);
		--lumi-message-max-inline-size: 80%;
		display: flex;
		align-items: flex-start;
		gap: var(--lumi-space-xs);
		min-width: 0;
	}

	.lumi-message:not(:first-child) {
		margin-block-start: var(--lumi-space-md);
	}

	.lumi-message--grouped:not(:first-child) {
		margin-block-start: var(--lumi-space-2xs);
	}

	.lumi-message--end {
		flex-direction: row-reverse;
	}

	.lumi-message__avatar {
		display: flex;
		flex: none;
		min-inline-size: var(--lumi-message-avatar-size);
	}

	.lumi-message__content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--lumi-space-2xs);
		min-width: 0;
		max-inline-size: var(--lumi-message-max-inline-size);
	}

	.lumi-message--end .lumi-message__content {
		align-items: flex-end;
	}

	.lumi-message__header,
	.lumi-message__footer {
		display: flex;
		align-items: baseline;
		gap: var(--lumi-space-xs);
		padding-inline: var(--lumi-space-2xs);
		font-size: var(--lumi-font-size-xs);
		line-height: var(--lumi-line-height-tight);
		color: var(--lumi-color-text-muted);
	}

	.lumi-message__name {
		font-weight: var(--lumi-font-weight-semibold);
		color: var(--lumi-color-text);
	}

	/* Bubble: one recipe; variants only choose fill, border and ink. */
	.lumi-message__bubble {
		padding: var(--lumi-space-xs) var(--lumi-space-sm);
		font-size: var(--lumi-font-size-sm);
		line-height: var(--lumi-line-height-normal);
		color: var(--lumi-color-text);
		overflow-wrap: anywhere;
		background: var(--lumi-message-tint);
		border: var(--lumi-border-width-thin) solid
			color-mix(in srgb, var(--lumi-message-accent) 18%, transparent);
		border-radius: var(--lumi-radius-lg);
		/* The corner beside the sender stays tight, like a tail. */
		border-start-start-radius: var(--lumi-radius-xs);
	}

	.lumi-message--end .lumi-message__bubble {
		border-start-start-radius: var(--lumi-radius-lg);
		border-start-end-radius: var(--lumi-radius-xs);
	}

	.lumi-message--filled .lumi-message__bubble {
		color: var(--lumi-message-on-solid);
		background: var(--lumi-message-solid);
		border-color: transparent;
		box-shadow: var(--lumi-shadow-sm);
	}

	.lumi-message--filled .lumi-message__bubble :global(a) {
		color: inherit;
	}

	.lumi-message--outline .lumi-message__bubble {
		background: transparent;
		border-color: color-mix(
			in srgb,
			var(--lumi-message-accent) 45%,
			var(--lumi-color-border)
		);
	}

	.lumi-message--ghost {
		--lumi-message-max-inline-size: 100%;
	}

	.lumi-message--ghost .lumi-message__content {
		flex: 1;
	}

	.lumi-message--ghost .lumi-message__bubble {
		padding: 0;
		background: none;
		border: none;
	}
</style>
