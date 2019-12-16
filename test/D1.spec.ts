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

    it(': setVal(), low then high', () => {
        const a = new Uint32ArrD1();
        a.setVal(2, 222);
        a.setVal(4, 444);
        expect(a.toArr()).toEqual([undefined, undefined, 222, undefined, 444]);
    });

    it(': setVal(), high then low', () => {
        const a = new Uint32ArrD1();
        a.setVal(4, 444);
        a.setVal(2, 222);
        expect(a.toArr()).toEqual([undefined, undefined, 222, undefined, 444]);
    });

    it(': setVal(), undefined', () => {
        const a = new Uint32ArrD1();
        a.setVal(4, 444);
        a.setVal(4, undefined);
        expect(a.toArr()).toEqual([undefined, undefined, undefined, undefined, undefined]);
    });

    it(': insVal()', () => {
        const a = new Uint32ArrD1();
        a.setVal(4, 444);
        a.insVal(2, 222);
        expect(a.toArr()).toEqual([undefined, undefined, 222, undefined, undefined, 444]);
    });

    it(': insVal() at start', () => {
        const a = new Uint32ArrD1();
        a.setVal(4, 444);
        a.insVal(0, 222);
        expect(a.toArr()).toEqual([222, undefined, undefined, undefined, undefined, 444]);
    });

    it(': insVal() at end', () => {
        const a = new Uint32ArrD1();
        a.setVal(4, 444);
        a.insVal(5, 222);
        expect(a.toArr()).toEqual([undefined, undefined, undefined, undefined, 444, 222]);
    });

    it(': insVal() into empty arr', () => {
        const a = new Uint32ArrD1();
        a.insVal(5, 222);
        expect(a.toArr()).toEqual([undefined, undefined, undefined, undefined, undefined, 222]);
    });

    it(': pushVal()', () => {
        const a = new Uint32ArrD1();
        a.pushVal(222);
        a.pushVal(undefined);
        a.pushVal(333);
        expect(a.toArr()).toEqual([222, undefined, 333]);
    });

    it(': delVal() at start', () => {
        const a = new Uint32ArrD1();
        a.setVal(0, 222);
        a.setVal(1, undefined);
        a.setVal(2, 333);
        a.delVal(0);
        expect(a.toArr()).toEqual([undefined, undefined, 333]);
    });

    it(': delVal() at mid', () => {
        const a = new Uint32ArrD1();
        a.setVal(0, 222);
        a.setVal(1, undefined);
        a.setVal(2, 333);
        a.delVal(1);
        expect(a.toArr()).toEqual([222, undefined, 333]);
    });

    it(': delVal() at end', () => {
        const a = new Uint32ArrD1();
        a.setVal(0, 222);
        a.setVal(1, undefined);
        a.setVal(2, 333);
        a.delVal(2);
        expect(a.toArr()).toEqual([222, undefined, undefined]);
    });

    it(': remVal() at start', () => {
        const a = new Uint32ArrD1();
        a.setVal(0, 222);
        a.setVal(1, undefined);
        a.setVal(2, 333);
        a.remVal(0);
        expect(a.toArr()).toEqual([undefined, 333]);
    });

    it(': remVal() at mid', () => {
        const a = new Uint32ArrD1();
        a.setVal(0, 222);
        a.setVal(1, undefined);
        a.setVal(2, 333);
        a.remVal(1);
        expect(a.toArr()).toEqual([222, 333]);
    });

    it(': remVal() at end', () => {
        const a = new Uint32ArrD1();
        a.setVal(0, 222);
        a.setVal(1, undefined);
        a.setVal(2, 333);
        a.remVal(2);
        expect(a.toArr()).toEqual([222, undefined]);
    });

    it(': popVal() at end', () => {
        const a = new Uint32ArrD1();
        a.setVal(0, 222);
        a.setVal(1, undefined);
        a.setVal(2, 333);
        a.popVal();
        a.popVal();
        expect(a.toArr()).toEqual([222]);
    });

    it(': hasVal() true', () => {
        const a = new Uint32ArrD1();
        a.setVal(0, 222);
        a.setVal(1, undefined);
        a.setVal(2, 333);
        expect(a.hasVal(333)).toEqual(true);
    });

    it(': hasVal() undef true', () => {
        const a = new Uint32ArrD1();
        a.setVal(0, 222);
        a.setVal(1, undefined);
        a.setVal(2, 333);
        expect(a.hasVal(undefined)).toEqual(true);
    });

    it(': hasVal() false', () => {
        const a = new Uint32ArrD1();
        a.setVal(0, 222);
        a.setVal(1, undefined);
        a.setVal(2, 333);
        expect(a.hasVal(444)).toEqual(false);
    });

    it(': idxOfVal() true', () => {
        const a = new Uint32ArrD1();
        a.setVal(0, 222);
        a.setVal(1, undefined);
        a.setVal(2, 333);
        expect(a.idxOfVal(333)).toEqual(2);
    });

    it(': idxOfVal() undef true', () => {
        const a = new Uint32ArrD1();
        a.setVal(0, 222);
        a.setVal(1, undefined);
        a.setVal(2, 333);
        expect(a.idxOfVal(undefined)).toEqual(1);
    });

    it(': idxOfVal() false', () => {
        const a = new Uint32ArrD1();
        a.setVal(0, 222);
        a.setVal(1, undefined);
        a.setVal(2, 333);
        expect(a.idxOfVal(444)).toEqual(-1);
    });
});
