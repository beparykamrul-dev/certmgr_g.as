const privilegedAction = (approved: boolean) => approved ? 'execute' : 'approval_required';
console.assert(privilegedAction(false) === 'approval_required');
console.assert(privilegedAction(true) === 'execute');
console.log('approval invariant passed');
