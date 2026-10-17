export {
	ALLOWED_MIME_TYPES,
	DRIVE_IMAGE_COMPRESSION_THRESHOLD_BYTES,
	DRIVE_PROJECT_STORAGE_LIMIT_BYTES,
	MAX_DRIVE_NAME_LENGTH,
	MAX_FILE_SIZE,
	detectFileType,
	driveTagColorCssVar,
	formatDriveDate,
	formatDriveDateTime,
	formatFileSize,
	getDriveMenuOptions,
	getDriveScopeOptions,
	getDriveScopeSegmentOptions,
	getDriveServeUrl,
	getDriveTagByHash,
	getDriveTagOptions,
	getDriveTypeLabel,
	getFileColor,
	getFileIcon,
	getSafeDriveExtension,
	isAllowedMimeType,
	isValidDriveImageVariant,
	isValidDriveScope,
	isValidTagHash,
	normalizeDriveFileSize,
	normalizeDriveName,
	validateDriveName
} from './utils/drive';

export type {
	DriveBreadcrumb,
	DriveDateFormatter,
	DriveFileType,
	DriveImageVariant,
	DriveMenuOption,
	DriveScope,
	DriveScopeOption,
	DriveServeUrlOptions,
	DriveServeUrlResolver,
	DriveTagOption,
	DriveTagTone
} from './utils/drive';

export { lumiDriveEn, lumiDriveEs } from './i18n';
export type { LumiDriveMessages } from './i18n';
export type { DriveFileItem } from './components/Drive';
