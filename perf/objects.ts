export function countObjs(obj: object): number {
    let count = 1;
    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'object') {
            count += countObjs(obj[key]);
        }
    }
    return count;
}
