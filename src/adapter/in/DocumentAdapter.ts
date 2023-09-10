import { TextDocument, Webview, workspace } from "vscode";
import { inject, injectable } from "tsyringe";

import { setUpdateFrom, UpdateFrom, updateFrom } from "common/helpers";
import { SyncWebviewCommand, SyncWebviewUseCase } from "port/in/webview";

@injectable()
export class DocumentAdapter {
    constructor(
        private readonly document: TextDocument,
        private readonly webview: Webview,
        @inject("SyncWebviewUseCase")
        private readonly syncWebviewUseCase: SyncWebviewUseCase,
    ) {
        this.registerEvents();
    }

    private registerEvents() {
        // Sync document with webview
        workspace.onDidChangeTextDocument(async (event) => {
            if (event.contentChanges.length === 0) {
                return;
            }
            if (updateFrom === UpdateFrom.WEBVIEW) {
                setUpdateFrom(UpdateFrom.NULL);
                return;
            }

            if (this.document.fileName === event.document.fileName) {
                const syncWebviewQuery = new SyncWebviewCommand(
                    this.webview,
                    event.document.getText(),
                );

                this.syncWebviewUseCase.sync(syncWebviewQuery);
            }
        });
    }
}
