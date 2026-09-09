import { isValidHostname, requireNonEmpty } from '../src/lib/validation';

console.assert(isValidHostname('example.com'));
console.assert(!isValidHostname('not-a-host'));
console.assert(requireNonEmpty('ftn', 'name') === 'ftn');
console.log('validation tests passed');
