<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = {
		errorBadRequestKicker: en.errorBadRequestKicker,
		errorBadRequestTitle: en.errorBadRequestTitle,
		errorBadRequestDescription: en.errorBadRequestDescription,
		errorNotFoundKicker: en.errorNotFoundKicker,
		errorNotFoundTitle: en.errorNotFoundTitle,
		errorNotFoundDescription: en.errorNotFoundDescription,
		errorServerKicker: en.errorServerKicker,
		errorServerTitle: en.errorServerTitle,
		errorServerDescription: en.errorServerDescription,
		errorBack: en.errorBack,
		errorHome: en.errorHome,
		errorRetry: en.errorRetry
	};
</script>

<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import House from '@lucide/svelte/icons/house';
	import RefreshCcw from '@lucide/svelte/icons/refresh-ccw';
	import SearchX from '@lucide/svelte/icons/search-x';
	import ServerCrash from '@lucide/svelte/icons/server-crash';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import { Button } from '../Button';
	import { Card } from '../Card';
	import { EmptyState } from '../EmptyState';
	import { useLumiLocale } from '../../i18n';
	import type { ErrorStateProps, ErrorStateStatus } from './types';

	const {
		status = 500,
		message = '',
		homeHref = '/',
		class: className
	}: ErrorStateProps = $props();

	const i18n = useLumiLocale(COPY);

	const code = $derived<ErrorStateStatus>(
		status === 404 ? 404 : status >= 400 && status < 500 ? 400 : 500
	);
	const content = $derived.by(() => {
		const t = i18n.t;
		if (code === 400)
			return {
				icon: TriangleAlert,
				color: 'warning',
				kicker: t.errorBadRequestKicker,
				title: t.errorBadRequestTitle,
				description: t.errorBadRequestDescription
			} as const;
		if (code === 404)
			return {
				icon: SearchX,
				color: 'info',
				kicker: t.errorNotFoundKicker,
				title: t.errorNotFoundTitle,
				description: t.errorNotFoundDescription
			} as const;
		return {
			icon: ServerCrash,
			color: 'danger',
			kicker: t.errorServerKicker,
			title: t.errorServerTitle,
			description: t.errorServerDescription
		} as const;
	});

	function goBack(): void {
		if (history.length > 1) history.back();
		else location.assign(homeHref);
	}
</script>

<section
	class={['lumi-error-state', className]}
	aria-label={`${content.kicker}: ${content.title}`}
>
	<Card class="lumi-error-state__card">
		<EmptyState
			icon={content.icon}
			iconColor={content.color}
			title={`${code} · ${content.title}`}
			description={message.trim() || content.description}
		>
			{#snippet actions()}
				{#if code === 500}
					<Button
						variant="filled"
						color="danger"
						icon={RefreshCcw}
						onclick={() => location.reload()}
					>
						{i18n.t.errorRetry}
					</Button>
				{:else if code === 400}
					<Button
						variant="filled"
						color="warning"
						icon={ArrowLeft}
						onclick={goBack}
					>
						{i18n.t.errorBack}
					</Button>
				{/if}
				<Button
					variant={code === 404 ? 'filled' : 'border'}
					color={code === 404 ? 'info' : 'primary'}
					icon={House}
					href={homeHref}
				>
					{i18n.t.errorHome}
				</Button>
				{#if code === 404}
					<Button variant="border" icon={ArrowLeft} onclick={goBack}>
						{i18n.t.errorBack}
					</Button>
				{/if}
			{/snippet}
		</EmptyState>
	</Card>
</section>

<style>
	.lumi-error-state {
		display: flex;
		align-items: center;
		justify-content: center;
		inline-size: 100%;
		min-block-size: calc(100dvh - (var(--lumi-layout-content-padding) * 2));
		padding: var(--lumi-space-xl);
	}

	.lumi-error-state :global(.lumi-error-state__card) {
		max-inline-size: calc(var(--lumi-space-6xl) * 7);
	}

	@media (max-width: 48rem) {
		.lumi-error-state {
			min-block-size: calc(
				100dvh - (var(--lumi-layout-content-padding-mobile) * 2)
			);
		}
	}
</style>
