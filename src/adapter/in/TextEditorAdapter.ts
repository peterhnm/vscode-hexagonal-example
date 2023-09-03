import {
    CancellationToken,
    CustomTextEditorProvider,
    TextDocument,
    Uri,
    Webview,
    WebviewPanel,
    workspace,
} from "vscode";
import { inject, injectable } from "tsyringe";

import { SyncWebviewQuery, SyncWebviewUseCase } from "port/in/syncWebview";
import { SyncDocumentQuery, SyncDocumentUseCase } from "port/in/syncDocument";
import { MessageType } from "common/webview";

@injectable()
export class TextEditorAdapter implements CustomTextEditorProvider {
    private updateFrom: UpdateFrom = UpdateFrom.NULL;

    constructor(
        private readonly extensionUri: Uri,
        @inject("SyncWebviewUseCase")
        private readonly syncWebviewUseCase: SyncWebviewUseCase,
        @inject("SyncDocumentUseCase")
        private readonly syncDocumentUseCase: SyncDocumentUseCase,
    ) {}

    async resolveCustomTextEditor(
        document: TextDocument,
        webviewPanel: WebviewPanel,
        token: CancellationToken,
    ): Promise<void> {
        // Webview configuration
        webviewPanel.webview.options = { enableScripts: true };
        webviewPanel.webview.html = getHtml(webviewPanel.webview, this.extensionUri);

        // Sync webview to document
        webviewPanel.webview.onDidReceiveMessage(async (message) => {
            if (this.updateFrom === UpdateFrom.DOCUMENT) {
                this.updateFrom = UpdateFrom.NULL;
                return;
            }

            if (message.type === MessageType.UPDATE) {
                const syncDocumentQuery = new SyncDocumentQuery(document, message);

                if (await this.syncDocumentUseCase.sync(syncDocumentQuery)) {
                    this.updateFrom = UpdateFrom.WEBVIEW;
                }
            }
        });

        // Sync document to webview
        workspace.onDidChangeTextDocument(async (event) => {
            if (this.updateFrom === UpdateFrom.WEBVIEW) {
                this.updateFrom = UpdateFrom.NULL;
                return;
            }

            if (document.fileName === event.document.fileName) {
                const syncWebviewQuery = new SyncWebviewQuery(
                    webviewPanel.webview,
                    event.document.getText(),
                );

                if (await this.syncWebviewUseCase.sync(syncWebviewQuery)) {
                    this.updateFrom = UpdateFrom.DOCUMENT;
                }
            }
        });
    }
}

enum UpdateFrom {
    NULL = "",
    WEBVIEW = "webview",
    DOCUMENT = "document",
}

function getHtml(webview: Webview, extensionUri: Uri): string {
    const baseUri = Uri.joinPath(extensionUri, "dist", "client");

    const scriptUri = webview.asWebviewUri(Uri.joinPath(baseUri, "index.js"));
    const styleUri = webview.asWebviewUri(Uri.joinPath(baseUri, "index.css"));

    const nonce = getNonce();

    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8" />

                <meta http-equiv="Content-Security-Policy" content="default-src 'none';
                    style-src ${webview.cspSource} 'unsafe-inline';
                    img-src ${webview.cspSource} data:;
                    font-src ${webview.cspSource} data:;
                    script-src 'nonce-${nonce}';"/>

                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

                <link href="${styleUri}" rel="stylesheet" type="text/css" />

                <title>Hexagonal Texteditor Example</title>
            </head>
            <body>
                <div id="app"></div>
                <script type="text/javascript" src="${scriptUri}" nonce="${nonce}"></script>
            </body>
            </html>
        `;
}

function getNonce(): string {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
