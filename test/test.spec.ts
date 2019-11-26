import 'jasmine';
import {a} from '../src/test';

describe('test set 1:', () => {
    it('case 1: a is truthy', () => {
        expect(a).toBeTruthy('???');
    });
    it('case 2: exact value of a', () => {
        const b = a.toArray();
        expect(b).toEqual([123, 0, 11, 999, 456, 789, 55, undefined, undefined, undefined, undefined, undefined, 1000]);
    });
});
