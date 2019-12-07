import 'jasmine';
import { Uint32ArrD1 } from '../src/Uint32ArrD1';

describe('Uint32ArrD1', () => {

    it(': constructor', () => {
        const a = new Uint32ArrD1();
        expect(a).toBeTruthy('???');
        expect(a.toArr()).toEqual([]);
    });

    it(': setVal()', () => {
        const a = new Uint32ArrD1();
        a.setVal(2, 222);
        expect(a.toArr()).toEqual([undefined, undefined, 222]);
    });

});
