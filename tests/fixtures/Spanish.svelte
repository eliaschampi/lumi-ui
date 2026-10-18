<script lang="ts">
	import { lumiEs, Pagination, setLumiLocale } from '../../src/lib';

	setLumiLocale({ locale: 'es-PE', currency: 'PEN', messages: lumiEs });
</script>

<Pagination page={2} pages={5} href={(page) => `?page=${page}`} />
