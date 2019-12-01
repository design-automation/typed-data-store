export function randInt(max: number): number {
    return Math.floor(Math.random() * max);
}

export function randArr(max_len: number): number[] {
    const len = randInt(max_len);
    const arr: number[] = [];
    for (let i = 0; i < len; i++) {
        arr.push(randInt(1000));
    }
    return arr;
}

