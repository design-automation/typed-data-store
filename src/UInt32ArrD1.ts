/**
 * A sparse array of unsigned ints.
 *
 * The array can contain undefined and null values.
 * `[undef, 1, 2, 3, undef]`
 */
export class Uint32ArrD1 {
    // static
    private static BUFF_START_SIZE = 1024;
    private static BUFF_STEP_SIZE = 1024;
    // data array
    private _data_view: Uint32Array = null;
    // total number of values
    private _arr_len: number = null;

    /**
     * Constructor
     */
    public constructor() {
        // data array
        this._data_view = new Uint32Array(
            new ArrayBuffer(Uint32ArrD1.BUFF_START_SIZE * Uint32Array.BYTES_PER_ELEMENT)
        );
        // num ints
        this._arr_len = 0;
    }
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    // Private methods
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    /**
     * Increases the size of the data buffer if the number of ints to add connot be accomodated.
     */
    private _extendDataBuff(ints_to_add: number): void {
        if ((this._arr_len * 3) + ints_to_add <= this._data_view.length) { return; }
        // console.log('XXX EXTEND DATA BUFF XXX');
        const new_num_ints: number = this._data_view.length +
            Math.ceil(ints_to_add / Uint32ArrD1.BUFF_STEP_SIZE) * Uint32ArrD1.BUFF_STEP_SIZE;
        // data
        const new_data_view: Uint32Array = new Uint32Array(
            new ArrayBuffer(new_num_ints * Uint32Array.BYTES_PER_ELEMENT)
        );
        new_data_view.set(this._data_view);
        this._data_view = new_data_view;
    }
    /**
     * Set the value in the array.
     */
    private _setVal(idx: number, val: number): void {
        if (val === undefined) {
            this._data_view[idx] = 1;
        } else if (val === null) {
            this._data_view[idx] = 2;
        } else {
            this._data_view[idx] = val + 3;
        }
    }
    /**
     * Get the value in the array.
     */
    private _getVal(idx: number): number {
        if (this._data_view[idx] === 0) {
            return undefined; // empty
        } else if (this._data_view[idx] === 1) {
            return undefined;
        } else if (this._data_view[idx] === 2) {
            return null;
        } else {
            return this._data_view[idx] - 3;
        }
    }
    /**
     * Encode to internal representation.
     */
    private _encodeVal(val: number): number {
        if (val === undefined) {
           return 1;
        } else if (val === null) {
            return 2;
        } else {
            return val + 3;
        }
    }
    /**
     * Shifts the data in the data array.
     * The shift can be positive or negative.
     * Beware, when you shift negatively, you overwrite data.
     */
    private _shiftData(idx: number, offset: number): void {
        this._data_view.copyWithin(idx + offset, idx, this._arr_len);
    }
    /**
     * Return true if this value is the last one.
     */
    private _isValLast(idx: number): boolean {
        return idx === this._arr_len - 1;
    }
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    // Public methods - for working with values
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    /**
     * Gets a value from the array.
     * Similar to val = data[idx]
     * @param idx
     * @returns The value
     */
    public getVal(idx: number): number {
        if (idx >= this._arr_len) { throw new Error('Error: Index out of bounds.'); }
        // return the value
        return this._getVal(idx);
    }
    /**
     * Overwrites an existing value in a value with a new value.
     * Similar to data[idx][idx1] = val
     * @param idx
     * @param val
     */
    public setVal(idx: number, val: number): number {
        // console.log('SET');
        // extend
        if (idx >= this._arr_len) {
            const num_vals_to_add: number = idx - this._arr_len + 1;
            this._extendDataBuff(num_vals_to_add);
            this._arr_len += num_vals_to_add;
        }
        // set the value
        this._setVal(idx, val);
        // return the lengthh
        return this._arr_len;
    }
    /**
     * If the existing value in the array is a given value,
     * then overwrite the existing value with a new value.
     * @param idx
     * @param val
     */
    public setValIf(idx: number, old_val: number, new_val: number): void {
        if (idx >= this._arr_len) { throw new Error('Error: Index out of bounds.'); }
        // set the value
        if (this._data_view[idx] === this._encodeVal(old_val)) {
            this._setVal(idx, new_val);
        }
    }
    /**
     * Inserts a value into the array.
     * @param idx
     * @param val
     */
    public insVal(idx: number, val: number): number {
        // special cases
        if (idx > this._arr_len) { return this.setVal(idx, val); }
        if (idx === this._arr_len) { return this.pushVal(val); }
        // set the value
        this._extendDataBuff(1);
        this._shiftData(idx + 1, 1);
        this._setVal(idx, val);
        // set the length
        this._arr_len += 1;
        // return the new length
        return this._arr_len;
    }
    /**
     * Pushes a value onto the end of the array.
     * @param idx
     * @param val
     */
    public pushVal(val: number): number {
        // set the value
        this._extendDataBuff(1);
        this._setVal(this._arr_len, val);
        // set the length
        this._arr_len += 1;
        // return the new length
        return this._arr_len;
    }
    /**
     * Delete a value in the array.
     * @param idx
     */
    public delVal(idx: number): void {
        if (idx >= this._arr_len) { throw new Error('Error: Index out of bounds.'); }
        // set the value
        this._setVal(idx, undefined);
    }
    /**
     * Inserts a value into the array.
     * @param idx
     */
    public remVal(idx: number): number {
        if (idx >= this._arr_len) { throw new Error('Error: Index out of bounds.'); }
        // special case
        if (this._isValLast(idx)) { return this.popVal(); }
        // set the value
        this._shiftData(idx + 1, -1);
        // set the length
        this._arr_len -= 1;
        // return the new length
        return this._arr_len;
    }
    /**
     * Pop a value off the end of the array.
     * @param idx
     */
    public popVal(): number {
        // get the val
        const val: number = this._getVal(this._arr_len - 1);
        // set the length
        this._arr_len -= 1;
        // return the value
        return val;
    }
    /**
     * Returns true if the array contains the number.
     * @param val
     * @returns True or false.
     */
    public hasVal(val: number): boolean {
        return this._data_view.includes(this._encodeVal(val));
    }
    /**
     * Returns the index of the first matching number in the value, or -1.
     * @param val
     * @returns The index, or -1.
     */
    public idxOfVal(val: number): number {
        return this._data_view.indexOf(this._encodeVal(val));
    }
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    // Public methods - for working with the container array
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    /**
     * Returns a deep clone of the array.
     * @returns The Uint32ArrD1 clone.
     */
    public clone(): Uint32ArrD1 {
        const new_arr: Uint32ArrD1 = new Uint32ArrD1();
        new_arr._data_view = new Uint32Array( this._data_view );
        new_arr._arr_len = this._arr_len;
        return new_arr;
    }
    /**
     * Returns the number of values in the array.
     * @returns The length.
     */
    public len(): number {
        return this._arr_len;
    }
    /**
     * Returns a standard array of arrays representation.
     * @returns The array of arrays.
     */
    public toArr(limit?: number, end?: boolean): number[] {
        limit = limit === undefined ? this._arr_len : limit;
        const arr: number[] = [];
        // get the whole thing
        if (this._arr_len < limit) {
            for (let next_idx = 0; next_idx < this._arr_len; next_idx++) {
                arr.push( this._getVal(next_idx) );
            }
            return arr;
        }
        // get the start
        if (end === undefined || end === false) {
            for (let next_idx = 0; next_idx < limit; next_idx++) {
                arr.push( this._getVal(next_idx) );
            }
            return arr;
        }
        // get the end
        for (let next_idx = this._arr_len - limit; next_idx < this._arr_len; next_idx++) {
            arr.push( this._getVal(next_idx) );
        }
        return arr;
    }
    /**
     * Returns a string representation of the array of arrays.
     * @returns The string representation.
     */
    public toStr(limit: number): string {
        limit = limit === undefined ? 50 : limit;
        // get the whole thing
        if (this._arr_len < limit) {
            return JSON.stringify(this.toArr());
        }
        // get the start and end
        const half_limit: number = Math.ceil(limit / 2);
        const start: number[] = this.toArr(half_limit, false);
        const end: number[] = this.toArr(half_limit, true);
        return JSON.stringify(start).slice(0, -1) +
            ' ... ' + JSON.stringify(end).slice(1) + ']';
    }
    /**
     * Returns a string representation of various types of data in the array.
     * @returns The string representation.
     */
    public toDebugStr(limit?: number): string {
        limit = limit === undefined ? 50 : limit;
        // data
        let data_arr_str = '';
        if (this._arr_len < limit) {
            // data
            data_arr_str = '[' + this._data_view.subarray(0, this._arr_len) + ']';
        } else {
            const half_limit: number = Math.ceil(limit / 2);
            const part2_start: number = this._arr_len - half_limit;
            // data
            data_arr_str =  '[' +
                this._data_view.subarray(0, half_limit) + ' ... '  +
                this._data_view.subarray(part2_start, this._arr_len) +
            ']';
        }
        // return the str
        return [
            '==========',
            'Num arrays = \t\t' + this._arr_len,
            'Data buff size = \t' + this._data_view.length,
            'Data array = \t\t' + data_arr_str,
            'Array = \t\t' + this.toStr(limit),
            '=========='
        ].join('\n');
    }
}
