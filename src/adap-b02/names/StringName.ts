import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { assertIsValidIndex} from "./helpers";


export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.name = source;

        if(delimiter === null) {
            throw new Error("invalid delim");
        }
        if(delimiter !== undefined){
            if(delimiter.length !== 1) throw new Error("delim must be one character");
            this.delimiter = delimiter;
        }

        // count components
        this.noComponents = 1;

        for (let i = 0; i < this.name.length; i++) {
            if(source[i] === ESCAPE_CHARACTER){
                i++;
            }
            else if(source[i] === this.delimiter){
                this.noComponents++;
            }
        }
    }

    private extractComponents(): string[] {
        if (this.name === "") {
            return [""];  // Special case: empty string = one empty component
        }

        const components: string[] = [];
        let currentComponent = "";
        let i = 0;

        while (i < this.name.length) {
            if (this.name[i] === ESCAPE_CHARACTER && i + 1 < this.name.length) {
                currentComponent += this.name[i] + this.name[i + 1];
                i += 2;
            } else if (this.name[i] === this.delimiter) {
                if (currentComponent !== "" || components.length === 0) {
                    components.push(currentComponent);
                }
                currentComponent = "";
                i++;
            } else {
                currentComponent += this.name[i];
                i++;
            }
        }
        
        if (currentComponent !== "" || components.length === 0) {
            components.push(currentComponent);
        }
        
        return components;
    }

    public asString(delimiter: string = this.delimiter): string {
        if(delimiter.length !== 1){
            throw new Error("delimiter must be one character")
        }

        const name_strings : string[] = [];
        for(let i = 0; i < this.noComponents; i++){
            name_strings.push(this.getComponent(i));
        }

        return name_strings.map(c => c.replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER)
                            .replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter))
                    .join(delimiter);
    }

    public asDataString(): string {
        const name_strings = [];
        for(let i = 0; i < this.noComponents; i++){
            if(this.delimiter === DEFAULT_DELIMITER){
                name_strings.push(this.getComponent(i));
            }
            else{
                name_strings.push(this.getComponent(i).replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter)
                                .replaceAll(DEFAULT_DELIMITER, ESCAPE_CHARACTER + DEFAULT_DELIMITER));
            }
        }

        return name_strings.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        if(this.noComponents === 0) return true;
        return false;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        assertIsValidIndex(x, this.getNoComponents());
        const components = this.extractComponents();

        return x < components.length ? components[x] : '';
    }

    public setComponent(i: number, c: string): void {
        const components = this.extractComponents();
        assertIsValidIndex(i, this.noComponents);

        components[i] = c;

        this.name = components.join(this.delimiter);
    }

    public insert(n: number, c: string): void {
        const components = this.extractComponents();
        assertIsValidIndex(n, this.noComponents + 1); 

        if(n === this.noComponents){
            this.append(c);
            return;
        }

        components.splice(n, 0, c);

        this.name = components.join(this.delimiter);
        this.noComponents++;
    }

    public append(c: string): void {
        if(this.noComponents !== 0){
            this.name += this.delimiter + c;
        } else {
            this.name = c;
        }
        this.noComponents++;
    }

    public remove(i: number): void {
        const components = this.extractComponents();
        assertIsValidIndex(i, this.noComponents);

        components.splice(i, 1);

        this.name = components.join(this.delimiter);
        this.noComponents--;
    }

    public concat(other: StringName): void {
        const components = this.extractComponents();
        // Use the public interface methods instead of extractComponents()
        const otherComponents: string[] = [];
        for (let i = 0; i < other.getNoComponents(); i++) {
            if(other.getDelimiterCharacter() !== this.delimiter){
                otherComponents.push(other.getComponent(i).replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter));
            }
            else{
                otherComponents.push(other.getComponent(i));
            }
        }

        const allComponents = [...components, ...otherComponents];

        this.name = allComponents.join(this.delimiter);
        this.noComponents += other.getNoComponents();
    }
}