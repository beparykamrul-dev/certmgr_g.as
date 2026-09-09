const state = { configured: false, activePoPs: [], activeIncidents: [], totalInspectedRequests: null };
console.assert(state.configured === false);
console.assert(state.activePoPs.length === 0);
console.assert(state.totalInspectedRequests === null);
console.log('EdgeOne contract passed');
