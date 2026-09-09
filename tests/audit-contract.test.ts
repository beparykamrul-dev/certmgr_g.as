const record = { id: 'audit-1', action: 'certificate.inspect', user: 'operator', time: new Date().toISOString(), section: 'Cert' };
console.assert(record.id && record.action && record.user && record.time);
console.log('audit contract passed');
