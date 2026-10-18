<script lang="ts">
	import { Dialog, Toaster } from '../../src/lib';
	import type { ToasterController } from '../../src/lib';

	const {
		toaster,
		dialog = true
	}: { toaster: ToasterController; dialog?: boolean } = $props();
</script>

{#if dialog}
	<Dialog open title="Edit">Body</Dialog>
{/if}
<Toaster {toaster} />
