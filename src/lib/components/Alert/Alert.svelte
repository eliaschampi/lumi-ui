<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { alertDismiss: en.alertDismiss };
</script>

<script lang="ts">
	import { fade } from 'svelte/transition';
	import { DURATION_BASE, motion } from '../config';
	import StatusSurface from '../Notification/StatusSurface.svelte';
	import { statusRole } from '../Notification/status';
	import { useLumiLocale } from '../../i18n';
	import type { AlertProps } from './types';

	let {
		color = 'info',
		title,
		icon = true,
		closable = false,
		active = $bindable(true),
		class: className,
		children,
		onclose
	}: AlertProps = $props();

	const i18n = useLumiLocale(COPY);
</script>

{#if active}
	<StatusSurface
		{color}
		{title}
		{icon}
		{children}
		class={className ? `lumi-alert ${className}` : 'lumi-alert'}
		role={statusRole(color)}
		closeLabel={closable ? i18n.t.alertDismiss : undefined}
		motion={fade}
		params={{ duration: motion(DURATION_BASE) }}
		onclose={() => (active = false)}
		onoutroend={onclose}
	/>
{/if}
