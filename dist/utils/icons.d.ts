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
import type { LucideIcon } from '@lucide/svelte';
/** Lucide-compatible Svelte icon component. */
export type IconComponent = LucideIcon;
declare const _registry: {
    house: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    menu: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    chevronLeft: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    chevronRight: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    chevronDown: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    chevronUp: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    arrowLeft: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    arrowLeftRight: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    arrowRight: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    search: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    plus: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    minus: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    x: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    check: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    edit: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    trash: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    copy: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    cornerDownRight: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    cornerUpRight: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    clipboard: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    clipboardCheck: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    clipboardPenLine: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    crop: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    download: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    upload: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    share: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    link: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    refresh: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    refreshCw: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    receiptText: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    rotateCcw: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    send: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    settings: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    flipHorizontal: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    flipVertical: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    zoomIn: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    zoomOut: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    undo: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    imagePlus: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    checkCircle: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    xCircle: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    alertTriangle: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    info: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    badgeCheck: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    user: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    userRound: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    users: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    userPlus: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    mail: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    phone: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    inbox: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    bell: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    image: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    video: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    music: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    file: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    fileText: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    folder: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    folderPlus: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    bookOpen: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    bookOpenCheck: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    bookCopy: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    slidersHorizontal: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    moreVertical: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    list: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    listChecks: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    grid: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    layers: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    lock: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    shield: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    shieldCheck: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    key: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    keyboard: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    chartBar: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    trendingUp: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    activity: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    calendar: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    clock: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    heart: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    star: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    tag: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    award: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    creditCard: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    shoppingCart: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    qrCode: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    wallet: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    building: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    building2: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    mapPin: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    monitor: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    hardDrive: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    boxes: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    package: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    shoppingBag: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    eye: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    eyeOff: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    moon: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    sun: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    hand: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    logOut: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    history: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    sparkles: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    graduationCap: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
};
/** All registered icon names as a union type */
export type IconName = keyof typeof _registry;
/** Icon registry — string key → component mapping */
export declare const iconRegistry: {
    house: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    menu: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    chevronLeft: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    chevronRight: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    chevronDown: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    chevronUp: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    arrowLeft: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    arrowLeftRight: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    arrowRight: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    search: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    plus: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    minus: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    x: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    check: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    edit: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    trash: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    copy: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    cornerDownRight: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    cornerUpRight: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    clipboard: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    clipboardCheck: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    clipboardPenLine: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    crop: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    download: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    upload: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    share: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    link: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    refresh: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    refreshCw: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    receiptText: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    rotateCcw: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    send: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    settings: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    flipHorizontal: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    flipVertical: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    zoomIn: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    zoomOut: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    undo: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    imagePlus: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    checkCircle: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    xCircle: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    alertTriangle: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    info: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    badgeCheck: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    user: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    userRound: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    users: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    userPlus: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    mail: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    phone: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    inbox: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    bell: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    image: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    video: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    music: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    file: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    fileText: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    folder: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    folderPlus: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    bookOpen: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    bookOpenCheck: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    bookCopy: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    slidersHorizontal: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    moreVertical: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    list: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    listChecks: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    grid: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    layers: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    lock: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    shield: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    shieldCheck: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    key: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    keyboard: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    chartBar: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    trendingUp: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    activity: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    calendar: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    clock: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    heart: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    star: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    tag: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    award: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    creditCard: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    shoppingCart: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    qrCode: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    wallet: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    building: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    building2: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    mapPin: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    monitor: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    hardDrive: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    boxes: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    package: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    shoppingBag: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    eye: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    eyeOff: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    moon: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    sun: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    hand: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    logOut: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    history: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    sparkles: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
    graduationCap: import("svelte").Component<import("@lucide/svelte").LucideProps, {}, "">;
};
/**
 * Retrieve an icon component by name.
 * Returns null if not found.
 */
export declare function getIcon(name: string): IconComponent | null;
/** Check whether a name exists in the registry */
export declare function hasIcon(name: string): name is IconName;
/** List all registered icon names */
export declare function getAvailableIcons(): IconName[];
export {};
//# sourceMappingURL=icons.d.ts.map