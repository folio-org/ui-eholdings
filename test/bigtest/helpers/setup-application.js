import setupStripesCore from '@folio/stripes-core/test/bigtest/helpers/setup-application';
import mirageOptions from '../network';

export default function setupApplication({
  scenarios,
  hasAllPerms = true,
  permissions = {}
} = {}) {
  setupStripesCore({
    mirageOptions: {
      serverType: 'miragejs',
      ...mirageOptions
    },
    scenarios,
    permissions,
    stripesConfig: {
      hasAllPerms
    },
    userLoggedIn: true,
  });
}
