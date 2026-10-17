<script module lang="ts">
	import * as en from '../../i18n/en';
	import { lumiDriveEn } from '../../i18n/drive';

	const COPY = { ...lumiDriveEn, close: en.close };
</script>

<script lang="ts">
	import HardDrive from '@lucide/svelte/icons/hard-drive';
	import { CloseButton } from '../CloseButton';
	import { List, ListItem } from '../List';
	import { Progress } from '../Progress';
	import { SegmentedControl } from '../SegmentedControl';
	import { useLumiLocale } from '../../i18n';
	import {
		formatFileSize,
		getDriveMenuOptions,
		getDriveScopeSegmentOptions,
		isValidDriveScope,
		type DriveMenuOption,
		type DriveScope
	} from '../../utils/drive';

	interface StorageInfo {
		used: number;
		total: number;
		percentage: number;
	}

	interface Props {
		currentScope?: DriveScope;
		selectedMenu: DriveMenuOption | null;
		storageInfo: StorageInfo;
		closable?: boolean;
		showScopeControl?: boolean;
		onscopechange?: (scope: DriveScope) => void;
		onmenuselect?: (menu: DriveMenuOption | null) => void;
		onclose?: () => void;
	}

	const {
		currentScope,
		selectedMenu,
		storageInfo,
		closable = false,
		showScopeControl = currentScope !== undefined,
		onscopechange,
		onmenuselect,
		onclose
	}: Props = $props();

	const i18n = useLumiLocale(COPY);
	const menuOptions = $derived(getDriveMenuOptions(i18n.t));
	const scopeOptions = $derived(getDriveScopeSegmentOptions(i18n.t));
	const effectiveScope = $derived(currentScope ?? 'shared');
	const isMyDriveActive = $derived(!selectedMenu);
	const storageColor = $derived(
		storageInfo.percentage >= 95
			? 'danger'
			: storageInfo.percentage >= 80
				? 'warning'
				: 'primary'
	);
</script>

{#if closable}
	<div class="lumi-drive-sidebar__header">
		<span class="lumi-drive-sidebar__title">{i18n.t.driveTitle}</span>
		<CloseButton label={i18n.t.close} onclick={onclose} />
	</div>
{/if}

{#if showScopeControl}
	<div class="lumi-page-sidebar__section">
		<p class="lumi-page-sidebar__label">{i18n.t.driveScope}</p>
		<div class="lumi-drive-sidebar__scope">
			<SegmentedControl
				value={effectiveScope}
				options={scopeOptions}
				color="info"
				fullWidth
				aria-label={i18n.t.driveScopeLabel}
				onchange={(value) => {
					if (typeof value === 'string' && isValidDriveScope(value)) {
						onscopechange?.(value);
					}
				}}
			/>
		</div>
	</div>
{/if}

<div class="lumi-page-sidebar__section">
	<p class="lumi-page-sidebar__label">{i18n.t.driveNavigation}</p>
	<List size="sm" color="primary" class="lumi-drive-sidebar__nav">
		<ListItem
			title={i18n.t.driveMyDrive}
			description={i18n.t.driveMyDriveHint}
			icon={HardDrive}
			selected={isMyDriveActive}
			onclick={() => onmenuselect?.(null)}
		/>
		{#each menuOptions.main as menu (menu.value)}
			<ListItem
				title={menu.name}
				description={menu.description}
				icon={menu.icon}
				selected={selectedMenu?.value === menu.value}
				onclick={() => onmenuselect?.(menu)}
			/>
		{/each}
		{#each menuOptions.trash as menu (menu.value)}
			<ListItem
				title={menu.name}
				description={menu.description}
				icon={menu.icon}
				selected={selectedMenu?.value === menu.value}
				onclick={() => onmenuselect?.(menu)}
			/>
		{/each}
	</List>
</div>

<div class="lumi-page-sidebar__section">
	<p class="lumi-page-sidebar__label">{i18n.t.driveStorage}</p>
	<Progress value={storageInfo.percentage} color={storageColor} />
	<div class="lumi-drive-sidebar__storage-meta">
		<span class="lumi-drive-sidebar__meta">
			{i18n.t.driveStorageUsage(
				formatFileSize(storageInfo.used),
				formatFileSize(storageInfo.total)
			)}
		</span>
		<span class="lumi-drive-sidebar__meta">{storageInfo.percentage}%</span>
	</div>
</div>

<style>
	.lumi-drive-sidebar__title {
		font-size: var(--lumi-font-size-sm);
		font-weight: var(--lumi-font-weight-bold);
	}

	.lumi-drive-sidebar__meta {
		color: var(--lumi-color-text-muted);
		font-size: var(--lumi-font-size-xs);
	}

	:global(.lumi-drive-sidebar__nav) {
		max-height: var(--lumi-drive-sidebar-nav-max-height);
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.lumi-drive-sidebar__scope {
		width: 100%;
	}

	.lumi-drive-sidebar__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.lumi-drive-sidebar__storage-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
