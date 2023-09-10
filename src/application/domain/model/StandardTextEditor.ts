import { singleton } from "tsyringe";

@singleton()
export class StandardTextEditor {
    private _isOpen = false;

    public get isOpen(): boolean {
        return this._isOpen;
    }

    public set isOpen(value: boolean) {
        this._isOpen = value;
    }

    private _fileName: string | undefined;

    public get fileName(): string {
        if (!this._fileName) {
            throw new Error("No text editor set");
        }
        return this._fileName;
    }

    public set fileName(value: string) {
        this._fileName = value;
    }
}
