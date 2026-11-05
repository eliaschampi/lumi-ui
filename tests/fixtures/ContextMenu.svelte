<script lang="ts">
	import { Context, ContextItem } from '../../src/lib';

	let context: Context | undefined = $state();

	export function open(event: MouseEvent): void {
		context?.open(event);
	}
</script>

<div id="page" style="overflow: auto">page</div>
<Context bind:this={context}>
	<ContextItem title="Copy" />
	<ContextItem title="Paste" />
</Context>
