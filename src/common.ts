export type Nullable<T> = T | null;

export function isJsonParsable(str: string): boolean {
    try {
        JSON.parse(str);
        return true;
    } catch {
        return false;
    }
}

export function convertNonNullableValue<T>(value: T | null | undefined): T {
    if (value === null || value === undefined) {
        throw new TypeError("Received a null or undefined value");
    }
    return value;
}
