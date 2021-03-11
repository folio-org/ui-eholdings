import React from 'react';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';

import IntlProvider from './intl';
import buildStripes from './build-stripes';

const STRIPES = buildStripes();

const Harness = ({ stripes, children }) => (
  <StripesContext.Provider value={stripes || STRIPES}>
    <IntlProvider>
      {children}
    </IntlProvider>
  </StripesContext.Provider>
);

export default Intl;
