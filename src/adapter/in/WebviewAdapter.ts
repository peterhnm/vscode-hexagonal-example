import { TextDocument, Uri, Webview } from "vscode";
import { inject, injectable } from "tsyringe";

import { MessageType } from "common/webview";
import {
    EXTENSION_CONTEXT,
    setUpdateFrom,
    UpdateFrom,
    updateFrom,
} from "common/helpers";
import {
    // ActiveDocumentCommand,
    // ActiveDocumentUseCase,
    SyncDocumentCommand,
    SyncDocumentUseCase,
} from "port/in/document";
import {InitWebviewCommand, InitWebviewUseCase} from "port/in/webview";
// import {ActiveWebviewCommand, ActiveWebviewUseCase} from "port/in/webview";

@injectable()
export class WebviewAdapter {
    constructor(
        webview: Webview,
        document: TextDocument,
        @inject("InitWebviewUseCase") private readonly initWebviewUseCase: InitWebviewUseCase,
        @inject("SyncDocumentUseCase") private readonly syncDocumentUseCase: SyncDocumentUseCase,
        // @inject("ActiveWebviewUseCase") private readonly activeWebviewUseCase: ActiveWebviewUseCase,
        // @inject("ActiveEditorUseCase") private readonly activeEditorUseCase: ActiveDocumentUseCase,
    ) {
        // this.webview.options = { enableScripts: true };
        // this.webview.html = getHtml(
        //     webview,
        //     EXTENSION_CONTEXT.getContext().extensionUri,
        // );

        // // Initial setup of the document and webview
        // this.activeEditorUseCase.setActiveDocument(
        //     new ActiveDocumentCommand(this.document),
        // );
        // this.activeWebviewUseCase.setActiveWebview(
        //     new ActiveWebviewCommand(this.document.fileName, this.webviewPanel.webview),
        // );

        this.initWebview(webview, document);
        this.onDidReceiveMessage(webview, document);
    }

    private initWebview(webview: Webview, document: TextDocument) {
        webview.options = { enableScripts: true };
        webview.html = getHtml(
            webview,
            EXTENSION_CONTEXT.getContext().extensionUri,
        );
        const initWebviewCommand = new InitWebviewCommand(document.fileName, document.getText());
        this.initWebviewUseCase.initWebview(initWebviewCommand);
    }

    private onDidReceiveMessage(webview: Webview, document: TextDocument) {
        // Sync webview with a document
        webview.onDidReceiveMessage(async (message) => {
            if (updateFrom === UpdateFrom.DOCUMENT) {
                setUpdateFrom(UpdateFrom.NULL);
                return;
            }
            setUpdateFrom(UpdateFrom.WEBVIEW);

            if (message.type === MessageType.UPDATE) {
                const syncDocumentCommand = new SyncDocumentCommand(
                    document.fileName,
                    message,
                );
                this.syncDocumentUseCase.sync(syncDocumentCommand);
            }
        });

        // this.webviewPanel.onDidChangeViewState((event) => {
        //     if (event.webviewPanel.active) {
        //         const activeDocumentCommand = new ActiveDocumentCommand(this.document);
        //         this.activeEditorUseCase.setActiveDocument(activeDocumentCommand);

        //         const activeWebviewCommand =
        //             new ActiveWebviewCommand(this.document.fileName, event.webviewPanel.webview);
        //         this.activeWebviewUseCase.setActiveWebview(activeWebviewCommand);
        //     }
        // });
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
