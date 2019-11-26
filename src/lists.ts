
export class FlatIntArr {
    private _bytes = 0;
    constructor(num_ints: number) {
        this._bytes = num_ints * 4;
    }
}
