import "reflect-metadata";
import { ExtensionContext, window } from "vscode";
import { container } from "tsyringe";

import { config } from "./extension.config";
import { TextEditorAdapter } from "adapter/in/TextEditorAdapter";

export function activate(context: ExtensionContext) {
    config();
    const editor = new TextEditorAdapter(
        context.extensionUri,
        container.resolve("SyncWebviewUseCase"),
        container.resolve("SyncDocumentUseCase"),
    );
    const registry = window.registerCustomEditorProvider(
        "vscode-hexagonal-example",
        editor,
    );
    context.subscriptions.push(registry);
}

export function deactivate() {}
