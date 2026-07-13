<script lang="ts">
	import {
		Alert,
		Button,
		Card,
		Checkbox,
		Fieldset,
		Input,
		NumberInput,
		PageHeader,
		SegmentedControl,
		Select,
		Slider,
		Switch,
		Textarea
	} from '@lumi-ui/svelte';

	let name = $state('Lumi Workspace');
	let email = $state('hello@example.com');
	let seats = $state(12);
	let region = $state<string | number | Record<string, unknown> | null>('Lima');
	let plan = $state<string | number>('team');
	let notes = $state('Una interfaz tranquila, clara y consistente.');
	let notifications = $state(true);
	let analytics = $state(false);
	let capacity = $state(68);
	let submitted = $state(false);

	const planOptions = [
		{ value: 'starter', label: 'Starter', icon: 'sparkles' },
		{ value: 'team', label: 'Team', icon: 'users' },
		{ value: 'scale', label: 'Scale', icon: 'trendingUp' }
	];

	function submitForm(event: SubmitEvent): void {
		event.preventDefault();
		submitted = true;
	}
</script>

<div class="lumi-stack lumi-stack--xl lumi-min-width--0">
	<PageHeader
		title="Formularios"
		subtitle="Controles accesibles organizados con Grid y Stack"
		icon="clipboardPenLine"
		size="xl"
	/>

	{#if submitted}
		<Alert type="success" title="Preferencias guardadas" closable>
			La demostración actualizó su estado local correctamente.
		</Alert>
	{/if}

	<Card title="Configurar workspace" subtitle="Ejemplo completo sin estilos de aplicación" spaced>
		<form class="lumi-stack lumi-stack--lg" onsubmit={submitForm}>
			<Fieldset legend="Identidad">
				<div class="lumi-grid lumi-grid--columns-2 lumi-grid--gap-md">
					<Input bind:value={name} name="name" label="Nombre" icon="building" required />
					<Input bind:value={email} name="email" type="email" label="Correo" icon="mail" required />
					<NumberInput bind:value={seats} name="seats" label="Miembros" min={1} max={100} />
					<Select
						bind:value={region}
						name="region"
						label="Región"
						options={['Lima', 'Cusco', 'Arequipa', 'Trujillo']}
						autocomplete
					/>
				</div>
			</Fieldset>

			<Fieldset legend="Plan">
				<SegmentedControl
					bind:value={plan}
					options={planOptions}
					fullWidth
					aria-label="Plan del workspace"
				/>
			</Fieldset>

			<Fieldset legend="Preferencias">
				<div class="lumi-grid lumi-grid--columns-2 lumi-grid--gap-lg">
					<div class="lumi-stack lumi-stack--md">
						<Switch bind:checked={notifications} label="Notificaciones de actividad" />
						<Checkbox bind:checked={analytics} label="Compartir métricas anónimas" />
					</div>
					<Slider
						bind:value={capacity}
						label="Capacidad objetivo"
						min={0}
						max={100}
						showValue
						showTooltip
					/>
				</div>
			</Fieldset>

			<Textarea bind:value={notes} name="notes" label="Notas" rows={4} maxlength={240} showCount />

			<div class="lumi-flex lumi-flex--wrap lumi-justify--end lumi-flex--gap-sm">
				<Button type="flat" onclick={() => (submitted = false)}>Cancelar</Button>
				<Button type="filled" icon="check" button="submit" disabled={!name.trim() || !email.trim()}>
					Guardar cambios
				</Button>
			</div>
		</form>
	</Card>
</div>
