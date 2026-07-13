<script lang="ts">
	import {
		Button,
		Chip,
		DashboardBarChart,
		DashboardSection,
		Dialog,
		List,
		ListItem,
		PageHeader,
		Progress,
		QuickAccessCard,
		StatCard,
		Title,
		type ChartSeriesPoint
	} from '@lumi-ui/svelte';

	let reportOpen = $state(false);

	const activity: ChartSeriesPoint[] = [
		{ key: 'mon', label: 'Lun', value: 48 },
		{ key: 'tue', label: 'Mar', value: 64 },
		{ key: 'wed', label: 'Mié', value: 57 },
		{ key: 'thu', label: 'Jue', value: 76 },
		{ key: 'fri', label: 'Vie', value: 82 },
		{ key: 'sat', label: 'Sáb', value: 69 }
	];
</script>

<div class="lumi-stack lumi-stack--xl lumi-min-width--0">
	<PageHeader
		title="Dashboard"
		subtitle="Una composición completa creada únicamente con Lumi UI"
		icon="house"
		size="xl"
	>
		{#snippet actions()}
			<Button type="filled" icon="chartBar" onclick={() => (reportOpen = true)}>
				Crear reporte
			</Button>
		{/snippet}
	</PageHeader>

	<div class="lumi-grid lumi-grid--columns-4 lumi-grid--gap-md lumi-min-width--0">
		<StatCard
			title="Ingresos"
			value="S/ 48,240"
			icon="wallet"
			color="primary"
			subtitle="12.8% sobre el periodo anterior"
		/>
		<StatCard
			title="Actividad"
			value="1,284"
			icon="activity"
			color="success"
			subtitle="Interacciones durante esta semana"
		/>
		<StatCard
			title="Tareas abiertas"
			value="18"
			icon="listChecks"
			color="warning"
			subtitle="Cinco requieren atención hoy"
		/>
		<StatCard
			title="Disponibilidad"
			value="99.9%"
			icon="shieldCheck"
			color="info"
			subtitle="Servicios operando normalmente"
		/>
	</div>

	<div class="lumi-stack lumi-stack--md lumi-min-width--0">
		<Title
			title="Accesos rápidos"
			subtitle="Rutas reales para explorar cada familia de componentes"
			icon="sparkles"
			size="md"
		/>

		<div class="lumi-grid lumi-grid--columns-4 lumi-grid--gap-md lumi-min-width--0">
			<QuickAccessCard
				href="/components"
				title="Componentes"
				description="Acciones, superficies y estados semánticos."
				icon="boxes"
				color="primary"
			/>
			<QuickAccessCard
				href="/forms"
				title="Formularios"
				description="Controles accesibles y composición responsive."
				icon="clipboardPenLine"
				color="secondary"
			/>
			<QuickAccessCard
				href="/data"
				title="Datos"
				description="Métricas, tablas, selección y visualizaciones."
				icon="chartBar"
				color="info"
			/>
			<QuickAccessCard
				href="/settings"
				title="Ajustes"
				description="Tema, densidad y preferencias de interfaz."
				icon="settings"
				color="success"
			/>
		</div>
	</div>

	<div class="lumi-dashboard-overview-grid">
		<DashboardSection
			title="Actividad semanal"
			subtitle="Volumen consolidado por día"
			icon="chartBar"
		>
			<DashboardBarChart
				data={activity}
				color="primary"
				aria-label="Actividad semanal de la demostración"
			/>
		</DashboardSection>

		<DashboardSection
			title="Actividad reciente"
			subtitle="Estados presentados con semántica Lumi"
			icon="history"
		>
			<List size="sm" color="primary">
				<ListItem title="Nuevo espacio creado" subtitle="Hace 8 minutos" icon="folderPlus">
					<Chip color="success" size="sm">Listo</Chip>
				</ListItem>
				<ListItem title="Reporte actualizado" subtitle="Hace 24 minutos" icon="refreshCw">
					<Chip color="info" size="sm">Sincronizado</Chip>
				</ListItem>
				<ListItem title="Revisión pendiente" subtitle="Hace 1 hora" icon="clock">
					<Chip color="warning" size="sm">Pendiente</Chip>
				</ListItem>
				<ListItem title="Acceso protegido" subtitle="Hace 3 horas" icon="lock">
					<Chip color="secondary" size="sm">Seguro</Chip>
				</ListItem>
			</List>
		</DashboardSection>
	</div>

	<DashboardSection
		title="Estado operativo"
		subtitle="Progreso y salud de capacidades compartidas"
		icon="activity"
	>
		<div class="lumi-grid lumi-grid--columns-3 lumi-grid--gap-lg">
			<div class="lumi-stack lumi-stack--xs">
				<div class="lumi-flex lumi-justify--between lumi-align-items--center">
					<span class="lumi-font--medium">Diseño del sistema</span>
					<span class="lumi-text--sm lumi-text--muted">92%</span>
				</div>
				<Progress value={92} color="primary" aria-label="Diseño del sistema" />
			</div>
			<div class="lumi-stack lumi-stack--xs">
				<div class="lumi-flex lumi-justify--between lumi-align-items--center">
					<span class="lumi-font--medium">Accesibilidad</span>
					<span class="lumi-text--sm lumi-text--muted">86%</span>
				</div>
				<Progress value={86} color="success" aria-label="Accesibilidad" />
			</div>
			<div class="lumi-stack lumi-stack--xs">
				<div class="lumi-flex lumi-justify--between lumi-align-items--center">
					<span class="lumi-font--medium">Documentación</span>
					<span class="lumi-text--sm lumi-text--muted">78%</span>
				</div>
				<Progress value={78} color="secondary" aria-label="Documentación" />
			</div>
		</div>
	</DashboardSection>
</div>

<Dialog bind:open={reportOpen} title="Crear reporte" size="sm">
	<div class="lumi-stack lumi-stack--md">
		<p class="lumi-text--muted">
			Esta interacción demuestra un diálogo portaled sin añadir estilos ni infraestructura local.
		</p>
		<Chip icon="checkCircle" color="success">Datos listos para procesar</Chip>
	</div>

	{#snippet footer()}
		<Button type="flat" onclick={() => (reportOpen = false)}>Cancelar</Button>
		<Button type="filled" icon="download" onclick={() => (reportOpen = false)}>Generar</Button>
	{/snippet}
</Dialog>
