<script lang="ts">
	import {
		Alert,
		Button,
		Card,
		Chip,
		Fieldset,
		InfoItem,
		PageHeader,
		Radio,
		SegmentedControl,
		Switch,
		type SegmentedControlOption
	} from '@lumi-ui/svelte';
	import { colorScheme } from '$lib/color-scheme.svelte';

	let compactMode = $state(false);
	let reducedMotion = $state(false);
	let navigationMode = $state('expanded');

	const themeOptions: SegmentedControlOption[] = [
		{ value: 'system', label: 'Sistema', icon: 'monitor' },
		{ value: 'light', label: 'Claro', icon: 'sun' },
		{ value: 'dark', label: 'Oscuro', icon: 'moon' }
	];

	function setColorScheme(value: string | number): void {
		if (value === 'system' || value === 'light' || value === 'dark') {
			colorScheme.setPreference(value);
		}
	}

	function resetPreferences(): void {
		compactMode = false;
		reducedMotion = false;
		navigationMode = 'expanded';
		colorScheme.setPreference('system');
	}
</script>

<div class="lumi-stack lumi-stack--xl lumi-min-width--0">
	<PageHeader
		title="Ajustes"
		subtitle="Brand CSS-only y preferencia de color scheme opcional"
		icon="settings"
		size="xl"
	>
		{#snippet actions()}
			<Button variant="border" icon="refresh" onclick={resetPreferences}>Restablecer</Button>
		{/snippet}
	</PageHeader>

	<Alert color="info" title="Separación de responsabilidades">
		La identidad primary/secondary pertenece al desarrollador. El usuario final solo elige sistema,
		claro u oscuro.
	</Alert>

	<div class="lumi-grid lumi-grid--columns-2 lumi-grid--gap-lg">
		<Card
			title="Apariencia"
			subtitle="Preferencia persistente y sincronizada con el sistema"
			spaced
		>
			<div class="lumi-stack lumi-stack--lg">
				<Fieldset legend="Color scheme">
					<SegmentedControl
						value={colorScheme.preference}
						options={themeOptions}
						fullWidth
						aria-label="Color scheme"
						onchange={setColorScheme}
					/>
				</Fieldset>

				<div class="lumi-grid lumi-grid--columns-2 lumi-grid--gap-sm">
					<InfoItem label="Preferencia" value={colorScheme.preference} icon="settings" />
					<InfoItem label="Tema resuelto" value={colorScheme.resolved} icon="sparkles" />
				</div>

				<div class="lumi-flex lumi-flex--wrap lumi-flex--gap-sm">
					<Chip color="primary">Primary</Chip>
					<Chip color="secondary">Secondary</Chip>
					<Chip color="success">Success</Chip>
					<Chip color="warning">Warning</Chip>
					<Chip color="danger">Danger</Chip>
					<Chip color="info">Info</Chip>
				</div>
			</div>
		</Card>

		<Card title="Interfaz" subtitle="Preferencias locales de la demostración" spaced>
			<div class="lumi-stack lumi-stack--lg">
				<Fieldset legend="Densidad y movimiento">
					<div class="lumi-stack lumi-stack--md">
						<Switch bind:checked={compactMode} label="Modo compacto" />
						<Switch bind:checked={reducedMotion} label="Reducir movimiento" color="secondary" />
					</div>
				</Fieldset>

				<Fieldset legend="Navegación inicial">
					<div class="lumi-stack lumi-stack--sm">
						<Radio
							bind:group={navigationMode}
							value="expanded"
							label="Expandida"
							description="Muestra texto e iconos."
						/>
						<Radio
							bind:group={navigationMode}
							value="collapsed"
							label="Compacta"
							description="Prioriza el contenido principal."
						/>
					</div>
				</Fieldset>
			</div>
		</Card>
	</div>
</div>
