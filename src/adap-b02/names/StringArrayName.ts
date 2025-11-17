import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { assertIsValidIndex } from "./helpers";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        if(delimiter === null) {
            throw new Error("invalid delim");
        }
        if(delimiter !== undefined){
            if(delimiter.length !== 1) throw new Error("delim must be one character");
            this.delimiter = delimiter;
        }

        this.components = [...other];
    }

    public asString(delimiter: string = this.delimiter): string {
        if(delimiter.length !== 1){
            throw new Error("delim must be one character");
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

    public concat(other: Name): void {
        let delim = other.getDelimiterCharacter();
        for(let i = 0; i < other.getNoComponents(); i++){
            if(this.delimiter !== other.getDelimiterCharacter()){
                this.append(other.getComponent(i).replaceAll(ESCAPE_CHARACTER + delim, delim)
                            .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter));
            }
            else{
                this.append(other.getComponent(i));
            }
        }
    }
}