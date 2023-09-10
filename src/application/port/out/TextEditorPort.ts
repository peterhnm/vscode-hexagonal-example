import { TextDocument } from "vscode";

export interface TextEditorPort {
    createTextEditor(document: TextDocument): Promise<string>;

    closeTextEditor(fileName: string): Promise<boolean>;
}
