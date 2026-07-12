import type { LumiColor } from '../components/config';
import type { IconName } from './icons';
/** Supported drive file types */
export type DriveFileType = 'dir' | 'img' | 'vid' | 'aud' | 'doc' | 'zip' | 'otr';
/** Supported drive visibility scopes */
export type DriveScope = 'shared' | 'user_private';
/** Supported image serve variants */
export type DriveImageVariant = 'thumb' | 'preview' | 'original';
export interface DriveScopeOption {
    value: DriveScope;
    name: string;
    description: string;
    icon: string;
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
    value: string;
    icon: string;
}
/** Maximum upload file size: 50MB */
export declare const MAX_FILE_SIZE: number;
/** Project-wide drive storage quota shared by all Drive scopes: 2GB */
export declare const DRIVE_PROJECT_STORAGE_LIMIT_BYTES: number;
/** Max file/folder name length */
export declare const MAX_DRIVE_NAME_LENGTH = 160;
/** Allowed MIME types for upload */
export declare const ALLOWED_MIME_TYPES: Record<string, DriveFileType>;
/**
 * Images above this threshold are optimized during upload.
 */
export declare const DRIVE_IMAGE_COMPRESSION_THRESHOLD_BYTES: number;
/**
 * Detect DriveFileType from MIME type
 */
export declare function detectFileType(mimeType: string): DriveFileType;
/**
 * Check if MIME type is allowed for upload
 */
export declare function isAllowedMimeType(mimeType: string): boolean;
/**
 * Normalize file/folder names
 */
export declare function normalizeDriveName(value: string): string;
/**
 * Build a safe extension for storage paths based on the original filename.
 */
export declare function getSafeDriveExtension(originalName: string): string;
/**
 * Validate file/folder names. Returns null if valid.
 */
export declare function validateDriveName(value: string): string | null;
/**
 * Validate drive tag hash
 */
export declare function isValidTagHash(value: string): boolean;
/**
 * Validate drive scope value
 */
export declare function isValidDriveScope(value: string): value is DriveScope;
/**
 * Validate drive image variant value
 */
export declare function isValidDriveImageVariant(value: string): value is DriveImageVariant;
/**
 * Get the Lucide icon name for a file type
 */
export declare function getFileIcon(type: DriveFileType): IconName;
/**
 * Get semantic Lumi color for a file type
 */
export declare function getFileColor(type: DriveFileType): "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "muted";
/**
 * Get display label for a drive file type.
 */
export declare function getDriveTypeLabel(type: DriveFileType): string;
/**
 * Normalize potentially mixed numeric size values coming from API payloads.
 */
export declare function normalizeDriveFileSize(value: number | string | null | undefined): number;
/**
 * Format bytes into human-readable size
 */
export declare function formatFileSize(bytes: number): string;
export type DriveDateFormatter = (value: string) => string;
export type DriveServeUrlResolver = (fileCode: string, options?: DriveServeUrlOptions) => string;
export interface DriveServeUrlOptions {
    download?: boolean;
    variant?: DriveImageVariant;
    basePath?: string;
}
/**
 * Build a Drive serve URL with consistent query params.
 */
export declare function getDriveServeUrl(fileCode: string, options?: DriveServeUrlOptions): string;
export declare function formatDriveDate(value: string): string;
export declare function formatDriveDateTime(value: string): string;
/**
 * Tag options for Drive
 * `hash` is what gets stored in DB, `color` comes from Lumi tokens.
 */
export declare const TAG_OPTIONS: DriveTagOption[];
export declare function getDriveTagByHash(hash: string | null | undefined): DriveTagOption | null;
/** CSS `var(--lumi-color-*)` for tag dots (semantic `color` is not a paint value). */
export declare function driveTagColorCssVar(color: DriveTagOption['color']): string;
/**
 * Sidebar menu options for Drive navigation
 */
export declare const DRIVE_MENU_OPTIONS: {
    main: DriveMenuOption[];
    trash: DriveMenuOption[];
};
/**
 * Drive scope options for UI selectors
 */
export declare const DRIVE_SCOPE_OPTIONS: DriveScopeOption[];
export declare const DRIVE_SCOPE_SEGMENT_OPTIONS: {
    value: DriveScope;
    label: string;
    icon: string;
}[];
/** Interface for breadcrumb items in Drive navigation */
export interface DriveBreadcrumb {
    label: string;
    code: string | null;
}
//# sourceMappingURL=drive.d.ts.map