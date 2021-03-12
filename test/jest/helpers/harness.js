import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';

import IntlProvider from './intl';
import buildStripes from './build-stripes';

const STRIPES = buildStripes();

const Harness = ({ stripes, children }) => (
  <StripesContext.Provider value={stripes || STRIPES}>
    <MemoryRouter>
      <IntlProvider>
        {children}
      </IntlProvider>
    </MemoryRouter>
  </StripesContext.Provider>
);

export default Harness;
