import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { assertIsNotNullOrUndefined } from "../names/helpers";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception";


export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        assertIsNotNullOrUndefined(bn);
        assertIsNotNullOrUndefined(pn);

        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        assertIsNotNullOrUndefined(pn);

        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        assertIsNotNullOrUndefined(to);

        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        assertIsNotNullOrUndefined(bn);

        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        assertIsNotNullOrUndefined(bn);

        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        assertIsNotNullOrUndefined(bn);
        let nodes = new Set<Node>();
        try{this.findNodesHelper(bn,nodes);}
        catch(e){ throw new ServiceFailureException("findNodes", e as Exception);}

        return nodes;
    }

    protected findNodesHelper(bn:string, s:Set<Node>){
        InvalidStateException.assert(this.doGetBaseName() !== "");
    }

}