import { type DriveMenuOption, type DriveScope } from "../../utils/drive";
interface StorageInfo {
    used: number;
    total: number;
    percentage: number;
}
interface Props {
    currentScope?: DriveScope;
    selectedMenu: DriveMenuOption | null;
    storageInfo: StorageInfo;
    closable?: boolean;
    showScopeControl?: boolean;
    onscopechange?: (scope: DriveScope) => void;
    onmenuselect?: (menu: DriveMenuOption | null) => void;
    onclose?: () => void;
}
declare const DriveSidebar: import("svelte").Component<Props, {}, "">;
type DriveSidebar = ReturnType<typeof DriveSidebar>;
export default DriveSidebar;
//# sourceMappingURL=DriveSidebar.svelte.d.ts.map