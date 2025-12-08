import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
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
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        assertIsNotNullOrUndefined(cn);
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        assertIsNotNullOrUndefined(cn);
        IllegalArgumentException.assert(this.hasChildNode(cn));
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    protected override findNodesHelper(bn:string, s:Set<Node>){
        if(bn === this.doGetBaseName()){
            s.add(this);
        }

        for(const child of this.childNodes){
            if(child instanceof Directory){
                child.findNodesHelper(bn,s);
            }
            else{
                InvalidStateException.assert(child.getBaseName() !== "");
                if(bn === child.getBaseName()){
                    s.add(child);
                }
            }
        }
    }

}