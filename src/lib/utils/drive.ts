import Building from '@lucide/svelte/icons/building';
import Building2 from '@lucide/svelte/icons/building-2';
import Clock from '@lucide/svelte/icons/clock';
import FileIcon from '@lucide/svelte/icons/file';
import FileText from '@lucide/svelte/icons/file-text';
import Folder from '@lucide/svelte/icons/folder';
import HardDrive from '@lucide/svelte/icons/hard-drive';
import Image from '@lucide/svelte/icons/image';
import Music from '@lucide/svelte/icons/music';
import Trash2 from '@lucide/svelte/icons/trash-2';
import User from '@lucide/svelte/icons/user';
import Video from '@lucide/svelte/icons/video';
import type { LumiColor } from '../components/config';
import { lumiDriveEn } from '../i18n/drive';
import type { LumiDriveMessages, LumiFormatLocale } from '../i18n/types';
import { dateFormat, DEFAULT_LOCALE } from './format';
import type { IconComponent, IconSource } from './icons';

export { formatFileSize } from './file';

/** Supported drive file types */
export type DriveFileType =
	'dir' | 'img' | 'vid' | 'aud' | 'doc' | 'zip' | 'otr';

/** Supported drive visibility scopes */
export type DriveScope = 'shared' | 'user_private';

/** Supported image serve variants */
export type DriveImageVariant = 'thumb' | 'preview' | 'original';

export interface DriveScopeOption {
	value: DriveScope;
	name: string;
	description: string;
	icon: IconComponent;
	color: LumiColor;
}

export type DriveTagTone = 'favorite' | 'highlight' | 'work' | 'personal';

export interface DriveTagOption {
	tone: DriveTagTone;
	color: 'secondary' | 'success' | 'warning' | 'info';
	hash: string;
	name: string;
}

export interface DriveMenuOption {
	name: string;
	description?: string;
	value: string;
	icon: IconSource;
}

/** Maximum upload file size: 50MB */
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

/** Project-wide drive storage quota shared by all Drive scopes: 2GB */
export const DRIVE_PROJECT_STORAGE_LIMIT_BYTES = 2 * 1024 * 1024 * 1024;

/** Max file/folder name length */
export const MAX_DRIVE_NAME_LENGTH = 160;

/** Allowed MIME types for upload */
export const ALLOWED_MIME_TYPES: Record<string, DriveFileType> = {
	// Images
	'image/jpeg': 'img',
	'image/png': 'img',
	'image/gif': 'img',
	'image/webp': 'img',
	'image/svg+xml': 'img',
	'image/avif': 'img',
	// Video
	'video/mp4': 'vid',
	'video/webm': 'vid',
	'video/quicktime': 'vid',
	// Audio
	'audio/mpeg': 'aud',
	'audio/wav': 'aud',
	'audio/ogg': 'aud',
	'audio/webm': 'aud',
	// Documents
	'application/pdf': 'doc',
	'application/msword': 'doc',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
		'doc',
	'text/plain': 'doc',
	// Archives
	'application/zip': 'zip',
	'application/x-rar-compressed': 'zip',
	'application/x-7z-compressed': 'zip'
};

const FORBIDDEN_NAME_CHARS = new Set([
	'<',
	'>',
	':',
	'"',
	'/',
	'\\',
	'|',
	'?',
	'*'
]);

const TAG_HASH_REGEX = /^[a-f0-9]{6}$/i;
const DRIVE_SCOPE_SET: ReadonlySet<DriveScope> = new Set([
	'shared',
	'user_private'
]);
const DRIVE_IMAGE_VARIANT_SET: ReadonlySet<DriveImageVariant> = new Set([
	'thumb',
	'preview',
	'original'
]);
const DRIVE_FILE_ICONS: Record<DriveFileType, IconComponent> = {
	dir: Folder,
	img: Image,
	vid: Video,
	aud: Music,
	doc: FileText,
	zip: FileIcon,
	otr: FileIcon
};
const DRIVE_FILE_COLORS = {
	dir: 'primary',
	img: 'success',
	vid: 'danger',
	aud: 'warning',
	doc: 'info',
	zip: 'secondary',
	otr: 'muted'
} as const satisfies Record<DriveFileType, LumiColor | 'muted'>;

/**
 * Images above this threshold are optimized during upload.
 */
export const DRIVE_IMAGE_COMPRESSION_THRESHOLD_BYTES = 1 * 1024 * 1024;

/**
 * Detect DriveFileType from MIME type
 */
export function detectFileType(mimeType: string): DriveFileType {
	return isAllowedMimeType(mimeType) ? ALLOWED_MIME_TYPES[mimeType] : 'otr';
}

/**
 * Check if MIME type is allowed for upload
 */
export function isAllowedMimeType(mimeType: string): boolean {
	return Object.hasOwn(ALLOWED_MIME_TYPES, mimeType);
}

/**
 * Normalize file/folder names
 */
export function normalizeDriveName(value: string): string {
	return value.replace(/\s+/g, ' ').trim();
}

/**
 * Build a safe extension for storage paths based on the original filename.
 */
export function getSafeDriveExtension(originalName: string): string {
	const extensionIndex = originalName.lastIndexOf('.');
	const cleaned = originalName
		.slice(extensionIndex < 0 ? originalName.length : extensionIndex)
		.toLowerCase()
		.replace(/[^a-z0-9.]/g, '');

	if (!cleaned || cleaned === '.') {
		return '.bin';
	}

	return cleaned.slice(0, 10);
}

/**
 * Validate file/folder names. Returns null if valid, otherwise a message.
 */
export function validateDriveName(
	value: string,
	t: LumiDriveMessages = lumiDriveEn
): string | null {
	const normalized = normalizeDriveName(value);

	if (!normalized) return t.driveNameRequired;
	if (normalized.length > MAX_DRIVE_NAME_LENGTH) {
		return t.driveNameTooLong(MAX_DRIVE_NAME_LENGTH);
	}
	if (normalized === '.' || normalized === '..') return t.driveNameInvalid;
	if (hasInvalidDriveNameChars(normalized)) return t.driveNameInvalidChars;

	return null;
}

/**
 * Validate drive tag hash
 */
export function isValidTagHash(value: string): boolean {
	return TAG_HASH_REGEX.test(value);
}

/**
 * Validate drive scope value
 */
export function isValidDriveScope(value: string): value is DriveScope {
	return DRIVE_SCOPE_SET.has(value as DriveScope);
}

/**
 * Validate drive image variant value
 */
export function isValidDriveImageVariant(
	value: string
): value is DriveImageVariant {
	return DRIVE_IMAGE_VARIANT_SET.has(value as DriveImageVariant);
}

function hasInvalidDriveNameChars(value: string): boolean {
	for (const char of value) {
		if (FORBIDDEN_NAME_CHARS.has(char)) {
			return true;
		}

		if (char.charCodeAt(0) < 32) {
			return true;
		}
	}

	return false;
}

/**
 * Get the Lucide icon for a file type
 */
export function getFileIcon(type: DriveFileType): IconComponent {
	return DRIVE_FILE_ICONS[type];
}

/**
 * Get semantic Lumi color for a file type
 */
export function getFileColor(type: DriveFileType) {
	return DRIVE_FILE_COLORS[type];
}

const DRIVE_TYPE_LABEL_KEYS = {
	dir: 'driveFolder',
	img: 'driveImage',
	vid: 'driveVideo',
	aud: 'driveAudio',
	doc: 'driveDocument',
	zip: 'driveArchive',
	otr: 'driveFile'
} as const satisfies Record<DriveFileType, keyof LumiDriveMessages>;

/**
 * Get display label for a drive file type.
 */
export function getDriveTypeLabel(
	type: DriveFileType,
	t: LumiDriveMessages = lumiDriveEn
): string {
	return t[DRIVE_TYPE_LABEL_KEYS[type] ?? 'driveFile'];
}

/**
 * Normalize potentially mixed numeric size values coming from API payloads.
 */
export function normalizeDriveFileSize(
	value: number | string | null | undefined
): number {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : 0;
}

export type DriveDateFormatter = (value: string) => string;
export type DriveServeUrlResolver = (
	fileCode: string,
	options?: DriveServeUrlOptions
) => string;

export interface DriveServeUrlOptions {
	download?: boolean;
	variant?: DriveImageVariant;
	basePath?: string;
}

/**
 * Build a Drive serve URL with consistent query params.
 */
export function getDriveServeUrl(
	fileCode: string,
	options: DriveServeUrlOptions = {}
): string {
	const params = new URLSearchParams();

	if (options.download === true) {
		params.set('download', 'true');
	}

	if (options.variant && options.variant !== 'original') {
		params.set('variant', options.variant);
	}

	const query = params.toString();
	const basePath = options.basePath ?? '/api/drive';
	const path = `${basePath.replace(/\/$/, '')}/${fileCode}/serve`;

	return query ? `${path}?${query}` : path;
}

type DriveDateLocale = Pick<LumiFormatLocale, 'locale' | 'timeZone'>;

const DRIVE_DATE = { year: 'numeric', month: 'short', day: 'numeric' } as const;
const DRIVE_DATE_TIME = {
	...DRIVE_DATE,
	hour: '2-digit',
	minute: '2-digit'
} as const;

const DEFAULT_DATE_FORMAT: DriveDateLocale = { locale: DEFAULT_LOCALE };

function formatDriveInstant(
	value: string,
	{ locale, timeZone }: DriveDateLocale,
	options: Intl.DateTimeFormatOptions
): string {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '—';
	return dateFormat(locale, { ...options, timeZone }).format(date);
}

/** Short date ("Oct 16, 2026"); invalid input renders an em dash. */
export function formatDriveDate(
	value: string,
	format: DriveDateLocale = DEFAULT_DATE_FORMAT
): string {
	return formatDriveInstant(value, format, DRIVE_DATE);
}

/** Short date with time; invalid input renders an em dash. */
export function formatDriveDateTime(
	value: string,
	format: DriveDateLocale = DEFAULT_DATE_FORMAT
): string {
	return formatDriveInstant(value, format, DRIVE_DATE_TIME);
}

const DRIVE_TAGS = [
	{
		tone: 'favorite',
		color: 'secondary',
		hash: 'fb7185',
		key: 'driveTagFavorite'
	},
	{
		tone: 'highlight',
		color: 'success',
		hash: '47b57c',
		key: 'driveTagHighlight'
	},
	{ tone: 'work', color: 'warning', hash: 'faa75f', key: 'driveTagWork' },
	{ tone: 'personal', color: 'info', hash: '42a5f5', key: 'driveTagPersonal' }
] as const satisfies readonly (Omit<DriveTagOption, 'name'> & {
	key: DriveTagKey;
})[];

type DriveTagKey =
	| 'driveTagFavorite'
	| 'driveTagHighlight'
	| 'driveTagWork'
	| 'driveTagPersonal';

function toTag(
	{ key, ...tag }: (typeof DRIVE_TAGS)[number],
	t: LumiDriveMessages
): DriveTagOption {
	return { ...tag, name: t[key] };
}

/**
 * Tag options for Drive. `hash` is what gets stored in the database; `color`
 * comes from Lumi tokens.
 */
export function getDriveTagOptions(
	t: LumiDriveMessages = lumiDriveEn
): DriveTagOption[] {
	return DRIVE_TAGS.map((tag) => toTag(tag, t));
}

export function getDriveTagByHash(
	hash: string | null | undefined,
	t: LumiDriveMessages = lumiDriveEn
): DriveTagOption | null {
	if (!hash) return null;
	const normalizedHash = hash.toLowerCase();
	const tag = DRIVE_TAGS.find((option) => option.hash === normalizedHash);
	return tag ? toTag(tag, t) : null;
}

/** CSS `var(--lumi-color-*)` for tag dots (semantic `color` is not a paint value). */
export function driveTagColorCssVar(color: DriveTagOption['color']): string {
	return `var(--lumi-color-${color})`;
}

/**
 * Sidebar menu options for Drive navigation
 */
export function getDriveMenuOptions(t: LumiDriveMessages = lumiDriveEn): {
	main: DriveMenuOption[];
	trash: DriveMenuOption[];
} {
	return {
		main: [
			{
				name: t.driveRecent,
				description: t.driveRecentHint,
				value: 'recent',
				icon: Clock
			},
			{
				name: t.driveHeavy,
				description: t.driveHeavyHint,
				value: 'heavy',
				icon: HardDrive
			}
		],
		trash: [
			{
				name: t.driveTrash,
				description: t.driveTrashHint,
				value: 'trash',
				icon: Trash2
			}
		]
	};
}

/**
 * Drive scope options for UI selectors
 */
export function getDriveScopeOptions(
	t: LumiDriveMessages = lumiDriveEn
): DriveScopeOption[] {
	return [
		{
			value: 'shared',
			name: t.driveScopeShared,
			description: t.driveScopeSharedHint,
			icon: Building,
			color: 'info'
		},
		{
			value: 'user_private',
			name: t.driveScopePrivate,
			description: t.driveScopePrivateHint,
			icon: User,
			color: 'secondary'
		}
	];
}

/** Scope options shaped for `SegmentedControl`. */
export function getDriveScopeSegmentOptions(
	t: LumiDriveMessages = lumiDriveEn
): { value: DriveScope; label: string; icon: IconComponent }[] {
	return getDriveScopeOptions(t).map((scope) => ({
		value: scope.value,
		label: scope.name,
		icon: scope.value === 'shared' ? Building2 : scope.icon
	}));
}

/** Interface for breadcrumb items in Drive navigation */
export interface DriveBreadcrumb {
	label: string;
	code: string | null;
}
