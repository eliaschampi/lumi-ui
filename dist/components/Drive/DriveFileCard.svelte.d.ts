import { type DriveServeUrlResolver } from "../../utils/drive";
import type { DriveFileItem } from "./types";
interface Props {
    file: DriveFileItem;
    selected?: boolean;
    isTrash?: boolean;
    onclick?: (file: DriveFileItem) => void;
    ondblclick?: (file: DriveFileItem) => void;
    oncontextmenu?: (event: MouseEvent, file: DriveFileItem) => void;
    ondragstart?: (event: DragEvent, file: DriveFileItem) => void;
    ondragend?: () => void;
    ondrop?: (event: DragEvent, file: DriveFileItem) => void;
    serveUrl?: DriveServeUrlResolver;
}
declare const DriveFileCard: import("svelte").Component<Props, {}, "">;
type DriveFileCard = ReturnType<typeof DriveFileCard>;
export default DriveFileCard;
//# sourceMappingURL=DriveFileCard.svelte.d.ts.map