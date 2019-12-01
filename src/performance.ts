import { Uint32ArrD2Irreg } from './Uint32ArrD2Irreg';
import {ArrD2Irreg } from './ArrD2Irreg';
import {randArr, randInt} from './rand';

const ITERATIONS = 10000;
const MAX_ARRAY_LEN = 10000;
const MAX_SUB_ARRAY_LEN = 10;

function testA() {
    const start = new Date().getTime();
    const a = new Uint32ArrD2Irreg(16);
    for (let i = 0; i < ITERATIONS; i++) {
        // set
        const idx0 = randInt(MAX_ARRAY_LEN);
        a.setArr(idx0, randArr(MAX_SUB_ARRAY_LEN));
        // insert a number into the array
        const idx1 = randInt(a.arrLen(idx0) - 1);
        a.insVal(idx0, idx1, 123456);
        // delete a different array
        a.delArr(randInt(MAX_ARRAY_LEN));
    }
    const end = new Date().getTime();
    const time = end - start;
    console.log('TYPED Speed = ', time);
    console.log('TYPED Num Objects = ', Object.keys(a).length);
    return a;
}

// function testB() {
//     const start = new Date().getTime();
//     const b = new ArrD2Irreg(16);
//     for (let i = 0; i < ITERATIONS; i++) {
//         // set
//         b.setArr(randInt(MAX_ARRAY_LEN), randArr(MAX_SUB_ARRAY_LEN));
//         // delete
//         b.delArr(randInt(MAX_ARRAY_LEN));
//     }
//     const end = new Date().getTime();
//     const time = end - start;
//     console.log('FLAT Speed = ', time);
//     console.log('FLAT Num Objects = ', Object.keys(b).length);
//     return b;
// }

function testC() {
    const start = new Date().getTime();
    const c: number[][] = [];
    for (let i = 0; i < ITERATIONS; i++) {
        // set
        const idx0 = randInt(MAX_ARRAY_LEN);
        c[idx0] =  randArr(MAX_SUB_ARRAY_LEN);
        // insert a number into the array
        const idx1 = randInt(c[idx0].length - 1);
        c[idx0].splice(idx1, 0, 123456);
        // delete a different array
        delete c[randInt(MAX_ARRAY_LEN)];
    }
    const end = new Date().getTime();
    const time = end - start;
    console.log('NORMAL Speed = ', time);
    console.log('NORMAL Num Objects = ', Object.keys(c).length);
    return c;
}

const aa = testA();
// console.log('TYPED', aa.toDebugStr());

// const bb = testB();
// console.log('FLAT', bb.toDebugStr());

const cc = testC();
// console.log('NORMAL', JSON.stringify(cc));
