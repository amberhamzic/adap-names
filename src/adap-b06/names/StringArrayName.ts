import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { assertComponentProperlyMasked, assertIsValidIndex } from "./helpers";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {
    protected readonly components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter);

        this.components = [...other];
    }

    public asString(delimiter: string = this.delimiter): string {
        if(delimiter.length !== 1){
            throw new IllegalArgumentException("delim must be one character");
        }

        return this.components
            .map(c => c.replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER))
            .map(c => c.replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter))
            .join(delimiter);
    }

    public asDataString(): string {
        if(this.delimiter === DEFAULT_DELIMITER){
            return this.components.join(DEFAULT_DELIMITER);
        }

        return this.components
            .map(c => c.replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter))
            .map(c => c.replaceAll(DEFAULT_DELIMITER, ESCAPE_CHARACTER + DEFAULT_DELIMITER))
            .join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        if(this.getNoComponents() === 0) return true;
        return false;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        assertIsValidIndex(i, this.getNoComponents());
        return this.components[i];
    }

    public setComponent(i: number, c: string): Name {
        assertIsValidIndex(i, this.getNoComponents());
        assertComponentProperlyMasked(c, this.delimiter);

        const comps = [...this.components];
        comps[i] = c;
        return new StringArrayName(comps, this.delimiter);
    }

    public insert(i: number, c: string): Name {
        assertIsValidIndex(i, this.getNoComponents() + 1);
        assertComponentProperlyMasked(c, this.delimiter);

        const comps = [...this.components];
        comps.splice(i, 0, c);
        return new StringArrayName(comps, this.delimiter);
    }

    public append(c: string): Name {
        assertComponentProperlyMasked(c, this.delimiter);
        
        const comps = [...this.components, c];
        return new StringArrayName(comps, this.delimiter);
    }

    public remove(i: number): Name {
        assertIsValidIndex(i, this.getNoComponents());

        const comps = [...this.components];
        this.components.splice(i, 1);
        return new StringArrayName(comps, this.delimiter);
    }
}