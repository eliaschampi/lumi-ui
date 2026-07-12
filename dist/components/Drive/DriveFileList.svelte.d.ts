import { type DriveDateFormatter } from '../../utils/drive';
import type { DriveFileItem } from './types';
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
    formatDate?: DriveDateFormatter;
}
declare const DriveFileList: import("svelte").Component<Props, {}, "">;
type DriveFileList = ReturnType<typeof DriveFileList>;
export default DriveFileList;
//# sourceMappingURL=DriveFileList.svelte.d.ts.map