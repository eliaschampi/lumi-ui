<script lang="ts">
	import {
		Chip,
		DashboardBarChart,
		DashboardChart,
		DashboardSection,
		PageHeader,
		StatCard,
		Table,
		type ChartSeriesPoint,
		type DashboardChartSeries
	} from '@lumi-ui/svelte';

	type RecordStatus = 'active' | 'pending' | 'paused';

	interface DemoRecord {
		id: number;
		name: string;
		owner: string;
		status: RecordStatus;
		value: number;
	}

	const records: DemoRecord[] = [
		{ id: 1, name: 'Atlas Workspace', owner: 'Ana Torres', status: 'active', value: 12400 },
		{ id: 2, name: 'Northwind Lab', owner: 'Bruno Díaz', status: 'pending', value: 8900 },
		{ id: 3, name: 'Nexus Portal', owner: 'Carla Ruiz', status: 'active', value: 17250 },
		{ id: 4, name: 'Orbit Studio', owner: 'Diego Silva', status: 'paused', value: 6300 },
		{ id: 5, name: 'Vertex Cloud', owner: 'Elena Paz', status: 'active', value: 21100 },
		{ id: 6, name: 'Pulse Center', owner: 'Fabio León', status: 'pending', value: 9800 }
	];

	const revenue: ChartSeriesPoint[] = [
		{ key: 'jan', label: 'Ene', value: 18 },
		{ key: 'feb', label: 'Feb', value: 25 },
		{ key: 'mar', label: 'Mar', value: 23 },
		{ key: 'apr', label: 'Abr', value: 31 },
		{ key: 'may', label: 'May', value: 38 },
		{ key: 'jun', label: 'Jun', value: 44 }
	];

	const chartSeries: DashboardChartSeries[] = [
		{
			key: 'current',
			label: 'Periodo actual',
			color: 'primary',
			data: revenue
		},
		{
			key: 'previous',
			label: 'Periodo anterior',
			color: 'secondary',
			data: revenue.map((point) => ({ ...point, value: Math.max(0, point.value - 7) }))
		}
	];

	let selectedRecords = $state<DemoRecord[]>([]);

	function statusLabel(status: RecordStatus): string {
		return status === 'active' ? 'Activo' : status === 'pending' ? 'Pendiente' : 'Pausado';
	}

	function statusColor(status: RecordStatus): 'success' | 'warning' | 'secondary' {
		return status === 'active' ? 'success' : status === 'pending' ? 'warning' : 'secondary';
	}

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('es-PE', {
			style: 'currency',
			currency: 'PEN',
			maximumFractionDigits: 0
		}).format(value);
	}
</script>

<div class="lumi-stack lumi-stack--xl lumi-min-width--0">
	<PageHeader
		title="Datos"
		subtitle="Tablas tipadas, selección, paginación y gráficos responsive"
		icon="chartBar"
		size="xl"
	/>

	<div class="lumi-grid lumi-grid--columns-4 lumi-grid--gap-md">
		<StatCard title="Registros" value={records.length} icon="list" color="primary" />
		<StatCard
			title="Activos"
			value={records.filter((item) => item.status === 'active').length}
			icon="activity"
			color="success"
		/>
		<StatCard
			title="Seleccionados"
			value={selectedRecords.length}
			icon="checkCircle"
			color="secondary"
		/>
		<StatCard
			title="Valor total"
			value={formatCurrency(records.reduce((sum, item) => sum + item.value, 0))}
			icon="wallet"
			color="info"
		/>
	</div>

	<div class="lumi-dashboard-analytics-grid">
		<DashboardSection title="Evolución" subtitle="Comparación entre periodos" icon="trendingUp">
			<DashboardChart
				series={chartSeries}
				valueFormat="number"
				aria-label="Comparación mensual entre periodos"
			/>
		</DashboardSection>

		<DashboardSection title="Distribución" subtitle="Volumen del periodo actual" icon="chartBar">
			<DashboardBarChart
				data={revenue}
				color="secondary"
				aria-label="Distribución mensual del periodo actual"
			/>
		</DashboardSection>
	</div>

	<DashboardSection
		title="Workspaces"
		subtitle="Listado local con búsqueda, selección y paginación"
		icon="building2"
	>
		<Table
			data={records}
			rowKey={(row) => row.id}
			search
			selectable
			pagination
			itemsPerPage={4}
			hover
			stripe
			bind:selected={selectedRecords}
			searchPlaceholder="Buscar workspace"
			aria-label="Workspaces de demostración"
		>
			{#snippet thead()}
				<th>Workspace</th>
				<th>Responsable</th>
				<th>Estado</th>
				<th>Valor</th>
			{/snippet}

			{#snippet row({ row })}
				<td class="lumi-font--medium">{row.name}</td>
				<td>{row.owner}</td>
				<td><Chip color={statusColor(row.status)} size="sm">{statusLabel(row.status)}</Chip></td>
				<td>{formatCurrency(row.value)}</td>
			{/snippet}
		</Table>
	</DashboardSection>
</div>
