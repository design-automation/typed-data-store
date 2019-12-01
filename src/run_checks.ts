import { Uint32ArrD1 } from './Uint32ArrD1';
import { Uint32ArrD2Reg } from './Uint32ArrD2Reg';
import { Uint32ArrD2Irreg } from './Uint32ArrD2Irreg';
import {randArr, randInt} from './rand';

console.log('TEST');

const ITERATIONS = 10;
const MAX_ARRAY_LEN = 10;

function testA() {
    const a = new Uint32ArrD2Irreg(10);
    for (let i = 0; i < ITERATIONS; i++) {
        console.log('ITERATION', i);
        // set
        a.setArr(randInt(MAX_ARRAY_LEN), randArr(10));
        // delete
        // a.delArr(randInt(MAX_ARRAY_LEN));
    }
}
// testA();

const b = new Uint32ArrD2Irreg(16);
b.setArr(5000, [1, 2, 3, 4, 5]);
b.setArr(10000, [111, 222, 333, 444, 555]);
console.log(b.toDebugStr(12));
