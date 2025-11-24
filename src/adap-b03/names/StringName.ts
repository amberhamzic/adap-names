import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { assertIsValidIndex} from "./helpers";


export class StringName extends AbstractName {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);

        this.name = source;

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

    public clone(): Name {
        let nameClone = new StringName(this.name, this.delimiter);
        if(this.noComponents === 0){
            nameClone.remove(0);
        }

        return nameClone;
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
}