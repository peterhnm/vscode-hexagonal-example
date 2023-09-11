import {commands, TabInputText, window} from "vscode";
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

        this.onDidCloseTextEditor();

        EXTENSION_CONTEXT.getContext().subscriptions.push(command);
    }

    private onDidCloseTextEditor() {
        window.tabGroups.onDidChangeTabs((tabs) => {
            const closedTextEditors: string[] = [];
            for (const tab of tabs.closed) {
                if (tab.input instanceof TabInputText) {
                    closedTextEditors.push(tab.input.uri.path);
                }
            }
            const textEditorCommand = new TextEditorCommand(closedTextEditors);
            this.textEditorUseCase.close(textEditorCommand);
        });
    }
}
