import 'jasmine';
import { Uint32ArrD2Reg } from '../src/Uint32ArrD2Reg';

describe('Uint32ArrD2Reg', () => {

    it(': constructor', () => {
        const a = new Uint32ArrD2Reg(3);
        expect(a).toBeTruthy('???');
        expect(a.len()).toEqual(0);
        expect(a.toArr()).toEqual([]);
    });

    it(': setArr(), len 1', () => {
        const a = new Uint32ArrD2Reg(1);
        a.setArr(2, [111]);
        expect(a.len()).toEqual(3);
        expect(a.toArr()).toEqual([undefined, undefined, [111]]);
    });

    it(': setArr() large idx', () => {
        const a = new Uint32ArrD2Reg(4);
        a.setArr(5000, [111, 222, 333, 444]);
        expect(a.len()).toEqual(5001);
    });

    it(': setArr() large idx x 2', () => {
        const a = new Uint32ArrD2Reg(4);
        // a.setArr(5000, [111, 222, 333, 444]);
        a.setArr(10000, [4, 3, 2, 1]);
        expect(a.len()).toEqual(10001);
    });

    it(': setArr(), len 10', () => {
        const a = new Uint32ArrD2Reg(10);
        a.setArr(2, [1, 3, 5, 1, 3, 5, 1, 3, 5, 1]);
        expect(a.len()).toEqual(3);
        expect(a.toArr()).toEqual([undefined, undefined, [1, 3, 5, 1, 3, 5, 1, 3, 5, 1]]);
    });

    it(': setArr(), wrong len', () => {
        const a = new Uint32ArrD2Reg(2);
        try {
            a.setArr(2, [111]);
        } catch (e) {

        }
        expect(a.len()).toEqual(0);
        expect(a.toArr()).toEqual([]);
    });

    it(': setArr(), low then high', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(2, [111, 222, 333]);
        a.setArr(4, [1, 2, 3]);
        expect(a.len()).toEqual(5);
        expect(a.toArr()).toEqual([undefined, undefined, [111, 222, 333], undefined, [1, 2, 3]]);
    });

    it(': setArr(), high then low', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(4, [1, 2, 3]);
        a.setArr(2, [111, 222, 333]);
        expect(a.len()).toEqual(5);
        expect(a.toArr()).toEqual([undefined, undefined, [111, 222, 333], undefined, [1, 2, 3]]);
    });

    it(': setArr(), at start', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(4, [1, 2, 3]);
        a.setArr(0, [111, 222, 333]);
        expect(a.len()).toEqual(5);
        expect(a.toArr()).toEqual([[111, 222, 333], undefined, undefined, undefined, [1, 2, 3]]);
    });

    it(': setArr(), at end', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(2, [1, 2, 3]);
        a.setArr(3, [111, 222, 333]);
        expect(a.len()).toEqual(4);
        expect(a.toArr()).toEqual([undefined, undefined, [1, 2, 3], [111, 222, 333]]);
    });


    it(': setArr(), undef', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(2, [1, 2, 3]);
        a.setArr(3, [111, 222, 333]);
        a.setArr(2, undefined);
        expect(a.len()).toEqual(4);
        expect(a.toArr()).toEqual([undefined, undefined, undefined, [111, 222, 333]]);
    });

    it(': setArr(), then delArr()', () => {
        const a = new Uint32ArrD2Reg(3);
        for (let i = 0; i  < 5; i++) {
            a.setArr(i, [i, i + 1, i + 2]);
        }
        for (let i = 4; i  >= 0; i--) {
            a.delArr(i);
        }
        expect(a.len()).toEqual(5);
        expect(a.toArr()).toEqual([undefined, undefined, undefined, undefined, undefined]);
    });

    it(': insArr(), at start', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(1, [1, 2, 3]);
        a.insArr(0, [111, 222, 333]);
        expect(a.len()).toEqual(3);
        expect(a.toArr()).toEqual([[111, 222, 333], undefined, [1, 2, 3]]);
    });

    it(': insArr(), at mid', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(0, [1, 2, 3]);
        a.setArr(1, [4, 5, 6]);
        a.insArr(1, [111, 222, 333]);
        expect(a.len()).toEqual(3);
        expect(a.toArr()).toEqual([ [1, 2, 3], [111, 222, 333], [4, 5, 6]]);
    });

    it(': insArr(), at end', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(0, [1, 2, 3]);
        a.setArr(1, [4, 5, 6]);
        a.insArr(2, [111, 222, 333]);
        expect(a.len()).toEqual(3);
        expect(a.toArr()).toEqual([ [1, 2, 3], [4, 5, 6], [111, 222, 333]]);
    });

    it(': insArr(), push onto empty arr', () => {
        const a = new Uint32ArrD2Reg(3);
        a.pushArr([1, 2, 3]);
        expect(a.len()).toEqual(1);
        expect(a.toArr()).toEqual([ [1, 2, 3] ]);
    });

    it(': insArr(), push onto undefined', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(0, undefined);
        a.pushArr([1, 2, 3]);
        expect(a.len()).toEqual(2);
        expect(a.toArr()).toEqual([ undefined, [1, 2, 3] ]);
    });

    it(': insArr(), push onto array', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(0, [4, 5, 6]);
        a.pushArr([1, 2, 3]);
        expect(a.len()).toEqual(2);
        expect(a.toArr()).toEqual([ [4, 5, 6], [1, 2, 3] ]);
    });

    it(': delArr(), at start', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(0, [1, 2, 3]);
        a.delArr(0);
        expect(a.len()).toEqual(1);
        expect(a.toArr()).toEqual([ undefined ]);
    });

    it(': delArr(), at mid', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(0, [1, 2, 3]);
        a.setArr(1, [4, 5, 6]);
        a.setArr(2, [7, 8, 9]);
        a.delArr(1);
        expect(a.len()).toEqual(3);
        expect(a.toArr()).toEqual([ [1, 2, 3], undefined, [7, 8, 9] ]);
    });

    it(': delArr(), beyond end', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(0, [1, 2, 3]);
        a.setArr(1, [4, 5, 6]);
        a.delArr(2);
        expect(a.len()).toEqual(2);
        expect(a.toArr()).toEqual([ [1, 2, 3], [4, 5, 6] ]);
    });

    it(': remArr(), at start', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(0, [1, 2, 3]);
        a.remArr(0);
        expect(a.len()).toEqual(0);
        expect(a.toArr()).toEqual([  ]);
    });

    it(': remArr(), at mid', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(0, [1, 2, 3]);
        a.setArr(1, [4, 5, 6]);
        a.setArr(2, [7, 8, 9]);
        a.remArr(1);
        expect(a.len()).toEqual(2);
        expect(a.toArr()).toEqual([ [1, 2, 3], [7, 8, 9] ]);
    });

    it(': remArr(), beyond end', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(0, [1, 2, 3]);
        a.setArr(1, [4, 5, 6]);
        a.remArr(2);
        expect(a.len()).toEqual(2);
        expect(a.toArr()).toEqual([ [1, 2, 3], [4, 5, 6] ]);
    });

    it(': popArr()', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(0, [1, 2, 3]);
        a.setArr(1, [4, 5, 6]);
        a.setArr(2, [7, 8, 9]);
        a.popArr();
        expect(a.len()).toEqual(2);
        expect(a.toArr()).toEqual([ [1, 2, 3], [4, 5, 6] ]);
    });

    it(': popArr() undefined', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(0, [1, 2, 3]);
        a.setArr(1, [4, 5, 6]);
        a.setArr(2, [7, 8, 9]);
        a.delArr(2);
        a.popArr();
        expect(a.len()).toEqual(2);
        expect(a.toArr()).toEqual([ [1, 2, 3], [4, 5, 6] ]);
    });

    it(': setVal()', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(0, [1, 2, 3]);
        a.setArr(1, [4, 5, 6]);
        a.setArr(2, [7, 8, 9]);
        a.setVal(1, 1, 999);
        expect(a.len()).toEqual(3);
        expect(a.toArr()).toEqual([ [1, 2, 3], [4, 999, 6], [7, 8, 9] ]);
    });

    it(': getVal()', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(0, [1, 2, 3]);
        a.setArr(1, [4, 5, 6]);
        a.setArr(2, [7, 8, 9]);
        const b: number = a.getVal(1, 1);
        expect(b).toEqual(5);
    });

    it(': hasVal() true', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(0, [1, 2, 3]);
        a.setArr(1, [4, 5, 6]);
        a.setArr(2, [7, 8, 9]);
        const b: boolean = a.hasVal(1, 5);
        expect(b).toEqual(true);
    });

    it(': hasVal() false', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(0, [1, 2, 3]);
        a.setArr(1, [4, 5, 6]);
        a.setArr(2, [7, 8, 9]);
        const b: boolean = a.hasVal(1, 3);
        expect(b).toEqual(false);
    });

    it(': idxOfVal()', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(0, [1, 2, 3]);
        a.setArr(1, [4, 5, 6]);
        a.setArr(2, [7, 8, 9]);
        const b: number = a.idxOfVal(1, 5);
        expect(b).toEqual(1);
    });

    it(': idxOfVal() -1', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(0, [1, 2, 3]);
        a.setArr(1, [4, 5, 6]);
        a.setArr(2, [7, 8, 9]);
        const b: number = a.idxOfVal(1, 3);
        expect(b).toEqual(-1);
    });

    it(': clone()', () => {
        const a = new Uint32ArrD2Reg(3);
        a.setArr(1, [11, 22, 33]);
        a.setArr(3, [100, 200, 300]);
        const b = a.clone();
        b.setArr(3, [3, 2, 1]);
        b.setVal(1, 1, 0);
        expect(a.toArr()).toEqual([undefined, [11, 22, 33], undefined, [100, 200, 300]]);
        expect(b.toArr()).toEqual([undefined, [11, 0, 33], undefined,  [3, 2, 1]]);
    });

});
