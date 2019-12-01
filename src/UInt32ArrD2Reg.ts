/**
 * A sparse array of regular arrays of ints.
 * Example: [[2,3,4], undefined ,[3,undefined,5],[4,5,6]]
 * Supports Python-style negative indexes.
 */
export class Uint32ArrD2Reg {
    private _size: number = null;
    private _buff_cap_bytes: number = null;
    private _buff_cap_ints: number = null;
    private _buff_cap_arrs: number = null;
    private _buff: ArrayBuffer = null;
    private _view: Uint32Array = null;
    private _num_arrs: number = null;
    /**
     * Constructor
     * @param size The size of each sub array
     * @param cap_ints The total size of the initial buffer, specified in number of ints
     */
    public constructor(size: number, cap_ints?: number) {
        this._size = size;
        this._buff_cap_arrs = cap_ints === undefined ? size * 3000 : Math.floor(cap_ints / size);
        this._buff_cap_bytes = this._buff_cap_arrs * 4 * size;
        this._buff_cap_ints = this._buff_cap_arrs * size;
        this._buff = new ArrayBuffer(this._buff_cap_bytes);
        this._view = new Uint32Array(this._buff);
        this._num_arrs = 0;
    }
    /**
     * Increases the size of the buffer.
     */
    private _extend(): void {
        const extend_by_num_arrs = 10000; // 40 kb
        const new_num_arrs: number = this._buff_cap_arrs + extend_by_num_arrs;
        const new_num_ints: number = this._buff_cap_ints + (extend_by_num_arrs * this._size);
        const new_num_bytes: number = this._buff_cap_bytes + (extend_by_num_arrs * 4 * this._size);
        const new_buff: ArrayBuffer = new ArrayBuffer(new_num_bytes);
        const new_view: Uint32Array = new Uint32Array(new_buff);
        new_view.set(this._view);
        this._buff_cap_bytes = new_num_bytes;
        this._buff_cap_ints = new_num_ints;
        this._buff_cap_arrs = new_num_arrs;
        this._buff = new_buff;
        this._view = new_view;
    }
    /**
     * Convert a normal external arr to the internal arr representation
     * All values get incremented by 1
     * All undefined values or null values get replaced by 0
     * @param arr
     * @param idx0
     */
    private _arrExtToInt(arr: number[], idx0: number): void {
        const idx2: number = (idx0 * this._size);
        let i = 0; const i_max = this._size;
        for (; i < i_max; i++) {
            const val: number = arr[i] === undefined || arr[i] === null ? 0 : arr[i] + 1;
            this._view[idx2 + i] = val;
        }
    }
    /**
     * Convert an internal representation to a normal external arr
     * All values get decrementd by 1
     * All 0 values get replaced by undefined (i.e. no value, as in a sparse array)
     * If a sub array is all undefined, then the array itself is undefined
     * @param idx0
     */
    private _arrIntToExt(idx0: number): number[] {
        const idx2: number = (idx0 * this._size);
        const arr: number[] = [];
        let i = 0; const i_max = this._size;
        let all_undef = true;
        for (; i < i_max; i++) {
            const val: number = this._view[idx2 + i];
            if (val !== 0) { arr[i] = val - 1; all_undef = false; }
        }
        if (all_undef) { return undefined; }
        return arr;
    }
    /**
     * Sets a value in the array of arrays.
     * data[idx0][idx1] = val
     * @param idx0
     * @param idx1
     * @param val
     */
    public setVal(idx0: number, idx1: number, val: number): void {
        // neg index
        idx0 = idx0 < 0 ? this._num_arrs - idx0 : idx0;
        idx1 = idx1 < 0 ? this._size - idx1 : idx1;
        // update length
        if (idx0 >= this._num_arrs) { this._num_arrs = idx0 + 1; }
        // out of bounds
        if (idx1 >= this._size) { throw new Error('Error: Index 1 out of bounds.'); }
        // calc index
        const idx2: number = (idx0 * this._size) + idx1;
        // extend
        if (idx2 >= this._buff_cap_ints - 1) { this._extend(); }
        // set the value
        this._view[idx2] = val + 1;
    }
    /**
     * Sets an array in the array of arrays.
     * data[idx0] = [ ... ]
     * @param idx0
     * @param arr An array of length size.
     */
    public setArr(idx0: number, arr: number[]): void {
        // neg index
        idx0 = idx0 < 0 ? this._num_arrs - idx0 : idx0;
        // extend
        if (idx0 >= this._buff_cap_arrs - 1) { this._extend(); }
        // set the values
        this._arrExtToInt(arr, idx0);
        // update length
        if (this._num_arrs <= idx0) { this._num_arrs = idx0 + 1; }
    }
    /**
     * Gets a value from the array of arrays.
     * val = data[idx0][idx1]
     * @param idx0
     * @param idx1
     * @returns The value
     */
    public getVal(idx0: number, idx1: number): number {
        // neg index
        idx0 = idx0 < 0 ? this._num_arrs - idx0 : idx0;
        idx1 = idx1 < 0 ? this._size - idx1 : idx1;
        // out of bounds
        if (idx0 >= this._num_arrs) { throw new Error('Error: Index 0 out of bounds.'); }
        if (idx1 >= this._size) { throw new Error('Error: Index 1 out of bounds.'); }
        // calc index
        const idx2: number = (idx0 * this._size) + idx1;
        // check if we need to return indefined
        if (this._view[idx2] === 0) { return undefined; }
        // return the value
        return this._view[idx2] - 1;
    }
    /**
     * Gets an arrays from the array of arrays.
     * val = data[idx0]
     * @param idx0
     * @returns The array
     */
    public getArr(idx0: number): number[] {
        // neg index
        idx0 = idx0 < 0 ? this._num_arrs - idx0 : idx0;
        // out of bounds
        if (idx0 >= this._num_arrs) { throw new Error('Error: Index 0 out of bounds.'); }
        // return the array
        return this._arrIntToExt(idx0);
    }
    /**
     * Pushes an array onto the end of the array of arrays,
     * and returns the length of the array.
     * @param arr
     * @returns The length
     */
    public pushArr(arr: number[]): number {
        // extend
        if (this._num_arrs >= this._buff_cap_arrs) { this._extend(); }
        // add the array
        this._arrExtToInt(arr, this._num_arrs);
        // update length
        this._num_arrs += 1;
        // return length
        return this._num_arrs;
    }
    /**
     * Splices arrays into the array of array. Works same as normal array splice.
     * @param idx0 The index at which to splice
     * @param del_count The number of arrays to delete
     * @param arrs_to_add An array of arrays to add
     */
    public spliceArrs(idx0: number, del_count: number, arrs_to_add?: number[][]): void {
        // neg index
        idx0 = idx0 < 0 ? this._num_arrs - idx0 : idx0;
        // out of bounds
        if (idx0 >= this._num_arrs) { throw new Error('Error: Index 0 out of bounds.'); }
        // arrays to add
        arrs_to_add = arrs_to_add === undefined ? [] : arrs_to_add;
        const add_count: number = arrs_to_add.length;
        // extend
        if ((idx0 + add_count - del_count) >= this._buff_cap_arrs) { this._extend(); }
        // splice
        const len_ints: number = this._num_arrs * this._size;
        if (del_count !== add_count) {
            this._view.copyWithin(
                (idx0 + add_count) * this._size,
                (idx0 + del_count) * this._size,
                len_ints);
        }
        let i = 0; const i_max = add_count;
        for (; i < i_max; i++) {
            const idx0_next = idx0 + i;
            this._arrExtToInt(arrs_to_add[i], idx0_next);
        }
        // if arr copied left, fill end in with 0 values
        if (add_count < del_count) {
            let j = 0; const j_max = (del_count - add_count) * this._size;
            for (; j < j_max; j++ ) {
                this._view[len_ints - j] = 0;
            }
        }
        // update length
        this._num_arrs += (add_count - del_count);
    }
    /**
     * Deletes a value at the specified index in the array of arrays.
     * @param idx0
     * @param idx1
     */
    public delVal(idx0: number, idx1: number): void {
        // neg index
        idx0 = idx0 < 0 ? this._num_arrs - idx0 : idx0;
        idx1 = idx1 < 0 ? this._size - idx1 : idx1;
        // ou of bounds
        if (idx0 >= this._num_arrs) { throw new Error('Error: Index 0 out of bounds.'); }
        if (idx1 >= this._size) { throw new Error('Error: Index 1 out of bounds.'); }
        // calc index
        const idx2: number = (idx0 * this._size) + idx1;
        // set the value to 0
        this._view[idx2] = 0;
    }
    /**
     * Deletes an array in the array of arrays.
     * @param idx0
     */
    public delArr(idx0: number): void {
        // neg index
        idx0 = idx0 < 0 ? this._num_arrs - idx0 : idx0;
        // ou of bounds
        if (idx0 >= this._num_arrs) { throw new Error('Error: Index 0 out of bounds.'); }
        // calc index
        const idx2: number = (idx0 * this._size);
        // set the values to 0
        let i = 0; const i_max = this._size;
        for (; i < i_max; i++) {
            this._view[idx2 + i] = 0;
        }
        // update lengths TODO
        if (this._num_arrs === idx0 - 1) {
            i = this._num_arrs * this._size;
            this._num_arrs = 0;
            for (; i >= 0; i --) {
                if (this._view[i] !== 0) {
                    this._num_arrs = Math.ceil(i / this._size);
                    break;
                }
            }
        }
    }
    /**
     * Returns the number of arrays in the array of arrays.
     * @returns The length.
     */
    public length(): number {
        return this._num_arrs;
    }
    /**
     * Returns true if the array exists in the array of arrays.
     * @param arr
     * @returns True or false.
     */
    public includesArr(arr: number[]): boolean {
        throw new Error('not implemented');
    }
    /**
     * Returns the index of the first matching array in teh array of arrays, or -1.
     * @param arr
     * @returns The index.
     */
    public idxOfArr(arr: number[]): number {
        throw new Error('not implemented');
    }
    /**
     * Returns a standard array of arrays representation.
     * @returns The array of arrays.
     */
    public toArray(): number[][] {
        const arrs: number[][] = [];
        let i = 0; const i_max = this._num_arrs;
        for (; i < i_max; i++) {
            arrs.push(this._arrIntToExt(i));
        }
        return arrs;
    }
    /**
     * Returns a string representation of the array of arrays.
     * @returns The string representation.
     */
    public toString(): string {
        return JSON.stringify(this.toArray());
    }
}
