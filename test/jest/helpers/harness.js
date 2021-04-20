import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';

import IntlProvider from './intl';
import buildStripes from '../__mock__/stripesCore.mock';

const STRIPES = buildStripes();

const defaultHistory = createMemoryHistory();

const Harness = ({ stripes, children, history = defaultHistory }) => (
  <StripesContext.Provider value={stripes || STRIPES}>
    <Router history={history}>
      <IntlProvider>
        {children}
      </IntlProvider>
    </Router>
  </StripesContext.Provider>
);

export default Harness;
