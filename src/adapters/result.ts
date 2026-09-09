export type AdapterState = 'configured' | 'unavailable' | 'error';

export type AdapterResult<T> = {
  state: AdapterState;
  configured: boolean;
  source: string;
  data?: T;
  reason?: string;
};

export function unavailable<T>(source: string, reason: string): AdapterResult<T> {
  return { state: 'unavailable', configured: false, source, reason };
}

export function configured<T>(source: string, data: T): AdapterResult<T> {
  return { state: 'configured', configured: true, source, data };
}
