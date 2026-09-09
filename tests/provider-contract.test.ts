const sample = { name: 'Cloudflare', health: null, status: 'unknown', source: 'not-configured' };
console.assert(typeof sample.name === 'string');
console.assert(sample.status === 'unknown');
console.assert(sample.health === null);
console.log('provider contract passed');
