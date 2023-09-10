import { inject, injectable } from "tsyringe";

import { ActiveDocumentCommand, ActiveDocumentUseCase } from "port/in/document";
import { DocumentPort } from "port/out";

@injectable()
export class ActiveEditorService implements ActiveDocumentUseCase {
    constructor(
        @inject("DocumentPort")
        private readonly documentPort: DocumentPort,
    ) {}

    // TODO: Maybe call the Out-Adapter directly?
    setActiveDocument(activeDocumentCommand: ActiveDocumentCommand): boolean {
        return this.documentPort.setActiveDocument(activeDocumentCommand.document);
    }
}
