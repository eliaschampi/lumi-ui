<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = {
		notifications: en.notifications,
		notificationDismiss: en.notificationDismiss
	};
</script>

<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { portal } from '../../actions/portal';
	import { DURATION_BASE, motion } from '../config';
	import StatusSurface from '../Notification/StatusSurface.svelte';
	import { useLumiLocale } from '../../i18n';
	import type { ToasterProps } from './types';

	const {
		toaster,
		placement = 'top-end',
		class: className
	}: ToasterProps = $props();

	const i18n = useLumiLocale(COPY);
</script>

<!-- One persistent polite region announces each toast once as it is added;
     it joins the top open modal so announcements stay reachable. Items
     animate here, so dismiss, clear and overflow all leave the same way. -->
<section
	use:portal={document.querySelector<HTMLElement>('[aria-modal="true"]') ??
		'body'}
	class={['lumi-toaster', `lumi-toaster--${placement}`, className]}
	aria-label={i18n.t.notifications}
	aria-live="polite"
>
	{#each toaster.items as toast (toast.id)}
		{@const color = toast.color ?? 'primary'}
		<div
			animate:flip={{ duration: motion(DURATION_BASE) }}
			transition:fly={{ y: 12, duration: motion(DURATION_BASE) }}
		>
			<StatusSurface
				floating
				{color}
				title={toast.title}
				message={toast.message}
				duration={toast.duration}
				closeLabel={toast.closable === false
					? undefined
					: i18n.t.notificationDismiss}
				onclose={() => toaster.dismiss(toast.id)}
				onexpire={() => toaster.dismiss(toast.id)}
			/>
		</div>
	{/each}
</section>

<style>
	.lumi-toaster {
		position: fixed;
		inset-block-start: var(--lumi-space-lg);
		inset-inline-end: var(--lumi-space-lg);
		z-index: var(--lumi-z-toast);
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-sm);
		inline-size: min(
			100vw - var(--lumi-space-lg) * 2,
			var(--lumi-toast-portal-max-width)
		);
		pointer-events: none;
	}

	.lumi-toaster > * {
		pointer-events: auto;
	}

	.lumi-toaster--bottom-end,
	.lumi-toaster--bottom-center {
		inset-block: auto var(--lumi-space-lg);
	}

	.lumi-toaster--top-center,
	.lumi-toaster--bottom-center {
		inset-inline: 0;
		margin-inline: auto;
	}

	@media (max-width: 48rem) {
		.lumi-toaster {
			inset-inline: var(--lumi-space-md);
			inline-size: auto;
		}
	}
</style>
