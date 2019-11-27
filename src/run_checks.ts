import { Uint32ArrD1 } from './Uint32ArrD1';
import { Uint32ArrD2Reg } from './Uint32ArrD2Reg';

function testUint32ArrD1() {

    const a: Uint32ArrD1 = new Uint32ArrD1(12);

    a.setVal(0, 123);
    a.setVal(1, 0);
    a.setVal(3, 456);
    a.setVal(4, 789);
    console.log(a.toString());

    console.log('\na.splice(2, 1, [11, 22, 33, 44, 55, 66])');
    a.spliceVals(2, 1, [11, 22, 33, 44, 55, 66]);
    console.log(a.toString());

    console.log('\na.splice(3, 5, [999])');
    a.spliceVals(3, 5, [999]);
    console.log(a.toString());

    console.log('\nlength = ', a.length());

    console.log('\na.set(12, 1000)');
    a.setVal(12, 1000);
    console.log('length = ', a.length());

    console.log('\n', a.toString());

    console.log('\na.includes(11) = ', a.includesVal(11));

    console.log('\na.indexOf(11) = ', a.indexOfVal(11));

    console.log('\na.indexOf(5656) = ', a.indexOfVal(5656));
}

function testUint32ArrD2Reg() {

    const b: Uint32ArrD2Reg = new Uint32ArrD2Reg(4, 12);

    b.setArr(3, [1, 2, 3, 4]);

    console.log(b.length());
    console.log(b.toString());
}

testUint32ArrD2Reg();
