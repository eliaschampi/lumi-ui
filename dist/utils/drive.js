/** Maximum upload file size: 50MB */
export const MAX_FILE_SIZE = 50 * 1024 * 1024;
/** Project-wide drive storage quota shared by all Drive scopes: 2GB */
export const DRIVE_PROJECT_STORAGE_LIMIT_BYTES = 2 * 1024 * 1024 * 1024;
/** Max file/folder name length */
export const MAX_DRIVE_NAME_LENGTH = 160;
/** Allowed MIME types for upload */
export const ALLOWED_MIME_TYPES = {
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
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'doc',
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
const DRIVE_SCOPE_SET = new Set([
    'shared',
    'user_private'
]);
const DRIVE_IMAGE_VARIANT_SET = new Set([
    'thumb',
    'preview',
    'original'
]);
const DRIVE_FILE_ICONS = {
    dir: 'folder',
    img: 'image',
    vid: 'video',
    aud: 'music',
    doc: 'fileText',
    zip: 'file',
    otr: 'file'
};
const DRIVE_FILE_COLORS = {
    dir: 'primary',
    img: 'success',
    vid: 'danger',
    aud: 'warning',
    doc: 'info',
    zip: 'secondary',
    otr: 'muted'
};
/**
 * Images above this threshold are optimized during upload.
 */
export const DRIVE_IMAGE_COMPRESSION_THRESHOLD_BYTES = 1 * 1024 * 1024;
/**
 * Detect DriveFileType from MIME type
 */
export function detectFileType(mimeType) {
    return ALLOWED_MIME_TYPES[mimeType] || 'otr';
}
/**
 * Check if MIME type is allowed for upload
 */
export function isAllowedMimeType(mimeType) {
    return mimeType in ALLOWED_MIME_TYPES;
}
/**
 * Normalize file/folder names
 */
export function normalizeDriveName(value) {
    return value.replace(/\s+/g, ' ').trim();
}
/**
 * Build a safe extension for storage paths based on the original filename.
 */
export function getSafeDriveExtension(originalName) {
    const cleaned = originalName
        .slice(originalName.lastIndexOf('.'))
        .toLowerCase()
        .replace(/[^a-z0-9.]/g, '');
    if (!cleaned || cleaned === '.') {
        return '.bin';
    }
    return cleaned.slice(0, 10);
}
/**
 * Validate file/folder names. Returns null if valid.
 */
export function validateDriveName(value) {
    const normalized = normalizeDriveName(value);
    if (!normalized) {
        return 'El nombre es obligatorio';
    }
    if (normalized.length > MAX_DRIVE_NAME_LENGTH) {
        return `El nombre no puede superar ${MAX_DRIVE_NAME_LENGTH} caracteres`;
    }
    if (normalized === '.' || normalized === '..') {
        return 'Nombre de archivo inválido';
    }
    if (hasInvalidDriveNameChars(normalized)) {
        return 'El nombre contiene caracteres inválidos';
    }
    return null;
}
/**
 * Validate drive tag hash
 */
export function isValidTagHash(value) {
    return TAG_HASH_REGEX.test(value);
}
/**
 * Validate drive scope value
 */
export function isValidDriveScope(value) {
    return DRIVE_SCOPE_SET.has(value);
}
/**
 * Validate drive image variant value
 */
export function isValidDriveImageVariant(value) {
    return DRIVE_IMAGE_VARIANT_SET.has(value);
}
function hasInvalidDriveNameChars(value) {
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
 * Get the Lucide icon name for a file type
 */
export function getFileIcon(type) {
    return DRIVE_FILE_ICONS[type];
}
/**
 * Get semantic Lumi color for a file type
 */
export function getFileColor(type) {
    return DRIVE_FILE_COLORS[type];
}
const DRIVE_TYPE_LABELS = {
    dir: 'Carpeta',
    img: 'Imagen',
    vid: 'Video',
    aud: 'Audio',
    doc: 'Documento',
    zip: 'Comprimido',
    otr: 'Archivo'
};
/**
 * Get display label for a drive file type.
 */
export function getDriveTypeLabel(type) {
    return DRIVE_TYPE_LABELS[type] ?? 'Archivo';
}
/**
 * Normalize potentially mixed numeric size values coming from API payloads.
 */
export function normalizeDriveFileSize(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}
/**
 * Format bytes into human-readable size
 */
export function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / k ** i).toFixed(1));
    return `${size} ${units[i]}`;
}
/**
 * Build a Drive serve URL with consistent query params.
 */
export function getDriveServeUrl(fileCode, options = {}) {
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
const DRIVE_DATE_FORMATTER = new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
});
const DRIVE_DATE_TIME_FORMATTER = new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
});
function toDriveDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}
export function formatDriveDate(value) {
    const date = toDriveDate(value);
    return date ? DRIVE_DATE_FORMATTER.format(date) : '—';
}
export function formatDriveDateTime(value) {
    const date = toDriveDate(value);
    return date ? DRIVE_DATE_TIME_FORMATTER.format(date) : '—';
}
/**
 * Tag options for Drive
 * `hash` is what gets stored in DB, `color` comes from Lumi tokens.
 */
export const TAG_OPTIONS = [
    { tone: 'favorite', color: 'secondary', hash: 'fb7185', name: 'Favoritos' },
    { tone: 'highlight', color: 'success', hash: '47b57c', name: 'Destacados' },
    { tone: 'work', color: 'warning', hash: 'faa75f', name: 'Trabajo' },
    { tone: 'personal', color: 'info', hash: '42a5f5', name: 'Personal' }
];
export function getDriveTagByHash(hash) {
    if (!hash) {
        return null;
    }
    const normalizedHash = hash.toLowerCase();
    return TAG_OPTIONS.find((tag) => tag.hash === normalizedHash) ?? null;
}
/** CSS `var(--lumi-color-*)` for tag dots (semantic `color` is not a paint value). */
export function driveTagColorCssVar(color) {
    return `var(--lumi-color-${color})`;
}
/**
 * Sidebar menu options for Drive navigation
 */
export const DRIVE_MENU_OPTIONS = {
    main: [
        { name: 'Recientes', value: 'recent', icon: 'clock' },
        { name: 'Archivos pesados', value: 'heavy', icon: 'hardDrive' }
    ],
    trash: [{ name: 'Papelera', value: 'trash', icon: 'trash' }]
};
/**
 * Drive scope options for UI selectors
 */
export const DRIVE_SCOPE_OPTIONS = [
    {
        value: 'shared',
        name: 'Institucional',
        description: 'Visible para usuarios autorizados del sistema',
        icon: 'building',
        color: 'info'
    },
    {
        value: 'user_private',
        name: 'Personal',
        description: 'Visible solo para ti',
        icon: 'user',
        color: 'secondary'
    }
];
export const DRIVE_SCOPE_SEGMENT_OPTIONS = DRIVE_SCOPE_OPTIONS.map((scopeOption) => ({
    value: scopeOption.value,
    label: scopeOption.name,
    icon: scopeOption.value === 'shared' ? 'building2' : 'user'
}));
