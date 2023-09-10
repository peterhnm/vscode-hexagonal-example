import { Range, TextDocument, workspace, WorkspaceEdit } from "vscode";
import { DocumentPort } from "port/out/DocumentPort";

export class DocumentAdapter implements DocumentPort {
    private activeDocument: TextDocument | undefined;

    // TODO: Use the activeDocument and get an ID instead of the document for validation?
    write(document: TextDocument, content: string): Promise<boolean> {
        if (document.getText() === content) {
            throw new Error("No changes to apply!");
        }

        const edit = new WorkspaceEdit();

        edit.replace(document.uri, new Range(0, 0, document.lineCount, 0), content);

        return Promise.resolve(workspace.applyEdit(edit));
    }

    save(document: TextDocument): Promise<boolean> {
        return Promise.resolve(document.save());
    }

    getActiveDocument(): TextDocument {
        if (!this.activeDocument) {
            throw new Error("No active document!");
        }
        return this.activeDocument;
    }

    setActiveDocument(document: TextDocument): boolean {
        this.activeDocument = document;
        return true;
    }
}
