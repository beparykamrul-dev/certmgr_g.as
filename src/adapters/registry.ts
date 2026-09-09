import { acmeConfig } from './acme';
import { alertmanagerConfig } from './alertmanager';
import { cfsslConfig } from './cfssl';
import { ctConfig } from './ct';
import { edgeOneConfig } from './edgeone';
import { githubConfig } from './github';
import { identityConfig } from './identity';
import { meshConfig } from './mesh';
import { notificationsConfig } from './notifications';
import { postgresConfig } from './postgres';
import { prometheusConfig } from './prometheus';
import { providerConfig } from './providers';
import { serviceControllerConfig } from './service-controller';
import { trafficConfig } from './traffic';

export function adapterRegistry() {
  return {
    postgresql: postgresConfig(), prometheus: prometheusConfig(), alertmanager: alertmanagerConfig(),
    acme: acmeConfig(), cfssl: cfsslConfig(), ct: ctConfig(), github: githubConfig(),
    identity: identityConfig(), notifications: notificationsConfig(), mesh: meshConfig(),
    traffic: trafficConfig(), providers: providerConfig(), edgeone: edgeOneConfig(), serviceController: serviceControllerConfig()
  };
}
