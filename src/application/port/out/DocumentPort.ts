import { TextDocument } from "vscode";

export interface DocumentPort {
    write(document: TextDocument, content: string): Promise<boolean>;

    save(document: TextDocument): Promise<boolean>;

    setActiveDocument(document: TextDocument): boolean;

    getActiveDocument(): TextDocument;
}
