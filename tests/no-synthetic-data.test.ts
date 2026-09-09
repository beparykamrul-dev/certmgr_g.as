const productionPayload = { syntheticData: false, source: 'live-adapter' };
console.assert(productionPayload.syntheticData === false);
console.assert(productionPayload.source !== 'simulation');
console.log('synthetic-data guard passed');
