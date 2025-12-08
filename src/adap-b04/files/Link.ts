import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { assertIsNotNullOrUndefined } from "../names/helpers";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        assertIsNotNullOrUndefined(bn);
        assertIsNotNullOrUndefined(pn);
        IllegalArgumentException.assert(typeof bn === "string", "basename must be of type string");
        IllegalArgumentException.assert(pn instanceof Directory);
        super(bn, pn);

        if (tn != undefined) {
            IllegalArgumentException.assert(tn instanceof Node);
            IllegalArgumentException.assert(tn !== this);
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        assertIsNotNullOrUndefined(target);
        IllegalArgumentException.assert(target instanceof Node);
        IllegalArgumentException.assert(target !== this);

        this.targetNode = target;
    }

    public getBaseName(): string {
        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public rename(bn: string): void {
        assertIsNotNullOrUndefined(bn);
        IllegalArgumentException.assert(typeof bn === "string" && bn.length > 0);

        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);
    }

    protected ensureTargetNode(target: Node | null): Node {
        const result: Node = this.targetNode as Node;
        return result;
    }
}