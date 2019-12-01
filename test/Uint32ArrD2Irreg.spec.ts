import 'jasmine';
import { Uint32ArrD2Irreg } from '../src/Uint32ArrD2Irreg';

describe('Uint32ArrD2Irreg', () => {


    it(': constructor', () => {
        const a = new Uint32ArrD2Irreg(10);
        expect(a).toBeTruthy('???');
        expect(a.toNestedArr()).toEqual([]);
    });

    it(': setArr()', () => {
        const a = new Uint32ArrD2Irreg(10);
        a.setArr(2, [111, 222, 333, 444]);
        expect(a.toNestedArr()).toEqual([undefined, undefined, [111, 222, 333, 444]]);
    });

    it(': setArr() 3, 2', () => {
        const a = new Uint32ArrD2Irreg(10);
        a.setArr(3, [333]);
        a.setArr(2, [111, 222]);
        console.log(a.toNestedArr());
        console.log(a.toDebugStr());
        expect(a.toNestedArr()).toEqual([undefined, undefined, [111, 222], [333]]);
    });

    it(': setArr() 2, 3', () => {
        const a = new Uint32ArrD2Irreg(10);
        a.setArr(2, [111, 222]);
        a.setArr(3, [333]);
        console.log(a.toNestedArr());
        console.log(a.toDebugStr());
        expect(a.toNestedArr()).toEqual([undefined, undefined, [111, 222], [333]]);
    });

    it(': setArr() overwrite  at end, increase length', () => {
        const a = new Uint32ArrD2Irreg(10);
        a.setArr(2, [111, 222, 333, 444]);
        a.setArr(2, [111, 222, 333, 444, 555]);
        expect(a.toNestedArr()).toEqual([undefined, undefined, [111, 222, 333, 444, 555]]);
    });

    it(': setArr() overwrite  at end, decrease length', () => {
        const a = new Uint32ArrD2Irreg(10);
        a.setArr(2, [111, 222, 333, 444]);
        a.setArr(2, [111, 222]);
        expect(a.toNestedArr()).toEqual([undefined, undefined, [111, 222]]);
    });

    // it(': setArr() overwrite in mid, increase length', () => {
    //     const a = new Uint32ArrD2Irreg(10);
    //     a.setArr(2, [111, 222, 333, 444]);
    //     a.setArr(3, [123]);
    //     a.setArr(2, [111, 222, 333, 444, 555]);
    //     expect(a.toNestedArr()).toEqual([undefined, undefined, [111, 222, 333, 444, 555], [123]]);
    // });

    // it(': setArr() overwrite in mid, decrease length', () => {
    //     const a = new Uint32ArrD2Irreg(10);
    //     a.setArr(2, [111, 222, 333, 444]);
    //     a.setArr(3, [123]);
    //     a.setArr(2, [111, 222]);
    //     console.log(a.toNestedArr());
    //     console.log(a.toDebugStr());
    //     expect(a.toNestedArr()).toEqual([undefined, undefined, [111, 222], [123]]);
    // });

    
        // console.log(a.toNestedArr());
        // console.log(a.toDebugStr());

});
