import { Uint32ArrD1 } from './Uint32ArrD1';
import { Uint32ArrD2Reg } from './Uint32ArrD2Reg';
import { Uint32ArrD2Irreg } from './Uint32ArrD2Irreg';
import {randArr, randInt} from './rand';

console.log('TEST');

const ITERATIONS = 10;
const MAX_ARRAY_LEN = 10;

function testA() {
    const a = new Uint32ArrD2Irreg();
    for (let i = 0; i < ITERATIONS; i++) {
        console.log('ITERATION', i);
        // set
        a.setArr(randInt(MAX_ARRAY_LEN), randArr(10));
        // delete
        // a.delArr(randInt(MAX_ARRAY_LEN));
    }
}
// testA();

const a = new Uint32ArrD2Irreg();
a.setArr(1, [11, 22, 33]);
a.insVal(1, 0, 555);
console.log(a.toDebugStr(12));
