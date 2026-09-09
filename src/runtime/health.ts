export type ReadinessChecks = { process: boolean; operatorControl: boolean; liveCollectors: boolean };
export function readiness(checks: ReadinessChecks) { const ready = checks.process && checks.operatorControl && checks.liveCollectors; return { ready, status: ready ? 'ready' : 'not_ready', checks }; }
