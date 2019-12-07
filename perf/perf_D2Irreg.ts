import { Uint32ArrD2Irreg } from '../src/Uint32ArrD2Irreg';
import { randVarArr, randInt} from './rand';
import { countObjs } from './objects';

const ITERATIONS = 10000;
const MAX_ARRAY_LEN = 10000;
const MAX_SUB_ARRAY_LEN = 10;

export function test_typed() {
    const start = new Date().getTime();
    const arr = new Uint32ArrD2Irreg();
    for (let i = 0; i < ITERATIONS; i++) {
        // push sub-array
        arr.pushArr(randVarArr(1, MAX_SUB_ARRAY_LEN));
        // set sub-array
        const idx0_0 = randInt(MAX_ARRAY_LEN);
        const sub_arr = randVarArr(1, MAX_SUB_ARRAY_LEN);
        arr.setArr(idx0_0, sub_arr);
        // -----------------------
        // push value on sub-array
        arr.pushVal(idx0_0, 12345);
        // set val in sub-array
        const idx1_5 = randInt(sub_arr.length);
        arr.setVal(idx0_0, idx1_5, 123456);
        // has val in sub-array
        const has = arr.hasVal(idx0_0, 123456);
        // index of val in sub-array
        const idx = arr.idxOfVal(idx0_0, 123456);
        // get val in sub-array
        const idx1_8 = randInt(sub_arr.length);
        const b = arr.getVal(idx0_0, idx1_8);
        // insert val in sub-array
        const idx1_9 = randInt(sub_arr.length);
        arr.insVal(idx0_0, idx1_9, 5432);
        // remove val in sub-array
        const idx1_10 = randInt(sub_arr.length);
        arr.remVal(idx0_0, idx1_10);
        // pop value from sub-array
        const popped = arr.popVal(idx0_0);
        // -----------------------
        // get sub-array
        const idx0_1 = randInt(arr.len());
        const a = arr.getArr(idx0_1);
        // insert sub-array
        const idx0_2 = randInt(arr.len());
        arr.insArr(idx0_2, randVarArr(1, MAX_SUB_ARRAY_LEN));
        // remove sub-array
        const idx0_3 = randInt(arr.len());
        arr.remArr(idx0_3);
        delete sub-array
        const idx0_4 = randInt(arr.len());
        arr.delArr(idx0_4);
    }
    const end = new Date().getTime();
    const time = end - start;
    console.log('D2 IRREG TYPED Speed = ', time);
    console.log('D2 IRREG TYPED Num Props = ', Object.keys(arr).length);
    console.log('D2 IRREG TYPED Num Objects = ', countObjs(arr));
    return arr;
}

export function test_normal() {
    const start = new Date().getTime();
    const arr: number[][] = [];
    for (let i = 0; i < ITERATIONS; i++) {
        // push sub-array
        arr.push(randVarArr(1, MAX_SUB_ARRAY_LEN));
        // set sub-array
        const idx0_0 = randInt(MAX_ARRAY_LEN);
        const sub_arr = randVarArr(1, MAX_SUB_ARRAY_LEN);
        arr[idx0_0] =  sub_arr;
        // -----------------------
        // push value on sub-array
        arr[idx0_0].push(12345);
        // set val in sub-array
        const idx1_5 = randInt(sub_arr.length);
        arr[idx0_0][idx1_5] = 123456;
        // has val in sub-array
        const has = arr[idx0_0].includes(123456);
        // index of val in sub-array
        const idx = arr[idx0_0].indexOf(123456);
        // get val in sub-array
        const idx1_8 = randInt(sub_arr.length);
        const b = arr[idx0_0][idx1_8];
        // insert val in sub-array
        const idx1_9 = randInt(sub_arr.length);
        arr[idx0_0].splice(idx1_9, 0, 5432);
        // remove val in sub-array
        const idx1_10 = randInt(sub_arr.length);
        arr[idx0_0].splice(idx1_10, 1);
        // pop value from sub-array
        const popped = arr[idx0_0].pop();
        // -----------------------
        // get sub-array
        const idx0_1 = randInt(MAX_ARRAY_LEN);
        const a = arr[idx0_1];
        // // insert sub-array
        // const idx0_2 = randInt(arr.length);
        // arr.splice(idx0_2, 0, randVarArr(1, MAX_SUB_ARRAY_LEN));
        // // remove sub-array
        // const idx0_3 = randInt(arr.length);
        // arr.splice(idx0_3, 1);
        // delete sub-array
        const idx0_4 = randInt(arr.length);
        delete arr[idx0_4];
    }
    const end = new Date().getTime();
    const time = end - start;
    console.log('D2 IRREG NORMAL Speed = ', time);
    console.log('D2 IRREG NORMAL Props = ', Object.keys(arr).length);
    console.log('D2 IRREG NORMAL Num Objects = ', countObjs(arr));
    return arr;
}
