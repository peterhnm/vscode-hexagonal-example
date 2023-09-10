import "reflect-metadata";
import {
    CancellationToken,
    CustomTextEditorProvider,
    ExtensionContext,
    TextDocument,
    WebviewPanel,
    window,
} from "vscode";
import { container, injectable } from "tsyringe";

import { config } from "./extension.config";
import { DocumentAdapter, WebviewAdapter } from "adapter/in";
import { TextEditorAdapter } from "adapter/in/TextEditorAdapter";
import { EXTENSION_CONTEXT } from "common/helpers";

export function activate(context: ExtensionContext) {
    config();

    EXTENSION_CONTEXT.setContext(context);

    // CustomTextEditor
    const editor = window.registerCustomEditorProvider(
        "vscode-hexagonal.editor",
        new CustomTextEditor(),
    );

    // Commands
    container.resolve(TextEditorAdapter);

    EXTENSION_CONTEXT.getContext().subscriptions.push(editor);
}

export function deactivate() {}

@injectable()
class CustomTextEditor implements CustomTextEditorProvider {
    async resolveCustomTextEditor(
        document: TextDocument,
        webviewPanel: WebviewPanel,
        token: CancellationToken,
    ): Promise<void> {
        new WebviewAdapter(
            webviewPanel,
            document,
            container.resolve("SyncDocumentUseCase"),
            container.resolve("ActiveEditorUseCase"),
        );

        new DocumentAdapter(
            document,
            webviewPanel.webview,
            container.resolve("SyncWebviewUseCase"),
        );
    }
}
