import { Uint32ArrD2Reg } from '../src/Uint32ArrD2Reg';
import {randFixArr, randInt} from './rand';
import { countObjs } from './objects';

const ITERATIONS = 10000;
const MAX_ARRAY_LEN = 10000;
const SUB_ARRAY_LEN = 10;

export function test_typed() {
    const start = new Date().getTime();
    const arr = new Uint32ArrD2Reg(SUB_ARRAY_LEN);
    for (let i = 0; i < ITERATIONS; i++) {
        // push sub-array
        arr.pushArr(randFixArr(SUB_ARRAY_LEN));
        // set sub-array
        const idx0_0 = randInt(MAX_ARRAY_LEN);
        arr.setArr(idx0_0, randFixArr(SUB_ARRAY_LEN));
        // set val
        const idx1_5 = randInt(SUB_ARRAY_LEN - 1);
        arr.setVal(idx0_0, idx1_5, 123456);
        // has val in sub-array
        const has = arr.hasVal(idx0_0, 123456);
        // index of val in sub-array
        const idx = arr.idxOfVal(idx0_0, 123456);
        // get val in sub-array
        const idx1_8 = randInt(SUB_ARRAY_LEN - 1);
        const b = arr.getVal(idx0_0, idx1_8);
        // get sub-array
        const idx0_1 = randInt(arr.len());
        const a = arr.getArr(idx0_1);
        // // insert sub-array
        // const idx0_2 = randInt(arr.len());
        // arr.insArr(idx0_2, randFixArr(SUB_ARRAY_LEN));
        // // remove sub-array
        // const idx0_3 = randInt(arr.len());
        // arr.remArr(idx0_3);
        // delete sub-array
        const idx0_4 = randInt(arr.len());
        arr.delArr(idx0_4);
    }
    const end = new Date().getTime();
    const time = end - start;
    console.log('D2 REG TYPED Speed = ', time);
    // console.log('D2 REG TYPED Num Props = ', Object.keys(arr).length);
    console.log('D2 REG TYPED Num Objects = ', countObjs(arr));
    return arr;
}

export function test_normal() {
    const start = new Date().getTime();
    const arr: number[][] = [];
    for (let i = 0; i < ITERATIONS; i++) {
        // push sub-array
        arr.push(randFixArr(SUB_ARRAY_LEN));
        // set sub-array
        const idx0_0 = randInt(MAX_ARRAY_LEN);
        arr[idx0_0] =  randFixArr(SUB_ARRAY_LEN);
        // set val in sub-array
        const idx1_5 = randInt(SUB_ARRAY_LEN - 1);
        arr[idx0_0][idx1_5] = 123456;
        // has val in sub-array
        const has = arr[idx0_0].includes(123456);
        // index of val in sub-array
        const idx = arr[idx0_0].indexOf(123456);
        // get val in sub-array
        const idx1_8 = randInt(SUB_ARRAY_LEN - 1);
        const b = arr[idx0_0][idx1_8];
        // get sub-array
        const idx0_1 = randInt(MAX_ARRAY_LEN);
        const a = arr[idx0_1];
        // // insert sub-array
        // const idx0_2 = randInt(arr.length);
        // arr.splice(idx0_2, 0, randFixArr(SUB_ARRAY_LEN));
        // // remove sub-array
        // const idx0_3 = randInt(arr.length);
        // arr.splice(idx0_3, 1);
        // delete sub-array
        const idx0_4 = randInt(arr.length);
        delete arr[idx0_4];
    }
    const end = new Date().getTime();
    const time = end - start;
    console.log('D2 REG NORMAL Speed = ', time);
    // console.log('D2 REG NORMAL Num Props = ', Object.keys(arr).length);
    console.log('D2 REG NORMAL Num Objects = ', countObjs(arr));
    return arr;
}
