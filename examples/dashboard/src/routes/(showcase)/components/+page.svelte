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
		Loading,
		Notification,
		type NotificationColor,
		PageHeader,
		PageSidebar,
		Progress,
		RemoteSelect,
		StatusIndicator,
		TagOption,
		Title,
		Tabs,
		Tooltip,
		UserInfo
	} from '@lumi-ui/svelte';
	import type { Snippet } from 'svelte';

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

	// Card to navigate with PageSidebar.
	let filtersOpen = $state(false);

	// Context menu demo state.
	let contextMenu = $state<Context>();
	let contextTarget = $state<string>('');

	function openWorkspaceContext(event: MouseEvent, name: string): void {
		contextTarget = name;
		contextMenu?.open(event, name);
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

	const FILTER_SECTIONS = [
		'Estado',
		'Visibilidad',
		'Miembro responsable',
		'Estrategia de archivo',
		'Etiquetas recientes',
		'Creado dentro de'
	] as const;
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
		<Card title="PageSidebar" subtitle="Superficie lateral con drawer móvil reutilizable" spaced>
			<PageHeader title="Workspaces" subtitle="Demostración del contrato de filtros laterales">
				{#snippet actions()}
					<Button
						variant="border"
						class="lumi-page-sidebar__mobile-trigger"
						onclick={() => (filtersOpen = true)}
					>
						Filtros
					</Button>
				{/snippet}
			</PageHeader>

			<div class="lumi-layout--two-columns lumi-page-sidebar-layout">
				<PageSidebar bind:mobileOpen={filtersOpen} mobileTitle="Filtros">
					{#snippet sidebar()}
						<div class="lumi-page-sidebar__section">
							{#each FILTER_SECTIONS as section (section)}
								<div class="lumi-stack lumi-stack--xs">
									<span class="lumi-page-sidebar__label">{section}</span>
									<p class="lumi-text--sm lumi-text--muted">Sin límites aplicados.</p>
								</div>
							{/each}
						</div>
					{/snippet}
				</PageSidebar>

				<section class="lumi-layout--content-right">
					<Title
						title="Resultados"
						subtitle="El contenido principal convive con la superficie lateral."
						icon="list"
						size="md"
					/>
				</section>
			</div>
		</Card>
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
							icon="folders"
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
