import { adapterRegistry } from './registry';

export function adapterReadiness() {
  const adapters = adapterRegistry();
  const states = Object.fromEntries(Object.entries(adapters).map(([name, value]) => [name, value.state]));
  return { ready: Object.values(states).every(state => state !== 'error'), states };
}
