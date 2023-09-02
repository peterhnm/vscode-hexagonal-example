import { Webview } from "vscode";
import { WebviewPort } from "port/out/WebviewPort";
import { WebviewMessage } from "common/webview";

export class WebviewAdapter implements WebviewPort {
    async postMessage(webview: Webview, message: WebviewMessage<any>): Promise<boolean> {
        return webview.postMessage(message);
    }
}
