/**
 * A sparse array of irregular arrays of unsigned ints.
 * The arrays will be referred to as the 'container array', and the 'sub-arrays'.
 *
 * The array can contain undefined sub-arrays, but not null values.
 * The sub-arrays cannot contain neither undefined nor null values.
 * `[undef, [], [11], [22, 33, 44], undef]`
 *
 * The nested array is represented by three flat arrays.
 * * _data_view contains the data items (ints) .
 * * _idx_view contains the start index of each sub-array.
 * * _len_view contains the length of each sub-array.
 *
 * # _data_view
 *
 * The data is stored in a UInt32 typed array. (Max is 4.2 billion.)
 *
 * This contains the actual values.
 *
 * # _idx_view
 *
 * The indexes are stored in a Uint32 typed array. (Max is 4.2 billion.)
 *
 * Each index indicates the start of each sub-array.
 *
 * There is an additional index at the end of the array.
 * This can be seen as one moroe dummy empty array at the end.
 * The value is equal to the length of the _data_view array.
 *
 * If the sub-array is undefined, the index indicate the location in the _data_view where the sub-array would be inserted.
 * So if the index was 3, it means that everything from 3 onwards (incl.) would get shifted to the right.
 * An undefined sub-array at the start of the _data_view array would have an index of 0.
 * An undefined sub-array at the end of the _data_view array would have an index equal to the _data_view array length.
 *
 * # _len_view
 *
 * The lengths are stored in a Uint16 typed array. (Max is 64 thousand.)
 *
 * A value of 0 indicates that the sub-array is undefine.
 *
 * There is an additional index at the end of the array. The value is set to 0.
 *
 * # Example - empty
 *
 * `nested = []`
 * `_data_view = []`
 * `_idx_view =  [0]`
 * `_len_view =  [0]`
 *
 * # Example - undef only
 *
 * `nested = [undef, undef]`
 * `_data_view = []`
 * `_idx_view =  [0, 0, 0]`
 * `_len_view =  [0, 0, 0]`
 *
 * # Example - some values
 *
 * `nested = [undef, [], [11], [22, 33, 44], undef]`
 * `_data_view = [0, 11, 22, 33, 44]`
 * `_idx_view =  [0, 0, 1, 2, 5, 5]`
 * `_len_view =  [0, 1, 2, 4, 0, 0]`
 *
 * # Sub-array padding in _data_view
 *
 * Shifting data ever time something is inserted or deleted reduces performance.
 * The _data_view has padding to reduce the number of times data needs to be shifted.
 * So if _padding is set to 2, then:
 *
 * `nested = [undef, [], [11], [22, 33, 44], undef]`
 * `_data_view = [11, 0, 0, 22, 33, 44, 0, 0]`
 * `_idx_view =  [0, 0, 0, 1, 4, 8]`
 * `_len_view =  [0, 1, 2, 4, 0, 0]`
 *
 * If a value is now pushed to nested[2], it fills the padding.
 * `nested.pushVal(2, 55)`
 * `nested = [undef, [], [11, 55], [22, 33, 44], undef]`
 * `_data_view = [11, 55, 0, 22, 33, 44, 0, 0]`
 * `_idx_view =  [0, 0, 0, 1, 4, 8]`
 * `_len_view =  [0, 1, 3, 4, 0, 0]`
 *
 * # Pushing in _data_view
 *
 * Pushing a value onto the end of a sub-array will overwrite padding.
 * If there is no more padding, then the sub-array length will be extended by adding padding.
 * This will result in all subsequent sub-arrays in _data_view being shifted to the right.
 *
 * # Deleting in _data_view
 *
 * Deleting a value in a sub-array will only shift the data in the sub-array.
 * Padding is added to the end of the sub-array.
 *
 * Deleting a whole sub-array will shift all subsequent sub-arrays in _data_view to the left.
 * The size of the shift is equal to the length of the sub-arry being deleted.
 * The index in _idx_view and _len_view are both set to 0.
 *
 *
 */
export class ArrD2Irreg {
    // index array
    private _idx_view: number[] = null;
    // len array
    private _len_view: number[] = null;
    // data array
    private _data_view: number[] = null;
    // others
    private _padding: number = null;
    private _num_arrs: number;

    /**
     * Constructor
     * @param padding The padding added to the end of each sub-array.
     * @param num_ints The size of the initial buffer, in integers.
     */
    public constructor(padding: number) {
        // index array
        this._idx_view = [];
        // len array
        this._len_view = [];
        // data array
        this._data_view = [];
        // add the additional element to the idx and len arrays
        this._len_view[0] = 0;
        this._idx_view[0] = 0;
        // arras and ints
        this._padding = padding;
        this._num_arrs = 0;
    }
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    // Private methods
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    /**
     * Get the index to the flat array from the two indexes for the nested array
     */
    private _getDataArrIdx(idx0: number, idx1: number): number {
        // if (idx0 >= this._num_arrs) { throw new Error('Error: Index 0 out of bounds.'); }
        // if (this._idx_view[idx0] === 0) { throw new Error('Error: Array is undefined.'); }
        // if (idx1 >= this._arrLen(idx0)) { throw new Error('Error: Index 1 is out of bounds.'); }
        return this._idx_view[idx0] + idx1;
    }
    /**
     * Return the length + padding.
     */
    private _arrSpace(idx0: number): number {
        return this._idx_view[idx0 + 1] - this._idx_view[idx0];
    }
    /**
     * Return the number of values in the sub-array.
     * If the sub-array is undefined, return 0.
     */
    private _arrLen(idx0: number): number {
        if (this._len_view[idx0] < 2) { return 0; } // undef or []
        return this._len_view[idx0] - 1;
    }
    /**
     * Set the number of values in the sub-array.
     */
    private _arrSetLen(idx0: number, len: number): void {
        this._len_view[idx0] = len + 1;
    }
    /**
     * Set a sub-array to be undefined.
     */
    private _arrSetUndef(idx0: number): void {
        this._len_view[idx0] = 0;
    }
    /**
     * Return true if this sub-array is the last one.
     */
    private _isArrLast(idx0: number): boolean {
        return idx0 === this._num_arrs - 1;
    }
    /**
     * Return true if this array is undefined
     */
    private _isArrUndef(idx0: number): boolean {
        return this._len_view[idx0] === 0;
    }
    /**
     * Return true if this array is not undefined, but has len = 0, i.e. []
     */
    private _isArrEmpty(idx0: number): boolean {
        return this._len_view[idx0] === 1;
    }
    /**
     * Get the index of the first element in the array.
     */
    private _arrStart(idx0: number): number {
        return this._idx_view[idx0];
    }
    /**
     * Get the index of the last element in the array.
     */
    private _arrEnd(idx0: number): number {
        if (this._len_view[idx0] < 2) { return this._idx_view[idx0]; }
        return this._idx_view[idx0] + this._len_view[idx0] - 2;
    }
    /**
     * Stretches the space that is available to an array to a new length.
     */
    private _arrStretchSpace(idx0: number, req_space: number): void {
        const end_idx2: number = this._idx_view[this._num_arrs];
        const space: number = this._arrSpace(idx0);
        // calc data shift
        const data_shift: number = req_space - space;
        // get end and next
        const next_idx2: number = this._idx_view[idx0 + 1];
        // shift data
        const from: number = next_idx2;
        const target: number = this._idx_view[idx0] + req_space;
        this._data_view.copyWithin(target, from, end_idx2);
        // update indexes for evertthing after idx0
        const i_max = this._num_arrs - idx0;
        for (let i = 1; i <= i_max; i++) {
            this._idx_view[idx0 + i] += data_shift;
        }
        // update _data_view length
        this._idx_view[this._num_arrs] = end_idx2 + data_shift;
    }
    /**
     * Stretches the space that is available to an array to a new length.
     */
    private _fillArr(big_arr: number[], idx: number, arr: number[]): void {
        for (let i = 0; i < arr.length; i++) {
            big_arr[idx + i] = arr[i];
        }
    }
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    // Public methods - for working with Sub-Arrays
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    /**
     * Sets the data for a sub-array.
     * Padding is added to the end of the data array.
     * If there is not enough space, the space is stretched.
     * Everything after idx0 gets shifted to the right.
     * @param idx0
     * @param arr The array of numbers, or undefined
     */
    public setArr(idx0: number, arr: number[]): number {
        // console.log('SET');
        // special case
        if (arr === undefined) { return this._setArrUndef(idx0); }
        // get end
        const end_idx2: number = this._idx_view[this._num_arrs];
        // two possibilities, overwrite an existing arr or add a new arr at or after _num_arrs
        if (idx0 < this._num_arrs) { // overwrite
            const space: number = this._arrSpace(idx0);
            // make enough space
            if (arr.length > space) {
                const req_space: number = arr.length + this._padding;
                this._arrStretchSpace(idx0, req_space);
            }
            // push the data for the last arr
            this._fillArr(this._data_view, this._idx_view[idx0], arr);
            // this._data_view.set(arr, this._idx_view[idx0]);
        } else { // add
            // add empty arrs
            const emp_arrs_to_add: number = idx0 - this._num_arrs + 1;
            // update idx arr
            for (let i = 0; i < emp_arrs_to_add; i++) {
                const next_idx0: number = this._num_arrs + i;
                this._idx_view[next_idx0] = end_idx2;
            }
            // set the data for the last arr
            this._fillArr(this._data_view, end_idx2, arr);
            // this._data_view.set(arr, end_idx2);
            // update _num_arrs
            this._num_arrs += emp_arrs_to_add;
            // update _data_view length
            this._idx_view[this._num_arrs] = end_idx2 + arr.length  + this._padding;
        }
        // update len
        this._arrSetLen(idx0, arr.length);
        // return
        return this._num_arrs;
    }
    private _setArrUndef(idx0: number): number {
        // special case
        if (idx0 < this._num_arrs) { this.delArr(idx0); return; }
        // get end
        const end_idx2: number = this._idx_view[this._num_arrs];
        // add empty arrs
        const emp_arrs_to_add: number = idx0 - this._num_arrs + 1;
        // update idx arr
        for (let i = 0; i < emp_arrs_to_add; i++) {
            const next_idx0: number = this._num_arrs + i;
            this._idx_view[next_idx0] = end_idx2;
        }
        // update _num_arrs
        this._num_arrs += emp_arrs_to_add;
        // update _data_view length
        this._idx_view[this._num_arrs] = end_idx2;
        // update len
        this._arrSetUndef(idx0);
        // return
        return this._num_arrs;
    }
    /**
     * Gets the data for a sub-array.
     * @param idx0
     * @returns The array of ints
     */
    public getArr(idx0: number): number[] {
        if (idx0 >= this._num_arrs) { throw new Error('Error: Index 0 out of bounds.'); }
        // console.log("GET")
        // special cases
        if (this._isArrUndef(idx0)) { return undefined; }
        if (this._isArrEmpty(idx0)) { return []; }
        // create arr of data
        const arr: number[] = new Array();
        const idx2_start: number = this._arrStart(idx0);
        const idx2_end: number = this._arrEnd(idx0);
        for (let idx2 = idx2_start; idx2 <= idx2_end; idx2++) {
            arr.push(this._data_view[idx2]);
        }
        // return arr of data
        return arr;
    }
    /**
     * Inserts a sub-array.
     * Insert at 0 inserts a sub-array at the start.
     * Insert at _num_arrs inserts a sub-array at the end.
     * Padding is added to the end of the data array.
     * Everything from idx0 onwards (incl.) gets shifted to the right.
     * @param idx0 The index at which to insert.
     * @param arr
     * @returns The length of the array after insertion
     */
    public insArr(idx0: number, arr: number[]): number {
        // console.log("INSERT")
        // special cases
        if (idx0 > this._num_arrs) { return this.setArr(idx0, arr); }
        if (idx0 === this._num_arrs) { this.pushArr(arr); return; }
        if (arr === undefined) { this._insArrUndef(idx0); return; }
        // get the indexes
        const end_idx2: number = this._idx_view[this._num_arrs];
        // shift data
        const from: number = this._idx_view[idx0];
        const target: number = this._idx_view[idx0] + arr.length + this._padding;
        this._data_view.copyWithin(target, from, end_idx2);
        // update indexes
        const data_shift: number = target - from; // to the right
        for (let i = 0; i <= this._num_arrs; i++) { // includes dummy
            const update_idx0: number = idx0 + i;
            this._idx_view[update_idx0] += data_shift;
        }
        // shift idx and len
        this._idx_view.copyWithin(
            idx0 + 1, // target
            idx0, this._num_arrs // from, to
        );
        this._len_view.copyWithin(
            idx0 + 1, // target
            idx0, this._num_arrs // from, to
        );
        // update idx
        this._idx_view[idx0] = from;
        // update len
        this._arrSetLen(idx0, arr.length);
        // push the data for the last arr
        this._fillArr(this._data_view, this._idx_view[idx0], arr);
        // this._data_view.set(arr, this._idx_view[idx0]);
        // update _num_arrs, add 1
        this._num_arrs += 1;
        // update _data_view length
        this._idx_view[this._num_arrs] = end_idx2 + data_shift;
        // return length
        return this._num_arrs;
    }
    private _insArrUndef(idx0: number): number {
        // special case
        if (idx0 === this._num_arrs) { return this._pushArrUndef(); }
        // get the indexes
        const end_idx2: number = this._idx_view[this._num_arrs];
        // shift idx and len
        this._idx_view.copyWithin(
            idx0 + 1, // target
            idx0, this._num_arrs // from, to
        );
        this._len_view.copyWithin(
            idx0 + 1, // target
            idx0, this._num_arrs // from, to
        );
        // update idx
        this._idx_view[idx0] = this._idx_view[idx0];
        // update len
        this._arrSetUndef(idx0);
        // update _num_arrs, add 1
        this._num_arrs += 1;
        // update _data_view length
        this._idx_view[this._num_arrs] = end_idx2;
        // return length
        return this._num_arrs;
    }
    /**
     * Push a sub-array.
     * Padding is added at the end of the data array.
     * @param arr
     * @returns The length of the array after pushing.
     */
    public pushArr(arr: number[]): number {
        // console.log("PUSH");
        // special case
        if (arr === undefined) { return this._pushArrUndef(); }
        // get the indexes
        const next_idx0: number = this._num_arrs;
        const next_idx2: number = this._idx_view[this._num_arrs];
        // push
        this._fillArr(this._data_view, next_idx2, arr);
        // this._data_view.set(arr, next_idx2);
        // update idx and len
        this._idx_view[next_idx0] = next_idx2;
        this._arrSetLen(next_idx0, arr.length);
        // update _num_arrs, add 1
        this._num_arrs += 1;
        // update _data_view length
        this._idx_view[this._num_arrs] = next_idx2 + arr.length + this._padding;
        // return the new length
        return this._num_arrs;
    }
    private _pushArrUndef(): number {
        // get the indexes
        const next_idx0: number = this._num_arrs;
        const next_idx2: number = this._idx_view[this._num_arrs];
        // update idx and len
        this._idx_view[next_idx0] = next_idx2;
        this._arrSetUndef(next_idx0);
        // update _num_arrs, add 1
        this._num_arrs += 1;
        // update _data_view length
        this._idx_view[this._num_arrs] = next_idx2;
        // return the new length
        return this._num_arrs;
    }
    /**
     * Removes a sub-array.
     * Everything after idx0 gets shifted to the left.
     * @param idx0 The index of the sub array to delete.
     */
    public delArr(idx0: number): void {
        if (idx0 >= this._num_arrs) { return; }
        // console.log("DEL")
        // get end and next
        const end_idx2: number = this._idx_view[this._num_arrs];
        const next_idx0 = idx0 + 1;
        // shift data
        const from: number = this._idx_view[next_idx0];
        const target: number = this._idx_view[idx0];
        this._data_view.copyWithin(target, from, end_idx2);
        // calc shift
        const data_shift: number = target - from; // to the left
        // update indexes
        for (let update_idx0 = idx0 + 1; update_idx0 <= this._num_arrs; update_idx0++) { // includes dummy
            this._idx_view[update_idx0] += data_shift;
        }
        // set undefined
        this._arrSetUndef(idx0);
    }
    /**
     * Removes a sub-array.
     * Everything after idx0 gets shifted to the left.
     * @param idx0 The index of the sub array to delete.
     */
    public remArr(idx0: number): void {
        if (idx0 >= this._num_arrs) { return; }
        // console.log("REM")
        // special case
        if (this._isArrLast(idx0)) { this.popArr(); return; }
        // get end and next
        const end_idx2: number = this._idx_view[this._num_arrs];
        const next_idx0 = idx0 + 1;
        // shift data
        const from: number = this._idx_view[next_idx0];
        const target: number = this._idx_view[idx0];
        this._data_view.copyWithin(target, from, end_idx2);
        // calc shift
        const data_shift: number = target - from; // to the left
        // update indexes
        for (let update_idx0 = idx0 + 1; update_idx0 <= this._num_arrs; update_idx0++) { // includes dummy
            this._idx_view[update_idx0] += data_shift;
        }
        // shift idx and len
        this._idx_view.copyWithin(
            idx0, // target
            next_idx0, this._num_arrs + 1 // from, to, includes dummy
        );
        this._len_view.copyWithin(
            idx0, // target
            next_idx0, this._num_arrs + 1 // from, to, includes dummy
        );
        // update _num_arrs, deduct 1
        this._num_arrs -= 1;
        // set dummy len to 0
        this._len_view[this._num_arrs] = 0;
    }
    /**
     * Deletes the last sub-array.
     */
    public popArr(): number[] {
        // console.log("POP")
        if (this._num_arrs === 0) { return undefined; }
        // get the arr to return
        const arr: number[] = this.getArr(this._num_arrs - 1);
        // update _num_arrs
        this._num_arrs -= 1;
        // make the last dummy arr be undefined
        this._len_view[this._num_arrs] = 0;
        // return the arr
        return arr;
    }
    /**
     * Gets the length of a sub-array.
     * If the sub-array is undefined, 0 is returned.
     */
    private arrLen(idx0: number): number {
        return this._arrLen(idx0);
    }
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    // Public methods - for working with values in sub-Arrays
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    /**
     * Overwrites an existing value in a sub-array with a new value.
     * Similar to data[idx0][idx1] = val
     * @param idx0
     * @param idx1
     * @param val
     */
    public setVal(idx0: number, idx1: number, val: number): void {
        if (idx0 >= this._num_arrs) { throw new Error('Error: Index 0 out of bounds.'); }
        const len: number = this._arrLen(idx0);
        if (idx1 >= len) { throw new Error('Error: Index 1 out of bounds.'); }
        // get index for _data_view array
        const idx2: number = this._getDataArrIdx(idx0, idx1);
        // set the value
        this._data_view[idx2] = val;
    }
    /**
     * Gets a value from the array of arrays.
     * Similar to val = data[idx0][idx1]
     * @param idx0
     * @param idx1
     * @returns The value
     */
    public getVal(idx0: number, idx1: number): number {
        if (idx0 >= this._num_arrs) { throw new Error('Error: Index 0 out of bounds.'); }
        const len: number = this._arrLen(idx0);
        if (idx1 >= len) { throw new Error('Error: Index 1 out of bounds.'); }
        // get index for _data_view array
        const idx2: number = this._getDataArrIdx(idx0, idx1);
        // return the value
        return this._data_view[idx2];
    }
    /**
     * Pushes a value onto the end of a sub array in the array of arrays.
     * Similar to data[idx0].push(val)
     * @param idx0
     * @param val
     * @returns The length of the sub array
     */
    public pushVal(idx0: number, val: number): number {
        if (idx0 >= this._num_arrs) { throw new Error('Error: Index 0 out of bounds.'); }
        // calc idx1 and idx2
        const idx1: number = this._arrLen(idx0);
        const idx2: number = this._getDataArrIdx(idx0, idx1);
        // stretch?
        if (idx1 >= this._arrSpace(idx0)) {
            const req_space: number = idx1 + this._padding;
            this._arrStretchSpace(idx0, req_space);
        }
        // set the value
        this._data_view[idx2] = val;
        // set the new length
        this._arrSetLen(idx0, idx1 + 1);
        // return len
        return idx1 + 1;
    }
    /**
     * Pops a value off the end of a sub-array.
     * Similar to data[idx0].pop()
     * If the array is empty, return undefined.
     * @returns The value that was popped
     */
    public popVal(idx0: number): number {
        if (idx0 >= this._num_arrs) { throw new Error('Error: Index 0 out of bounds.'); }
        // check len
        const len: number = this._arrLen(idx0);
        if (len === 0) { return undefined; }
        // calc idx1 and idx2
        const idx1: number = len - 1;
        const idx2: number = this._getDataArrIdx(idx0, idx1);
        // set new length
        this._arrSetLen(idx0, len - 1);
        // return the value
        return this._data_view[idx2];
    }
    /**
     * Inserts a value at the specified index in a sub-array.
     * The index must be less than or equal to the length of the sub-array.
     * Return the length of the sub-array after pushing.
     * @param idx0
     * @param idx1
     * @param val
     * @returns The length of the sub array
     */
    public insVal(idx0: number, idx1: number, val: number): number {
        if (idx0 >= this._num_arrs) { throw new Error('Error: Index 0 out of bounds.'); }
        const len: number = this._arrLen(idx0);
        if (idx1 >= len) { throw new Error('Error: Index 1 out of bounds.'); }
        // push?
        if (idx1 === len) { return this.pushVal(idx0, val); }
        // get index for _data_view array
        if (idx1 >= len) { return; }
        // stretch?
        if (len + 1 >= this._arrSpace(idx0)) {
            const req_space: number = len + 1 + this._padding;
            this._arrStretchSpace(idx0, req_space);
        }
        // calc index
        const idx2: number = this._getDataArrIdx(idx0, idx1);
        // shift data
        const from: number = idx2 ;
        const to: number = idx2 + len;
        const target: number = idx2 + 1;
        this._data_view.copyWithin(target, from, to);
        // set value
        this._data_view[idx2] = val;
        // set the new length
        this._arrSetLen(idx0, len + 1);
        // return length
        return len + 1;
    }
    /**
     * Removes a value at the specified index in the sub-array.
     * @param idx0
     * @param idx1
     */
    public remVal(idx0: number, idx1: number): number {
        if (idx0 >= this._num_arrs) { throw new Error('Error: Index 0 out of bounds.'); }
        const len: number = this._arrLen(idx0);
        if (idx1 >= len) { throw new Error('Error: Index 1 out of bounds.'); }
        // pop?
        if (idx1 === len - 1) { return this.popVal(idx0); }
        // get index for _data_view array
        const idx2: number = this._getDataArrIdx(idx0, idx1);
        const val: number = this._data_view[idx2];
        // shift data
        const from: number = idx2 + 1;
        const to: number = idx2 + len;
        const target: number = idx2;
        this._data_view.copyWithin(target, from, to);
        // set the new length
        this._arrSetLen(idx0, len - 1);
        // return value that was removed
        return val;
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
        return this._num_arrs;
    }
    /**
     * Returns true if the array exists in the array of arrays.
     * @param arr
     * @returns True or false.
     */
    public hasArr(arr: number[]): boolean {
        throw new Error('not implemented');
    }
    /**
     * Returns the index of the first matching array in the array of arrays, or -1.
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
    public toNestedArr(): number[][] {
        const arrs: number[][] = [];
        for (let next_idx0 = 0; next_idx0 < this._num_arrs; next_idx0++) {
            arrs.push(this.getArr(next_idx0));
        }
        return arrs;
    }
    /**
     * Returns a string representation of the array of arrays.
     * @returns The string representation.
     */
    public toStr(): string {
        return JSON.stringify(this.toNestedArr());
    }
    /**
     * Returns a string representation of various types of data in the array.
     * @returns The string representation.
     */
    public toDebugStr(): string {
        return [
            '==========',
            'Num arrays = \t\t' + this._num_arrs,
            'Length data= \t\t' + this._idx_view[this._num_arrs],
            // 'Data buff size = \t' + this._data_buff_cap_ints,
            // 'Idxlen buff size = \t' + this._idxlen_buff_cap_ints,
            // 'Data array = \t\t[' + this._data_view.subarray(0, this._idx_view[this._num_arrs]) + ']',
            // 'Idx array = \t\t[' + this._idx_view.subarray(0, this._num_arrs + 1) + ']',
            // 'Len array = \t\t[' + this._len_view.subarray(0, this._num_arrs + 1) + ']',
            'Nested array = \t\t' + this.toStr(),
            '=========='
        ].join('\n');
    }
}
