<script lang="ts">
	interface Props {
		/** Accessible name (localized by the owner) */
		label: string;
		onclick?: (event: MouseEvent) => void;
		class?: string;
	}

	const { label, onclick, class: className }: Props = $props();
</script>

<!-- Internal: the one dismiss control shared by Alert, Notification and Dialog. -->
<button
	type="button"
	class={['lumi-close-button', className]}
	aria-label={label}
	{onclick}
>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		aria-hidden="true"
	>
		<path d="M18 6 6 18M6 6l12 12" />
	</svg>
</button>

<style>
	.lumi-close-button svg {
		inline-size: var(--lumi-icon-sm);
		block-size: var(--lumi-icon-sm);
	}

	.lumi-close-button {
		display: inline-grid;
		flex-shrink: 0;
		place-items: center;
		inline-size: var(--lumi-space-xl);
		block-size: var(--lumi-space-xl);
		padding: 0;
		background: transparent;
		border: var(--lumi-border-width-thin) solid transparent;
		border-radius: var(--lumi-radius-full);
		color: var(--lumi-color-text-muted);
		cursor: pointer;
		transition: var(--lumi-transition-interactive);
	}

	.lumi-close-button:hover {
		background: var(--lumi-color-background-hover);
		border-color: var(--lumi-color-border-light);
		color: var(--lumi-color-text);
	}

	.lumi-close-button:active {
		transform: scale(var(--lumi-interactive-press-scale));
	}

	.lumi-close-button:focus-visible {
		outline: var(--lumi-focus-outline);
		outline-offset: var(--lumi-focus-outline-offset);
	}
</style>
