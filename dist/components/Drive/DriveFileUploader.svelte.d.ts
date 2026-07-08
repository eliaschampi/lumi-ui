interface Props {
    open: boolean;
    onupload?: (file: File, customName?: string) => Promise<void>;
    oncomplete?: (summary: {
        uploaded: number;
        failed: number;
    }) => Promise<void> | void;
    onclose?: () => void;
}
declare const DriveFileUploader: import("svelte").Component<Props, {}, "open">;
type DriveFileUploader = ReturnType<typeof DriveFileUploader>;
export default DriveFileUploader;
//# sourceMappingURL=DriveFileUploader.svelte.d.ts.map