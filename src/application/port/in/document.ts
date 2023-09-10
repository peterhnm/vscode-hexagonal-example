import { TextDocument } from "vscode";
import { WebviewMessage } from "common/webview";

export interface SyncDocumentUseCase {
    sync(syncDocumentQuery: SyncDocumentCommand): Promise<boolean>;
}

export interface ActiveDocumentUseCase {
    setActiveDocument(activeDocumentCommand: ActiveDocumentCommand): boolean;
}

export class SyncDocumentCommand {
    constructor(
        private readonly _document: TextDocument,
        message: WebviewMessage<any>,
    ) {
        if (!(this.validate(/*message*/))) {
            throw new Error("Invalid message");
        }

        this.mapMessageToContent(message);
    }

    private _content: string | undefined;

    public get content(): string {
        if (!this._content) {
            throw new Error("Content is undefined");
        }
        return this._content;
    }

    public get document(): TextDocument {
        return this._document;
    }

    private validate(/*message: WebviewMessage<any>*/): boolean {
        return true;
    }

    private mapMessageToContent(message: WebviewMessage<any>): void {
        this._content = JSON.stringify(message.data);
    }
}

export class ActiveDocumentCommand {
    constructor(private readonly _document: TextDocument) {
        if (!this.validate()) {
            throw new Error("Invalid document");
        }
    }

    public get document(): TextDocument {
        return this._document;
    }

    public validate(): boolean {
        return true;
    }
}
