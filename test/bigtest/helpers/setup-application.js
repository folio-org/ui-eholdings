import setupStripesCore from '@folio/stripes-core/test/bigtest/helpers/setup-application';
import axe from 'axe-core';

import mirageOptions from '../network';

const defaultInitialState = {
  eholdings: {
    data: {},
  },
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

axe.configure({
  rules: [{
    id: 'meta-viewport',
    enabled: false,
  }, {
    id: 'landmark-one-main',
    enabled: false,
  }, {
    id: 'page-has-heading-one',
    enabled: false,
  }, {
    id: 'bypass',
    enabled: false,
  }],
});

export { axe };

export default function setupApplication({
  scenarios,
  hasAllPerms = true,
  permissions = {},
  initialState = defaultInitialState,
  modules,
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
    modules,
  });
}
