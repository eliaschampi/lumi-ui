// Rule tables for migrate-1.0.mjs.

// Former string-registry names → Lucide component + deep import path.
export const ICONS = {
	house: { component: 'House', path: 'house' },
	menu: { component: 'Menu', path: 'menu' },
	chevronLeft: { component: 'ChevronLeft', path: 'chevron-left' },
	chevronRight: { component: 'ChevronRight', path: 'chevron-right' },
	chevronDown: { component: 'ChevronDown', path: 'chevron-down' },
	chevronUp: { component: 'ChevronUp', path: 'chevron-up' },
	arrowLeft: { component: 'ArrowLeft', path: 'arrow-left' },
	arrowLeftRight: { component: 'ArrowLeftRight', path: 'arrow-left-right' },
	arrowRight: { component: 'ArrowRight', path: 'arrow-right' },
	search: { component: 'Search', path: 'search' },
	plus: { component: 'Plus', path: 'plus' },
	minus: { component: 'Minus', path: 'minus' },
	x: { component: 'X', path: 'x' },
	check: { component: 'Check', path: 'check' },
	edit: { component: 'Pencil', path: 'pencil' },
	trash: { component: 'Trash2', path: 'trash-2' },
	copy: { component: 'Copy', path: 'copy' },
	cornerDownRight: { component: 'CornerDownRight', path: 'corner-down-right' },
	cornerUpRight: { component: 'CornerUpRight', path: 'corner-up-right' },
	clipboard: { component: 'Clipboard', path: 'clipboard' },
	clipboardCheck: { component: 'ClipboardCheck', path: 'clipboard-check' },
	clipboardPenLine: {
		component: 'ClipboardPenLine',
		path: 'clipboard-pen-line'
	},
	crop: { component: 'Crop', path: 'crop' },
	download: { component: 'Download', path: 'download' },
	upload: { component: 'CloudUpload', path: 'cloud-upload' },
	share: { component: 'Share2', path: 'share-2' },
	link: { component: 'Link', path: 'link' },
	refresh: { component: 'RefreshCcw', path: 'refresh-ccw' },
	refreshCw: { component: 'RefreshCw', path: 'refresh-cw' },
	receiptText: { component: 'ReceiptText', path: 'receipt-text' },
	rotateCcw: { component: 'RotateCcw', path: 'rotate-ccw' },
	send: { component: 'Send', path: 'send' },
	settings: { component: 'Settings', path: 'settings' },
	flipHorizontal: { component: 'FlipHorizontal2', path: 'flip-horizontal-2' },
	flipVertical: { component: 'FlipVertical2', path: 'flip-vertical-2' },
	zoomIn: { component: 'ZoomIn', path: 'zoom-in' },
	zoomOut: { component: 'ZoomOut', path: 'zoom-out' },
	undo: { component: 'Undo2', path: 'undo-2' },
	imagePlus: { component: 'ImagePlus', path: 'image-plus' },
	checkCircle: { component: 'CircleCheck', path: 'circle-check' },
	xCircle: { component: 'CircleX', path: 'circle-x' },
	alertTriangle: { component: 'TriangleAlert', path: 'triangle-alert' },
	info: { component: 'Info', path: 'info' },
	badgeCheck: { component: 'BadgeCheck', path: 'badge-check' },
	user: { component: 'User', path: 'user' },
	userRound: { component: 'UserRound', path: 'user-round' },
	users: { component: 'Users', path: 'users' },
	userPlus: { component: 'UserPlus', path: 'user-plus' },
	mail: { component: 'Mail', path: 'mail' },
	phone: { component: 'Phone', path: 'phone' },
	inbox: { component: 'Inbox', path: 'inbox' },
	bell: { component: 'Bell', path: 'bell' },
	image: { component: 'Image', path: 'image' },
	video: { component: 'Video', path: 'video' },
	music: { component: 'Music', path: 'music' },
	file: { component: 'FileIcon', path: 'file' },
	fileText: { component: 'FileText', path: 'file-text' },
	folder: { component: 'Folder', path: 'folder' },
	folderPlus: { component: 'FolderPlus', path: 'folder-plus' },
	bookOpen: { component: 'BookOpen', path: 'book-open' },
	bookOpenCheck: { component: 'BookOpenCheck', path: 'book-open-check' },
	bookCopy: { component: 'BookCopy', path: 'book-copy' },
	slidersHorizontal: {
		component: 'SlidersHorizontal',
		path: 'sliders-horizontal'
	},
	moreVertical: { component: 'EllipsisVertical', path: 'ellipsis-vertical' },
	list: { component: 'List', path: 'list' },
	listChecks: { component: 'ListChecks', path: 'list-checks' },
	grid: { component: 'Grid2x2', path: 'grid-2x2' },
	layers: { component: 'Layers', path: 'layers' },
	lock: { component: 'Lock', path: 'lock' },
	shield: { component: 'Shield', path: 'shield' },
	shieldCheck: { component: 'ShieldCheck', path: 'shield-check' },
	key: { component: 'Key', path: 'key' },
	keyboard: { component: 'Keyboard', path: 'keyboard' },
	chartBar: { component: 'ChartBar', path: 'chart-bar' },
	trendingUp: { component: 'TrendingUp', path: 'trending-up' },
	activity: { component: 'Activity', path: 'activity' },
	calendar: { component: 'Calendar', path: 'calendar' },
	clock: { component: 'Clock', path: 'clock' },
	heart: { component: 'Heart', path: 'heart' },
	star: { component: 'Star', path: 'star' },
	tag: { component: 'Tag', path: 'tag' },
	award: { component: 'Award', path: 'award' },
	creditCard: { component: 'CreditCard', path: 'credit-card' },
	shoppingCart: { component: 'ShoppingCart', path: 'shopping-cart' },
	qrCode: { component: 'QrCode', path: 'qr-code' },
	wallet: { component: 'Wallet', path: 'wallet' },
	building: { component: 'Building', path: 'building' },
	building2: { component: 'Building2', path: 'building-2' },
	mapPin: { component: 'MapPin', path: 'map-pin' },
	monitor: { component: 'Monitor', path: 'monitor' },
	hardDrive: { component: 'HardDrive', path: 'hard-drive' },
	boxes: { component: 'Boxes', path: 'boxes' },
	package: { component: 'Package', path: 'package' },
	shoppingBag: { component: 'ShoppingBag', path: 'shopping-bag' },
	eye: { component: 'Eye', path: 'eye' },
	eyeOff: { component: 'EyeClosed', path: 'eye-closed' },
	moon: { component: 'Moon', path: 'moon' },
	sun: { component: 'Sun', path: 'sun' },
	hand: { component: 'Hand', path: 'hand' },
	logOut: { component: 'LogOut', path: 'log-out' },
	history: { component: 'History', path: 'history' },
	sparkles: { component: 'Sparkles', path: 'sparkles' },
	graduationCap: { component: 'GraduationCap', path: 'graduation-cap' }
};

// Per component, prop → rule:
//   { to }               rename
//   { to, only: [..] }   rename only when the literal value is listed
//   { to, values: {..} } rename and map literal values
//   { removed: 'hint' }  reported, never rewritten
export const PROPS = {
	Button: {
		type: {
			to: 'variant',
			only: ['filled', 'border', 'flat', 'ghost', 'gradient']
		},
		button: { to: 'type' },
		radius: { removed: 'unused; style through tokens', drop: true }
	},
	Input: {
		'onaction-click': { to: 'onactionclick' },
		'onicon-click': {
			removed: 'icons are decorative; use actionIcon + onactionclick'
		},
		iconLabel: {
			removed:
				'icons are decorative; use actionIcon + actionLabel + onactionclick',
			drop: true,
			unless: 'onicon-click'
		},
		iconAfter: { removed: 'use actionIcon for a trailing control' },
		labelPlaceholder: { to: 'placeholder' }
	},
	Select: {
		autocomplete: { to: 'searchable' },
		valueKey: { removed: 'unused in 1.0; map options before passing them' },
		labelKey: { removed: 'unused in 1.0; map options before passing them' },
		disabledKey: { removed: 'unused in 1.0; map options before passing them' },
		serializeValue: {
			removed: 'unused in 1.0; map options before passing them'
		},
		placement: { removed: 'floating geometry is internal', drop: true },
		maxHeight: { removed: 'floating geometry is internal', drop: true },
		offset: { removed: 'floating geometry is internal', drop: true },
		viewportPadding: { removed: 'floating geometry is internal', drop: true }
	},
	RemoteSelect: {
		autocomplete: { to: 'searchable' },
		valueKey: { removed: 'unused in 1.0; map options before passing them' },
		labelKey: { removed: 'unused in 1.0; map options before passing them' },
		disabledKey: { removed: 'unused in 1.0; map options before passing them' },
		serializeValue: {
			removed: 'unused in 1.0; map options before passing them'
		},
		placement: { removed: 'floating geometry is internal', drop: true },
		maxHeight: { removed: 'floating geometry is internal', drop: true },
		offset: { removed: 'floating geometry is internal', drop: true },
		viewportPadding: { removed: 'floating geometry is internal', drop: true }
	},
	Table: {
		'onrow-click': { to: 'onrowclick' },
		'onrow-dblclick': { to: 'onrowdblclick' },
		'onrow-contextmenu': { to: 'onrowcontextmenu' },
		'onrow-select': { to: 'onrowselect' },
		'onpage-change': { to: 'onpagechange' },
		showingLabel: {
			removed: 'the range text comes from the locale (paginationRange)'
		},
		ofLabel: {
			removed: 'the range text comes from the locale (paginationRange)'
		},
		loadingText: { removed: 'loading renders skeleton rows' }
	},
	DateRangeFilter: {
		hideApply: {
			removed:
				'the apply button shows when onapply is set — remove onapply to hide it',
			drop: true,
			unless: 'onapply'
		},
		resetLabel: { removed: 'reset was removed' },
		onreset: { removed: 'reset was removed' }
	},
	TagOption: {
		active: { to: 'selected' }
	},
	Avatar: {
		text: { to: 'name' },
		icon: {
			removed:
				'render the icon as children, e.g. <Avatar><User size="60%" /></Avatar>'
		},
		onerror: { removed: 'the initials fallback is automatic' }
	},
	AvatarGroup: {
		items: {
			to: 'items',
			note: 'items use { name, src } now ({ text, alt } → { name })'
		}
	},
	UserInfo: {
		lastName: { mergeInto: 'name' },
		photoUrl: { to: 'src' },
		avatarSize: { to: 'size' },
		avatarColor: { to: 'color' }
	},
	Divider: {
		text: { to: 'label' },
		position: {
			to: 'align',
			values: { left: 'start', center: 'center', right: 'end' }
		},
		spaced: { to: 'spacing', values: { '{false}': 'none', '{true}': 'md' } },
		icon: { removed: 'use label text' },
		onclick: { removed: 'a separator is not a control; use a Button' }
	},
	ListItem: {
		subtitle: { to: 'description' },
		active: { to: 'selected' },
		clickable: {
			removed: 'the row is interactive when it has href or onclick',
			drop: true
		}
	},
	ListHeader: {
		color: { removed: 'it inherits the List color' }
	},
	Image: {
		srcSet: { to: 'srcset' },
		fetchPriority: { to: 'fetchpriority' },
		isZoomed: { to: 'zoom' },
		removeWrapper: { removed: 'the wrapper is always rendered', drop: true },
		disableSkeleton: {
			removed: 'images are never hidden while loading',
			drop: true
		},
		decoding: { removed: 'always async', drop: true }
	},
	Alert: {
		type: { to: 'color', values: { error: 'danger' } }
	},
	Notification: {
		type: { to: 'color', values: { error: 'danger' } }
	},
	Tooltip: {
		position: { to: 'placement' }
	},
	Dropdown: {
		position: { to: 'placement' },
		trigger: { removed: 'dropdowns open on click' },
		maxHeight: { removed: 'floating geometry is internal', drop: true },
		offset: { removed: 'floating geometry is internal', drop: true },
		viewportPadding: { removed: 'floating geometry is internal', drop: true },
		closeOnClickOutside: { removed: 'outside clicks always close', drop: true }
	},
	Context: {
		closeOnClick: { removed: 'items always close the menu' },
		closeOnScroll: { removed: 'scrolling always closes the menu' },
		itemSelector: { removed: 'items are found by [role="menuitem"]' },
		maxHeight: { removed: 'floating geometry is internal', drop: true },
		viewportPadding: { removed: 'floating geometry is internal', drop: true }
	},
	Collapse: {
		defaultOpen: { to: 'open' },
		onchange: { removed: 'use ontoggle' },
		radius: { removed: 'style through tokens' }
	},
	Navbar: {
		'ontoggle-sidebar': { to: 'ontogglesidebar' }
	},
	Sidebar: {
		ariaLabel: { to: 'aria-label' }
	},
	SidebarItem: {
		active: { to: 'current' }
	},
	Progress: {
		'bind:value': { removed: 'value is no longer bindable; pass value={x}' }
	}
};

// Snippets renamed inside a component's body (null = removed);
// `children` wraps loose content into the named snippet.
export const SNIPPETS = {
	UserInfo: { actions: 'trailing' },
	ListItem: {
		avatar: 'leading',
		titleSlot: 'title',
		subtitleSlot: 'description',
		children: 'trailing'
	},
	ListHeader: { children: 'actions' },
	Collapse: { titleSnippet: null },
	EmptyState: { titleSlot: null, descriptionSlot: null },
	InfoItem: { iconSlot: null, labelSlot: null }
};

// Literal text replacements (CSS custom properties).
export const REPLACE = [
	[/--card-image-height\b/g, '--lumi-card-image-height'],
	[/(?<![\w-])--progress-/g, '--lumi-progress-'],
	[/\bIconName\b/g, 'IconSource'],
	[/\bTAG_OPTIONS\b(?![\w(])/g, 'getDriveTagOptions()'],
	[/\bDRIVE_MENU_OPTIONS\b(?![\w(])/g, 'getDriveMenuOptions()'],
	[
		/\bDRIVE_SCOPE_SEGMENT_OPTIONS\b(?![\w(])/g,
		'getDriveScopeSegmentOptions()'
	],
	[/\bDRIVE_SCOPE_OPTIONS\b(?![\w(])/g, 'getDriveScopeOptions()'],
	// Inside import braces the helpers are imported by name, not called.
	[/(import[^;]*?)\b(get\w+Options)\(\)/g, '$1$2'],
	[/(import[^;]*?)\b(get\w+Options)\(\)/g, '$1$2'],
	[/(import[^;]*?)\b(get\w+Options)\(\)/g, '$1$2']
];

// Props added when missing so 0.6 behaviour is preserved.
export const ENSURE = {
	NumberInput: { min: '{0}' }
};

// Snippets or members whose use needs a manual change.
export const MANUAL = [
	[
		/\{#snippet triggerContent\(\)\}\s*<(Button|button|a)\b/g,
		'Dropdown trigger is a button now: move a custom control into the `trigger(props)` snippet and spread props on it'
	],
	[
		/\.lumi-toast-portal\b|class="[^"]*\blumi-toast-portal\b/g,
		'replace the toast wrapper + Notification loop with <Toaster toaster={createToaster()} />'
	],
	[
		/\blumi-context(--[\w-]+)?\b/g,
		'Context classes are now .lumi-menu / .lumi-menu--*'
	],
	[
		/\b(DividerPosition|NotificationType|TooltipPosition|DropdownPosition|DropdownTrigger|CollapseRadius|ErrorStateContent|ErrorStateVariant|ErrorStateHomeHref|TablePaginationData|LumiTransition|LumiIconSize)\b/g,
		'type removed in 1.0 — see docs/UPGRADE.md'
	],
	[
		/\{#snippet paginationSlot\b/g,
		'Table `paginationSlot` was removed — Table renders Pagination; compose your own below it if needed'
	],
	[
		/\.(validate|blur|select)\(\)/g,
		'Input `validate()`/`blur()`/`select()` were removed (only `focus()` remains) — check this call if it targets an Input'
	]
];

// Global classes deleted from core.css / patterns.css (unused by Lumi and its consumers).
export const REMOVED_CLASSES = [
	'lumi-toast-portal',
	'lumi-animate-fade-in',
	'lumi-animate-pulse',
	'lumi-animate-slide-up',
	'lumi-animate-spin',
	'lumi-bg--background',
	'lumi-bg--danger',
	'lumi-bg--info',
	'lumi-bg--secondary',
	'lumi-bg--success',
	'lumi-bg--warning',
	'lumi-border--strong',
	'lumi-centered-card--lg',
	'lumi-centered-card--sm',
	'lumi-centered-card--xl',
	'lumi-cluster--pull-next-up',
	'lumi-container--2xl',
	'lumi-container--lg',
	'lumi-container--md',
	'lumi-container--wide',
	'lumi-container--xl',
	'lumi-container-responsive',
	'lumi-filter-summary__actions',
	'lumi-flex--around',
	'lumi-flex--column-reverse',
	'lumi-flex--end',
	'lumi-flex--evenly',
	'lumi-flex--gap-3xl',
	'lumi-flex--gap-lg',
	'lumi-flex--gap-xl',
	'lumi-flex--gap-xxl',
	'lumi-flex--row',
	'lumi-flex--row-reverse',
	'lumi-flex--start',
	'lumi-grid--auto-fill',
	'lumi-grid--auto-fit',
	'lumi-grid--columns-5',
	'lumi-grid--columns-6',
	'lumi-grid--gap-2xs',
	'lumi-grid--gap-xs',
	'lumi-grid--gap-xxl',
	'lumi-h--screen',
	'lumi-hero-panel',
	'lumi-hero-panel__code',
	'lumi-hero-panel__copy',
	'lumi-hero-panel__identity',
	'lumi-hero-panel__name',
	'lumi-hero-panel__name-row',
	'lumi-hero-panel__stats',
	'lumi-hero-panel__subtitle',
	'lumi-hero__subtitle',
	'lumi-hero__title',
	'lumi-hidden-mobile',
	'lumi-history-item',
	'lumi-history-item__main',
	'lumi-history-item__meta',
	'lumi-history-item__side',
	'lumi-history-item__title',
	'lumi-history-item__top',
	'lumi-history-list',
	'lumi-inline-block',
	'lumi-margin--2xs',
	'lumi-margin--lg',
	'lumi-margin--md',
	'lumi-margin--sm',
	'lumi-margin--xl',
	'lumi-margin--xs',
	'lumi-margin--xxl',
	'lumi-margin-bottom--2xs',
	'lumi-margin-bottom--lg',
	'lumi-margin-bottom--sm',
	'lumi-margin-bottom--xs',
	'lumi-max-w--2xl',
	'lumi-max-w--3xl',
	'lumi-max-w--5xl',
	'lumi-max-w--6xl',
	'lumi-max-w--md',
	'lumi-max-w--xl',
	'lumi-max-w--xs',
	'lumi-metric-rank-list--accent-secondary',
	'lumi-metric-rank-list--dense',
	'lumi-metric-rank-row__head',
	'lumi-metric-rank-row__meta',
	'lumi-metric-rank-row__progress',
	'lumi-metric-rank-row__value',
	'lumi-min-h--full',
	'lumi-min-w--md',
	'lumi-ml-auto',
	'lumi-mr-auto',
	'lumi-opacity--10',
	'lumi-opacity--20',
	'lumi-opacity--30',
	'lumi-opacity--40',
	'lumi-opacity--50',
	'lumi-opacity--60',
	'lumi-opacity--70',
	'lumi-opacity--90',
	'lumi-overflow-auto',
	'lumi-overflow-x-auto',
	'lumi-overflow-y-auto',
	'lumi-padding--3xl',
	'lumi-padding--lg',
	'lumi-padding--xxl',
	'lumi-padding-x--2xs',
	'lumi-padding-x--lg',
	'lumi-padding-x--md',
	'lumi-padding-y--lg',
	'lumi-padding-y--md',
	'lumi-padding-y--sm',
	'lumi-result-option',
	'lumi-result-option__label',
	'lumi-rounded--base',
	'lumi-rounded--none',
	'lumi-rounded--sm',
	'lumi-search-panel__buttons',
	'lumi-segmented-control--icon-only',
	'lumi-segmented-control__content',
	'lumi-shadow--lg',
	'lumi-shadow--md',
	'lumi-shadow--none',
	'lumi-shadow--xl',
	'lumi-stack--xxl',
	'lumi-tabs--horizontal',
	'lumi-tabs__nav',
	'lumi-text--3xl',
	'lumi-text--info',
	'lumi-text--left',
	'lumi-text--light',
	'lumi-visible-mobile',
	'lumi-width--auto',
	'lumi-width--fit',
	'lumi-z--max',
	'lumi-z--modal',
	'lumi-z--tooltip'
];
