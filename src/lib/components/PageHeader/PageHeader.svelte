<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { pageActions: en.pageActions };
</script>

<script lang="ts">
	import { Title } from '../Title';
	import { useLumiLocale } from '../../i18n';
	import type { PageHeaderProps } from './types';

	const {
		size = 'lg',
		level = 1,
		class: className,
		actions,
		...titleProps
	}: PageHeaderProps = $props();

	const i18n = useLumiLocale(COPY);
</script>

<header class={['lumi-page-header', className]}>
	<div class="lumi-page-header__title">
		<Title {...titleProps} {size} {level} />
	</div>

	{#if actions}
		<div
			class="lumi-page-header__actions"
			role="group"
			aria-label={i18n.t.pageActions}
		>
			{@render actions()}
		</div>
	{/if}
</header>

<style>
	.lumi-page-header {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--lumi-space-md);
		padding: var(--lumi-space-lg);
		border-radius: var(--lumi-surface-radius);
		border: var(--lumi-border-width-thin) solid var(--lumi-color-border);
		background: var(--lumi-gradient-card);
		box-shadow: var(--lumi-shadow-sm);
		overflow: hidden;
		isolation: isolate;
	}

	.lumi-page-header__title {
		position: relative;
		z-index: var(--lumi-z-base);
		min-width: 0;
	}

	.lumi-page-header__actions {
		position: relative;
		z-index: var(--lumi-z-base);
		display: flex;
		align-items: center;
		gap: var(--lumi-space-sm);
		flex-shrink: 0;
		flex-wrap: wrap;
	}

	@media (max-width: 48rem) {
		.lumi-page-header {
			padding: var(--lumi-space-md);
			border-radius: var(--lumi-radius-panel);
			grid-template-columns: 1fr;
		}

		.lumi-page-header__actions {
			width: 100%;
			justify-content: flex-end;
			gap: var(--lumi-space-xs);
		}
	}
</style>
