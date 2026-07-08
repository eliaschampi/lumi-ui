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
import type { Component } from 'svelte';
/** Svelte 5 compatible icon component type (replaces deprecated ComponentType) */
export type IconComponent = Component;
declare const _registry: {
    house: Component<import("@lucide/svelte").LucideProps, {}, "">;
    menu: Component<import("@lucide/svelte").LucideProps, {}, "">;
    chevronLeft: Component<import("@lucide/svelte").LucideProps, {}, "">;
    chevronRight: Component<import("@lucide/svelte").LucideProps, {}, "">;
    chevronDown: Component<import("@lucide/svelte").LucideProps, {}, "">;
    chevronUp: Component<import("@lucide/svelte").LucideProps, {}, "">;
    arrowLeft: Component<import("@lucide/svelte").LucideProps, {}, "">;
    arrowLeftRight: Component<import("@lucide/svelte").LucideProps, {}, "">;
    arrowRight: Component<import("@lucide/svelte").LucideProps, {}, "">;
    search: Component<import("@lucide/svelte").LucideProps, {}, "">;
    plus: Component<import("@lucide/svelte").LucideProps, {}, "">;
    minus: Component<import("@lucide/svelte").LucideProps, {}, "">;
    x: Component<import("@lucide/svelte").LucideProps, {}, "">;
    check: Component<import("@lucide/svelte").LucideProps, {}, "">;
    edit: Component<import("@lucide/svelte").LucideProps, {}, "">;
    trash: Component<import("@lucide/svelte").LucideProps, {}, "">;
    copy: Component<import("@lucide/svelte").LucideProps, {}, "">;
    cornerDownRight: Component<import("@lucide/svelte").LucideProps, {}, "">;
    cornerUpRight: Component<import("@lucide/svelte").LucideProps, {}, "">;
    clipboard: Component<import("@lucide/svelte").LucideProps, {}, "">;
    clipboardCheck: Component<import("@lucide/svelte").LucideProps, {}, "">;
    clipboardPenLine: Component<import("@lucide/svelte").LucideProps, {}, "">;
    crop: Component<import("@lucide/svelte").LucideProps, {}, "">;
    download: Component<import("@lucide/svelte").LucideProps, {}, "">;
    upload: Component<import("@lucide/svelte").LucideProps, {}, "">;
    share: Component<import("@lucide/svelte").LucideProps, {}, "">;
    link: Component<import("@lucide/svelte").LucideProps, {}, "">;
    refresh: Component<import("@lucide/svelte").LucideProps, {}, "">;
    refreshCw: Component<import("@lucide/svelte").LucideProps, {}, "">;
    receiptText: Component<import("@lucide/svelte").LucideProps, {}, "">;
    rotateCcw: Component<import("@lucide/svelte").LucideProps, {}, "">;
    send: Component<import("@lucide/svelte").LucideProps, {}, "">;
    settings: Component<import("@lucide/svelte").LucideProps, {}, "">;
    flipHorizontal: Component<import("@lucide/svelte").LucideProps, {}, "">;
    flipVertical: Component<import("@lucide/svelte").LucideProps, {}, "">;
    zoomIn: Component<import("@lucide/svelte").LucideProps, {}, "">;
    zoomOut: Component<import("@lucide/svelte").LucideProps, {}, "">;
    undo: Component<import("@lucide/svelte").LucideProps, {}, "">;
    imagePlus: Component<import("@lucide/svelte").LucideProps, {}, "">;
    checkCircle: Component<import("@lucide/svelte").LucideProps, {}, "">;
    xCircle: Component<import("@lucide/svelte").LucideProps, {}, "">;
    alertTriangle: Component<import("@lucide/svelte").LucideProps, {}, "">;
    info: Component<import("@lucide/svelte").LucideProps, {}, "">;
    badgeCheck: Component<import("@lucide/svelte").LucideProps, {}, "">;
    user: Component<import("@lucide/svelte").LucideProps, {}, "">;
    userRound: Component<import("@lucide/svelte").LucideProps, {}, "">;
    users: Component<import("@lucide/svelte").LucideProps, {}, "">;
    userPlus: Component<import("@lucide/svelte").LucideProps, {}, "">;
    mail: Component<import("@lucide/svelte").LucideProps, {}, "">;
    phone: Component<import("@lucide/svelte").LucideProps, {}, "">;
    inbox: Component<import("@lucide/svelte").LucideProps, {}, "">;
    bell: Component<import("@lucide/svelte").LucideProps, {}, "">;
    image: Component<import("@lucide/svelte").LucideProps, {}, "">;
    video: Component<import("@lucide/svelte").LucideProps, {}, "">;
    music: Component<import("@lucide/svelte").LucideProps, {}, "">;
    file: Component<import("@lucide/svelte").LucideProps, {}, "">;
    fileText: Component<import("@lucide/svelte").LucideProps, {}, "">;
    folder: Component<import("@lucide/svelte").LucideProps, {}, "">;
    folderPlus: Component<import("@lucide/svelte").LucideProps, {}, "">;
    bookOpen: Component<import("@lucide/svelte").LucideProps, {}, "">;
    bookOpenCheck: Component<import("@lucide/svelte").LucideProps, {}, "">;
    bookCopy: Component<import("@lucide/svelte").LucideProps, {}, "">;
    slidersHorizontal: Component<import("@lucide/svelte").LucideProps, {}, "">;
    moreVertical: Component<import("@lucide/svelte").LucideProps, {}, "">;
    list: Component<import("@lucide/svelte").LucideProps, {}, "">;
    listChecks: Component<import("@lucide/svelte").LucideProps, {}, "">;
    grid: Component<import("@lucide/svelte").LucideProps, {}, "">;
    layers: Component<import("@lucide/svelte").LucideProps, {}, "">;
    lock: Component<import("@lucide/svelte").LucideProps, {}, "">;
    shield: Component<import("@lucide/svelte").LucideProps, {}, "">;
    shieldCheck: Component<import("@lucide/svelte").LucideProps, {}, "">;
    key: Component<import("@lucide/svelte").LucideProps, {}, "">;
    keyboard: Component<import("@lucide/svelte").LucideProps, {}, "">;
    chartBar: Component<import("@lucide/svelte").LucideProps, {}, "">;
    trendingUp: Component<import("@lucide/svelte").LucideProps, {}, "">;
    activity: Component<import("@lucide/svelte").LucideProps, {}, "">;
    calendar: Component<import("@lucide/svelte").LucideProps, {}, "">;
    clock: Component<import("@lucide/svelte").LucideProps, {}, "">;
    heart: Component<import("@lucide/svelte").LucideProps, {}, "">;
    star: Component<import("@lucide/svelte").LucideProps, {}, "">;
    tag: Component<import("@lucide/svelte").LucideProps, {}, "">;
    award: Component<import("@lucide/svelte").LucideProps, {}, "">;
    creditCard: Component<import("@lucide/svelte").LucideProps, {}, "">;
    shoppingCart: Component<import("@lucide/svelte").LucideProps, {}, "">;
    qrCode: Component<import("@lucide/svelte").LucideProps, {}, "">;
    wallet: Component<import("@lucide/svelte").LucideProps, {}, "">;
    building: Component<import("@lucide/svelte").LucideProps, {}, "">;
    building2: Component<import("@lucide/svelte").LucideProps, {}, "">;
    mapPin: Component<import("@lucide/svelte").LucideProps, {}, "">;
    monitor: Component<import("@lucide/svelte").LucideProps, {}, "">;
    hardDrive: Component<import("@lucide/svelte").LucideProps, {}, "">;
    boxes: Component<import("@lucide/svelte").LucideProps, {}, "">;
    package: Component<import("@lucide/svelte").LucideProps, {}, "">;
    shoppingBag: Component<import("@lucide/svelte").LucideProps, {}, "">;
    eye: Component<import("@lucide/svelte").LucideProps, {}, "">;
    eyeOff: Component<import("@lucide/svelte").LucideProps, {}, "">;
    moon: Component<import("@lucide/svelte").LucideProps, {}, "">;
    sun: Component<import("@lucide/svelte").LucideProps, {}, "">;
    hand: Component<import("@lucide/svelte").LucideProps, {}, "">;
    logOut: Component<import("@lucide/svelte").LucideProps, {}, "">;
    history: Component<import("@lucide/svelte").LucideProps, {}, "">;
    sparkles: Component<import("@lucide/svelte").LucideProps, {}, "">;
    graduationCap: Component<import("@lucide/svelte").LucideProps, {}, "">;
};
/** All registered icon names as a union type */
export type IconName = keyof typeof _registry;
/** Icon registry — string key → component mapping */
export declare const iconRegistry: {
    house: Component<import("@lucide/svelte").LucideProps, {}, "">;
    menu: Component<import("@lucide/svelte").LucideProps, {}, "">;
    chevronLeft: Component<import("@lucide/svelte").LucideProps, {}, "">;
    chevronRight: Component<import("@lucide/svelte").LucideProps, {}, "">;
    chevronDown: Component<import("@lucide/svelte").LucideProps, {}, "">;
    chevronUp: Component<import("@lucide/svelte").LucideProps, {}, "">;
    arrowLeft: Component<import("@lucide/svelte").LucideProps, {}, "">;
    arrowLeftRight: Component<import("@lucide/svelte").LucideProps, {}, "">;
    arrowRight: Component<import("@lucide/svelte").LucideProps, {}, "">;
    search: Component<import("@lucide/svelte").LucideProps, {}, "">;
    plus: Component<import("@lucide/svelte").LucideProps, {}, "">;
    minus: Component<import("@lucide/svelte").LucideProps, {}, "">;
    x: Component<import("@lucide/svelte").LucideProps, {}, "">;
    check: Component<import("@lucide/svelte").LucideProps, {}, "">;
    edit: Component<import("@lucide/svelte").LucideProps, {}, "">;
    trash: Component<import("@lucide/svelte").LucideProps, {}, "">;
    copy: Component<import("@lucide/svelte").LucideProps, {}, "">;
    cornerDownRight: Component<import("@lucide/svelte").LucideProps, {}, "">;
    cornerUpRight: Component<import("@lucide/svelte").LucideProps, {}, "">;
    clipboard: Component<import("@lucide/svelte").LucideProps, {}, "">;
    clipboardCheck: Component<import("@lucide/svelte").LucideProps, {}, "">;
    clipboardPenLine: Component<import("@lucide/svelte").LucideProps, {}, "">;
    crop: Component<import("@lucide/svelte").LucideProps, {}, "">;
    download: Component<import("@lucide/svelte").LucideProps, {}, "">;
    upload: Component<import("@lucide/svelte").LucideProps, {}, "">;
    share: Component<import("@lucide/svelte").LucideProps, {}, "">;
    link: Component<import("@lucide/svelte").LucideProps, {}, "">;
    refresh: Component<import("@lucide/svelte").LucideProps, {}, "">;
    refreshCw: Component<import("@lucide/svelte").LucideProps, {}, "">;
    receiptText: Component<import("@lucide/svelte").LucideProps, {}, "">;
    rotateCcw: Component<import("@lucide/svelte").LucideProps, {}, "">;
    send: Component<import("@lucide/svelte").LucideProps, {}, "">;
    settings: Component<import("@lucide/svelte").LucideProps, {}, "">;
    flipHorizontal: Component<import("@lucide/svelte").LucideProps, {}, "">;
    flipVertical: Component<import("@lucide/svelte").LucideProps, {}, "">;
    zoomIn: Component<import("@lucide/svelte").LucideProps, {}, "">;
    zoomOut: Component<import("@lucide/svelte").LucideProps, {}, "">;
    undo: Component<import("@lucide/svelte").LucideProps, {}, "">;
    imagePlus: Component<import("@lucide/svelte").LucideProps, {}, "">;
    checkCircle: Component<import("@lucide/svelte").LucideProps, {}, "">;
    xCircle: Component<import("@lucide/svelte").LucideProps, {}, "">;
    alertTriangle: Component<import("@lucide/svelte").LucideProps, {}, "">;
    info: Component<import("@lucide/svelte").LucideProps, {}, "">;
    badgeCheck: Component<import("@lucide/svelte").LucideProps, {}, "">;
    user: Component<import("@lucide/svelte").LucideProps, {}, "">;
    userRound: Component<import("@lucide/svelte").LucideProps, {}, "">;
    users: Component<import("@lucide/svelte").LucideProps, {}, "">;
    userPlus: Component<import("@lucide/svelte").LucideProps, {}, "">;
    mail: Component<import("@lucide/svelte").LucideProps, {}, "">;
    phone: Component<import("@lucide/svelte").LucideProps, {}, "">;
    inbox: Component<import("@lucide/svelte").LucideProps, {}, "">;
    bell: Component<import("@lucide/svelte").LucideProps, {}, "">;
    image: Component<import("@lucide/svelte").LucideProps, {}, "">;
    video: Component<import("@lucide/svelte").LucideProps, {}, "">;
    music: Component<import("@lucide/svelte").LucideProps, {}, "">;
    file: Component<import("@lucide/svelte").LucideProps, {}, "">;
    fileText: Component<import("@lucide/svelte").LucideProps, {}, "">;
    folder: Component<import("@lucide/svelte").LucideProps, {}, "">;
    folderPlus: Component<import("@lucide/svelte").LucideProps, {}, "">;
    bookOpen: Component<import("@lucide/svelte").LucideProps, {}, "">;
    bookOpenCheck: Component<import("@lucide/svelte").LucideProps, {}, "">;
    bookCopy: Component<import("@lucide/svelte").LucideProps, {}, "">;
    slidersHorizontal: Component<import("@lucide/svelte").LucideProps, {}, "">;
    moreVertical: Component<import("@lucide/svelte").LucideProps, {}, "">;
    list: Component<import("@lucide/svelte").LucideProps, {}, "">;
    listChecks: Component<import("@lucide/svelte").LucideProps, {}, "">;
    grid: Component<import("@lucide/svelte").LucideProps, {}, "">;
    layers: Component<import("@lucide/svelte").LucideProps, {}, "">;
    lock: Component<import("@lucide/svelte").LucideProps, {}, "">;
    shield: Component<import("@lucide/svelte").LucideProps, {}, "">;
    shieldCheck: Component<import("@lucide/svelte").LucideProps, {}, "">;
    key: Component<import("@lucide/svelte").LucideProps, {}, "">;
    keyboard: Component<import("@lucide/svelte").LucideProps, {}, "">;
    chartBar: Component<import("@lucide/svelte").LucideProps, {}, "">;
    trendingUp: Component<import("@lucide/svelte").LucideProps, {}, "">;
    activity: Component<import("@lucide/svelte").LucideProps, {}, "">;
    calendar: Component<import("@lucide/svelte").LucideProps, {}, "">;
    clock: Component<import("@lucide/svelte").LucideProps, {}, "">;
    heart: Component<import("@lucide/svelte").LucideProps, {}, "">;
    star: Component<import("@lucide/svelte").LucideProps, {}, "">;
    tag: Component<import("@lucide/svelte").LucideProps, {}, "">;
    award: Component<import("@lucide/svelte").LucideProps, {}, "">;
    creditCard: Component<import("@lucide/svelte").LucideProps, {}, "">;
    shoppingCart: Component<import("@lucide/svelte").LucideProps, {}, "">;
    qrCode: Component<import("@lucide/svelte").LucideProps, {}, "">;
    wallet: Component<import("@lucide/svelte").LucideProps, {}, "">;
    building: Component<import("@lucide/svelte").LucideProps, {}, "">;
    building2: Component<import("@lucide/svelte").LucideProps, {}, "">;
    mapPin: Component<import("@lucide/svelte").LucideProps, {}, "">;
    monitor: Component<import("@lucide/svelte").LucideProps, {}, "">;
    hardDrive: Component<import("@lucide/svelte").LucideProps, {}, "">;
    boxes: Component<import("@lucide/svelte").LucideProps, {}, "">;
    package: Component<import("@lucide/svelte").LucideProps, {}, "">;
    shoppingBag: Component<import("@lucide/svelte").LucideProps, {}, "">;
    eye: Component<import("@lucide/svelte").LucideProps, {}, "">;
    eyeOff: Component<import("@lucide/svelte").LucideProps, {}, "">;
    moon: Component<import("@lucide/svelte").LucideProps, {}, "">;
    sun: Component<import("@lucide/svelte").LucideProps, {}, "">;
    hand: Component<import("@lucide/svelte").LucideProps, {}, "">;
    logOut: Component<import("@lucide/svelte").LucideProps, {}, "">;
    history: Component<import("@lucide/svelte").LucideProps, {}, "">;
    sparkles: Component<import("@lucide/svelte").LucideProps, {}, "">;
    graduationCap: Component<import("@lucide/svelte").LucideProps, {}, "">;
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