/**
 * Icon System — Lucide Icons for Lumi UI
 *
 * Two usage patterns:
 *   1. Direct component ref (tree-shakeable):  <Icon icon={Home} />
 *   2. String registry lookup (convenient):     <Icon icon="home" />
 *
 * Dev note: import each icon via deep path (@lucide/svelte/icons/*),
 * never the package barrel. The barrel re-exports ~1700 icons and
 * freezes Vite HMR first-load (minutes of network waterfall).
 *
 * @module icons
 */

import type { LucideIcon } from '@lucide/svelte';

// ─── Types ─────────────────────────────────────────────────────

/** Lucide-compatible Svelte icon component. */
export type IconComponent = LucideIcon;

// ─── Lucide Imports (deep paths — alphabetically sorted) ───────────

import Activity from '@lucide/svelte/icons/activity';
import ArrowLeft from '@lucide/svelte/icons/arrow-left';
import ArrowLeftRight from '@lucide/svelte/icons/arrow-left-right';
import ArrowRight from '@lucide/svelte/icons/arrow-right';
import Award from '@lucide/svelte/icons/award';
import BadgeCheck from '@lucide/svelte/icons/badge-check';
import Bell from '@lucide/svelte/icons/bell';
import BookCopy from '@lucide/svelte/icons/book-copy';
import BookOpen from '@lucide/svelte/icons/book-open';
import BookOpenCheck from '@lucide/svelte/icons/book-open-check';
import Boxes from '@lucide/svelte/icons/boxes';
import Building from '@lucide/svelte/icons/building';
import Building2 from '@lucide/svelte/icons/building-2';
import Calendar from '@lucide/svelte/icons/calendar';
import ChartBar from '@lucide/svelte/icons/chart-bar';
import Check from '@lucide/svelte/icons/check';
import ChevronDown from '@lucide/svelte/icons/chevron-down';
import ChevronLeft from '@lucide/svelte/icons/chevron-left';
import ChevronRight from '@lucide/svelte/icons/chevron-right';
import ChevronUp from '@lucide/svelte/icons/chevron-up';
import CircleCheck from '@lucide/svelte/icons/circle-check';
import CircleX from '@lucide/svelte/icons/circle-x';
import Clipboard from '@lucide/svelte/icons/clipboard';
import ClipboardCheck from '@lucide/svelte/icons/clipboard-check';
import ClipboardPenLine from '@lucide/svelte/icons/clipboard-pen-line';
import Clock from '@lucide/svelte/icons/clock';
import CloudUpload from '@lucide/svelte/icons/cloud-upload';
import Copy from '@lucide/svelte/icons/copy';
import CornerDownRight from '@lucide/svelte/icons/corner-down-right';
import CornerUpRight from '@lucide/svelte/icons/corner-up-right';
import CreditCard from '@lucide/svelte/icons/credit-card';
import Crop from '@lucide/svelte/icons/crop';
import Download from '@lucide/svelte/icons/download';
import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
import Eye from '@lucide/svelte/icons/eye';
import EyeClosed from '@lucide/svelte/icons/eye-closed';
import FileIcon from '@lucide/svelte/icons/file';
import FileText from '@lucide/svelte/icons/file-text';
import FlipHorizontal2 from '@lucide/svelte/icons/flip-horizontal-2';
import FlipVertical2 from '@lucide/svelte/icons/flip-vertical-2';
import Folder from '@lucide/svelte/icons/folder';
import FolderPlus from '@lucide/svelte/icons/folder-plus';
import GraduationCap from '@lucide/svelte/icons/graduation-cap';
import Grid2x2 from '@lucide/svelte/icons/grid-2x2';
import Hand from '@lucide/svelte/icons/hand';
import HardDrive from '@lucide/svelte/icons/hard-drive';
import Heart from '@lucide/svelte/icons/heart';
import History from '@lucide/svelte/icons/history';
import House from '@lucide/svelte/icons/house';
import Image from '@lucide/svelte/icons/image';
import ImagePlus from '@lucide/svelte/icons/image-plus';
import Inbox from '@lucide/svelte/icons/inbox';
import Info from '@lucide/svelte/icons/info';
import Key from '@lucide/svelte/icons/key';
import Keyboard from '@lucide/svelte/icons/keyboard';
import Layers from '@lucide/svelte/icons/layers';
import Link from '@lucide/svelte/icons/link';
import List from '@lucide/svelte/icons/list';
import ListChecks from '@lucide/svelte/icons/list-checks';
import Lock from '@lucide/svelte/icons/lock';
import LogOut from '@lucide/svelte/icons/log-out';
import Mail from '@lucide/svelte/icons/mail';
import MapPin from '@lucide/svelte/icons/map-pin';
import Menu from '@lucide/svelte/icons/menu';
import Minus from '@lucide/svelte/icons/minus';
import Monitor from '@lucide/svelte/icons/monitor';
import Moon from '@lucide/svelte/icons/moon';
import Music from '@lucide/svelte/icons/music';
import Package from '@lucide/svelte/icons/package';
import Pencil from '@lucide/svelte/icons/pencil';
import Phone from '@lucide/svelte/icons/phone';
import Plus from '@lucide/svelte/icons/plus';
import QrCode from '@lucide/svelte/icons/qr-code';
import RefreshCcw from '@lucide/svelte/icons/refresh-ccw';
import RefreshCw from '@lucide/svelte/icons/refresh-cw';
import ReceiptText from '@lucide/svelte/icons/receipt-text';
import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
import Search from '@lucide/svelte/icons/search';
import Send from '@lucide/svelte/icons/send';
import Settings from '@lucide/svelte/icons/settings';
import Share2 from '@lucide/svelte/icons/share-2';
import Shield from '@lucide/svelte/icons/shield';
import ShieldCheck from '@lucide/svelte/icons/shield-check';
import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
import ShoppingCart from '@lucide/svelte/icons/shopping-cart';
import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
import Sparkles from '@lucide/svelte/icons/sparkles';
import Star from '@lucide/svelte/icons/star';
import Sun from '@lucide/svelte/icons/sun';
import Tag from '@lucide/svelte/icons/tag';
import Trash2 from '@lucide/svelte/icons/trash-2';
import TrendingUp from '@lucide/svelte/icons/trending-up';
import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
import Undo2 from '@lucide/svelte/icons/undo-2';
import User from '@lucide/svelte/icons/user';
import UserPlus from '@lucide/svelte/icons/user-plus';
import UserRound from '@lucide/svelte/icons/user-round';
import Users from '@lucide/svelte/icons/users';
import Video from '@lucide/svelte/icons/video';
import Wallet from '@lucide/svelte/icons/wallet';
import X from '@lucide/svelte/icons/x';
import ZoomIn from '@lucide/svelte/icons/zoom-in';
import ZoomOut from '@lucide/svelte/icons/zoom-out';

// ─── Registry ──────────────────────────────────────────────────
// Organized by category. `satisfies` checks value types while
// preserving literal key types for IconName inference.

const _registry = {
	// Navigation
	house: House,
	menu: Menu,
	chevronLeft: ChevronLeft,
	chevronRight: ChevronRight,
	chevronDown: ChevronDown,
	chevronUp: ChevronUp,
	arrowLeft: ArrowLeft,
	arrowLeftRight: ArrowLeftRight,
	arrowRight: ArrowRight,

	// Actions
	search: Search,
	plus: Plus,
	minus: Minus,
	x: X,
	check: Check,
	edit: Pencil,
	trash: Trash2,
	copy: Copy,
	cornerDownRight: CornerDownRight,
	cornerUpRight: CornerUpRight,
	clipboard: Clipboard,
	clipboardCheck: ClipboardCheck,
	clipboardPenLine: ClipboardPenLine,
	crop: Crop,
	download: Download,
	upload: CloudUpload,
	share: Share2,
	link: Link,
	refresh: RefreshCcw,
	refreshCw: RefreshCw,
	receiptText: ReceiptText,
	rotateCcw: RotateCcw,
	send: Send,
	settings: Settings,
	flipHorizontal: FlipHorizontal2,
	flipVertical: FlipVertical2,
	zoomIn: ZoomIn,
	zoomOut: ZoomOut,
	undo: Undo2,
	imagePlus: ImagePlus,
	// Status & Feedback
	checkCircle: CircleCheck,
	xCircle: CircleX,
	alertTriangle: TriangleAlert,
	info: Info,
	badgeCheck: BadgeCheck,

	// User
	user: User,
	userRound: UserRound,
	users: Users,
	userPlus: UserPlus,

	// Communication
	mail: Mail,
	phone: Phone,
	inbox: Inbox,
	bell: Bell,

	// Media
	image: Image,
	video: Video,
	music: Music,

	// Files & Documents
	file: FileIcon,
	fileText: FileText,
	folder: Folder,
	folderPlus: FolderPlus,
	bookOpen: BookOpen,
	bookOpenCheck: BookOpenCheck,
	bookCopy: BookCopy,

	// UI & Layout
	slidersHorizontal: SlidersHorizontal,
	moreVertical: EllipsisVertical,
	list: List,
	listChecks: ListChecks,
	grid: Grid2x2,
	layers: Layers,

	// Security
	lock: Lock,
	shield: Shield,
	shieldCheck: ShieldCheck,
	key: Key,
	keyboard: Keyboard,

	// Data & Charts
	chartBar: ChartBar,
	trendingUp: TrendingUp,
	activity: Activity,

	// Objects
	calendar: Calendar,
	clock: Clock,
	heart: Heart,
	star: Star,
	tag: Tag,
	award: Award,
	creditCard: CreditCard,
	shoppingCart: ShoppingCart,
	qrCode: QrCode,
	wallet: Wallet,
	// Places & Environment
	building: Building,
	building2: Building2,
	mapPin: MapPin,
	monitor: Monitor,
	hardDrive: HardDrive,
	boxes: Boxes,
	package: Package,
	shoppingBag: ShoppingBag,
	// Miscellaneous
	eye: Eye,
	eyeOff: EyeClosed,
	moon: Moon,
	sun: Sun,
	hand: Hand,
	logOut: LogOut,
	history: History,
	sparkles: Sparkles,
	graduationCap: GraduationCap
} satisfies Record<string, IconComponent>;

/** All registered icon names as a union type */
export type IconName = keyof typeof _registry;

/** Icon registry — string key → component mapping */
export const iconRegistry = _registry;

// ─── Utilities ─────────────────────────────────────────────────

/**
 * Retrieve an icon component by name.
 * Returns null if not found.
 */
export function getIcon(name: string): IconComponent | null {
	if (name in iconRegistry) {
		return iconRegistry[name as IconName];
	}

	return null;
}

/** Check whether a name exists in the registry */
export function hasIcon(name: string): name is IconName {
	return name in iconRegistry;
}

/** List all registered icon names */
export function getAvailableIcons(): IconName[] {
	return Object.keys(iconRegistry) as IconName[];
}
