import "reflect-metadata";
import { container, Lifecycle } from "tsyringe";
import { DocumentAdapter, LoggerAdapter, WebviewAdapter } from "adapter/out";
import { SyncWebviewService } from "./application/domain/service/SyncWebviewService";
import { SyncDocumentService } from "./application/domain/service/SyncDocumentService";

export function config() {
    // Register adapters
    container.register("LoggerPort", { useClass: LoggerAdapter });
    container.register("WebviewPort", { useClass: WebviewAdapter });
    container.register("DocumentPort", { useClass: DocumentAdapter });

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
}
