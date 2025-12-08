import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { assertIsNotNullOrUndefined } from "../names/helpers";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        assertIsNotNullOrUndefined(baseName);
        assertIsNotNullOrUndefined(parent);
        IllegalArgumentException.assert(typeof baseName === "string");
        IllegalArgumentException.assert(parent instanceof Directory);
        super(baseName, parent);
    }

    public open(): void {
        IllegalArgumentException.assert(this.doGetFileState() === FileState.CLOSED);
        // do something
    }

    public read(noBytes: number): Int8Array {
        IllegalArgumentException.assert(this.doGetFileState() === FileState.OPEN);
        assertIsNotNullOrUndefined(noBytes);
        IllegalArgumentException.assert(Number.isInteger(noBytes) && noBytes >= 0);
        // read something
        return new Int8Array();
    }

    public close(): void {
        IllegalArgumentException.assert(this.doGetFileState() === FileState.OPEN);
        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}