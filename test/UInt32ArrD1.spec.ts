import 'jasmine';
import { Uint32ArrD1 } from '../src/Uint32ArrD1';

const TESTS = 'Uint32ArrD1';

describe(TESTS, () => {


    it(TESTS + ': constructor', () => {
        const a = new Uint32ArrD1(10);
        expect(a).toBeTruthy('???');
    });


    it(TESTS + ': setVal()', () => {
        const a = new Uint32ArrD1(10);
        a.setVal(2, 111);
        a.setVal(4, 222);
        const b = a.toArray();
        expect(b).toEqual([undefined, undefined, 111, undefined, 222]);
    });


});
