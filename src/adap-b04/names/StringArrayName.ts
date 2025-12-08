import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { assertComponentProperlyMasked, assertIsNotNullOrUndefined, assertIsValidIndex } from "./helpers";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter);

        if(!Array.isArray(other)){
            throw new IllegalArgumentException("other must be an array");
        }

        for(const s of other){
            assertComponentProperlyMasked(s, this.delimiter);
        }

        this.components = [...other];
    }

    public getNoComponents(): number {
        this.assertClassInvariant();

        const noComps = this.components.length;

        MethodFailedException.assert(noComps >= 0, "noComponents cannot be negative");

        return noComps;
    }

    public getComponent(i: number): string {
        assertIsNotNullOrUndefined(i);
        assertIsValidIndex(i, this.getNoComponents());

        this.assertClassInvariant();

        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        assertIsNotNullOrUndefined(i);
        assertIsNotNullOrUndefined(c);
        assertIsValidIndex(i, this.getNoComponents());
        assertComponentProperlyMasked(c, this.delimiter);

        this.assertClassInvariant();

        this.components[i] = c;

        MethodFailedException.assert(this.getComponent(i) === c);
    }

    public insert(i: number, c: string): void {
        assertIsNotNullOrUndefined(i);
        assertIsNotNullOrUndefined(c);
        assertIsValidIndex(i, this.getNoComponents() + 1);
        assertComponentProperlyMasked(c, this.delimiter);

        this.assertClassInvariant();

        const noComps = this.getNoComponents();

        this.components.splice(i, 0, c);

        MethodFailedException.assert(this.getComponent(i) === c);
        MethodFailedException.assert(this.getNoComponents() === noComps+1);
    }

    public append(c: string): void {
        assertIsNotNullOrUndefined(c);
        assertComponentProperlyMasked(c, this.delimiter);

        this.assertClassInvariant();
        const noComps = this.getNoComponents();

        this.components.push(c);

        MethodFailedException.assert(this.getNoComponents() === noComps+1);
    }

    public remove(i: number): void {
        assertIsNotNullOrUndefined(i);
        assertIsValidIndex(i, this.getNoComponents());
        this.assertClassInvariant();
        const noComps = this.getNoComponents();

        this.components.splice(i, 1);

        MethodFailedException.assert(this.getNoComponents() === noComps-1);
    }

    public clone(): Name{
        this.assertClassInvariant();

        let cloned = new StringArrayName([... this.components], this.delimiter);
        MethodFailedException.assert(cloned.isEqual(this), "cloned object is not equal");
        return cloned;
    }
}