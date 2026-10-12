<script lang="ts">
	import { Alert } from '../Alert';
	import { Button } from '../Button';
	import { Dialog } from '../Dialog';
	import { FileUpload } from '../FileUpload';
	import type { FileUploadFile } from '../FileUpload';
	import {
		DRIVE_IMAGE_COMPRESSION_THRESHOLD_BYTES,
		formatFileSize,
		MAX_FILE_SIZE
	} from '../../utils/drive';

	interface Props {
		open: boolean;
		onupload?: (file: File, customName?: string) => Promise<void>;
		oncomplete?: (summary: {
			uploaded: number;
			failed: number;
		}) => Promise<void> | void;
		onclose?: () => void;
	}

	let {
		open = $bindable(false),
		onupload,
		oncomplete,
		onclose
	}: Props = $props();

	let queue = $state<FileUploadFile[]>([]);
	let uploading = $state(false);
	let errorMessage = $state('');

	const pendingUploadsCount = $derived(
		queue.filter(
			(item) => item.status === 'selected' || item.status === 'error'
		).length
	);

	const uploaderHintText = $derived(
		`Máximo ${formatFileSize(MAX_FILE_SIZE)} por archivo - Las imágenes mayores a ${formatFileSize(
			DRIVE_IMAGE_COMPRESSION_THRESHOLD_BYTES
		)} se optimizan automáticamente`
	);

	function validateDriveFile(file: File): string | null {
		if (file.size === 0) {
			return `"${file.name}" está vacío`;
		}

		return null;
	}

	function resetDialogState(): void {
		queue = [];
		errorMessage = '';
	}

	$effect(() => {
		if (!open && !uploading && (queue.length > 0 || errorMessage)) {
			resetDialogState();
		}
	});

	function closeDialog(): void {
		if (uploading) {
			return;
		}

		resetDialogState();
		open = false;
		onclose?.();
	}

	async function uploadQueuedFiles(): Promise<void> {
		if (pendingUploadsCount === 0 || uploading) {
			return;
		}

		if (!onupload) {
			errorMessage = 'No se configuró el servicio de subida de archivos';
			return;
		}

		uploading = true;
		errorMessage = '';
		let uploadedCount = 0;
		let failedCount = 0;

		for (const item of queue) {
			if (item.status !== 'selected' && item.status !== 'error') {
				continue;
			}

			item.status = 'uploading';
			item.progress = 30;
			item.error = undefined;

			try {
				await onupload(item.file);
				uploadedCount += 1;

				item.status = 'success';
				item.progress = 100;
			} catch (caught) {
				failedCount += 1;
				const message =
					caught instanceof Error ? caught.message : 'Error al subir archivos';

				if (!errorMessage) {
					errorMessage = message;
				}

				item.status = 'error';
				item.progress = 0;
				item.error = message;
			}
		}

		uploading = false;
		if (uploadedCount > 0) {
			await oncomplete?.({ uploaded: uploadedCount, failed: failedCount });
		}

		if (failedCount === 0) {
			resetDialogState();
			open = false;
			onclose?.();
		}
	}
</script>

<Dialog bind:open title="Subir archivos" size="md" persistent={uploading}>
	<div class="lumi-stack lumi-stack--md">
		{#if errorMessage}
			<Alert color="warning" closable onclose={() => (errorMessage = '')}
				>{errorMessage}</Alert
			>
		{/if}

		<div class="lumi-drive-uploader__file-upload">
			<FileUpload
				bind:files={queue}
				multiple
				maxSize={MAX_FILE_SIZE}
				disabled={uploading}
				placeholderText="Arrastra archivos aquí o haz clic para seleccionar"
				hintText={uploaderHintText}
				addMoreText="Agregar más archivos"
				validateFile={validateDriveFile}
				maxSizeErrorMessage={(file) =>
					`"${file.name}" excede el tamaño máximo de ${formatFileSize(MAX_FILE_SIZE)}`}
				oninvalid={(message) => {
					errorMessage = message;
				}}
			/>
		</div>
	</div>

	{#snippet footer()}
		<Button variant="border" onclick={closeDialog} disabled={uploading}
			>Cancelar</Button
		>
		<Button
			variant="filled"
			color="primary"
			icon="upload"
			loading={uploading}
			disabled={pendingUploadsCount === 0}
			onclick={() => void uploadQueuedFiles()}
		>
			Subir {pendingUploadsCount > 0 ? `(${pendingUploadsCount})` : ''}
		</Button>
	{/snippet}
</Dialog>

<style>
	.lumi-drive-uploader__file-upload :global(.lumi-file-upload__file-list) {
		max-height: var(--lumi-drive-uploader-queue-max-height);
		overflow-y: auto;
	}
</style>
