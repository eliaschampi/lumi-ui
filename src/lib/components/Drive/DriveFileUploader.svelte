<script module lang="ts">
	import * as en from '../../i18n/en';
	import { lumiDriveEn } from '../../i18n/drive';

	const COPY = {
		...lumiDriveEn,
		cancel: en.cancel,
		fileUploadHint: en.fileUploadHint,
		fileUploadAddMore: en.fileUploadAddMore
	};
</script>

<script lang="ts">
	import CloudUpload from '@lucide/svelte/icons/cloud-upload';
	import { Alert } from '../Alert';
	import { Button } from '../Button';
	import { Dialog } from '../Dialog';
	import { FileUpload } from '../FileUpload';
	import type { FileUploadFile } from '../FileUpload';
	import { useLumiLocale } from '../../i18n';
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

	const i18n = useLumiLocale(COPY);
	let queue = $state<FileUploadFile[]>([]);
	let uploading = $state(false);
	let errorMessage = $state('');

	const pendingUploadsCount = $derived(
		queue.filter(
			(item) => item.status === 'selected' || item.status === 'error'
		).length
	);

	const maxSize = formatFileSize(MAX_FILE_SIZE);

	function validateDriveFile(file: File): string | null {
		return file.size === 0 ? i18n.t.driveUploadEmptyFile(file.name) : null;
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
			errorMessage = i18n.t.driveUploadUnavailable;
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
					caught instanceof Error ? caught.message : i18n.t.driveUploadFailed;

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

<Dialog
	bind:open
	title={i18n.t.driveUploadTitle}
	size="md"
	persistent={uploading}
>
	<div class="lumi-drive-uploader">
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
				placeholderText={i18n.t.fileUploadHint}
				hintText={i18n.t.driveUploadHint(
					maxSize,
					formatFileSize(DRIVE_IMAGE_COMPRESSION_THRESHOLD_BYTES)
				)}
				addMoreText={i18n.t.fileUploadAddMore}
				validateFile={validateDriveFile}
				maxSizeErrorMessage={(file) =>
					i18n.t.driveUploadTooLarge(file.name, maxSize)}
				oninvalid={(message) => {
					errorMessage = message;
				}}
			/>
		</div>
	</div>

	{#snippet footer()}
		<Button variant="border" onclick={closeDialog} disabled={uploading}
			>{i18n.t.cancel}</Button
		>
		<Button
			variant="filled"
			color="primary"
			icon={CloudUpload}
			loading={uploading}
			disabled={pendingUploadsCount === 0}
			onclick={() => void uploadQueuedFiles()}
		>
			{i18n.t.driveUpload(pendingUploadsCount)}
		</Button>
	{/snippet}
</Dialog>

<style>
	.lumi-drive-uploader {
		display: flex;
		flex-direction: column;
		gap: var(--lumi-space-md);
	}

	.lumi-drive-uploader__file-upload :global(.lumi-file-upload__file-list) {
		max-height: var(--lumi-drive-uploader-queue-max-height);
		overflow-y: auto;
	}
</style>
