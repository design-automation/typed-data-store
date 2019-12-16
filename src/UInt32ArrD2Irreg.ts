/**
 * A sparse array of irregular arrays of unsigned ints.
 * The arrays will be referred to as the 'container array', and the 'sub-arrays'.
 *
 * The array can contain undefined sub-arrays but not null.
 * The sub-arrays can contain undefined or null values.
 * `[undef, [], [11], [22, 33, 44, undefined, null], undef]`
 *
 **/
export class Uint32ArrD2Irreg {
    //  The nested array is represented by three flat arrays.
    //  * _data_view contains the data items (ints) .
    //  * _idx_view contains the start index of each sub-array.
    //  * _len_view contains the length of each sub-array.
    //
    //  # _data_view
    //
    //  The data is stored in a UInt32 typed array. (Max is 4.2 billion.)
    //
    //  This contains the actual values.
    //
    //  # _idx_view
    //
    //  The indexes are stored in a Uint32 typed array. (Max is 4.2 billion.)
    //
    //  Each index indicates the start of each sub-array.
    //
    //  There is an additional index at the end of the array.
    //  This can be seen as one moroe dummy empty array at the end.
    //  The value is equal to the length of the _data_view array.
    //
    //  If the sub-array is undefined, the index indicate the location in the _data_view where the sub-array would be inserted.
    //  So if the index was 3, it means that everything from 3 onwards (incl.) would get shifted to the right.
    //  An undefined sub-array at the start of the _data_view array would have an index of 0.
    //  An undefined sub-array at the end of the _data_view array would have an index equal to the _data_view array length.
    //
    //  # _len_view
    //
    //  The lengths are stored in a Uint16 typed array. (Max is 64 thousand.)
    //
    //  A value of 0 indicates that the sub-array is undefine.
    //
    //  There is an additional index at the end of the array. The value is set to 0.
    //
    //  # Example - empty
    //
    //  `nested = []`
    //  `_data_view = []`
    //  `_idx_view =  [0]`
    //  `_len_view =  [0]`
    //
    //  # Example - undef only
    //
    //  `nested = [undef, undef]`
    //  `_data_view = []`
    //  `_idx_view =  [0, 0, 0]`
    //  `_len_view =  [0, 0, 0]`
    //
    //  # Example - some values
    //
    //  `nested = [undef, [], [11], [22, 33, 44], undef]`
    //  `_data_view = [0, 11, 22, 33, 44]`
    //  `_idx_view =  [0, 0, 1, 2, 5, 5]`
    //  `_len_view =  [0, 1, 2, 4, 0, 0]`
    //
    //  # Sub-array padding in _data_view
    //
    //  Shifting data ever time something is inserted or deleted reduces performance.
    //  The _data_view has padding to reduce the number of times data needs to be shifted.
    //  So if _padding is set to 2, then:
    //
    //  `nested = [undef, [], [11], [22, 33, 44], undef]`
    //  `_data_view = [11, 0, 0, 22, 33, 44, 0, 0]`
    //  `_idx_view =  [0, 0, 0, 1, 4, 8]`
    //  `_len_view =  [0, 1, 2, 4, 0, 0]`
    //
    //  If a value is now pushed to nested[2], it fills the padding.
    //  `nested.pushVal(2, 55)`
    //  `nested = [undef, [], [11, 55], [22, 33, 44], undef]`
    //  `_data_view = [11, 55, 0, 22, 33, 44, 0, 0]`
    //  `_idx_view =  [0, 0, 0, 1, 4, 8]`
    //  `_len_view =  [0, 1, 3, 4, 0, 0]`
    //
    //  # Pushing in _data_view
    //
    //  Pushing a value onto the end of a sub-array will overwrite padding.
    //  If there is no more padding, then the sub-array length will be extended by adding padding.
    //  This will result in all subsequent sub-arrays in _data_view being shifted to the right.
    //
    //  # Deleting in _data_view
    //
    //  Deleting a value in a sub-array will only shift the data in the sub-array.
    //  Padding is added to the end of the sub-array.
    //
    //  Deleting a whole sub-array will shift all subsequent sub-arrays in _data_view to the left.
    //  The size of the shift is equal to the length of the sub-arry being deleted.
    //  The index in _idx_view and _len_view are both set to 0.
    //
    // static
    private static BUFF_START_SIZE = 1024;
    private static BUFF_STEP_SIZE = 1024;
    private static LEN_MULT = 16;
    // index array
    private _sub_arr_idx_view: Uint32Array = null;
    // len array
    private _sub_arr_len_view: Uint16Array = null;
    // data array
    private _data_view: Uint32Array = null;
    // total number of arrays
    private _arr_len: number = null;

    /**
     * Constructor
     */
    public constructor() {
        // index array
        this._sub_arr_idx_view = new Uint32Array(
            new ArrayBuffer(Uint32ArrD2Irreg.BUFF_START_SIZE * Uint32Array.BYTES_PER_ELEMENT)
        );
        // len array
        this._sub_arr_len_view = new Uint16Array(
            new ArrayBuffer(Uint32ArrD2Irreg.BUFF_START_SIZE * Uint16Array.BYTES_PER_ELEMENT)
        );
        // data array
        this._data_view = new Uint32Array(
            new ArrayBuffer(Uint32ArrD2Irreg.BUFF_START_SIZE * Uint32Array.BYTES_PER_ELEMENT)
        );
        // add the additional element to the idx and len arrays
        this._sub_arr_len_view[0] = 0;
        this._sub_arr_idx_view[0] = 0;
        // arrs and ints
        this._arr_len = 0;
    }
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    // Private methods
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    /**
     * Increases the size of the index buffer.
     */
    private _extendIdxLenBuff(ints_to_add: number): void {
        if (this._arr_len + ints_to_add < this._sub_arr_idx_view.length) { return; }
        // console.log('XXX EXTEND IDX LEN BUFF XXX');
        const new_num_vals: number = this._sub_arr_idx_view.length +
            Math.ceil(ints_to_add / Uint32ArrD2Irreg.BUFF_STEP_SIZE) * Uint32ArrD2Irreg.BUFF_STEP_SIZE;
        // idx
        const new_idx_view: Uint32Array = new Uint32Array(
            new ArrayBuffer(new_num_vals * Uint32Array.BYTES_PER_ELEMENT)
        );
        new_idx_view.set(this._sub_arr_idx_view);
        this._sub_arr_idx_view = new_idx_view;
        // len
        const new_len_view: Uint16Array = new Uint16Array(
            new ArrayBuffer(new_num_vals * Uint16Array.BYTES_PER_ELEMENT)
        );
        new_len_view.set(this._sub_arr_len_view);
        this._sub_arr_len_view = new_len_view;
    }
    /**
     * Increases the size of the data buffer if the number of ints to add connot be accomodated.
     */
    private _extendDataBuff(ints_to_add: number): void {
        if (this._sub_arr_idx_view[this._arr_len] + ints_to_add <= this._data_view.length) { return; }
        // console.log('XXX EXTEND DATA BUFF XXX');
        const new_num_vals: number = this._data_view.length +
            Math.ceil(ints_to_add / Uint32ArrD2Irreg.BUFF_STEP_SIZE) * Uint32ArrD2Irreg.BUFF_STEP_SIZE;
        // data
        const new_data_view: Uint32Array = new Uint32Array(
            new ArrayBuffer(new_num_vals * Uint32Array.BYTES_PER_ELEMENT)
        );
        new_data_view.set(this._data_view);
        this._data_view = new_data_view;
    }
    /**
     * Get the index to the flat array from the two indexes for the nested array
     */
    private _getDataArrIdx(idx0: number, idx1: number): number {
        return this._sub_arr_idx_view[idx0] + idx1;
    }
    /**
     * Shifts the data in the data array and updates the indexes in the index array.
     * The shift can be positive or negative.
     * Beware, when you shift negatively, you overwrite data.
     */
    private _shiftData(idx0: number, offset: number): void {
        this._data_view.copyWithin(
            this._sub_arr_idx_view[idx0] + offset, this._sub_arr_idx_view[idx0], this._sub_arr_idx_view[this._arr_len]);
        // update indexes
        for (let i = 0; i <= this._arr_len; i++) { // includes dummy
            this._sub_arr_idx_view[idx0 + i] += offset;
        }
    }
    /**
     * Return the length + padding.
     */
    private _arrSpace(idx0: number): number {
        return this._sub_arr_idx_view[idx0 + 1] - this._sub_arr_idx_view[idx0];
    }
    /**
     * Return the number of values in the sub-array.
     * If the sub-array is undefined, return 0.
     */
    private _arrLen(idx0: number): number {
        return this._sub_arr_len_view[idx0] < 2 ? 0 : this._sub_arr_len_view[idx0] - 1;
    }
    /**
     * Return the padding
     */
    private _arrPad(idx0: number): number {
        const len: number = this._sub_arr_len_view[idx0] < 2 ?  0 : this._sub_arr_len_view[idx0] - 1;
        return this._sub_arr_idx_view[idx0 + 1] - this._sub_arr_idx_view[idx0] - len;
    }
    /**
     * Set the number of values in the sub-array.
     */
    private _arrSetLen(idx0: number, len: number): void {
        this._sub_arr_len_view[idx0] = len + 1;
    }
    /**
     * Set a sub-array to be undefined.
     */
    private _arrSetUndef(idx0: number): void {
        this._sub_arr_len_view[idx0] = 0;
    }
    /**
     * Set the value in the array.
     */
    private _arrSetVal(idx0: number, idx1: number, val: number): void {
        const idx2: number = this._sub_arr_idx_view[idx0] + idx1;
        if (val === undefined) {
            this._data_view[idx2] = 1;
        } else if (val === null) {
            this._data_view[idx2] = 2;
        } else {
            this._data_view[idx2] = val + 3;
        }
    }
    /**
     * Get the value in the array.
     */
    private _arrGetVal(idx0: number, idx1: number): number {
        const idx2: number = this._sub_arr_idx_view[idx0] + idx1;
        if (this._data_view[idx2] === 0) {
            return undefined; // empty
        } else if (this._data_view[idx2] === 1) {
            return undefined;
        } else if (this._data_view[idx2] === 2) {
            return null;
        } else {
            return this._data_view[idx2] - 3;
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
     * Set a sub-array contents.
     */
    private _arrSetData(idx0: number, arr: number[]): void {
        if (arr === undefined) {
            // update len for the last arr, set undefined
            this._sub_arr_len_view[idx0] = 0;
        } else {
            const encoded_arr: number[] = [];
            for (const val of arr) {
                if (val === undefined) {
                    encoded_arr.push(1);
                } else if (val === null) {
                    encoded_arr.push(2);
                } else {
                    encoded_arr.push(val + 3);
                }
            }
            // set the data for the last arr
            this._data_view.set(encoded_arr, this._sub_arr_idx_view[idx0]);
            // update len for the last arr
            this._sub_arr_len_view[idx0] = encoded_arr.length + 1;
        }
    }
    /**
     * Get a sub-array contents.
     */
    private _arrGetData(idx0: number): number[] {
        if (this._sub_arr_len_view[idx0] === 0) { return undefined; }
        if (this._sub_arr_len_view[idx0] === 1) { return []; }
        // create arr of data
        const arr: number[] = new Array();
        const idx2_start: number = this._arrStart(idx0);
        const idx2_end: number = this._arrEnd(idx0);
        for (let idx2 = idx2_start; idx2 <= idx2_end; idx2++) {
            const val: number = this._data_view[idx2];
            if (val === 1) {
                arr.push(undefined);
            } else if (val === 2) {
                arr.push(null);
            } else {
                arr.push(val - 3);
            }
        }
        return arr;
    }
    /**
     * Return true if this sub-array is the last one.
     */
    private _isArrLast(idx0: number): boolean {
        return idx0 === this._arr_len - 1;
    }
    /**
     * Get the index of the first element in the array.
     */
    private _arrStart(idx0: number): number {
        return this._sub_arr_idx_view[idx0];
    }
    /**
     * Get the index of the last element in the array.
     */
    private _arrEnd(idx0: number): number {
        if (this._sub_arr_len_view[idx0] < 2) { return this._sub_arr_idx_view[idx0]; }
        return this._sub_arr_idx_view[idx0] + this._sub_arr_len_view[idx0] - 2;
    }
    /**
     * Stretches the space that is available to an array to a new length.
     */
    private _arrStretchSpace(idx0: number, req_space: number): void {
        const end_idx2: number = this._sub_arr_idx_view[this._arr_len];
        const space: number = this._arrSpace(idx0);
        // calc data shift
        const data_shift: number = req_space - space;
        // get end and next
        const next_idx2: number = this._sub_arr_idx_view[idx0 + 1];
        // extend
        this._extendDataBuff(data_shift);
        // shift data
        const from: number = next_idx2;
        const target: number = this._sub_arr_idx_view[idx0] + req_space;
        this._data_view.copyWithin(target, from, end_idx2);
        // update indexes for evertthing after idx0
        const i_max = this._arr_len - idx0;
        for (let i = 1; i <= i_max; i++) {
            this._sub_arr_idx_view[idx0 + i] += data_shift;
        }
        // update _data_view length
        this._sub_arr_idx_view[this._arr_len] = end_idx2 + data_shift;
    }
    /**
     * Calculates space, as a multiple of _padding.
     */
    private _calcReqSpace(arr: number[]): number {
        if (arr === undefined) { return Uint32ArrD2Irreg.LEN_MULT; }
        return arr.length <= Uint32ArrD2Irreg.LEN_MULT ?
            Uint32ArrD2Irreg.LEN_MULT :
            Math.ceil(arr.length / Uint32ArrD2Irreg.LEN_MULT) * Uint32ArrD2Irreg.LEN_MULT;
    }
    private _setArrOverwrite(idx0: number, arr: number[]): void {
        const space: number = this._arrSpace(idx0);
        // make enough space
        if (arr.length > space) {
            const req_space: number = this._calcReqSpace(arr);
            this._arrStretchSpace(idx0, req_space);
        }
        // push the data for the last arr
        this._arrSetData(idx0, arr);
        // update len
        this._arrSetLen(idx0, arr.length);
    }
    private _setArrExtend(idx0: number, arr: number[]): void {
        // get end of data_view array
        const end_idx2: number = this._sub_arr_idx_view[this._arr_len];
        // add empty arrs
        const num_arrs_to_add: number = idx0 - this._arr_len + 1;
        // extend idx and len buffs by emp_arrs_to_add
        this._extendIdxLenBuff(num_arrs_to_add);
        // calc space required for this arr
        const req_space: number = this._calcReqSpace(arr);
        // extend data buff, adding space for all emp_arrs_to_add
        const num_vals_to_add: number = ((num_arrs_to_add - 1) * Uint32ArrD2Irreg.LEN_MULT) + req_space;
        this._extendDataBuff(num_vals_to_add);
        // update len and idx for each new empty arr
        for (let i = 0; i < num_arrs_to_add; i++) {
            const next_idx0: number = this._arr_len + i;
            this._sub_arr_len_view[next_idx0] = 0; // undefined
            this._sub_arr_idx_view[next_idx0] = end_idx2 + (i * Uint32ArrD2Irreg.LEN_MULT);
        }
        // update _num_arrs
        this._arr_len += num_arrs_to_add;
        // update _data_view length
        this._sub_arr_idx_view[this._arr_len] = end_idx2 + num_vals_to_add;
        // set the last arr
        this._arrSetData(idx0, arr);
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
        // delete a sub array
        if (arr === undefined && idx0 < this._arr_len) { this.delArr(idx0); return this._arr_len; }
        // overwrite an existing arr
        if (idx0 < this._arr_len) { this._setArrOverwrite(idx0, arr); return this._arr_len; }
        // extend by adding a new arr at or after _num_arrs
        this._setArrExtend(idx0, arr);
        return this._arr_len;
    }
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
     * Inserts a sub-array.
     * Insert at 0 inserts a sub-array at the start.
     * Insert at _num_arrs inserts a sub-array at the end (same as push()).
     * Padding is added to the end of the data array.
     * Everything from idx0 onwards (incl.) gets shifted to the right.
     * @param idx0 The index at which to insert.
     * @param arr
     * @returns The length of the array after insertion
     */
    public insArr(idx0: number, arr: number[]): number {
        // console.log("INSERT")
        // special cases
        if (idx0 > this._arr_len) { return this.setArr(idx0, arr); }
        if (idx0 === this._arr_len) { this.pushArr(arr); return; }
        // get the end index of the data view
        const idx2: number = this._sub_arr_idx_view[idx0];
        const end_idx2: number = this._sub_arr_idx_view[this._arr_len];
        // extend idx len views
        this._extendIdxLenBuff(1);
        // calc space required for this arr
        const req_space: number = this._calcReqSpace(arr);
        // extend data view
        this._extendDataBuff(req_space);
        // shift data
        this._shiftData(idx0, req_space);
        // shift idx and len
        this._sub_arr_idx_view.copyWithin(
            idx0 + 1, // target
            idx0, this._arr_len // from, to
        );
        this._sub_arr_len_view.copyWithin(
            idx0 + 1, // target
            idx0, this._arr_len // from, to
        );
        // update idx
        this._sub_arr_idx_view[idx0] = idx2;
        // update _num_arrs, add 1
        this._arr_len += 1;
        // update _data_view length
        this._sub_arr_idx_view[this._arr_len] = end_idx2 + req_space;
        // set the new arr data
        this._arrSetData(idx0, arr);
        // return length
        return this._arr_len;
    }
    /**
     * Push a sub-array.
     * Padding is added at the end of the data array.
     * @param arr
     * @returns The length of the array after pushing.
     */
    public pushArr(arr: number[]): number {
        // console.log("PUSH");
        // set the next idx0
        const idx0: number = this._arr_len;
        // get the end index of the data view
        const end_idx2: number = this._sub_arr_idx_view[this._arr_len];
        // extend idx len views
        this._extendIdxLenBuff(1);
        // calc space required for this arr
        const req_space: number = this._calcReqSpace(arr);
        // extend data view
        this._extendDataBuff(req_space);
        // update _num_arrs, add 1
        this._arr_len += 1;
        // update _data_view length
        this._sub_arr_idx_view[this._arr_len] = end_idx2 + req_space;
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
    public remArr(idx0: number): void {
        if (idx0 >= this._arr_len) { return; }
        // console.log("REM")
        // special case
        if (this._isArrLast(idx0)) { this.popArr(); return; }
        // get end and next
        const next_idx0 = idx0 + 1;
        // shift data - do not shift to improve performance
        // const offset: number = this._sub_arr_idx_view[idx0] - this._sub_arr_idx_view[next_idx0]; // to the left
        // this._shiftData(next_idx0, offset);
        // shift idx and len
        this._sub_arr_idx_view.copyWithin(
            idx0, // target
            next_idx0, this._arr_len + 1 // from, to, includes dummy
        );
        this._sub_arr_len_view.copyWithin(
            idx0, // target
            next_idx0, this._arr_len + 1 // from, to, includes dummy
        );
        // update _num_arrs, deduct 1
        this._arr_len -= 1;
        // set dummy len to 0
        this._sub_arr_len_view[this._arr_len] = 0;
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
        // make the last dummy arr be undefined
        this._sub_arr_len_view[this._arr_len] = 0;
        // return the arr
        return arr;
    }
    /**
     * Gets the length of a sub-array.
     * If the sub-array is undefined, 0 is returned.
     */
    public arrLen(idx0: number): number {
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
        if (idx0 >= this._arr_len) { throw new Error('Error: Index 0 out of bounds.'); }
        const len: number = this._arrLen(idx0);
        if (idx1 >= len) { throw new Error('Error: Index 1 out of bounds.'); }
        // set the value
        this._arrSetVal(idx0, idx1, val);
    }
    /**
     * Gets a value from the array of arrays.
     * Similar to val = data[idx0][idx1]
     * @param idx0
     * @param idx1
     * @returns The value
     */
    public getVal(idx0: number, idx1: number): number {
        if (idx0 >= this._arr_len) { throw new Error('Error: Index 0 out of bounds.'); }
        const len: number = this._arrLen(idx0);
        if (idx1 >= len) { throw new Error('Error: Index 1 out of bounds.'); }
        // return the value
        return this._arrGetVal(idx0, idx1);
    }
    /**
     * Pushes a value onto the end of a sub array in the array of arrays.
     * Similar to data[idx0].push(val)
     * @param idx0
     * @param val
     * @returns The length of the sub array
     */
    public pushVal(idx0: number, val: number): number {
        if (idx0 >= this._arr_len) { throw new Error('Error: Index 0 out of bounds.'); }
        // calc idx1 and idx2
        const idx1: number = this._arrLen(idx0);
        // stretch?
        if (idx1 >= this._arrSpace(idx0)) {
            const req_space: number = idx1 + Uint32ArrD2Irreg.LEN_MULT;
            this._arrStretchSpace(idx0, req_space);
        }
        // set the value
        this._arrSetVal(idx0, idx1, val);
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
        if (idx0 >= this._arr_len) { throw new Error('Error: Index 0 out of bounds.'); }
        // check len
        const len: number = this._arrLen(idx0);
        if (len === 0) { return undefined; }
        // calc idx1 and idx2
        const idx1: number = len - 1;
        const val: number = this._arrGetVal(idx0, idx1);
        // set new length
        this._arrSetLen(idx0, len - 1);
        // return the value
        return val;
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
        if (idx0 >= this._arr_len) { throw new Error('Error: Index 0 out of bounds.'); }
        const len: number = this._arrLen(idx0);
        if (idx1 > len) { throw new Error('Error: Index 1 out of bounds.'); }
        // push?
        if (idx1 === len) { return this.pushVal(idx0, val); }
        // get index for _data_view array
        if (idx1 >= len) { return; }
        // stretch?
        if (len + 1 >= this._arrSpace(idx0)) {
            const req_space: number = len + 1 + Uint32ArrD2Irreg.LEN_MULT;
            this._arrStretchSpace(idx0, req_space);
        }
        // calc index and shift the data
        const idx2: number = this._getDataArrIdx(idx0, idx1);
        const from: number = idx2 ;
        const to: number = idx2 + len;
        const target: number = idx2 + 1;
        this._data_view.copyWithin(target, from, to);
        // set value
        this._arrSetVal(idx0, idx1, val);
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
        if (idx0 >= this._arr_len) { throw new Error('Error: Index 0 out of bounds.'); }
        const len: number = this._arrLen(idx0);
        if (idx1 >= len) { throw new Error('Error: Index 1 out of bounds.'); }
        // pop?
        if (idx1 === len - 1) { return this.popVal(idx0); }
        // get index for _data_view array
        const val: number = this._arrGetVal(idx0, idx1);
        // calc index and shift data
        const idx2: number = this._getDataArrIdx(idx0, idx1);
        const from: number = idx2 + 1;
        const to: number = idx2 + len;
        const target: number = idx2;
        this._data_view.copyWithin(target, from, to);
        // set the new length
        this._arrSetLen(idx0, len - 1);
        // return value that was removed
        return val;
    }
    /**
     * Returns true if the sub-array contains the number.
     * @param idx0
     * @param val
     * @returns True or false.
     */
    public hasVal(idx0: number, val: number): boolean {
        const idx2: number = this._sub_arr_idx_view[idx0];
        const sub_arr: Uint32Array = this._data_view.subarray(idx2, idx2 + this._arrLen(idx0));
        return sub_arr.includes(this._encodeVal(val));
    }
    /**
     * Returns the index of the first matching number in the sub-array, or -1.
     * @param idx0
     * @param val
     * @returns The index.
     */
    public idxOfVal(idx0: number, val: number): number {
        const idx2: number = this._sub_arr_idx_view[idx0];
        const sub_arr: Uint32Array = this._data_view.subarray(idx2, idx2 + this._arrLen(idx0));
        return sub_arr.indexOf(this._encodeVal(val));
    }
    /**
     * Adds a value to a sub-array if the sub-arrays does not already contain the value.
     * @param idx0
     * @param val
     * @returns The index of the value.
     */
    public addValToSet(idx0: number, val: number): number {
        const idx2: number = this._sub_arr_idx_view[idx0];
        const sub_arr: Uint32Array = this._data_view.subarray(idx2, idx2 + this._arrLen(idx0));
        const index: number = sub_arr.indexOf( this._encodeVal(val) );
        if (index !== -1) { return index; }
        return this.pushVal(idx0, val) - 1;
    }
    /**
     * Removes a value from a sub-array if the sub-array contains the value.
     * @param idx0
     * @param val
     * @returns True if the value was removed, false otherwise..
     */
    public remValFromSet(idx0: number, val: number): boolean {
        const idx2: number = this._sub_arr_idx_view[idx0];
        const sub_arr: Uint32Array = this._data_view.subarray(idx2, idx2 + this._arrLen(idx0));
        const index: number = sub_arr.indexOf( this._encodeVal(val) );
        if (index === -1) { return false; }
        this.remVal(idx0, index);
        return true;
    }
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    // Public methods - for working with the container array
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    /**
     * Returns a deep clone of the array.
     * @returns The Uint32ArrD2Irreg clone.
     */
    public clone(): Uint32ArrD2Irreg {
        const new_arr: Uint32ArrD2Irreg = new Uint32ArrD2Irreg();
        new_arr._sub_arr_idx_view = new Uint32Array( this._sub_arr_idx_view );
        new_arr._sub_arr_len_view = new Uint16Array( this._sub_arr_len_view );
        new_arr._data_view = new Uint32Array( this._data_view );
        new_arr._arr_len = this._arr_len;
        return new_arr;
    }
    /**
     * Removes extra empty space in the data_view array.
     * This is an expensive operation and should be used sparingly.
     */
    public purge(): void {
        for (let i = 0; i < this._arr_len; i++) {
            const pad: number = this._arrPad(i);
            if (pad > Uint32ArrD2Irreg.LEN_MULT) {
                this._shiftData(i, -Math.floor(pad / Uint32ArrD2Irreg.LEN_MULT) * Uint32ArrD2Irreg.LEN_MULT);
            }
        }
    }
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
                arrs.push(this.getArr(next_idx0));
            }
            return arrs;
        }
        // get the start
        if (end === undefined || end === false) {
            for (let next_idx0 = 0; next_idx0 < limit; next_idx0++) {
                arrs.push(this.getArr(next_idx0));
            }
            return arrs;
        }
        // get the end
        for (let next_idx0 = this._arr_len - limit; next_idx0 < this._arr_len; next_idx0++) {
            arrs.push(this.getArr(next_idx0));
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
        let idx_arr_str = '';
        let len_arr_str = '';
        if (this._arr_len < limit) {
            // data
            data_arr_str = '[' + this._data_view.subarray(0, this._sub_arr_idx_view[this._arr_len]) + ']';
            // idx
            idx_arr_str = '[' + this._sub_arr_idx_view.subarray(0, this._arr_len + 1) + ']';
            // len
            len_arr_str = '[' + this._sub_arr_len_view.subarray(0, this._arr_len + 1) + ']';
        } else {
            const half_limit: number = Math.ceil(limit / 2);
            const part2_start: number = this._arr_len - half_limit;
            // data
            data_arr_str =  '[' +
                this._data_view.subarray(0, this._sub_arr_idx_view[half_limit]) + ' ... '  +
                this._data_view.subarray(this._sub_arr_idx_view[part2_start], this._sub_arr_idx_view[this._arr_len]) +
            ']';
            // idx
            idx_arr_str = '[' +
                this._sub_arr_idx_view.subarray(0, half_limit) + ' ... '
                + this._sub_arr_idx_view.subarray(part2_start, this._arr_len + 1) +
            ']' ;
            // len
            len_arr_str = '[' +
                this._sub_arr_len_view.subarray(0, half_limit) + ' ... '  +
                this._sub_arr_len_view.subarray(part2_start, this._arr_len + 1) +
            ']';
        }
        // return the str
        return [
            '==========',
            'Num arrays = \t\t' + this._arr_len,
            'Length data= \t\t' + this._sub_arr_idx_view[this._arr_len],
            'Data buff size = \t' + this._data_view.length,
            'Idxlen buff size = \t' + this._sub_arr_idx_view.length,
            'Data array = \t\t' + data_arr_str,
            'Idx array = \t\t' + idx_arr_str,
            'Len array = \t\t' + len_arr_str,
            'Nested array = \t\t' + this.toStr(limit),
            '=========='
        ].join('\n');
    }
}
