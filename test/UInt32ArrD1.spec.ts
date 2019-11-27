import 'jasmine';
import { Uint32ArrD1 } from '../src/Uint32ArrD1';

describe('Uint32ArrD1 - case 1:', () => {
    it('case 1: a is truthy', () => {
        const a = new Uint32ArrD1(10);
        expect(a).toBeTruthy('???');
    });
    it('Uint32ArrD1 - case 2:', () => {
        const a = new Uint32ArrD1(10);
        a.setVal(2, 111);
        a.setVal(4, 222);
        const b = a.toArray();
        expect(b).toEqual([undefined, undefined, 111, undefined, 222]);
    });
});
