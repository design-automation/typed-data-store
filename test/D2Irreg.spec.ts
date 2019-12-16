import 'jasmine';
import { Uint32ArrD2Irreg } from '../src/Uint32ArrD2Irreg';

describe('Uint32ArrD2Irreg', () => {


    it(': constructor', () => {
        const a = new Uint32ArrD2Irreg();
        expect(a).toBeTruthy('???');
        expect(a.toArr()).toEqual([]);
    });

    it(': setArr() large idx', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(5000, [111, 222, 333, 444]);
        expect(a.len()).toEqual(5001);
    });

    it(': len()', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(2, [111, 222, 333, 444]);
        expect(a.len()).toEqual(3);
    });

    it(': len() with undefined at the end', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(2, [22]);
        a.setArr(4, [44]);
        a.delArr(4);
        expect(a.len()).toEqual(5);
    });

    it(': len() after rem()', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(2, [22]);
        a.setArr(4, [44]);
        a.remArr(4);
        expect(a.len()).toEqual(4);
    });

    it(': len() after pushArr()', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(2, [22]);
        a.pushArr([33]);
        expect(a.len()).toEqual(4);
    });

    it(': len() after popArr()', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(2, [22]);
        const r = a.popArr();
        expect(r).toEqual([22]);
        expect(a.len()).toEqual(2);
    });

    it(': setArr() empty array', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(2, []);
        expect(a.toArr()).toEqual([undefined, undefined, []]);
    });

    it(': setArr() undefined array', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(2, undefined);
        expect(a.toArr()).toEqual([undefined, undefined, undefined]);
    });

    it(': getArr()', () => {
        const a = new Uint32ArrD2Irreg();
        const l = a.setArr(2, [111, 222, 333, 444]);
        expect(l).toEqual(3);
        const b = a.getArr(2);
        expect(b).toEqual([111, 222, 333, 444]);
    });

    it(': getArr() that is undefined', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(2, [111, 222, 333, 444]);
        const b = a.getArr(1);
        expect(b).toEqual(undefined);
    });

    it(': pushArr() onto empty array', () => {
        const a = new Uint32ArrD2Irreg();
        a.pushArr([111, 222, 333, 444]);
        expect(a.toArr()).toEqual([[111, 222, 333, 444]]);
    });

    it(': pushArr() onto nonempty array', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [2, 3]);
        const l = a.pushArr([111, 222, 333, 444]);
        expect(l).toEqual(3);
        expect(a.toArr()).toEqual([undefined, [2, 3], [111, 222, 333, 444]]);
    });

    it(': pushArr() empty array onto nonempty array', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [2, 3]);
        a.pushArr([]);
        expect(a.toArr()).toEqual([undefined, [2, 3], []]);
    });

    it(': pushArr() undefined array onto nonempty array', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [2, 3]);
        a.pushArr(undefined);
        expect(a.toArr()).toEqual([undefined, [2, 3], undefined]);
    });

    it(': pushArr() many', () => {
        const a = new Uint32ArrD2Irreg();
        for (let i = 0; i < 10; i ++) {
            a.pushArr([ i ]);
        }
        expect(a.toArr()).toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]]);
    });

    it(': setArr() high then low', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(4, [333]);
        a.setArr(2, [111, 222]);
        expect(a.toArr()).toEqual([undefined, undefined, [111, 222], undefined, [333]]);
    });

    it(': setArr() low then high', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(2, [111, 222]);
        a.setArr(4, [333]);
        expect(a.toArr()).toEqual([undefined, undefined, [111, 222], undefined, [333]]);
    });

    it(': setArr() overwrite  at end, increase length', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(2, [111, 222, 333, 444]);
        a.setArr(2, [111, 222, 333, 444, 555]);
        expect(a.toArr()).toEqual([undefined, undefined, [111, 222, 333, 444, 555]]);
    });

    it(': setArr() overwrite  at end, decrease length', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(2, [111, 222, 333, 444]);
        a.setArr(2, [111, 222]);
        expect(a.toArr()).toEqual([undefined, undefined, [111, 222]]);
    });

    it(': setArr() overwrite in mid, increase length', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [123]);
        a.setArr(2, [111, 222, 333, 444]);
        a.setArr(3, [123]);
        a.setArr(2, [111, 222, 333, 444, 555]);
        expect(a.toArr()).toEqual([undefined, [123], [111, 222, 333, 444, 555], [123]]);
    });

    it(': setArr() overwrite in mid, decrease length', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [123]);
        a.setArr(2, [111, 222, 333, 444]);
        a.setArr(3, [123]);
        a.setArr(2, [111, 222]);
        expect(a.toArr()).toEqual([undefined, [123], [111, 222], [123]]);
    });

    it(': insArr() into mid', () => {
        const a = new Uint32ArrD2Irreg();
        a.insArr(1, [111]);
        a.insArr(2, [222]);
        a.insArr(2, [333]);
        expect(a.toArr()).toEqual([undefined, [111], [333], [222]]);
    });

    it(': insArr() into start', () => {
        const a = new Uint32ArrD2Irreg();
        a.insArr(1, [111]);
        a.insArr(2, [222]);
        a.insArr(0, [333]);
        expect(a.toArr()).toEqual([[333], undefined, [111], [222]]);
    });

    it(': insArr() into end', () => {
        const a = new Uint32ArrD2Irreg();
        a.insArr(1, [1]);
        a.insArr(2, [2, 2, 2]);
        a.insArr(3, [3, 3, 3, 3]);
        expect(a.toArr()).toEqual([undefined, [1], [2, 2, 2], [3, 3, 3, 3]]);
    });

    it(': setArr() really long', () => {
        const a = new Uint32ArrD2Irreg();
        const long = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, ];
        a.insArr(1, long);
        expect(a.toArr()).toEqual([undefined, long]);
    });

    it(': insArr() really long', () => {
        const a = new Uint32ArrD2Irreg();
        const long = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, ];
        a.insArr(0, long);
        expect(a.toArr()).toEqual([long]);
    });

    it(': pushArr() really long', () => {
        const a = new Uint32ArrD2Irreg();
        const long = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, ];
        a.pushArr(long);
        expect(a.toArr()).toEqual([long]);
    });

    it(': delArr() mid', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [1, 2, 3]);
        a.setArr(2, [1, 2, 3]);
        a.setArr(3, [1, 2, 3]);
        a.delArr(2);
        expect(a.toArr()).toEqual([undefined, [1, 2, 3], undefined, [1, 2, 3]]);
    });

    it(': delArr() already deleted', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [1, 2, 3]);
        a.setArr(2, [1, 2, 3]);
        a.setArr(3, [1, 2, 3]);
        a.delArr(0);
        expect(a.toArr()).toEqual([undefined, [1, 2, 3], [1, 2, 3], [1, 2, 3]]);
    });

    it(': delArr() end', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [1, 2, 3]);
        a.setArr(2, [1, 2, 3]);
        a.setArr(3, [1, 2, 3]);
        a.delArr(3);
        expect(a.toArr()).toEqual([undefined, [1, 2, 3], [1, 2, 3], undefined]);
    });

    it(': remArr() mid', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 2, 3]);
        a.setArr(2, [1, 22, 3]);
        a.setArr(3, [1, 2, 33]);
        a.remArr(2);
        expect(a.toArr()).toEqual([undefined, [11, 2, 3], [1, 2, 33]]);
    });

    it(': remArr() undefined', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 2, 3]);
        a.setArr(2, [1, 22, 3]);
        a.setArr(3, [1, 2, 33]);
        a.remArr(0);
        expect(a.toArr()).toEqual([[11, 2, 3], [1, 22, 3], [1, 2, 33]]);
    });

    it(': remArr() end', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [1, 2, 3]);
        a.setArr(2, [1, 2]);
        a.setArr(3, [1]);
        a.remArr(3);
        expect(a.toArr()).toEqual([undefined, [1, 2, 3], [1, 2]]);
    });

    it(': remArr() end', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [1, 2, 3]);
        a.setArr(2, [1, 2]);
        a.setArr(3, [1]);
        a.remArr(0);
        a.remArr(0);
        a.remArr(0);
        a.remArr(0);
        expect(a.toArr()).toEqual([]);
    })

    it(': popArr() undefined', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 2, 3]);
        a.setArr(2, [1, 22, 3]);
        a.setArr(3, [1, 2, 33]);
        a.popArr();
        expect(a.toArr()).toEqual([undefined, [11, 2, 3], [1, 22, 3]]);
    });

    it(': popArr() all', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 2, 3]);
        a.setArr(2, [1, 22, 3]);
        a.setArr(3, [1, 2, 33]);
        a.popArr();
        a.popArr();
        a.popArr();
        a.popArr();
        expect(a.toArr()).toEqual([]);
    });

    it(': setVal()', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 22, 33]);
        a.setVal(1, 1, 222);
        expect(a.toArr()).toEqual([undefined, [11, 222, 33]]);
    });

    it(': getVal()', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 22, 33]);
        const b = a.getVal(1, 1);
        expect(b).toEqual(22);
    });

    it(': pushVal()', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 22, 33]);
        a.pushVal(1, 44);
        expect(a.toArr()).toEqual([undefined, [11, 22, 33, 44]]);
    });

    it(': remVal()', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 22, 33]);
        a.remVal(1, 1);
        expect(a.toArr()).toEqual([undefined, [11, 33]]);
    });


    it(': popVal()', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 22, 33]);
        a.popVal(1);
        expect(a.toArr()).toEqual([undefined, [11, 22]]);
    });

    it(': insVal() start', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 22, 33]);
        a.insVal(1, 0, 555);
        expect(a.toArr()).toEqual([undefined, [555, 11, 22, 33]]);
    });

    it(': insVal() mid', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 22, 33]);
        a.insVal(1, 2, 555);
        expect(a.toArr()).toEqual([undefined, [11, 22, 555, 33]]);
    });

    it(': insVal() end', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 22, 33]);
        a.insVal(1, 3, 555);
        expect(a.toArr()).toEqual([undefined, [11, 22, 33, 555]]);
    });

    it(': hasVal() true', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 22, 33]);
        const b = a.hasVal(1, 22);
        expect(b).toEqual(true);
    });

    it(': hasVal() false', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 22, 33]);
        const b = a.hasVal(1, 23);
        expect(b).toEqual(false);
    });

    it(': idxOfVal() true', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 22, 33]);
        const b = a.idxOfVal(1, 22);
        expect(b).toEqual(1);
    });

    it(': idxOfVal() -1', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 22, 33]);
        const b = a.idxOfVal(1, 23);
        expect(b).toEqual(-1);
    });

    it(': addValToSet() adds', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 22, 33]);
        a.addValToSet(1, 44);
        expect(a.toArr()).toEqual([undefined, [11, 22, 33, 44]]);
    });

    it(': addValToSet() does not add', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 22, 33]);
        a.addValToSet(1, 22);
        expect(a.toArr()).toEqual([undefined, [11, 22, 33]]);
    });

    it(': remValFromSet() adds', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 22, 33]);
        a.remValFromSet(1, 44);
        expect(a.toArr()).toEqual([undefined, [11, 22, 33]]);
    });

    it(': remValFromSet() does not add', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 22, 33]);
        a.remValFromSet(1, 22);
        expect(a.toArr()).toEqual([undefined, [11, 33]]);
    });

    it(': clone()', () => {
        const a = new Uint32ArrD2Irreg();
        a.setArr(1, [11, 22, 33]);
        a.setArr(3, [100, 200]);
        const b = a.clone();
        b.setArr(3, [100, 200, 300]);
        b.setVal(1, 1, 0);
        expect(a.toArr()).toEqual([undefined, [11, 22, 33], undefined, [100, 200]]);
        expect(b.toArr()).toEqual([undefined, [11, 0, 33], undefined, [100, 200, 300]]);
    });


    // TODO Test purge

});
