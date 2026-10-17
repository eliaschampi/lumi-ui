/**
 * Built-in copy for Lumi components. Keys are grouped by owner; shared verbs
 * come first. Messages that interpolate values are functions.
 */
export interface LumiMessages {
	// Shared
	close: string;
	cancel: string;
	apply: string;
	clear: string;
	search: string;
	loading: string;
	noData: string;
	noResults: string;
	/** Fallback accessible name for option groups (SegmentedControl, ToggleGroup) */
	options: string;

	// Feedback and surfaces
	alertDismiss: string;
	notificationDismiss: string;
	/** Accessible name of the toast region */
	notifications: string;
	chipRemove: string;
	dialog: string;
	dialogClose: string;
	emptyTitle: string;
	imageError: string;
	progress: string;

	// ErrorState (titles exclude the status code)
	errorBadRequestKicker: string;
	errorBadRequestTitle: string;
	errorBadRequestDescription: string;
	errorNotFoundKicker: string;
	errorNotFoundTitle: string;
	errorNotFoundDescription: string;
	errorServerKicker: string;
	errorServerTitle: string;
	errorServerDescription: string;
	errorBack: string;
	errorHome: string;
	errorRetry: string;

	// Identity
	avatar: string;
	/** Accessible summary of an avatar group */
	avatarGroup: (count: number) => string;
	/** Accessible name of the "+N" overflow badge */
	unnamed: string;

	// Forms
	numberDecrease: string;
	numberIncrease: string;
	selectPlaceholder: string;
	selectEmpty: string;
	selectLoading: string;
	selectClear: string;
	selectOpen: string;
	selectClose: string;
	slider: string;
	dateFrom: string;
	dateTo: string;
	fileUploadTitle: string;
	fileUploadHint: string;
	fileUploadAddMore: string;
	fileUploadList: string;
	fileUploadRemove: (name: string) => string;
	fileUploadMaxSize: (size: string) => string;
	/** FileUpload rejection for a file outside `accept` */
	fileUploadType: (name: string) => string;
	/** RemoteSelect hint before the minimum query length is reached */
	selectMinQuery: (count: number) => string;
	/** RemoteSelect fallback when a search request fails */
	selectSearchError: string;

	// Data
	tableSelectAll: string;
	tableSelectRow: (row: number) => string;
	pagination: string;
	paginationPrevious: string;
	paginationNext: string;
	paginationPage: (page: number) => string;
	/** "Showing 1–10 of 42" */
	paginationRange: (from: number, to: number, total: number) => string;
	/** "Page 2 of 5" — compact pagination status */
	paginationStatus: (page: number, pages: number) => string;
	chart: string;
	chartBar: string;
	chartDonut: string;
	chartSeries: string;
	chartEmpty: string;

	// Navigation and overlays
	tabs: string;
	contextMenu: string;
	sidebar: string;
	sidebarToggle: string;
	pageActions: string;
	pageSidebarTitle: string;
	pageSidebarClose: string;

	// Conversation
	messages: string;
	messagesLatest: string;
	messagesLoadingEarlier: string;
}

/** Copy for the Drive workspace (`@lumi-ui/svelte/drive`). */
export interface LumiDriveMessages {
	driveFolder: string;
	driveImage: string;
	driveVideo: string;
	driveAudio: string;
	driveDocument: string;
	driveArchive: string;
	driveFile: string;
	driveNameRequired: string;
	driveNameTooLong: (max: number) => string;
	driveNameInvalid: string;
	driveNameInvalidChars: string;
	driveTagFavorite: string;
	driveTagHighlight: string;
	driveTagWork: string;
	driveTagPersonal: string;
	driveRecent: string;
	driveRecentHint: string;
	driveHeavy: string;
	driveHeavyHint: string;
	driveTrash: string;
	driveTrashHint: string;
	driveTitle: string;
	driveNavigation: string;
	driveStorage: string;
	driveStorageUsage: (used: string, total: string) => string;
	driveMyDrive: string;
	driveMyDriveHint: string;
	driveScope: string;
	driveScopeLabel: string;
	driveScopeShared: string;
	driveScopeSharedHint: string;
	driveScopePrivate: string;
	driveScopePrivateHint: string;
	driveColumnName: string;
	driveColumnType: string;
	driveColumnSize: string;
	driveColumnModified: string;
	drivePreview: string;
	driveNoSelection: string;
	drivePreviewUnavailable: string;
	driveDownload: string;
	driveUploadTitle: string;
	/** Upload button label; `count` is the number of queued files */
	driveUpload: (count: number) => string;
	driveUploadHint: (maxSize: string, optimizeAbove: string) => string;
	driveUploadEmptyFile: (name: string) => string;
	driveUploadTooLarge: (name: string, maxSize: string) => string;
	driveUploadUnavailable: string;
	driveUploadFailed: string;
}

/** App-level locale configuration passed to `setLumiLocale`. */
export interface LumiLocaleOptions {
	/** BCP 47 tag for number and date formatting. @default 'en-US' */
	locale?: string;
	/** ISO 4217 code for currency formatting. @default 'USD' */
	currency?: string;
	/**
	 * IANA time zone for date-times. Set it when pages render on the server:
	 * unset, the server and the browser format in their own zones, so the
	 * hydrated text can differ (and dates near midnight shift a day).
	 */
	timeZone?: string;
	/** Copy overrides; missing keys fall back to English */
	messages?: Partial<LumiMessages & LumiDriveMessages>;
}

/** Formatting settings shared by locale-aware helpers. */
export interface LumiFormatLocale {
	locale: string;
	currency: string;
	timeZone?: string;
}

/** What `useLumiLocale` returns; read fields during render to stay reactive. */
export interface LumiLocale<
	T extends object = LumiMessages
> extends LumiFormatLocale {
	readonly t: T;
}
