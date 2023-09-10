import { TextDocument, Uri, Webview, WebviewPanel } from "vscode";
import { inject, injectable } from "tsyringe";

import { MessageType } from "common/webview";
import {
    EXTENSION_CONTEXT,
    setUpdateFrom,
    UpdateFrom,
    updateFrom,
} from "common/helpers";
import {
    ActiveDocumentCommand,
    ActiveDocumentUseCase,
    SyncDocumentCommand,
    SyncDocumentUseCase,
} from "port/in/document";

@injectable()
export class WebviewAdapter {
    constructor(
        private readonly webviewPanel: WebviewPanel,
        private readonly document: TextDocument,
        @inject("SyncDocumentUseCase")
        private readonly syncDocumentUseCase: SyncDocumentUseCase,
        @inject("ActiveEditorUseCase")
        private readonly activeEditorUseCase: ActiveDocumentUseCase,
    ) {
        this.webviewPanel.webview.options = { enableScripts: true };
        this.webviewPanel.webview.html = getHtml(
            webviewPanel.webview,
            EXTENSION_CONTEXT.getContext().extensionUri,
        );

        // TODO: Maybe not the right place for this?
        // Initial setup of document
        this.activeEditorUseCase.setActiveDocument(
            new ActiveDocumentCommand(this.document),
        );

        this.registerEvents();
    }

    private registerEvents() {
        // Sync webview with document
        this.webviewPanel.webview.onDidReceiveMessage(async (message) => {
            if (updateFrom === UpdateFrom.DOCUMENT) {
                setUpdateFrom(UpdateFrom.NULL);
                return;
            }
            setUpdateFrom(UpdateFrom.WEBVIEW);

            if (message.type === MessageType.UPDATE) {
                const syncDocumentQuery = new SyncDocumentCommand(
                    this.document,
                    message,
                );
                this.syncDocumentUseCase.sync(syncDocumentQuery);
            }
        });

        this.webviewPanel.onDidChangeViewState((event) => {
            if (event.webviewPanel.active) {
                const activeDocumentCommand = new ActiveDocumentCommand(this.document);
                this.activeEditorUseCase.setActiveDocument(activeDocumentCommand);
            }
        });
    }
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
