import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { assertIsNotNullOrUndefined, assertIsValidIndex } from "./helpers";

export class StringArrayName extends AbstractName {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);

        assertIsNotNullOrUndefined(source);
        if(!Array.isArray(source)){
            throw new Error("invalid type source array");
        }
        for(let i = 0; i < source.length; i++){
            assertIsNotNullOrUndefined(source[i]);
        }
        this.components = [...source];
    }

    public clone(): Name{
        return new StringArrayName([... this.components], this.delimiter);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        assertIsValidIndex(i, this.getNoComponents());
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        assertIsValidIndex(i, this.getNoComponents());
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        assertIsValidIndex(i, this.getNoComponents() + 1);
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        assertIsValidIndex(i, this.getNoComponents());
        this.components.splice(i, 1);
    }
}