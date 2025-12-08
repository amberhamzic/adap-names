import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { assertIsNotNullOrUndefined } from "../names/helpers";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        assertIsNotNullOrUndefined(bn);
        assertIsNotNullOrUndefined(pn);
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        assertIsNotNullOrUndefined(cn);
        IllegalArgumentException.assert(cn instanceof Node);
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        assertIsNotNullOrUndefined(cn);
        IllegalArgumentException.assert(cn instanceof Node);
        IllegalArgumentException.assert(cn !== this && !this.hasChildNode(cn));
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        assertIsNotNullOrUndefined(cn);
        IllegalArgumentException.assert(cn instanceof Node);
        IllegalArgumentException.assert(this.hasChildNode(cn));
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

}