/**
 * A sparse array of regular arrays of unsigned ints.
 * The arrays will be referred to as the 'container array' and the 'sub-arrays'.
 *
 * The array can contain undefined sub-arrays.
 * The sub-arrays can contain neither undefined nor null values.
 * `[undef, [1,2,3], [11,12,13], [22, 33, 44], undef]`
 */
export class Uint32ArrD2Reg {
    // static
    private static BUFF_START_SIZE = 1024;
    private static BUFF_STEP_SIZE = 1024;
    // data array
    private _data_view: Uint32Array = null;
    // total number of sub-arrays
    private _arr_len: number = null;
    // size of sub-arrays
    private _sub_arr_len = null;

    /**
     * Constructor
     * @param size The size of the sub arrays.
     */
    public constructor(size: number) {
        // data array
        this._data_view = new Uint32Array(
            new ArrayBuffer(Uint32ArrD2Reg.BUFF_START_SIZE * Uint32Array.BYTES_PER_ELEMENT)
        );
        // arrs and ints
        this._arr_len = 0;
        // size of sub arrays
        this._sub_arr_len = size;
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
        if ((this._arr_len * this._sub_arr_len) + ints_to_add <= this._data_view.length) { return; }
        // console.log('XXX EXTEND DATA BUFF XXX');
        const new_num_vals: number = this._data_view.length +
            Math.ceil(ints_to_add / Uint32ArrD2Reg.BUFF_STEP_SIZE) * Uint32ArrD2Reg.BUFF_STEP_SIZE;
        // data
        const new_data_view: Uint32Array = new Uint32Array(
            new ArrayBuffer(new_num_vals * Uint32Array.BYTES_PER_ELEMENT)
        );
        new_data_view.set(this._data_view);
        this._data_view = new_data_view;
    }
    /**
     * Shifts the data in the data array and updates the indexes in the index array.
     * The shift can be positive or negative.
     * Beware, when you shift negatively, you overwrite data.
     */
    private _shiftData(idx0: number, offset: number): void {
        this._data_view.copyWithin((idx0 * this._sub_arr_len) + offset, (idx0 * this._sub_arr_len), (this._arr_len * this._sub_arr_len));
    }
    /**
     * Set a sub-array to be undefined.
     */
    private _arrSetUndef(idx0: number): void {
        this._data_view[idx0 * this._sub_arr_len] = 0;
    }
    /**
     * Set sub-array data.
     */
    private _arrSetData(idx0: number, arr: number[]): void {
        if (arr === undefined) {
            this._data_view[idx0 * this._sub_arr_len] = 0;
        } else {
            this._data_view.set(arr.map(i => i + 1), (idx0 * this._sub_arr_len));
        }
    }
    /**
     * Get sub-array data.
     */
    private _arrGetData(idx0: number): number[] {
        const idx2: number = idx0 * this._sub_arr_len;
        if (this._data_view[idx2] === 0) {
            return undefined;
        }
        const arr: number[] = [];
        for (let i = 0; i < this._sub_arr_len; i++) {
            arr[i] = this._data_view[idx2 + i] - 1;
        }
        return arr;
    }
    /**
     * Set a value in a sub-array.
     */
    private _arrSetVal(idx0: number, idx1: number, val: number): void {
        this._data_view[(idx0 * this._sub_arr_len) + idx1] = val + 1;
    }
    /**
     * Get a value in a sub-array.
     */
    private _arrGetVal(idx0: number, idx1: number): number {
        return this._data_view[(idx0 * this._sub_arr_len) + idx1] - 1;
    }
    /**
     * Return true if this sub-array is the last one.
     */
    private _isArrLast(idx0: number): boolean {
        return idx0 === this._arr_len - 1;
    }
    /**
     * Sets an array that is beyond the end of the container array
     */
    private _setArrExtend(idx0: number, arr: number[]): void {
        // add empty arrs
        const num_arrs_to_add: number = idx0 - this._arr_len + 1;
        // extend data buff, adding space for all emp_arrs_to_add
        const num_vals_to_add: number = num_arrs_to_add * this._sub_arr_len;
        this._extendDataBuff(num_vals_to_add);
        // set the data
        this._arrSetData(idx0, arr);
        // update _num_arrs
        this._arr_len += num_arrs_to_add;
    }
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    // Public methods - for working with Sub-Arrays
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    /**
     * Gets the data for a sub-array.
     * @param idx0
     * @returns The array of ints
     */
    public getArr(idx0: number): number[] {
        if (idx0 >= this._arr_len) { throw new Error('Error: Index 0 out of bounds.'); }
        // console.log("GET")
        // return arr of data
        return this._arrGetData(idx0);
    }
    /**
     * Sets the data for a sub-array.
     * @param idx0
     * @param arr The array of numbers, or undefined
     */
    public setArr(idx0: number, arr: number[]): number {
        // console.log('SET');
        if (arr !== undefined && arr.length !== this._sub_arr_len) { throw new Error('Array length is incorrect.'); }
        // delete a sub array
        if (arr === undefined && idx0 < this._arr_len) { this._arrSetUndef(idx0); return this._arr_len; }
        // overwrite an existing arr
        if (idx0 < this._arr_len) { this._arrSetData(idx0, arr); return this._arr_len; }
        // extend by adding a new arr at or after _num_arrs
        this._setArrExtend(idx0, arr);
        return this._arr_len;
    }
    /**
     * Inserts a sub-array.
     * Insert at 0 inserts a sub-array at the start.
     * Insert at _num_arrs inserts a sub-array at the end (same as push()).
     * Everything from idx0 onwards (incl.) gets shifted to the right.
     * @param idx0 The index at which to insert.
     * @param arr
     * @returns The length of the array after insertion
     */
    public insArr(idx0: number, arr: number[]): number {
        // console.log("INSERT")
        if (arr !== undefined && arr.length !== this._sub_arr_len) { throw new Error('Array length is incorrect.'); }
        // special cases
        if (idx0 > this._arr_len) { return this.setArr(idx0, arr); }
        if (idx0 === this._arr_len) { return this.pushArr(arr); }
        // extend data view
        this._extendDataBuff(this._sub_arr_len);
        // shift data
        this._shiftData(idx0, this._sub_arr_len);
        // update _num_arrs, add 1
        this._arr_len += 1;
        // set the new arr data
        this._arrSetData(idx0, arr);
        // return length
        return this._arr_len;
    }
    /**
     * Push a sub-array.
     * @param arr
     * @returns The length of the array after pushing.
     */
    public pushArr(arr: number[]): number {
        // console.log("PUSH");
        if (arr !== undefined && arr.length !== this._sub_arr_len) { throw new Error('Array length is incorrect.'); }
        // set the next idx0
        const idx0: number = this._arr_len;
        // extend data view
        this._extendDataBuff(this._sub_arr_len);
        // update _num_arrs, add 1
        this._arr_len += 1;
        // set the new arr data
        this._arrSetData(idx0, arr);
        // return the new length
        return this._arr_len;
    }
    /**
     * Deletes a sub-array.
     * The value for that sub-array becomes undefined.
     * @param idx0 The index of the sub array to delete.
     */
    public delArr(idx0: number): void {
        if (idx0 >= this._arr_len) { return; }
        // console.log("DEL")
        // set undefined
        this._arrSetUndef(idx0);
    }
    /**
     * Removes a sub-array.
     * Everything after idx0 gets shifted to the left.
     * @param idx0 The index of the sub array to delete.
     */
    public remArr(idx0: number): number {
        if (idx0 >= this._arr_len) { return; }
        // console.log("REM")
        // special case
        if (this._isArrLast(idx0)) { this.popArr(); return; }
        // get end and next
        const next_idx0 = idx0 + 1;
        // shift data
        this._shiftData(next_idx0, -this._sub_arr_len);
        // update _num_arrs, deduct 1
        this._arr_len -= 1;
        // return length
        return this._arr_len;
    }
    /**
     * Deletes the last sub-array.
     */
    public popArr(): number[] {
        // console.log("POP")
        if (this._arr_len === 0) { return undefined; }
        // get the arr to return
        const arr: number[] = this.getArr(this._arr_len - 1);
        // update _num_arrs
        this._arr_len -= 1;
        // return the arr
        return arr;
    }
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    // Public methods - for working with values in sub-Arrays
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    /**
     * Gets a value from the array of arrays.
     * Similar to val = data[idx0][idx1]
     * @param idx0
     * @param idx1
     * @returns The value
     */
    public getVal(idx0: number, idx1: number): number {
        if (idx0 >= this._arr_len) { throw new Error('Error: Index 0 out of bounds.'); }
        if (idx1 >= this._sub_arr_len) { throw new Error('Error: Index 1 out of bounds.'); }
        // return the value
        return this._arrGetVal(idx0, idx1);
    }
    /**
     * Overwrites an existing value in a sub-array with a new value.
     * Similar to data[idx0][idx1] = val
     * @param idx0
     * @param idx1
     * @param val
     */
    public setVal(idx0: number, idx1: number, val: number): void {
        if (idx0 >= this._arr_len) { throw new Error('Error: Index 0 out of bounds.'); }
        if (idx1 >= this._sub_arr_len) { throw new Error('Error: Index 1 out of bounds.'); }
        // set the value
        this._arrSetVal(idx0, idx1, val);
    }
    /**
     * If the existing value in a sub-array is a given value,
     * then overwrite the existing value with a new value.
     * @param idx0
     * @param idx1
     * @param val
     */
    public setValIf(idx0: number, idx1: number, old_val: number, new_val: number): void {
        if (idx0 >= this._arr_len) { throw new Error('Error: Index 0 out of bounds.'); }
        if (idx1 >= this._sub_arr_len) { throw new Error('Error: Index 1 out of bounds.'); }
        // set the value
        if (this._arrGetVal(idx0, idx1) === old_val) { this._arrSetVal(idx0, idx1, new_val); }
    }
    /**
     * Returns true if the sub-array contains the number.
     * @param idx0
     * @param num
     * @returns True or false.
     */
    public hasVal(idx0: number, num: number): boolean {
        const idx2: number = (idx0 * this._sub_arr_len);
        return this._data_view.subarray(idx2, idx2 + this._sub_arr_len).includes(num + 1);
    }
    /**
     * Returns the index of the first matching number in the sub-array, or -1.
     * @param idx0
     * @param num
     * @returns The index.
     */
    public idxOfVal(idx0: number, num: number): number {
        const idx2: number = (idx0 * this._sub_arr_len);
        return this._data_view.subarray(idx2, idx2 + this._sub_arr_len).indexOf(num + 1);
    }
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    // Public methods - for working with the container array
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    /**
     * Returns the number of arrays in the array of arrays.
     * @returns The length.
     */
    public len(): number {
        return this._arr_len;
    }
    /**
     * Returns a standard array of arrays representation.
     * @returns The array of arrays.
     */
    public toArr(limit?: number, end?: boolean): number[][] {
        limit = limit === undefined ? this._arr_len : limit;
        const arrs: number[][] = [];
        // get the whole thing
        if (this._arr_len < limit) {
            for (let next_idx0 = 0; next_idx0 < this._arr_len; next_idx0++) {
                arrs.push(this._arrGetData(next_idx0));
            }
            return arrs;
        }
        // get the start
        if (end === undefined || end === false) {
            for (let next_idx0 = 0; next_idx0 < limit; next_idx0++) {
                arrs.push(this._arrGetData(next_idx0));
            }
            return arrs;
        }
        // get the end
        for (let next_idx0 = this._arr_len - limit; next_idx0 < this._arr_len; next_idx0++) {
            arrs.push(this._arrGetData(next_idx0));
        }
        return arrs;
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
        const start: number[][] = this.toArr(half_limit, false);
        const end: number[][] = this.toArr(half_limit, true);
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
            data_arr_str = '[' + this._data_view.subarray(0, (this._arr_len * this._sub_arr_len)) + ']';
        } else {
            const half_limit: number = Math.ceil(limit / 2);
            const part2_start: number = this._arr_len - half_limit;
            // data
            data_arr_str =  '[' +
                this._data_view.subarray(0, half_limit * this._sub_arr_len) + ' ... '  +
                this._data_view.subarray(part2_start * this._sub_arr_len, (this._arr_len * this._sub_arr_len)) +
            ']';
        }
        // return the str
        return [
            '==========',
            'Num arrays = \t\t' + this._arr_len,
            'Length data= \t\t' + (this._arr_len * this._sub_arr_len),
            'Data buff size = \t' + this._data_view.length,
            'Data array = \t\t' + data_arr_str,
            'Nested array = \t\t' + this.toStr(limit),
            '=========='
        ].join('\n');
    }
}
