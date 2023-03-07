export function findKeyPath(obj: object | null | undefined, key: string): string[] | null {
    if (obj == null) return null;  // Return null if obj is null or undefined

    const paths: string[] = [];  // Array to store the paths

    for (const [k, v] of Object.entries(obj)) {
        if (k === key) paths.push(key);  // Add the current key to the array of paths
        if (typeof v === 'object') {  // Search within arrays and objects
            const subpaths = findKeyPath(v, key);
            if (subpaths) subpaths.forEach(subpath => paths.push(`${k}?.${subpath}`));
        }
    }

    return paths.length > 0 ? paths : null;  // Return the array of paths if it's not empty, otherwise return null
}


export function findKeyPathAfterValue(obj: object | null | undefined, value: any): string[] | null {
    if (obj == null) return null;  // Return null if obj is null or undefined

    const paths: string[] = [];  // Array to store the paths

    for (const [k, v] of Object.entries(obj)) {
        if (v === value) paths.push(k);  // Add the current key to the array of paths
        if (typeof v === 'object') {  // Search within arrays and objects
            const subpaths = findKeyPath(v, value);
            if (subpaths) subpaths.forEach(subpath => paths.push(`${k}?.${subpath}`));
        }
    }

    return paths.length > 0 ? paths : null;  // Return the array of paths if it's not empty, otherwise return null
}


export function findKeyPathAfterValueWithArrays(obj: object | null | undefined, value: any): string[] | null {
    if (obj == null) return null;  // Return null if obj is null or undefined

    const paths: string[] = [];  // Array to store the paths

    for (const [k, v] of Object.entries(obj)) {
        if (v === value) paths.push(k);  // Add the current key to the array of paths
        if (typeof v === 'object') {  // Search within arrays and objects
            const subpaths = findKeyPath(v, value);
            if (subpaths) {
                if (Array.isArray(v)) {  // If v is an array, prepend the index of the element to the subpaths
                    subpaths.forEach((subpath, i) => paths.push(`${k}[${i}].${subpath}`));
                } else {  // If v is an object, prepend the key to the subpaths
                    subpaths.forEach(subpath => paths.push(`${k}.${subpath}`));
                }
            }
        }
    }

    return paths.length > 0 ? paths : null;  // Return the array of paths if it's not empty, otherwise return null
}