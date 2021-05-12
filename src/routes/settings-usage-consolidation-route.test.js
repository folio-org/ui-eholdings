import {
  createStore,
  combineReducers,
} from 'redux';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import noop from 'lodash/noop';

import {
  render,
  cleanup,
  fireEvent,
  act,
} from '@testing-library/react';

import SettingsUsageConsolidationRoute from './settings-usage-consolidation-route';
import {
  usageConsolidation,
  currencies,
  ucCredentials,
} from '../redux/reducers';

const mockClearUsageConsolidationErrors = jest.fn();
const mockGetUsageConsolidation = jest.fn();
const mockGetUsageConsolidationKey = jest.fn();
const mockPatchUsageConsolidation = jest.fn();
const mockPostUsageConsolidation = jest.fn();
const mockGetCurrencies = jest.fn();
const mockGetUcCredentials = jest.fn();
const mockUpdateUcCredentials = jest.fn();

jest.mock('../redux/actions', () => ({
  ...jest.requireActual('../redux/actions'),
  clearUsageConsolidationErrors: mockClearUsageConsolidationErrors,
  getUsageConsolidation: mockGetUsageConsolidation,
  getUsageConsolidationKey: mockGetUsageConsolidationKey,
  patchUsageConsolidation: mockPatchUsageConsolidation,
  postUsageConsolidation: mockPostUsageConsolidation,
  getCurrencies: mockGetCurrencies,
  getUcCredentials: mockGetUcCredentials,
  updateUcCredentials: mockUpdateUcCredentials,
}));

const createTestStore = () => createStore(
  combineReducers({
    ['eholdings.data.usageConsolidation']: usageConsolidation,
    ['eholdings.data.currencies']: currencies,
    ['eholdings.data.ucCredentials']: ucCredentials,
  })
);

const renderSettingsUsageConsolidationRoute = (store, props = {}) => render(
  <MemoryRouter>
    <Provider store={store}>
      <SettingsUsageConsolidationRoute
        clearUsageConsolidationErrors={noop}
        getUsageConsolidation={noop}
        getUsageConsolidationKey={noop}
        patchUsageConsolidation={noop}
        postUsageConsolidation={noop}
        getCurrencies={noop}
        getUcCredentials={noop}
        updateUcCredentials={noop}
        history={{}}
        match={{
          params: {
            kbId: 'id',
          },
        }}
        {...props}
      />
    </Provider>
  </MemoryRouter>
);

describe('Given SettingsUsageConsolidationRoute', () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
  })

  afterEach(cleanup);

  it('should handle getUsageConsoldation', async () => {
    await act(async () => {
      await renderSettingsUsageConsolidationRoute(store, {
        getUsageConsolidation: mockGetUsageConsolidation,
      });
    });

    expect(mockGetUsageConsolidation).toHaveBeenCalled();
  });

  it('should handle getCurrencies', async () => {
    await act(async () => {
      await renderSettingsUsageConsolidationRoute(store, {
        getCurrencies: mockGetCurrencies,
      });
    });

    expect(mockGetCurrencies).toHaveBeenCalled();
  });

  it('should handle getUcCredentials', async () => {
    await act(async () => {
      await renderSettingsUsageConsolidationRoute(store, {
        getUcCredentials: mockGetUcCredentials,
      });
    });

    expect(mockGetUcCredentials).toHaveBeenCalled();
  });
  /*
  it('should handle getUsageConsolidationKey', async () => {
    await act(async () => {
      await renderSettingsUsageConsolidationRoute(store, {
        getUsageConsolidationKey: mockGetUsageConsolidationKey,
      });
    });

    expect(mockGetUsageConsolidationKey).toHaveBeenCalled();
  });

  describe('when click on save', () => {
    it('test', async () => {
      let getByTestId;

      await act(async () => {
        getByTestId = await renderSettingsUsageConsolidationRoute(store, {
          updateUcCredentials: mockUpdateUcCredentials,
        }).getByTestId;
      });

      const customerKey = getByTestId('field-customerKey');
      const clientId = getByTestId('field-clientId');
      const clientSecret = getByTestId('field-clientSecret');
      const startMonth = getByTestId('field-startMonth');
      const platformType = getByTestId('field-platformType');
      const currency = getByTestId('field-currency');
      const saveButton = getByTestId('settings-form-save-button');

      await fireEvent.change(customerKey, { target: { value: '123' } });
      await fireEvent.change(clientId, { target: { value: '123' } });
      await fireEvent.change(clientSecret, { target: { value: '123' } });
      fireEvent.blur(clientSecret);
      console.log(saveButton);
      await fireEvent.click(saveButton);
      
      expect(mockUpdateUcCredentials).toHaveBeenCalled();
    });
  });
  */
});
