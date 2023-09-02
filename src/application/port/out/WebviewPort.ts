import { Webview } from "vscode";
import { WebviewMessage } from "common/webview";

export interface WebviewPort {
    postMessage(webview: Webview, message: WebviewMessage<any>): Promise<boolean>;
}
