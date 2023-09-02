import { Range, TextDocument, workspace, WorkspaceEdit } from "vscode";
import { DocumentPort } from "port/out/DocumentPort";

export class DocumentAdapter implements DocumentPort {
    write(document: TextDocument, content: string): Promise<boolean> {
        if (document.getText() === content) {
            throw new Error("No changes to apply!");
        }

        const edit = new WorkspaceEdit();

        edit.replace(document.uri, new Range(0, 0, document.lineCount, 0), content);

        return Promise.resolve(workspace.applyEdit(edit));
    }
}
