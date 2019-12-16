import { Uint32ArrD1 } from '../src/Uint32ArrD1';
import { randInt } from './rand';
import { countObjs } from './objects';

const ITERATIONS = 10000;
const MAX_ARRAY_LEN = 10000;

export function test_typed() {
    const start = new Date().getTime();
    const arr = new Uint32ArrD1();
    for (let i = 0; i < ITERATIONS; i++) {
        // push
        arr.pushVal(randInt(1000));
        // set
        const idx_0 = randInt(MAX_ARRAY_LEN);
        arr.setVal(idx_0, randInt(1000));
        // get
        const idx_1 = randInt(arr.len());
        const a = arr.getVal(idx_1);
        // insert
        const idx_2 = randInt(arr.len());
        arr.insVal(idx_2, randInt(1000));
        // remove
        const idx_3 = randInt(arr.len());
        arr.remVal(idx_3);
        // delete
        const idx_4 = randInt(arr.len());
        arr.delVal(idx_4);
        // pop
        arr.popVal();
    }
    const end = new Date().getTime();
    const time = end - start;
    console.log('D1 TYPED Speed = ', time);
    // console.log('D1 TYPED Num Props = ', Object.keys(arr).length);
    console.log('D1 TYPED Num Objects = ', countObjs(arr));
    return arr;
}

export function test_normal() {
    const start = new Date().getTime();
    const arr: number[] = [];
    for (let i = 0; i < ITERATIONS; i++) {
        // push
        arr.push( randInt(1000) );
        // set
        const idx_0 = randInt(MAX_ARRAY_LEN);
        arr[idx_0] = randInt(1000);
        // get
        const idx_1 = randInt(arr.length);
        const a = arr[idx_1];
        // insert
        const idx_2 = randInt(arr.length);
        arr.splice(idx_2, 0, randInt(1000));
        // remove
        const idx_3 = randInt(arr.length);
        arr.splice(idx_3, 1);
        // delete
        const idx_4 = randInt(arr.length);
        delete arr[idx_4];
        // pop
        arr.pop();
    }
    const end = new Date().getTime();
    const time = end - start;
    console.log('D1 NORMAL Speed = ', time);
    // console.log('D1 NORMAL Num Props = ', Object.keys(arr).length);
    console.log('D1 NORMAL Num Objects = ', countObjs(arr));
    return arr;
}
