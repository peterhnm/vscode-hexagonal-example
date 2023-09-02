import * as vscode from "vscode";
import {
    CancellationToken,
    CustomTextEditorProvider,
    TextDocument,
    WebviewPanel,
} from "vscode";
import { inject, injectable } from "tsyringe";

import { SyncWebviewQuery, SyncWebviewUseCase } from "port/in/syncWebview";
import { SyncDocumentQuery, SyncDocumentUseCase } from "port/in/syncDocument";
import { MessageType } from "common/webview";

@injectable()
export class TextEditorAdapter implements CustomTextEditorProvider {
    constructor(
        @inject("SyncWebviewUseCase")
        private readonly syncWebviewUseCase: SyncWebviewUseCase,
        @inject("SyncDocumentUseCase")
        private readonly syncDocumentUseCase: SyncDocumentUseCase,
    ) {}

    resolveCustomTextEditor(
        document: TextDocument,
        webviewPanel: WebviewPanel,
        token: CancellationToken,
    ): Thenable<void> | void {
        // Sync document to webview
        vscode.workspace.onDidChangeTextDocument((event) => {
            if (document.fileName === event.document.fileName) {
                const syncWebviewQuery = new SyncWebviewQuery(
                    webviewPanel.webview,
                    event.document.getText(),
                );

                this.syncWebviewUseCase.sync(syncWebviewQuery);
            }
        });

        // Sync webview to document
        webviewPanel.webview.onDidReceiveMessage((message) => {
            if (message.type === MessageType.UPDATE) {
                const syncDocumentQuery = new SyncDocumentQuery(document, message.value);

                this.syncDocumentUseCase.sync(syncDocumentQuery);
            }
        });
    }
}
