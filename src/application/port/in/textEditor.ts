import { Tab, TabInputText } from "vscode";

export interface TextEditorUseCase {
    toggle(): Promise<boolean>;

    close(textEditorCommand: TextEditorCommand): Promise<boolean>;
}

export class TextEditorCommand {
    constructor(private readonly _closedTabs: Readonly<Tab[]>) {
        if (!this.validate()) {
            throw new Error("Invalid text editors");
        }

        this.filterClosedEditors();
    }

    private _closedEditors: string[] = [];

    get closedEditors(): string[] {
        return this._closedEditors;
    }

    private validate(): boolean {
        return true;
    }

    private filterClosedEditors() {
        this._closedTabs.forEach((tab) => {
            if (tab.input instanceof TabInputText) {
                this._closedEditors.push(tab.input.uri.path);
            }
        });
    }
}
