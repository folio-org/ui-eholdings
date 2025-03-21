import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import {
  createStore,
  combineReducers,
} from 'redux';
import { QueryClient, QueryClientProvider } from 'react-query';

import { StripesContext } from '@folio/stripes/core';

import { RouteHistoryContext } from '../../../src/components/route-history';
import IntlProvider from './intl';
import buildStripes from '../__mock__/stripesCore.mock';

const STRIPES = buildStripes();

const defaultHistory = createMemoryHistory();

const defaultInitialState = {};

const defaultReducers = {};

const queryClient = new QueryClient();

const Harness = ({
  stripes,
  children,
  history = defaultHistory,
  storeInitialState = defaultInitialState,
  storeReducers = defaultReducers,
}) => {
  const reducers = {
    eholdings: () => storeInitialState,
    ...storeReducers,
  };

  const reducer = combineReducers(reducers);

  const store = createStore(reducer);

  const routeHistoryCtx = {
    routeHistory: [{ pathname: '/eholdings' }],
    navigateBack: jest.fn(),
  };

  return (
    <StripesContext.Provider value={stripes || STRIPES}>
      <Router history={history}>
        <RouteHistoryContext.Provider value={routeHistoryCtx}>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <IntlProvider locale="en">
                {children}
              </IntlProvider>
            </QueryClientProvider>
          </Provider>
        </RouteHistoryContext.Provider>
      </Router>
    </StripesContext.Provider>
  );
};

export default Harness;
