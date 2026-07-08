import type { DriveFileItem } from "./types";
import type { DriveServeUrlResolver } from "../../utils/drive";
interface Props {
    files: DriveFileItem[];
    selectedFiles: string[];
    isTrash?: boolean;
    onfileclick?: (file: DriveFileItem) => void;
    onfiledblclick?: (file: DriveFileItem) => void;
    onfilecontextmenu?: (event: MouseEvent, file: DriveFileItem) => void;
    onfiledragstart?: (event: DragEvent, file: DriveFileItem) => void;
    onfiledragend?: () => void;
    onfiledrop?: (event: DragEvent, file: DriveFileItem) => void;
    serveUrl?: DriveServeUrlResolver;
}
declare const DriveFileGrid: import("svelte").Component<Props, {}, "">;
type DriveFileGrid = ReturnType<typeof DriveFileGrid>;
export default DriveFileGrid;
//# sourceMappingURL=DriveFileGrid.svelte.d.ts.map