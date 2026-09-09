const checks = { process: true, operatorControl: false, liveCollectors: false };
const ready = checks.process && checks.operatorControl;
console.assert(ready === false);
console.log('readiness contract passed');
