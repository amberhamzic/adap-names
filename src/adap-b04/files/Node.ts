import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { assertIsNotNullOrUndefined } from "../names/helpers";
import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        assertIsNotNullOrUndefined(bn);
        assertIsNotNullOrUndefined(pn);
        IllegalArgumentException.assert(typeof bn === "string");

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
        IllegalArgumentException.assert(typeof bn === "string" && bn.length > 0);

        for(const child of (this.getParentNode() as any).childNodes){
            if(child.getBaseName() === bn){
                throw new IllegalArgumentException("same name already exists inside dir");
            }
        }

        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        assertIsNotNullOrUndefined(bn);
        IllegalArgumentException.assert(typeof bn === "string" && bn.length > 0);

        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

}
