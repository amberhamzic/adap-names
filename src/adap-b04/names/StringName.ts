import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { assertIsValidIndex, assertComponentProperlyMasked, assertIsNotNullOrUndefined} from "./helpers";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";


export class StringName extends AbstractName {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);

        assertIsNotNullOrUndefined(source);
        if(typeof source !== "string"){
            throw new IllegalArgumentException("source must be of type string");
        }
        
        let escaped = false;

        // check if StringName is properly masked
        for(let i = 0; i < source.length; i++){
            if(escaped === true){
                escaped = false;
            }
            else if(source[i] === ESCAPE_CHARACTER){
                escaped = true;
            }
        }
        if(escaped){
            throw new IllegalArgumentException("source not properly masked");
        }

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

    public getNoComponents(): number {
        this.assertClassInvariant();
        return this.noComponents;
    }

    public getComponent(x: number): string {
        assertIsNotNullOrUndefined(x);
        assertIsValidIndex(x, this.getNoComponents());
        this.assertClassInvariant();
        const components = this.extractComponents();

        return x < components.length ? components[x] : '';
    }

    public setComponent(i: number, c: string): void {
        assertIsNotNullOrUndefined(i);
        assertIsNotNullOrUndefined(c);
        assertIsValidIndex(i, this.noComponents);
        assertComponentProperlyMasked(c, this.delimiter);
        this.assertClassInvariant();

        const components = this.extractComponents();
        components[i] = c;
        this.name = components.join(this.delimiter);

        MethodFailedException.assert(this.getComponent(i) === c, "component was not set correctly");
    }

    public insert(n: number, c: string): void {
        assertIsNotNullOrUndefined(c);
        assertIsNotNullOrUndefined(n);
        IllegalArgumentException.assert(typeof c === "string");
        assertIsValidIndex(n, this.noComponents + 1); 
        assertComponentProperlyMasked(c, this.delimiter);
        this.assertClassInvariant();
        const noComps = this.getNoComponents();

        const components = this.extractComponents();

        if(n === this.noComponents){
            this.append(c);
            return;
        }

        components.splice(n, 0, c);

        this.name = components.join(this.delimiter);
        this.noComponents++;

        MethodFailedException.assert(this.getComponent(n) === c, "insertion did not set component correctly");
        MethodFailedException.assert(this.getNoComponents() === noComps+1, "noComponents not increased by 1 after insert");
    }

    public append(c: string): void {
        assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assert(typeof c === "string");
        assertComponentProperlyMasked(c, this.delimiter);
        this.assertClassInvariant();
        const noComps = this.getNoComponents();

        if(this.noComponents !== 0){
            this.name += this.delimiter + c;
        } else {
            this.name = c;
        }
        this.noComponents++;

        MethodFailedException.assert(this.getComponent(noComps) === c, "append did not set component correctly");
        MethodFailedException.assert(this.getNoComponents() === noComps+1, "noComponents not increased by 1 after insert");
    }

    public remove(i: number): void {
        assertIsValidIndex(i, this.noComponents);
        this.assertClassInvariant();
        const components = this.extractComponents();
        const noComps = this.getNoComponents();

        components.splice(i, 1);

        this.name = components.join(this.delimiter);
        this.noComponents--;

        MethodFailedException.assert(this.getNoComponents() === noComps-1, "noComponents not decreased by 1 after remove");
    }

    public clone(): Name {
        this.assertClassInvariant();
        let cloned = new StringName(this.name, this.delimiter);
        if(this.isEmpty()){
            cloned.remove(0);
        }

        MethodFailedException.assert(this.isEqual(cloned), "Clone is not equal");

        return cloned;
    }
}