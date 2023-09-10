import { container, inject, injectable } from "tsyringe";

import { TextEditorCommand, TextEditorUseCase } from "port/in/textEditor";
import { DocumentPort, TextEditorPort } from "port/out";
import { StandardTextEditor } from "../model/StandardTextEditor";

@injectable()
export class TextEditorService implements TextEditorUseCase {
    constructor(
        @inject("DocumentPort")
        private readonly documentPort: DocumentPort,
        @inject("TextEditorPort")
        private readonly textEditorPort: TextEditorPort,
    ) {}

    async toggle(): Promise<boolean> {
        const document = this.documentPort.getActiveDocument();
        const textEditor = container.resolve(StandardTextEditor);

        if (textEditor.isOpen) {
            if (await this.textEditorPort.closeTextEditor(document.fileName)) {
                textEditor.isOpen = false;
                textEditor.fileName = "";
            }
            return textEditor.isOpen;
        }

        textEditor.isOpen = true;
        textEditor.fileName = await this.textEditorPort.createTextEditor(document);
        return textEditor.isOpen;
    }

    async close(textEditorCommand: TextEditorCommand): Promise<boolean> {
        const standardTextEditor = container.resolve(StandardTextEditor);
        const closedEditors = textEditorCommand.closedEditors;

        for (const fileName of closedEditors) {
            if (fileName === standardTextEditor.fileName) {
                standardTextEditor.isOpen = false;
            }
        }

        return true;
    }
}
