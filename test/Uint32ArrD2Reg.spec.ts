import 'jasmine';
import { Uint32ArrD2Reg } from '../src/Uint32ArrD2Reg';

describe('Uint32ArrD2Reg', () => {


    it(': constructor', () => {
        const a = new Uint32ArrD2Reg(3, 30);
        expect(a).toBeTruthy('???');
        expect(a.length()).toEqual(0);
        expect(a.toArray()).toEqual([]);
    });


    it(': setArr()', () => {
        const a = new Uint32ArrD2Reg(3, 10 * 3);
        a.setArr(2, [111, 222, 333]);
        a.setArr(4, [0, 0, 0]);
        a.setArr(4, [1, 2, 3]);
        expect(a.length()).toEqual(5);
        expect(a.toArray()).toEqual([undefined, undefined, [111, 222, 333], undefined, [1, 2, 3]]);
    });

    it(': setArr(), delArr()', () => {
        const a = new Uint32ArrD2Reg(3, 10 * 3);
        for (let i = 0; i  < 5; i++) {
            a.setArr(i, [i, i + 1, i + 2]);
        }
        for (let i = 4; i  >= 0; i--) {
            a.delArr(i);
        }
        expect(a.length()).toEqual(5);
        expect(a.toArray()).toEqual([undefined, undefined, undefined, undefined, undefined]);
    });
});
