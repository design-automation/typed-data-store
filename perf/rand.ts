export function randInt(max: number): number {
    return Math.floor(Math.random() * max);
}

export function randVarArr(min_len: number, max_len: number): number[] {
    const len = min_len + randInt(max_len - min_len);
    const arr: number[] = [];
    for (let i = 0; i < len; i++) {
        arr.push(randInt(1000));
    }
    return arr;
}

export function randFixArr(len: number): number[] {
    const arr: number[] = [];
    for (let i = 0; i < len; i++) {
        arr.push(randInt(1000));
    }
    return arr;
}
