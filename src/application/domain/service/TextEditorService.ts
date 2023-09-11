import { container, inject, injectable } from "tsyringe";

import { TextEditorCommand, TextEditorUseCase } from "port/in/textEditor";
import { DocumentPort, TextEditorPort } from "port/out";
import { StandardTextEditor } from "../model/StandardTextEditor";

@injectable()
export class TextEditorService implements TextEditorUseCase {
    constructor(
        @inject("DocumentPort") private readonly documentPort: DocumentPort,
        @inject("TextEditorPort") private readonly textEditorPort: TextEditorPort,
    ) {}

    async toggle(): Promise<boolean> {
        const documentId = this.documentPort.loadActiveDocumentId();
        const textEditor = container.resolve(StandardTextEditor);

        if (textEditor.isOpen) {
            if (await this.textEditorPort.closeTextEditor(documentId)) {
                textEditor.isOpen = false;
                textEditor.fileName = "";
            }
            return textEditor.isOpen;
        }

        textEditor.fileName = await this.textEditorPort.createTextEditor(documentId);
        textEditor.isOpen = true;
        return textEditor.isOpen;
    }

    async close(textEditorCommand: TextEditorCommand): Promise<boolean> {
        const closedTextEditors = textEditorCommand.relevantDocuments;
        const standardTextEditor = container.resolve(StandardTextEditor);

        for (const fileName of closedTextEditors) {
            if (fileName === standardTextEditor.fileName) {
                standardTextEditor.isOpen = false;
            }
        }

        return true;
    }
}
