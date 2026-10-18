<script lang="ts">
	import { Select } from '../../src/lib';

	let { value = $bindable('') }: { value?: string } = $props();
</script>

<form>
	<Select
		bind:value
		name="fruit"
		label="Fruit"
		required
		options={[
			{ value: 'a', label: 'Apple' },
			{ value: 'b', label: 'Banana' }
		]}
	/>
</form>
