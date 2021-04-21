import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';

import IntlProvider from './intl';
import buildStripes from '../__mock__/stripesCore.mock';

const STRIPES = buildStripes();

const defaultHistory = createMemoryHistory();

const defaultInitialState = {};

const Harness = ({ stripes, children, history = defaultHistory, storeInitialState = defaultInitialState }) => {
  const reducers = {
    eholdings: () => storeInitialState,
  };

  const reducer = combineReducers(reducers);

  const store = createStore(reducer);

  return (
    <StripesContext.Provider value={stripes || STRIPES}>
      <Router history={history}>
        <Provider store={store}>
          <IntlProvider>
            {children}
          </IntlProvider>
        </Provider>
      </Router>
    </StripesContext.Provider>
  );
};

export default Harness;
