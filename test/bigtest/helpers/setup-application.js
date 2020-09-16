import setupStripesCore from '@folio/stripes-core/test/bigtest/helpers/setup-application';
import mirageOptions from '../network';

const defaultInitialState = {
  discovery: {
    modules: {
      'mod-kb-ebsco-java-3.5.3-SNAPSHOT.246': 'kb-ebsco',
    },
    interfaces: {
      erm: '3.0',
      tags: '1.0',
      eholdings: '2.1',
    }
  }
};

export default function setupApplication({
  scenarios,
  hasAllPerms = true,
  permissions = {},
  initialState = defaultInitialState,
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
    initialState,
  });
}
