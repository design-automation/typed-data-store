/**
 * A sparse flat (depth = 1) array of ints.
 * Supports Python-style negative indexes.
 */
export class Uint32Arr1 {
    private _num_bytes = 0;
    private _num_ints = 0;
    private _buff: ArrayBuffer = null;
    private _view: Uint32Array = null;
    private _next: number = null;
    /**
     * 
     * @param num_ints
     */
    public constructor(num_ints?: number) {
        num_ints = num_ints === undefined ? 10000 : num_ints;
        this._num_bytes = num_ints * 4;
        this._num_ints = num_ints;
        this._buff = new ArrayBuffer(this._num_bytes);
        this._view = new Uint32Array(this._buff);
        this._next = 0;
    }
    /**
     * Increases the size of the buffer.
     */
    private _extend(): void {
        const extend_by_num_ints = 10000; // 40 kb
        const new_num_ints: number = this._num_ints + extend_by_num_ints;
        const new_num_bytes: number = this._num_bytes + (extend_by_num_ints * 4);
        // Transfer has not yet been implemented by teh browsers
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/transfer
        // this._buff = ArrayBuffer.transfer(this._buff, new_num_bytes);
        const new_buff: ArrayBuffer = new ArrayBuffer(new_num_bytes);
        const new_view: Uint32Array = new Uint32Array(new_buff);
        new_view.set(this._view);
        this._num_bytes = new_num_bytes;
        this._num_ints = new_num_ints;
        this._buff = new_buff;
        this._view = new_view;
    }
    /**
     * Sets a value in the array.
     * @param idx
     * @param value
     */
    public set(idx: number, value: number): void {
        idx = idx < 0 ? this._next - idx : idx;
        if (idx >= this._num_ints - 1) { this._extend(); }
        this._view[idx] = value + 1;
        if (this._next <= idx) { this._next = idx + 1; }
    }
    /**
     * Gets a value from the array.
     * @param idx
     */
    public get(idx: number): number {
        idx = idx < 0 ? this._next - idx : idx;
        if (idx >= this._next) { return undefined; }
        if (this._view[idx] === 0) { return undefined; }
        return this._view[idx] - 1;
    }
    /**
     * Pushes a value onto the end of the array, and returns the length of the array.
     * @param value
     */
    public push(value: number): number {
        if (this._next >= this._num_ints) { this._extend(); }
        this._view[this._next] = value;
        this._next += 1;
        return this._next;
    }
    /**
     * Splices values into an array. Works same as normal array splice.
     * @param idx The index at which to splice
     * @param del_count The number of items to delete
     * @param add An array of items to add
     */
    public splice(idx: number, del_count: number, add?: number[]): void {
        idx = idx < 0 ? this._next - idx : idx;
        add = add === undefined ? [] : add;
        const add_count: number = add.length;
        if ((idx + add_count - del_count) >= this._num_ints) { this._extend(); }
        const add_nums: number[] = add.map( num => num + 1 );
        if (del_count !== add_count) {
            this._view.copyWithin(idx + add_count, idx + del_count, this._next);
        }
        if (add_count > 0) { this._view.set(add_nums, idx); }
        if (add_count < del_count) {
            let i = 0; const i_max = del_count - add_count;
            for (; i < i_max; i++ ) {
                this._view[this._next - i] = 0;
            }
        }
        this._next += (add_count - del_count);
    }
    /**
     * Deletes an index in the array.
     * @param idx
     */
    public delete(idx: number): void {
        idx = idx < 0 ? this._next - idx : idx;
        if (idx >= this._num_ints) { throw new Error('Index out of range'); }
        this._view[idx] = 0;
    }
    /**
     * Returns a normal array representation of the array.
     * @param idx
     */
    public toArray(): number[] {
        const nums: number[] = [];
        let i = 0; const i_max = this._next;
        for (; i < i_max; i++) {
            if (this._view[i] !== 0) {
                nums[i] = this._view[i] - 1;
            }
        }
        return nums;
    }
    /**
     * Returns a string representation of the array.
     * @param idx
     */
    public toString(): string {
        return JSON.stringify(this.toArray());
    }
    /**
     * Returns the length of the array.
     * @param idx
     */
    public length(): number {
        return this._next;
    }
    /**
     * Returns true if the number exists in the array.
     * @param idx
     */
    public includes(num: number): boolean {
        return this._view.includes(num + 1);
    }
    /**
     * Returns the index of the first item in the array with this value, or -1.
     * @param idx
     */
    public indexOf(num: number): number {
        return this._view.indexOf(num + 1);
    }
}
