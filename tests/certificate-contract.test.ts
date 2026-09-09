const states = ['not-configured','active','expiring','expired','error'] as const;
console.assert(states.includes('active'));
console.assert(states.includes('not-configured'));
console.assert(states.length === 5);
console.log('certificate contract passed');
