import { commands, window } from "vscode";
import { inject, singleton } from "tsyringe";

import { TextEditorCommand, TextEditorUseCase } from "port/in/textEditor";
import { EXTENSION_CONTEXT } from "common/helpers";

@singleton()
export class TextEditorAdapter {
    constructor(
        @inject("TextEditorUseCase")
        private readonly textEditorUseCase: TextEditorUseCase,
    ) {
        const command = commands.registerCommand(
            "vscode-hexagonal.toggleTextEditor",
            () => {
                this.textEditorUseCase.toggle();
            },
        );

        this.registerEvents();

        EXTENSION_CONTEXT.getContext().subscriptions.push(command);
    }

    private registerEvents() {
        window.tabGroups.onDidChangeTabs((tabs) => {
            const textEditorCommand = new TextEditorCommand(tabs.closed);
            this.textEditorUseCase.close(textEditorCommand);
        });
    }
}
