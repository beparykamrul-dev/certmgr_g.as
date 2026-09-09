export function syntheticDataDisabled(): true { return true; }
export function rejectSyntheticSource(source?: string): void { if (source?.toLowerCase().includes('synthetic') || source?.toLowerCase().includes('demo')) throw new Error('Synthetic production data is prohibited'); }
