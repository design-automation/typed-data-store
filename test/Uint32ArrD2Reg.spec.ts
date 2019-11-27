import 'jasmine';
import { Uint32ArrD2Reg } from '../src/Uint32ArrD2Reg';

describe('Uint32ArrD2Reg - case 1:', () => {
    it('case 1: a is truthy', () => {
        const a = new Uint32ArrD2Reg(3, 10);
        expect(a).toBeTruthy('???');
    });
    it('Uint32ArrD2Reg - case 2:', () => {
        const a = new Uint32ArrD2Reg(3, 10);
        a.setArr(2, [111, 222, 333]);
        a.setArr(4, [0, 0, 0]);
        a.setVal(1, 2, 123);
        const b = a.toArray();
        expect(b).toEqual([undefined, [undefined, undefined, 123], [111, 222, 333], undefined, [0, 0, 0]]);
    });
});
