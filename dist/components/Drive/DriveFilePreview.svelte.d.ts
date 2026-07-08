import { type DriveDateFormatter, type DriveServeUrlResolver } from "../../utils/drive";
import type { DriveFileItem } from "./types";
interface Props {
    open: boolean;
    file: DriveFileItem | null;
    ondownload?: (file: DriveFileItem) => void;
    formatDate?: DriveDateFormatter;
    serveUrl?: DriveServeUrlResolver;
}
declare const DriveFilePreview: import("svelte").Component<Props, {}, "open">;
type DriveFilePreview = ReturnType<typeof DriveFilePreview>;
export default DriveFilePreview;
//# sourceMappingURL=DriveFilePreview.svelte.d.ts.map