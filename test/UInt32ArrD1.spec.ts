import 'jasmine';
import { UInt32ArrD1 } from '../src/UInt32ArrD1';

describe('test set 1:', () => {
    it('case 1: a is truthy', () => {
        const a = new UInt32ArrD1(10);
        expect(a).toBeTruthy('???');
    });
    it('case 2: exact value of a', () => {
        const a = new UInt32ArrD1(10);
        a.setVal(2, 111);
        a.setVal(4, 222);
        const b = a.toArray();
        expect(b).toEqual([undefined, undefined, 111, undefined, 222]);
    });
});
