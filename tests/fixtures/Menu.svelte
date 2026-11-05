<script lang="ts">
	import { Button, Dropdown, DropdownItem } from '../../src/lib';

	let { open = $bindable(false) }: { open?: boolean } = $props();
</script>

<button id="outside">Outside</button>
<Dropdown bind:open>
	{#snippet trigger(props)}
		<Button {...props}>Menu</Button>
	{/snippet}
	<DropdownItem>One</DropdownItem>
	<DropdownItem disabled>Two</DropdownItem>
	<DropdownItem>Three</DropdownItem>
</Dropdown>
