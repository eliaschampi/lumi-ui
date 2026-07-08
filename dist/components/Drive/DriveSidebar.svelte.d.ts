import { type DriveMenuOption, type DriveScope, type DriveTagOption } from "../../utils/drive";
interface StorageInfo {
    used: number;
    total: number;
    percentage: number;
}
interface Props {
    currentScope?: DriveScope;
    selectedMenu: DriveMenuOption | null;
    selectedTag?: DriveTagOption | null;
    storageInfo: StorageInfo;
    closable?: boolean;
    showScopeControl?: boolean;
    showTags?: boolean;
    tagOptions?: DriveTagOption[];
    onscopechange?: (scope: DriveScope) => void;
    onmenuselect?: (menu: DriveMenuOption | null) => void;
    ontagselect?: (tag: DriveTagOption) => void;
    onclose?: () => void;
}
declare const DriveSidebar: import("svelte").Component<Props, {}, "">;
type DriveSidebar = ReturnType<typeof DriveSidebar>;
export default DriveSidebar;
//# sourceMappingURL=DriveSidebar.svelte.d.ts.map