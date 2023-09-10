import { container, Lifecycle } from "tsyringe";
import {
    DocumentAdapter,
    LoggerAdapter,
    TextEditorAdapter,
    WebviewAdapter,
} from "adapter/out";
import { SyncWebviewService } from "./application/domain/service/SyncWebviewService";
import { SyncDocumentService } from "./application/domain/service/SyncDocumentService";
import { TextEditorService } from "./application/domain/service/TextEditorService";
import { ActiveEditorService } from "./application/domain/service/ActiveEditorService";

export function config() {
    // Register adapters
    container.register(
        "LoggerPort",
        { useClass: LoggerAdapter },
        { lifecycle: Lifecycle.Singleton },
    );
    container.register(
        "WebviewPort",
        { useClass: WebviewAdapter },
        { lifecycle: Lifecycle.Singleton },
    );
    container.register(
        "DocumentPort",
        { useClass: DocumentAdapter },
        { lifecycle: Lifecycle.Singleton },
    );
    container.register(
        "TextEditorPort",
        { useClass: TextEditorAdapter },
        { lifecycle: Lifecycle.Singleton },
    );

    // Register services
    container.register(
        "SyncWebviewUseCase",
        { useClass: SyncWebviewService },
        { lifecycle: Lifecycle.Singleton },
    );
    container.register(
        "SyncDocumentUseCase",
        { useClass: SyncDocumentService },
        { lifecycle: Lifecycle.Singleton },
    );
    container.register(
        "ActiveEditorUseCase",
        { useClass: ActiveEditorService },
        { lifecycle: Lifecycle.Singleton },
    );
    container.register(
        "TextEditorUseCase",
        { useClass: TextEditorService },
        { lifecycle: Lifecycle.Singleton },
    );
}
