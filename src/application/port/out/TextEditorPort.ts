export interface TextEditorPort {
    createTextEditor(documentId: string): Promise<string>;

    closeTextEditor(fileName: string): Promise<boolean>;
}
