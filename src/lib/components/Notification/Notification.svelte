<script module lang="ts">
	import * as en from '../../i18n/en';

	const COPY = { notificationDismiss: en.notificationDismiss };
</script>

<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { DURATION_BASE, motion } from '../config';
	import { useLumiLocale } from '../../i18n';
	import StatusSurface from './StatusSurface.svelte';
	import { statusRole } from './status';
	import type { NotificationProps } from './types';

	let {
		color = 'primary',
		title = '',
		message = '',
		closable = true,
		duration = 0,
		active = $bindable(true),
		class: className,
		onclose
	}: NotificationProps = $props();

	const i18n = useLumiLocale(COPY);
</script>

{#if active}
	<StatusSurface
		floating
		{color}
		{title}
		{message}
		{duration}
		class={className ? `lumi-notification ${className}` : 'lumi-notification'}
		role={statusRole(color)}
		closeLabel={closable ? i18n.t.notificationDismiss : undefined}
		motion={fly}
		params={{ y: 12, duration: motion(DURATION_BASE), easing: cubicOut }}
		onclose={() => (active = false)}
		onexpire={() => (active = false)}
		onoutroend={onclose}
	/>
{/if}
