
export interface TextEditorUseCase {
    toggle(): Promise<boolean>;

    close(textEditorCommand: TextEditorCommand): Promise<boolean>;
}

export class TextEditorCommand {
    private readonly DOCUMENT_EXTENSION: string = ".hex";

    constructor(closedTextDocuments: string[]) {
        if (!this.validate(closedTextDocuments)) {
            throw new Error("Invalid closed editors");
        }

        this._relevantDocuments = this.filterRelevantDocuments(closedTextDocuments);
    }

    private readonly _relevantDocuments: string[];

    get relevantDocuments(): string[] {
        return this._relevantDocuments;
    }

    private validate(closedTextDocuments: string[]): boolean {
        return closedTextDocuments.length > 0;
    }

    /**
     * Filter out the closed editors that are not .hex files
     * @param closedTextDocuments - The closed editors
     * @returns The closed editors that are .hex files
     * @private
     */
    private filterRelevantDocuments(closedTextDocuments: string[]): string[] {
        const relevantDocuments: string[] = [];
        for (const document of closedTextDocuments) {
            if (document.endsWith(this.DOCUMENT_EXTENSION)) {
                relevantDocuments.push(document);
            }
        }
        return relevantDocuments;
    }
}
