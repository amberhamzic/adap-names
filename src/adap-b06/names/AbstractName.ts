import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if (delimiter.length !== 1) {
            throw new IllegalArgumentException("delimiter has to be one character");
        }
        this.delimiter = delimiter;
    }

    public clone(): Name {
        return this;
    }

    public asString(delimiter: string = this.delimiter): string {
        if(delimiter.length !== 1){
            throw new IllegalArgumentException("delimiter has to be one character")
        }

        const name_components = [];
        for(let i = 0; i < this.getNoComponents(); i++){
            name_components.push(this.getComponent(i));
        }
        
        return name_components
            .map(c => c.replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER))
            .map(c => c.replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter))
            .join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const name_components = [];
        for(let i = 0; i < this.getNoComponents(); i++){
            name_components.push(this.getComponent(i));
        }
        if(this.delimiter === DEFAULT_DELIMITER){
            return name_components.join(DEFAULT_DELIMITER);
        }

        return name_components
            .map(c => c.replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter))
            .map(c => c.replaceAll(DEFAULT_DELIMITER, ESCAPE_CHARACTER + DEFAULT_DELIMITER))
            .join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        if(this === other) return true;

        if(this.getNoComponents() != other.getNoComponents()) return false;

        return this.getDelimiterCharacter() === other.getDelimiterCharacter() && this.asDataString() === other.asDataString();
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString() + this.getDelimiterCharacter();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): Name;

    abstract insert(i: number, c: string): Name;
    abstract append(c: string): Name;
    abstract remove(i: number): Name;

    public concat(other: Name): Name {
        let concatName = this.clone();

        const otherComponents: string[] = [];
        for (let i = 0; i < other.getNoComponents(); i++) {
            if(other.getDelimiterCharacter() !== this.delimiter){
                otherComponents.push(other.getComponent(i).replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter));
            }
            else{
                otherComponents.push(other.getComponent(i));
            }
        }

        for(let i = 0; i < otherComponents.length; i++){
            concatName = concatName.append(otherComponents[i]);
        }

        return concatName;
    }

}