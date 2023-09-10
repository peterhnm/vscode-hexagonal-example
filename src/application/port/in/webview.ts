import { Webview } from "vscode";
import { MessageType, WebviewMessage } from "common/webview";

export interface SyncWebviewUseCase {
    sync(syncWebviewCommand: SyncWebviewCommand): Promise<boolean>;
}

export class SyncWebviewCommand {
    constructor(
        private readonly _webview: Webview,
        content: string,
    ) {
        if (!(this.validate(/*content*/))) {
            throw new Error("Invalid content");
        }

        this.mapContentToMessage(content);
    }

    // FIXME: change any to a proper type
    private _message: WebviewMessage<any> | undefined;

    public get message(): WebviewMessage<any> {
        if (!this._message) {
            throw new Error("Message is undefined");
        }
        return this._message;
    }

    public get webview(): Webview {
        return this._webview;
    }

    private validate(/*data: string*/): boolean {
        return true;
    }

    private mapContentToMessage(data: string): any {
        this._message = {
            type: MessageType.UPDATE,
            data,
        };
    }
}
