import { Uint32Arr1 } from './arrays';

export const a: Uint32Arr1 = new Uint32Arr1(12);
a.set(0, 123);
a.set(1, 0);
a.set(3, 456);
a.set(4, 789);
console.log(a.toString());

console.log('\na.splice(2, 1, [11, 22, 33, 44, 55, 66])');
a.splice(2, 1, [11, 22, 33, 44, 55, 66]);
console.log(a.toString());

console.log('\na.splice(3, 5, [999])');
a.splice(3, 5, [999]);
console.log(a.toString());

console.log('\nlength = ', a.length());

console.log('\na.set(12, 1000)');
a.set(12, 1000);
console.log('length = ', a.length());

console.log('\n', a.toString());

console.log('\na.includes(11) = ', a.includes(11));

console.log('\na.indexOf(11) = ', a.indexOf(11));

console.log('\na.indexOf(5656) = ', a.indexOf(5656));
