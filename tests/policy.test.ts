import { evaluatePrivilegedAction } from '../src/server/policy';

const result = evaluatePrivilegedAction('issue_certificate');
console.assert(result.requiresApproval === true);
console.assert(result.allowed === false);
console.log('policy tests passed');
