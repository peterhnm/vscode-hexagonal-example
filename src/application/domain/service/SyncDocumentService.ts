import { inject, injectable } from "tsyringe";

import { SyncDocumentCommand, SyncDocumentUseCase } from "port/in/document";
import { DocumentPort, LoggerPort } from "port/out";

@injectable()
export class SyncDocumentService implements SyncDocumentUseCase {
    constructor(
        @inject("LoggerPort") private readonly loggerPort: LoggerPort,
        @inject("DocumentPort") private readonly documentPort: DocumentPort,
    ) {}

    async sync(syncDocumentQuery: SyncDocumentCommand): Promise<boolean> {
        if (
            await this.documentPort.write(
                syncDocumentQuery.document,
                syncDocumentQuery.content,
            )
        ) {
            return await this.documentPort.save(syncDocumentQuery.document);
        }
        // TODO: Handle error
        return false;
    }
}
