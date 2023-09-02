import { inject, injectable } from "tsyringe";

import { SyncDocumentQuery, SyncDocumentUseCase } from "port/in/syncDocument";
import { DocumentPort, LoggerPort } from "port/out";

@injectable()
export class SyncDocumentService implements SyncDocumentUseCase {
    constructor(
        @inject("LoggerPort") private readonly loggerPort: LoggerPort,
        @inject("DocumentPort") private readonly documentPort: DocumentPort,
    ) {}

    async sync(syncDocumentQuery: SyncDocumentQuery): Promise<boolean> {
        if (
            await this.documentPort.write(
                syncDocumentQuery.document,
                syncDocumentQuery.content,
            )
        ) {
            return true;
        }
        // TODO: Handle error
        return false;
    }
}
