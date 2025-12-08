import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { ESCAPE_CHARACTER } from "../common/Printable";

export function unmaskComponent(component: string, delim: string, unmaskEscape: boolean = false): string {
    const escapeRegex = new RegExp(`${ESCAPE_CHARACTER}(.)`, 'g');
    return component.replace(escapeRegex, (_, escapedChar: string) => {
        if (escapedChar === ESCAPE_CHARACTER && !unmaskEscape) {
            return ESCAPE_CHARACTER + escapedChar;
        }
        return escapedChar;
    });
}

export function maskComponent(component: string, delim: string): string {
    // First handle existing escape sequences to avoid double-escaping
    const escapeRegex = new RegExp(`${ESCAPE_CHARACTER}.`, 'g');
    const alreadyEscaped = new Set<number>();
    
    let workingString = component;
    let match;
    while ((match = escapeRegex.exec(component)) !== null) {
        alreadyEscaped.add(match.index);
    }
    
    // Escape the delimiter where not already escaped
    const delimRegex = new RegExp(`(?<!${ESCAPE_CHARACTER})${delim}`, 'g');
    return workingString.replace(delimRegex, `${ESCAPE_CHARACTER}${delim}`);
}

export function assertIsValidIndex(index: number, upperBound: number): void {
    if (index < 0 || index >= upperBound) {
        throw new IllegalArgumentException("index out of bounds");
    }
}

export function assertIsNotNullOrUndefined<T>(o: T): asserts o is NonNullable<T> {
    if (o === null || o === undefined) {
        throw new IllegalArgumentException("object null or undefined");
    }
}

export function assertComponentProperlyMasked(c: string, delimiter : string): void {
    let s = c.replaceAll(ESCAPE_CHARACTER + delimiter, "");
    s = s.replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, "");

    if (s.includes(ESCAPE_CHARACTER) || s.includes(delimiter)) {
        throw new IllegalArgumentException(`component not properly masked: ${c}`);
    }
}