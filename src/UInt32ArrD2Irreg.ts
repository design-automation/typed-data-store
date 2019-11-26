/**
 * A sparse (depth = 2) array of irregular arrays of ints.
 * Supports Python-style negative indexes.
 */
export class Uint32ArrD2Irreg {
    private _size: number = null;
    // index array
    private _num_bytes0: number = null;
    private _num_ints0: number = null;
    private _buff0: ArrayBuffer = null;
    private _view0: Uint32Array = null;
    private _next0: number = null;
    // data array
    private _num_bytes1: number = null;
    private _num_ints1: number = null;
    private _buff1: ArrayBuffer = null;
    private _view1: Uint32Array = null;
    private _next1: number = null;

    /**
     * 
     * @param num_arrs
     */
    public constructor(size: number, num_arrs?: number) {
        num_arrs = num_arrs === undefined ? 10000 : num_arrs;
        this._size = size;
        // index array
        this._num_bytes0 = num_arrs * 4;
        this._num_ints0 = num_arrs;
        this._buff0 = new ArrayBuffer(this._num_bytes0);
        this._view0 = new Uint32Array(this._buff0);
        this._next0 = 0;
        // data array
        this._num_bytes1 = num_arrs * 4 * size;
        this._num_ints1 = num_arrs * size;
        this._buff1 = new ArrayBuffer(this._num_bytes1);
        this._view1 = new Uint32Array(this._buff1);
        this._next1 = 0;

    }
    /**
     * Increases the size of the buffer for the index array.
     */
    private _extend0(): void {
        const extend_by_num_ints = 10000; // 40 kb
        // index array, extend by num_arrs
        const new_num_ints0: number = this._num_ints0 + extend_by_num_ints;
        const new_num_bytes0: number = this._num_bytes0 + (extend_by_num_ints * 4);
        const new_buff0: ArrayBuffer = new ArrayBuffer(new_num_bytes0);
        const new_view0: Uint32Array = new Uint32Array(new_buff0);
        new_view0.set(this._view0);
        this._num_bytes0 = new_num_bytes0;
        this._num_ints0 = new_num_ints0;
        this._buff0 = new_buff0;
        this._view0 = new_view0;
    }
    // /**
    //  * Increases the size of the buffer for the data array.
    //  */
    // private _extend1(): void {
    //     const extend_by_num_arrs = 10000; // 40 kb * size
    //     // data array, extend by num_arrs x size
    //     const new_num_ints1: number = this._num_ints1 + (extend_by_num_arrs * this._size);
    //     const new_num_bytes1: number = this._num_bytes1 + (extend_by_num_arrs * 4 * this._size);
    //     const new_buff1: ArrayBuffer = new ArrayBuffer(new_num_bytes1);
    //     const new_view1: Uint32Array = new Uint32Array(new_buff1);
    //     new_view1.set(this._view1);
    //     this._num_bytes1 = new_num_bytes1;
    //     this._num_ints1 = new_num_ints1;
    //     this._buff1 = new_buff1;
    //     this._view1 = new_view1;
    // }
    // /**
    //  * Sets a value in the array.
    //  * @param idx0
    //  * @param value
    //  */
    // public set(idx0: number, idx1: number, value: number): void {
    //     idx0 = idx0 < 0 ? this._next0 - idx0 : idx0;
    //     idx1 = idx1 < 0 ? this._next1 - idx1 : idx1;
    //     if (idx0 >= this._num_ints1 - 1) { this._extend(); }
    //     this._view1[idx0] = value + 1;
    //     if (this._next1 <= idx0) { this._next1 = idx0 + 1; }
    // }
    // /**
    //  * Gets a value from the array.
    //  * @param idx
    //  */
    // public get(idx: number): number {
    //     idx = idx < 0 ? this._next1 - idx : idx;
    //     if (idx >= this._next1) { return undefined; }
    //     if (this._view1[idx] === 0) { return undefined; }
    //     return this._view1[idx] - 1;
    // }
    // /**
    //  * Pushes a value onto the end of the array, and returns the length of the array.
    //  * @param value
    //  */
    // public push(value: number): number {
    //     if (this._next1 >= this._num_ints1) { this._extend(); }
    //     this._view1[this._next1] = value;
    //     this._next1 += 1;
    //     return this._next1;
    // }
    // /**
    //  * Splices values into an array. Works same as normal array splice.
    //  * @param idx The index at which to splice
    //  * @param del_count The number of items to delete
    //  * @param add An array of items to add
    //  */
    // public splice(idx: number, del_count: number, add?: number[]): void {
    //     idx = idx < 0 ? this._next1 - idx : idx;
    //     add = add === undefined ? [] : add;
    //     const add_count: number = add.length;
    //     if ((idx + add_count - del_count) >= this._num_ints1) { this._extend(); }
    //     const add_nums: number[] = add.map( num => num + 1 );
    //     if (del_count !== add_count) {
    //         this._view1.copyWithin(idx + add_count, idx + del_count, this._next1);
    //     }
    //     if (add_count > 0) { this._view1.set(add_nums, idx); }
    //     if (add_count < del_count) {
    //         let i = 0; const i_max = del_count - add_count;
    //         for (; i < i_max; i++ ) {
    //             this._view1[this._next1 - i] = 0;
    //         }
    //     }
    //     this._next1 += (add_count - del_count);
    // }
    // /**
    //  * Deletes an index in the array.
    //  * @param idx
    //  */
    // public delete(idx: number): void {
    //     idx = idx < 0 ? this._next1 - idx : idx;
    //     if (idx >= this._num_ints1) { throw new Error('Index out of range'); }
    //     this._view1[idx] = 0;
    // }
    // /**
    //  * Returns a normal array representation of the array.
    //  * @param idx
    //  */
    // public toArray(): number[] {
    //     const nums: number[] = [];
    //     let i = 0; const i_max = this._next1;
    //     for (; i < i_max; i++) {
    //         if (this._view1[i] !== 0) {
    //             nums[i] = this._view1[i] - 1;
    //         }
    //     }
    //     return nums;
    // }
    // /**
    //  * Returns a string representation of the array.
    //  * @param idx
    //  */
    // public toString(): string {
    //     return JSON.stringify(this.toArray());
    // }
    // /**
    //  * Returns the length of the array.
    //  * @param idx
    //  */
    // public length(): number {
    //     return this._next1;
    // }
    // /**
    //  * Returns true if the number exists in the array.
    //  * @param idx
    //  */
    // public includes(num: number): boolean {
    //     return this._view1.includes(num + 1);
    // }
    // /**
    //  * Returns the index of the first item in the array with this value, or -1.
    //  * @param idx
    //  */
    // public indexOf(num: number): number {
    //     return this._view1.indexOf(num + 1);
    // }
}
