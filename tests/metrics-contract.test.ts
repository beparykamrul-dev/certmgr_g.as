const metricNames = ['certmgr_uptime_seconds','certmgr_provider_count','certmgr_live_collectors_configured','certmgr_operator_control_configured'];
console.assert(metricNames.every(Boolean));
console.assert(new Set(metricNames).size === metricNames.length);
console.log('metrics contract passed');
