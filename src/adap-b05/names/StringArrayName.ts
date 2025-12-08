import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { assertComponentProperlyMasked, assertIsValidIndex } from "./helpers";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

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

    public setComponent(i: number, c: string): void {
        assertIsValidIndex(i, this.getNoComponents());
        assertComponentProperlyMasked(c, this.delimiter);
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        assertIsValidIndex(i, this.getNoComponents() + 1);
        assertComponentProperlyMasked(c, this.delimiter);
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        assertComponentProperlyMasked(c, this.delimiter);
        this.components.push(c);
    }

    public remove(i: number): void {
        assertIsValidIndex(i, this.getNoComponents());
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for(let i = 0; i < other.getNoComponents(); i++){
            assertComponentProperlyMasked(other.getComponent(i), this.delimiter);
            this.append(other.getComponent(i));
        }
    }
}