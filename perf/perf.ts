import * as D2I from './perf_D2Irreg';
import * as D2R from './perf_D2Reg';
import * as D1 from './perf_D1';

console.log('========= D2 Irreg =========');

D2I.test_typed();
console.log('---');
D2I.test_normal();

console.log('========= D2 Reg =========');

D2R.test_typed();
console.log('---');
D2R.test_normal();

console.log('========= D1 =========');

D1.test_typed();
console.log('---');
D1.test_normal();

console.log('==================');
