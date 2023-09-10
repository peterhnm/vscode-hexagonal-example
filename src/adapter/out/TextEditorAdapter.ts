import { TextEditorPort } from "port/out/TextEditorPort";
import {
    Tab,
    TabInputText,
    TextDocument,
    TextDocumentShowOptions,
    ViewColumn,
    window,
} from "vscode";

export class TextEditorAdapter implements TextEditorPort {
    async createTextEditor(document: TextDocument): Promise<string> {
        const textEditor = await window.showTextDocument(
            document,
            this.getShowOptions(),
        );
        return textEditor.document.fileName;
    }

    async closeTextEditor(fileName: string): Promise<boolean> {
        const tab = this.findTab(fileName);

        if (!tab) {
            return true;
        }

        return window.tabGroups.close(tab);
    }

    /**
     * Get the tab with the correct text editor.
     * @param fileName - The file name of the document controlled by the text editor.
     * @returns The tab with the correct text editor.
     * @private
     */
    private findTab(fileName: string): Tab | undefined {
        for (const tabGroup of window.tabGroups.all) {
            for (const tab of tabGroup.tabs) {
                if (
                    tab.input instanceof TabInputText &&
                    tab.input.uri.path === fileName
                ) {
                    return tab;
                }
            }
        }
        return undefined;
    }

    /**
     * Dependent on the user settings returns the right options where the standard text editor should be displayed.
     * @param config - The user settings.
     * @returns The options where the standard text editor should be displayed.
     * @private
     */
    private getShowOptions(config = "Group"): TextDocumentShowOptions {
        switch (config) {
            case "Group": {
                return {
                    preserveFocus: true,
                    preview: true,
                    viewColumn: ViewColumn.Beside,
                };
            }
            case "Tab": {
                return {
                    preserveFocus: false,
                    preview: false,
                    viewColumn: ViewColumn.Active,
                };
            }
            default: {
                return {};
            }
        }
    }
}
