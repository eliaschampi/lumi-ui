/**
 * Icon System — Lucide Icons for Lumi UI
 *
 * Two usage patterns:
 *   1. Direct component ref (tree-shakeable):  <Icon icon={Home} />
 *   2. String registry lookup (convenient):     <Icon icon="home" />
 *
 * TRADE-OFF: The registry imports all listed icons at build time.
 * For minimal bundle size, prefer passing components directly.
 *
 * @module icons
 */
// ─── Lucide Imports ────────────────────────────────────────────
// Alphabetically sorted. Maintain order when adding new icons.
import { Activity, ArrowLeft, ArrowLeftRight, ArrowRight, Award, BadgeCheck, Bell, BookCopy, BookOpen, BookOpenCheck, Boxes, Building, Building2, Calendar, ChartBar, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, CircleCheck, CircleX, Clipboard, ClipboardCheck, ClipboardPenLine, Clock, CloudUpload, Copy, CornerDownRight, CornerUpRight, CreditCard, Crop, Download, EllipsisVertical, Eye, EyeClosed, File as FileIcon, FileText, FlipHorizontal2, FlipVertical2, Folder, FolderPlus, GraduationCap, Grid2x2, Hand, HardDrive, Heart, History, House, Image, ImagePlus, Inbox, Info, Key, Keyboard, Layers, Link, List, ListChecks, Lock, LogOut, Mail, MapPin, Menu, Minus, Monitor, Moon, Music, Package, Pencil, Phone, Plus, QrCode, RefreshCcw, RefreshCw, ReceiptText, RotateCcw, Search, Send, Settings, Share2, Shield, ShieldCheck, ShoppingBag, ShoppingCart, SlidersHorizontal, Sparkles, Star, Sun, Tag, Trash2, TrendingUp, TriangleAlert, Undo2, User, UserPlus, UserRound, Users, Video, Wallet, X, ZoomIn, ZoomOut } from '@lucide/svelte';
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
};
/** Icon registry — string key → component mapping */
export const iconRegistry = _registry;
// ─── Utilities ─────────────────────────────────────────────────
/**
 * Retrieve an icon component by name.
 * Returns null if not found.
 */
export function getIcon(name) {
    if (name in iconRegistry) {
        return iconRegistry[name];
    }
    return null;
}
/** Check whether a name exists in the registry */
export function hasIcon(name) {
    return name in iconRegistry;
}
/** List all registered icon names */
export function getAvailableIcons() {
    return Object.keys(iconRegistry);
}
