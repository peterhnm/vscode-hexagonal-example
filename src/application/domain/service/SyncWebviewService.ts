import { inject, injectable } from "tsyringe";

import { SyncWebviewCommand, SyncWebviewUseCase } from "port/in/webview";
import { LoggerPort, WebviewPort } from "port/out";

@injectable()
export class SyncWebviewService implements SyncWebviewUseCase {
    constructor(
        @inject("LoggerPort") private logger: LoggerPort,
        @inject("WebviewPort") private webview: WebviewPort,
    ) {}

    async sync(syncWebviewQuery: SyncWebviewCommand): Promise<boolean> {
        try {
            if (
                await this.webview.postMessage(
                    syncWebviewQuery.webview,
                    syncWebviewQuery.message,
                )
            ) {
                return true;
            }
            // TODO: Add retry logic
            return false;
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }
}
