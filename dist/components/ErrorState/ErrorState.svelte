<script lang="ts">
	import { Button } from '../Button';
	import { Card } from '../Card';
	import { EmptyState } from '../EmptyState';
	import type { ErrorStateContent, ErrorStateProps, ErrorStateStatus } from './types';

	const ERROR_CONTENT = {
		400: {
			status: 400,
			variant: 'bad-request',
			icon: 'alertTriangle',
			color: 'warning',
			kicker: 'Solicitud inválida',
			title: '400 · Algo no cuadra en esta solicitud',
			description:
				'Revisa los datos enviados o vuelve a la pantalla anterior para intentarlo con información válida.',
			primaryAction: 'Volver atrás',
			secondaryAction: 'Ir al inicio'
		},
		404: {
			status: 404,
			variant: 'not-found',
			icon: 'search',
			color: 'info',
			kicker: 'Página no encontrada',
			title: '404 · Esta ruta no existe o cambió de lugar',
			description:
				'Puedes regresar al panel principal y continuar desde una sección disponible para tu perfil.',
			primaryAction: 'Ir al inicio',
			secondaryAction: 'Volver atrás'
		},
		500: {
			status: 500,
			variant: 'server-error',
			icon: 'shieldCheck',
			color: 'danger',
			kicker: 'Error del servidor',
			title: '500 · No pudimos completar esta operación',
			description:
				'El sistema encontró un problema inesperado. Intenta recargar la vista o vuelve al inicio.',
			primaryAction: 'Reintentar',
			secondaryAction: 'Ir al inicio'
		}
	} satisfies Record<ErrorStateStatus, ErrorStateContent>;

	const {
		status = 500,
		message = '',
		homeHref = '/',
		class: className = ''
	}: ErrorStateProps = $props();

	const normalizedStatus = $derived.by<ErrorStateStatus>(() => {
		if (status === 400 || status === 404 || status === 500) return status;
		if (status >= 400 && status < 500) return 400;
		return 500;
	});

	const content = $derived.by(() => ERROR_CONTENT[normalizedStatus]);
	const classes = $derived(
		['lumi-error-state', 'lumi-flex', 'lumi-flex--center', 'lumi-padding--xl', className]
			.filter(Boolean)
			.join(' ')
	);
	const displayMessage = $derived(message.trim());

	function navigateHome() {
		if (typeof window !== 'undefined') {
			window.location.href = homeHref;
		}
	}

	function goBack() {
		if (typeof window !== 'undefined' && window.history.length > 1) {
			window.history.back();
			return;
		}

		navigateHome();
	}

	function retry() {
		if (typeof window !== 'undefined') {
			window.location.reload();
		}
	}

	function runPrimaryAction() {
		if (content.status === 400) {
			goBack();
			return;
		}

		if (content.status === 500) {
			retry();
			return;
		}

		navigateHome();
	}

	function runSecondaryAction() {
		if (content.status === 404) {
			goBack();
			return;
		}

		navigateHome();
	}
</script>

<section class={classes} aria-label={`${content.kicker}: ${content.title}`}>
	<Card class="lumi-error-state__card">
		<EmptyState
			icon={content.icon}
			iconColor={content.color}
			title={content.title}
			description={displayMessage || content.description}
		>
			{#snippet actions()}
				<div class="lumi-flex lumi-flex--center lumi-flex--wrap lumi-flex--gap-sm">
					<Button
						type="filled"
						color={content.color}
						icon={content.status === 500 ? 'refresh' : 'house'}
						onclick={runPrimaryAction}
					>
						{content.primaryAction}
					</Button>
					<Button
						type="border"
						color="primary"
						icon={content.status === 404 ? 'arrowLeft' : 'house'}
						onclick={runSecondaryAction}
					>
						{content.secondaryAction}
					</Button>
				</div>
			{/snippet}
		</EmptyState>
	</Card>
</section>

<style>
	.lumi-error-state {
		width: 100%;
		min-height: calc(100dvh - (var(--lumi-layout-content-padding) * 2));
	}

	:global(.lumi-error-state__card) {
		max-width: calc(var(--lumi-space-6xl) * 7);
	}

	@media (max-width: 768px) {
		.lumi-error-state {
			min-height: calc(100dvh - (var(--lumi-layout-content-padding-mobile) * 2));
		}
	}
</style>
