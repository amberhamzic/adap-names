import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { assertIsValidIndex, assertComponentProperlyMasked} from "./helpers";
import { IllegalArgumentException } from "../common/IllegalArgumentException";


export class StringName extends AbstractName {
    protected readonly name: string = "";
    protected readonly noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);

        this.name = source;

        // count components
        let count = 1;

        for (let i = 0; i < this.name.length; i++) {
            if(source[i] === ESCAPE_CHARACTER){
                i++;
            }
            else if(source[i] === this.delimiter){
                count++;
            }
        }

        this.noComponents = count;
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
                // Escape char followed by any character - add both to current component
                currentComponent += this.name[i] + this.name[i + 1];
                i += 2;
            } else if (this.name[i] === this.delimiter) {
                // Found unescaped delimiter
                if (currentComponent !== "" || components.length === 0) {
                    // Only push if component is not empty, or it's the first component
                    components.push(currentComponent);
                }
                currentComponent = "";
                i++;
            } else {
                // Normal character
                currentComponent += this.name[i];
                i++;
            }
        }
        
        // Push the last component (even if empty, if it's the only component)
        if (currentComponent !== "" || components.length === 0) {
            components.push(currentComponent);
        }
        
        return components;
    }

    public asString(delimiter: string = this.delimiter): string {
        if(delimiter.length !== 1){
            throw new IllegalArgumentException("delimiter must be one character")
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

    public setComponent(i: number, c: string): Name {
        assertIsValidIndex(i, this.noComponents);
        assertComponentProperlyMasked(c, this.delimiter);

        const components = this.extractComponents();
        components[i] = c;

        return new StringName(components.join(this.delimiter), this.delimiter);
    }

    public insert(n: number, c: string): Name {
        assertIsValidIndex(n, this.noComponents + 1); 
        assertComponentProperlyMasked(c, this.delimiter);

        const components = this.extractComponents();

        if(n === this.noComponents){
            let res = this.append(c);
            return res;
        }

        components.splice(n, 0, c);

        return new StringName(components.join(this.delimiter), this.delimiter);
    }

    public append(c: string): Name {
        assertComponentProperlyMasked(c, this.delimiter);

        if(this.noComponents !== 0){
            return new StringName(this.name + this.delimiter + c, this.delimiter);
        } else {
            return new StringName(c, this.delimiter);
        }
    }

    public remove(i: number): Name {
        assertIsValidIndex(i, this.noComponents);
        const components = this.extractComponents();

        components.splice(i, 1);

        return new StringName(components.join(this.delimiter), this.delimiter);
    }
}