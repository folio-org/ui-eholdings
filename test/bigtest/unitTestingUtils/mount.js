import React from 'react';
import { IntlProvider } from 'react-intl';
import { mount as enzymeMount } from 'enzyme';

import componentsTranslations from '@folio/stripes-components/translations/stripes-components/en';
import smartComponentsTranslations from '@folio/stripes-smart-components/translations/stripes-smart-components/en';
import stripesCoreTranslations from '@folio/stripes-core/translations/stripes-core/en';
import eholdingsTranslations from '../../../translations/ui-eholdings/en';


const prefixKeys = (translations, prefix) => {
  return Object.keys(translations).reduce((acc, key) => {
    return {
      ...acc,
      [`${prefix}.${key}`]: translations[key]
    };
  }, {});
};

const translations = {
  ...prefixKeys(eholdingsTranslations, 'ui-eholdings',),
  ...prefixKeys(componentsTranslations, 'stripes-components',),
  ...prefixKeys(smartComponentsTranslations, 'stripes-smart-components',),
  ...prefixKeys(stripesCoreTranslations, 'stripes-core',),
};

const mount = element => enzymeMount(
  <IntlProvider locale="en" messages={translations}>
    {element}
  </IntlProvider>
);

export default mount;
