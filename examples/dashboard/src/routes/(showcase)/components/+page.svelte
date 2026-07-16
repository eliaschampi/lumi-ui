<script lang="ts">
	import {
		Alert,
		Avatar,
		AvatarGroup,
		AvatarPicker,
		Button,
		Card,
		Chip,
		Collapse,
		Context,
		ContextItem,
		DateRangeFilter,
		Divider,
		EmptyState,
		ErrorState,
		FileUpload,
		IconBadge,
		type FileUploadFile,
		Image,
		Input,
		Loading,
		Notification,
		type NotificationColor,
		PageHeader,
		PageSidebar,
		Progress,
		Radio,
		RemoteSelect,
		Select,
		StatusIndicator,
		TagOption,
		Tabs,
		Tooltip,
		UserInfo
	} from '@lumi-ui/svelte';

	let activeTab = $state<string | number>('actions');
	let alertVisible = $state(true);

	// Status & feedback demo state.
	let notificationVisible = $state(false);
	let notificationColor = $state<NotificationColor>('success');
	let notificationTitle = $state('Datos guardados');
	const NOTIFICATION_TYPES: { value: NotificationColor; label: string }[] = [
		{ value: 'success', label: 'Éxito' },
		{ value: 'warning', label: 'Advertencia' },
		{ value: 'info', label: 'Info' },
		{ value: 'danger', label: 'Error' },
		{ value: 'primary', label: 'Primario' }
	];

	function triggerNotification(color: NotificationColor): void {
		const match = NOTIFICATION_TYPES.find((item) => item.value === color);
		notificationColor = color;
		notificationTitle = match?.label ?? 'Notificación';
		notificationVisible = true;
	}

	// Tags & forms demo state.
	let selectedTag = $state<string>('all');
	const TAG_OPTIONS = [
		{ value: 'all', label: 'Todos', color: 'primary' as const },
		{ value: 'active', label: 'Activos', color: 'success' as const },
		{ value: 'pending', label: 'Pendientes', color: 'warning' as const },
		{ value: 'paused', label: 'Pausados', color: 'secondary' as const }
	];

	let uploadedFiles = $state<FileUploadFile[]>([]);
	let dateRangeFrom = $state('');
	let dateRangeTo = $state('');

	let remoteWorkspace = $state<{ id: number; name: string } | null>(null);

	// PageSidebar layout demo (page-level, never nested in a Card).
	let filtersOpen = $state(false);
	let filterStatus = $state('all');
	let filterOwner = $state<string | number | Record<string, unknown> | null>('all');
	let filterQuery = $state('');

	const FILTER_STATUS = [
		{ value: 'all', label: 'Todos' },
		{ value: 'active', label: 'Activos' },
		{ value: 'pending', label: 'Pendientes' },
		{ value: 'paused', label: 'Pausados' }
	] as const;

	const FILTER_OWNERS = [
		{ value: 'all', label: 'Cualquiera' },
		{ value: 'ana', label: 'Ana Torres' },
		{ value: 'bruno', label: 'Bruno Díaz' },
		{ value: 'carla', label: 'Carla Ruiz' }
	];

	const WORKSPACE_ROWS = [
		{ name: 'Atlas Workspace', owner: 'Ana Torres', status: 'active' as const },
		{ name: 'Northwind Lab', owner: 'Bruno Díaz', status: 'pending' as const },
		{ name: 'Nexus Portal', owner: 'Carla Ruiz', status: 'active' as const },
		{ name: 'Orbit Studio', owner: 'Ana Torres', status: 'paused' as const }
	];

	const filteredWorkspaces = $derived(
		WORKSPACE_ROWS.filter((row) => {
			if (filterStatus !== 'all' && row.status !== filterStatus) return false;
			if (filterOwner && filterOwner !== 'all') {
				const owner = FILTER_OWNERS.find((item) => item.value === filterOwner)?.label;
				if (owner && row.owner !== owner) return false;
			}
			const q = filterQuery.trim().toLowerCase();
			if (q && !row.name.toLowerCase().includes(q) && !row.owner.toLowerCase().includes(q)) {
				return false;
			}
			return true;
		})
	);

	// Context menu demo state.
	let contextMenu = $state<Context>();
	let contextTarget = $state<string>('');

	function openWorkspaceContext(event: MouseEvent, name: string): void {
		contextTarget = name;
		contextMenu?.open(event, name);
	}

	function applyFiltersAndClose(): void {
		filtersOpen = false;
	}

	function statusChipColor(status: 'active' | 'pending' | 'paused'): 'success' | 'warning' | 'secondary' {
		if (status === 'active') return 'success';
		if (status === 'pending') return 'warning';
		return 'secondary';
	}

	function statusChipLabel(status: 'active' | 'pending' | 'paused'): string {
		if (status === 'active') return 'Activo';
		if (status === 'pending') return 'Pendiente';
		return 'Pausado';
	}

	const tabs = [
		{ value: 'actions', label: 'Acciones', icon: 'sparkles' },
		{ value: 'forms', label: 'Formularios', icon: 'clipboardPenLine' },
		{ value: 'status', label: 'Estados', icon: 'activity' },
		{ value: 'identity', label: 'Identidad', icon: 'users' },
		{ value: 'navigation', label: 'Navegación', icon: 'menu' },
		{ value: 'overlays', label: 'Overlays', icon: 'layers' }
	];

	const team = [
		{ text: 'Ana Torres', alt: 'Ana Torres' },
		{ text: 'Bruno Díaz', alt: 'Bruno Díaz' },
		{ text: 'Carla Ruiz', alt: 'Carla Ruiz' },
		{ text: 'Diego Silva', alt: 'Diego Silva' },
		{ text: 'Elena Paz', alt: 'Elena Paz' }
	];

	const AVATAR_OPTIONS = [
		{ src: 'https://i.pravatar.cc/120?u=ana', value: 'ana', label: 'Ana Torres' },
		{ src: 'https://i.pravatar.cc/120?u=bruno', value: 'bruno', label: 'Bruno Díaz' },
		{ src: 'https://i.pravatar.cc/120?u=carla', value: 'carla', label: 'Carla Ruiz' },
		{ src: 'https://i.pravatar.cc/120?u=diego', value: 'diego', label: 'Diego Silva' }
	];
	let selectedAvatar = $state('ana');

	const STATUS_VARIANTS: Array<{
		status: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'secondary';
		label: string;
		pulse?: boolean;
	}> = [
		{ status: 'success', label: 'En línea', pulse: true },
		{ status: 'warning', label: 'Pendiente' },
		{ status: 'danger', label: 'Con error' },
		{ status: 'info', label: 'Sincronizando', pulse: true },
		{ status: 'primary', label: 'Disponible' },
		{ status: 'secondary', label: 'Auxiliar' }
	];

</script>

<div class="lumi-stack lumi-stack--xl lumi-min-width--0">
	<PageHeader
		title="Componentes"
		subtitle="Primitivas coherentes, semánticas y listas para composición"
		icon="boxes"
		size="xl"
	/>

	<Tabs bind:value={activeTab} {tabs} aria-label="Familias de componentes" />

	{#if activeTab === 'actions'}
		<div class="lumi-grid lumi-grid--columns-2 lumi-grid--gap-lg">
			<Card title="Botones" subtitle="Variantes por jerarquía de acción" spaced>
				<div class="lumi-flex lumi-flex--wrap lumi-flex--gap-sm">
					<Button variant="filled" icon="plus">Crear</Button>
					<Button variant="border" icon="edit">Editar</Button>
					<Button variant="flat" icon="refreshCw">Actualizar</Button>
					<Button variant="ghost" icon="trash" color="danger">Eliminar</Button>
					<Button variant="filled" loading>Procesando</Button>
				</div>
			</Card>

			<Card title="Chips" subtitle="Etiquetas y estados compactos" spaced>
				<div class="lumi-flex lumi-flex--wrap lumi-flex--gap-sm">
					<Chip color="primary" icon="sparkles">Principal</Chip>
					<Chip color="secondary">Secundario</Chip>
					<Chip color="success" icon="check">Completado</Chip>
					<Chip color="warning" icon="clock">Pendiente</Chip>
					<Chip color="danger" icon="alertTriangle">Bloqueado</Chip>
					<Chip color="info" closable>Información</Chip>
				</div>
			</Card>

			<Card title="Ayuda contextual" subtitle="Tooltip portaled y controles accesibles" spaced>
				<div class="lumi-flex lumi-align-items--center lumi-flex--gap-sm">
					<Tooltip text="Este contenido se posiciona fuera de ancestros recortados">
						<Button variant="border" icon="info">Mostrar ayuda</Button>
					</Tooltip>
					<Button variant="filled" icon="settings" aria-label="Configurar" />
				</div>
			</Card>

			<Card title="Divulgación" subtitle="Contenido progresivo sin lógica duplicada" spaced>
				<Collapse title="¿Por qué composición?" defaultOpen color="primary">
					<p class="lumi-text--sm lumi-text--muted">
						Las primitivas pequeñas mantienen APIs claras y permiten construir interfaces
						diferentes.
					</p>
				</Collapse>
			</Card>
		</div>
	{:else if activeTab === 'forms'}
		<div class="lumi-stack lumi-stack--lg">
			<Card title="TagOption" subtitle="Selección semántica por color" spaced>
				<div class="lumi-flex lumi-flex--wrap lumi-flex--gap-sm">
					{#each TAG_OPTIONS as tag (tag.value)}
						<TagOption
							label={tag.label}
							color={tag.color}
							active={selectedTag === tag.value}
							onclick={() => (selectedTag = tag.value)}
						/>
					{/each}
				</div>
				<p class="lumi-text--sm lumi-text--muted">
					Filtro actual: <strong>{TAG_OPTIONS.find((t) => t.value === selectedTag)?.label}</strong>
				</p>
			</Card>

			<Card
				title="DateRangeFilter"
				subtitle="Composición de filtros con acciones opcionales"
				spaced
			>
				<DateRangeFilter
					bind:fromValue={dateRangeFrom}
					bind:toValue={dateRangeTo}
					fromLabel="Desde"
					toLabel="Hasta"
					applyLabel="Aplicar rango"
					onapply={() => {}}
				/>
				<p class="lumi-text--sm lumi-text--muted">
					Rango seleccionado: {dateRangeFrom || '—'} → {dateRangeTo || '—'}
				</p>
			</Card>

			<Card title="RemoteSelect" subtitle="Búsqueda remota con debounce y aborto" spaced>
				<RemoteSelect
					bind:selected={remoteWorkspace}
					endpoint="/api/workspaces"
					label="Workspace"
					placeholder="Busca un workspace"
					minQueryLength={2}
					debounceMs={250}
					limit={5}
					clearable
					getOptionValue={(item) => String(item.id)}
					getOptionLabel={(item) => item.name}
					errorMessageFallback="No se pudo cargar el workspace."
				/>
				<p class="lumi-text--sm lumi-text--muted">
					Seleccionado:
					{remoteWorkspace ? `${remoteWorkspace.name} (#${remoteWorkspace.id})` : 'ninguno'}
				</p>
			</Card>

			<Card title="FileUpload" subtitle="Validación local sin endpoint" spaced>
				<FileUpload
					bind:files={uploadedFiles}
					accept="image/*,.pdf"
					multiple
					maxSize={2_000_000}
					placeholderText="Subir archivos"
					hintText="Arrastra imágenes o PDF (máx 2MB) o haz clic para seleccionar"
				/>
				<p class="lumi-text--sm lumi-text--muted">
					Archivos seleccionados: {uploadedFiles.length}
				</p>
			</Card>
		</div>
	{:else if activeTab === 'status'}
		<div class="lumi-stack lumi-stack--lg">
			{#if alertVisible}
				<Alert color="info" title="Estado informativo" closable bind:active={alertVisible}>
					Una alerta permanece dentro del flujo hasta que deja de ser relevante.
				</Alert>
			{/if}

			<div class="lumi-grid lumi-grid--columns-2 lumi-grid--gap-lg">
				<Card title="Progreso" subtitle="Estados determinados e indeterminados" spaced>
					<div class="lumi-stack lumi-stack--md">
						<Progress value={72} color="primary" showLabel />
						<Progress value={48} color="secondary" striped animated />
						<Progress indeterminate color="info" aria-label="Sincronizando" />
					</div>
				</Card>

				<Card title="Mensajes vacíos" subtitle="Orientación cuando no existe contenido" spaced>
					<EmptyState
						icon="inbox"
						iconColor="muted"
						title="Sin elementos"
						description="Los nuevos elementos aparecerán aquí cuando estén disponibles."
					/>
				</Card>

				<Card title="Loading" subtitle="Indicadores locales de carga" spaced>
					<div class="lumi-stack lumi-stack--md">
						<Loading color="primary" />
						<Loading color="secondary" size="sm" text="Cargando datos" />
						<Loading color="info" size="lg" text="Procesando agregaciones" />
					</div>
				</Card>

				<Card title="Notificaciones" subtitle="Feedback transitorio colocado por la app" spaced>
					<div class="lumi-stack lumi-stack--md">
						<div class="lumi-flex lumi-flex--wrap lumi-flex--gap-sm">
							{#each NOTIFICATION_TYPES as type (type.value)}
								<Button variant="border" size="sm" onclick={() => triggerNotification(type.value)}>
									{type.label}
								</Button>
							{/each}
						</div>
						<p class="lumi-text--sm lumi-text--muted">
							La <code>Notification</code> se renderiza donde la app la coloca. Activa una para verla
							más abajo.
						</p>
						{#if notificationVisible}
							<Notification
								color={notificationColor}
								title={notificationTitle}
								message="Resumen local de la interacción reciente."
								closable
								duration={3500}
								bind:active={notificationVisible}
							/>
						{/if}
					</div>
				</Card>

				<Card
					title="Estados de error"
					subtitle="Recuperación visible desde la propia página"
					spaced
				>
					<div class="lumi-stack lumi-stack--md">
						<ErrorState
							status={404}
							message="Recurso de demostración no encontrado."
							homeHref="/"
						/>
					</div>
				</Card>

				<Card title="StatusIndicator" subtitle="Puntos semánticos con pulso y tooltip" spaced>
					<div class="lumi-stack lumi-stack--md">
						<div class="lumi-flex lumi-flex--wrap lumi-flex--gap-md">
							{#each STATUS_VARIANTS as variant (variant.status)}
								<Tooltip text={variant.label}>
									<div class="lumi-flex lumi-align-items--center lumi-flex--gap-sm">
										<StatusIndicator status={variant.status} pulse={variant.pulse} />
										<span class="lumi-text--sm">{variant.label}</span>
									</div>
								</Tooltip>
							{/each}
						</div>
					</div>
				</Card>
			</div>
		</div>
	{:else if activeTab === 'identity'}
		<div class="lumi-grid lumi-grid--columns-2 lumi-grid--gap-lg">
			<Card title="Avatares" subtitle="Identidad individual y equipos" spaced>
				<div class="lumi-stack lumi-stack--lg">
					<div class="lumi-flex lumi-flex--wrap lumi-align-items--center lumi-flex--gap-md">
						<Avatar text="Lumi UI" size="xl" color="primary" />
						<Avatar text="Design System" size="lg" color="secondary" />
						<Avatar icon="user" size="md" color="info" />
					</div>
					<Divider text="Equipo" position="left" />
					<AvatarGroup items={team} max={4} size="md" />
				</div>
			</Card>

			<Card title="Badges de icono" subtitle="Énfasis visual con color semántico" spaced>
				<div class="lumi-flex lumi-flex--wrap lumi-flex--gap-md">
					<IconBadge icon="shieldCheck" color="primary" size="xl" />
					<IconBadge icon="heart" color="danger" size="xl" />
					<IconBadge icon="star" color="warning" size="xl" />
					<IconBadge icon="sparkles" color="secondary" size="xl" />
				</div>
			</Card>

			<Card title="Image" subtitle="Imagen responsiva con skeleton de carga" spaced>
				<Image
					src="https://picsum.photos/id/1015/640/360"
					alt="Vista de ejemplo de Lumi UI"
					radius="lg"
					loading="lazy"
				/>
			</Card>

			<Card title="AvatarPicker" subtitle="Selección única por imagen" spaced>
				<AvatarPicker options={AVATAR_OPTIONS} bind:value={selectedAvatar} name="avatar" />
				<p class="lumi-text--sm lumi-text--muted">
					Avatar elegido:
					{AVATAR_OPTIONS.find((o) => o.value === selectedAvatar)?.label ?? 'ninguno'}
				</p>
			</Card>

			<Card title="UserInfo" subtitle="Identidad compacta para listas o encabezados" spaced>
				<div class="lumi-stack lumi-stack--md">
					<UserInfo
						name="Coedula"
						lastName="Studio"
						description="Editor educativo"
						avatarColor="primary"
						avatarSize="lg"
					/>
					<UserInfo
						name="Faztore"
						description="Consola comercial"
						avatarColor="secondary"
						avatarSize="md"
					/>
				</div>
			</Card>
		</div>
	{:else if activeTab === 'navigation'}
		<div class="lumi-stack lumi-stack--md lumi-min-width--0">
			<PageHeader
				title="Workspaces"
				subtitle="PageSidebar es la columna de filtros del page layout, no un demo dentro de Card"
				icon="folders"
			>
				{#snippet actions()}
					<div
						class="lumi-flex lumi-flex--gap-sm lumi-align-items--center lumi-page-sidebar__header-actions"
					>
						<Button
							variant="ghost"
							size="sm"
							icon="slidersHorizontal"
							class="lumi-page-sidebar__mobile-trigger"
							onclick={() => (filtersOpen = true)}
							aria-label="Abrir filtros"
						/>
						<Button variant="filled" size="sm" icon="plus">Nuevo</Button>
					</div>
				{/snippet}
			</PageHeader>

			<div class="lumi-layout--two-columns lumi-page-sidebar-layout">
				<PageSidebar
					bind:mobileOpen={filtersOpen}
					mobileTitle="Filtros"
					mobileAriaLabel="Cerrar filtros"
				>
					{#snippet sidebar()}
						<div class="lumi-page-sidebar__section">
							<div
								class="lumi-filter-summary lumi-filter-summary--compact lumi-filter-summary--secondary"
							>
								<p class="lumi-filter-summary__eyebrow">Vista de listado</p>
								<h2 class="lumi-filter-summary__title">Workspaces</h2>
								<p class="lumi-filter-summary__subtitle">
									Filtra por estado, responsable y texto.
								</p>
							</div>
						</div>

						<div class="lumi-page-sidebar__section">
							<p class="lumi-page-sidebar__label">Estado</p>
							<div class="lumi-page-sidebar__radio-group">
								{#each FILTER_STATUS as option (option.value)}
									<Radio
										bind:group={filterStatus}
										value={option.value}
										label={option.label}
										name="workspace-status"
									/>
								{/each}
							</div>
						</div>

						<div class="lumi-page-sidebar__section">
							<p class="lumi-page-sidebar__label">Responsable</p>
							<Select
								bind:value={filterOwner}
								name="workspace-owner"
								label="Persona"
								options={FILTER_OWNERS}
							/>
						</div>

						<div class="lumi-page-sidebar__section">
							<Input
								bind:value={filterQuery}
								name="workspace-search"
								label="Buscar"
								placeholder="Nombre o responsable"
								icon="search"
							/>
						</div>

						<div class="lumi-page-sidebar__section lumi-stack lumi-stack--xs">
							<Button variant="border" icon="search" onclick={applyFiltersAndClose}>
								Aplicar filtros
							</Button>
						</div>
					{/snippet}
				</PageSidebar>

				<section class="lumi-layout--content-right">
					<div class="lumi-stack lumi-stack--sm">
						<Card spaced>
							<div class="lumi-stack lumi-stack--md">
								<div class="lumi-filter-summary lumi-filter-summary--secondary">
									<p class="lumi-filter-summary__eyebrow">Resultados</p>
									<h2 class="lumi-filter-summary__title">Workspaces</h2>
									<p class="lumi-filter-summary__subtitle">
										El contenido principal vive a la derecha; los Cards van aquí, no alrededor del
										layout.
									</p>
									<div class="lumi-filter-summary__meta">
										<Chip color="primary" size="sm">Total {filteredWorkspaces.length}</Chip>
										{#if filterStatus !== 'all'}
											<Chip color="secondary" size="sm">
												{FILTER_STATUS.find((s) => s.value === filterStatus)?.label}
											</Chip>
										{/if}
										{#if filterQuery.trim()}
											<Chip color="info" size="sm" icon="search">{filterQuery.trim()}</Chip>
										{/if}
									</div>
								</div>

								{#if filteredWorkspaces.length === 0}
									<EmptyState
										icon="slidersHorizontal"
										title="Sin resultados"
										description="Ajusta los filtros del panel izquierdo."
									/>
								{:else}
									<div class="lumi-stack lumi-stack--sm">
										{#each filteredWorkspaces as row (row.name)}
											<div
												class="lumi-flex lumi-justify--between lumi-align-items--center lumi-flex--gap-sm"
											>
												<div class="lumi-stack lumi-stack--2xs">
													<span class="lumi-font--medium">{row.name}</span>
													<span class="lumi-text--sm lumi-text--muted">{row.owner}</span>
												</div>
												<Chip color={statusChipColor(row.status)} size="sm">
													{statusChipLabel(row.status)}
												</Chip>
											</div>
										{/each}
									</div>
								{/if}
							</div>
						</Card>
					</div>
				</section>
			</div>
		</div>
	{:else if activeTab === 'overlays'}
		<div class="lumi-grid lumi-grid--columns-2 lumi-grid--gap-lg">
			<Card title="Menu contextual" subtitle="Menú por puntero con datos adjuntos" spaced>
				<div
					class="lumi-padding--md"
					role="group"
					aria-label="Clic derecho abrir menú"
					oncontextmenu={(event) => openWorkspaceContext(event, 'Workspace demostración')}
				>
					<p class="lumi-text--sm lumi-text--muted">
						Haz clic derecho en cualquier parte de esta tarjeta para invocar el menú.
					</p>
					<p class="lumi-text--sm">
						Último objetivo: <strong>{contextTarget || 'ninguno'}</strong>
					</p>
				</div>

				<Context bind:this={contextMenu} aria-label="Menú workspace de demostración">
					{#snippet children({ data })}
						<ContextItem
							icon="folder"
							title="Abrir"
							onclick={() => (contextTarget = `Abrir: ${data}`)}
						/>
						<ContextItem icon="share" title="Compartir" />
						<ContextItem icon="settings" title="Configuración" />
						<ContextItem icon="trash" color="danger" title="Eliminar" shortcut="Supr" />
					{/snippet}
				</Context>
			</Card>

			<Card title="Cuándo usar overlays" subtitle="Distinción de roles por interacción" spaced>
				<div class="lumi-stack lumi-stack--sm">
					<p class="lumi-text--sm lumi-text--muted">
						<code>Dialog</code>: interrupción modal. <code>Dropdown</code>: menú anclado a un
						disparador. <code>Context</code>: menú por puntero. <code>Tooltip</code>: descripción
						suplementaria.
					</p>
					<p class="lumi-text--sm lumi-text--muted">
						Todos portales fuera de ancestros recortados y preservan foco y teclado.
					</p>
				</div>
			</Card>
		</div>
	{/if}
</div>
