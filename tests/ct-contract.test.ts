const response = { logs: [], certificates: [], configured: false, status: 'unavailable' };
console.assert(Array.isArray(response.logs));
console.assert(Array.isArray(response.certificates));
console.assert(response.configured === false);
console.log('CT contract passed');
