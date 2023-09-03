import { TextDocument } from "vscode";

export interface DocumentPort {
    write(document: TextDocument, content: string): Promise<boolean>;

    save(document: TextDocument): Promise<boolean>;
}
