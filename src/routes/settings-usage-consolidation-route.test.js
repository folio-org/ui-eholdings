import { MemoryRouter } from 'react-router-dom';
import noop from 'lodash/noop';

import {
  render,
  cleanup,
  act,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import SettingsUsageConsolidationRoute from './settings-usage-consolidation-route';
import Harness from '../../test/jest/helpers/harness';
import {
  getCurrencies,
  getUcCredentials,
  getUcCredentialsClientId,
  getUcCredentialsClientSecret,
  getUsageConsolidationKey,
  patchUsageConsolidation,
  postUsageConsolidation,
  updateUcCredentials,
} from '../redux/actions';

const fakeAction = { type: 'FAKE_ACTION' };

jest.mock('../redux/actions', () => ({
  ...jest.requireActual('../redux/actions'),
  getUsageConsolidation: jest.fn().mockReturnValue(fakeAction),
  getUsageConsolidationKey: jest.fn().mockReturnValue(fakeAction),
  patchUsageConsolidation: jest.fn().mockReturnValue(fakeAction),
  postUsageConsolidation: jest.fn().mockReturnValue(fakeAction),
  getCurrencies: jest.fn().mockReturnValue(fakeAction),
  getUcCredentials: jest.fn().mockReturnValue(fakeAction),
  getUcCredentialsClientId: jest.fn().mockReturnValue(fakeAction),
  getUcCredentialsClientSecret: jest.fn().mockReturnValue(fakeAction),
  updateUcCredentials: jest.fn().mockReturnValue(fakeAction),
}));

const currencies = {
  isLoading: false,
  items: [{
    attributes: {
      code: 'AFN',
      description: 'Afghan Afghani',
    },
  }, {
    attributes: {
      code: 'ALL',
      description: 'Albanian Lek',
    },
  }],
  errors: [],
};
const ucCredentials = {
  isPresent: false,
  isLoading: false,
  isFailed: false,
  isUpdated: false,
  isClientIdLoading: false,
  isClientIdLoaded: false,
  isClientIdFailed: false,
  isClientSecretLoading: false,
  isClientSecretLoaded: false,
  isClientSecretFailed: false,
  data: {},
  errors: [],
};
const usageConsolidation = {
  isLoading: false,
  isLoaded: false,
  isFailed: false,
  isKeyLoading: false,
  isKeyLoaded: false,
  isKeyFailed: false,
  hasSaved: false,
  data: {},
  errors: [],
};

const renderSettingsUsageConsolidationRoute = ({ harnessProps = {}, props = {} }) => render(
  <MemoryRouter>
    <Harness
      storeInitialState={{
        data: {
          currencies,
          ucCredentials,
          usageConsolidation,
        },
      }}
      {...harnessProps}
    >
      <SettingsUsageConsolidationRoute
        clearUsageConsolidationErrors={noop}
        getUsageConsolidation={noop}
        getUsageConsolidationKey={noop}
        patchUsageConsolidation={noop}
        postUsageConsolidation={noop}
        getCurrencies={noop}
        getUcCredentials={noop}
        getUcCredentialsClientId={noop}
        getUcCredentialsClientSecret={noop}
        updateUcCredentials={noop}
        {...props}
      />
    </Harness>
  </MemoryRouter>
);

describe('Given SettingsUsageConsolidationRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  it('should handle getCurrencies', async () => {
    await act(async () => {
      await renderSettingsUsageConsolidationRoute({
        props: { getCurrencies },
      });
    });

    expect(getCurrencies).toHaveBeenCalled();
  });

  it('should handle getUcCredentials', async () => {
    await act(async () => {
      await renderSettingsUsageConsolidationRoute({
        props: { getUcCredentials },
      });
    });

    expect(getUcCredentials).toHaveBeenCalled();
  });

  it('should handle getUcCredentialsClientId', async () => {
    await act(async () => {
      await renderSettingsUsageConsolidationRoute({
        props: { getUcCredentialsClientId },
      });
    });

    expect(getUcCredentialsClientId).toHaveBeenCalled();
  });

  it('should handle getUcCredentialsClientSecret', async () => {
    await act(async () => {
      await renderSettingsUsageConsolidationRoute({
        props: { getUcCredentialsClientSecret },
      });
    });

    expect(getUcCredentialsClientSecret).toHaveBeenCalled();
  });

  describe('when usage consolidation is loading', () => {
    it('should show spinner', () => {
      const { container } = renderSettingsUsageConsolidationRoute({
        harnessProps: {
          storeInitialState: {
            data: {
              currencies,
              ucCredentials,
              usageConsolidation: {
                ...usageConsolidation,
                isLoading: true,
              },
            },
          },
        },
      });

      expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
    });
  });

  describe('when usage consolidation is loaded', () => {
    it('should handle getUsageConsolidationKey', async () => {
      await act(async () => {
        await renderSettingsUsageConsolidationRoute({
          props: { getUsageConsolidationKey },
          harnessProps: {
            storeInitialState: {
              data: {
                currencies,
                ucCredentials,
                usageConsolidation: {
                  ...usageConsolidation,
                  isLoaded: true,
                },
              },
            },
          },
        });
      });

      expect(getUsageConsolidationKey).toHaveBeenCalled();
    });
  });

  describe('when the form was filled and click on save button', () => {
    describe('when ucCredentials is not present', () => {
      it('should handle updateUcCredentials', async () => {
        let getByTestId;

        await act(async () => {
          getByTestId = await renderSettingsUsageConsolidationRoute({
            props: { updateUcCredentials },
          }).getByTestId;
        });

        fireEvent.change(getByTestId('field-clientId'), { target: { value: '***' } });
        fireEvent.change(getByTestId('field-clientSecret'), { target: { value: '***' } });
        fireEvent.change(getByTestId('field-customerKey'), { target: { value: '123' } });
        fireEvent.change(getByTestId('field-currency'), { target: { value: 'AFN' } });
        fireEvent.click(getByTestId('settings-form-save-button'));

        expect(updateUcCredentials).toHaveBeenCalledWith({
          attributes: {
            clientId: '***',
            clientSecret: '***',
          },
          type: 'ucCredentials',
        });
      });
    });

    describe('when ucCredentials is present', () => {
      it('should not handle updateUcCredentials', async () => {
        let getByTestId;

        await act(async () => {
          getByTestId = await renderSettingsUsageConsolidationRoute({
            props: { updateUcCredentials },
            harnessProps: {
              storeInitialState: {
                data: {
                  currencies,
                  ucCredentials: {
                    ...ucCredentials,
                    isPresent: true,
                  },
                  usageConsolidation,
                },
              },
            },
          }).getByTestId;
        });

        fireEvent.change(getByTestId('field-customerKey'), { target: { value: '123' } });
        fireEvent.change(getByTestId('field-currency'), { target: { value: 'AFN' } });
        fireEvent.click(getByTestId('settings-form-save-button'));

        expect(updateUcCredentials).not.toHaveBeenCalled();
      });
    });

    describe('when credentials id is not present', () => {
      it('should handle postUsageConsolidation', async () => {
        const clientId = '111';
        const clientSecret = '222';
        let getByTestId;

        await act(async () => {
          getByTestId = await renderSettingsUsageConsolidationRoute({
            props: { postUsageConsolidation },
            harnessProps: {
              storeInitialState: {
                data: {
                  currencies,
                  ucCredentials: {
                    ...ucCredentials,
                    isPresent: true,
                    isUpdated: true,
                    data: {
                      clientId,
                      clientSecret,
                    },
                  },
                  usageConsolidation: {
                    ...usageConsolidation,
                    data: {
                      customerKey: '123',
                    },
                  },
                },
              },
            },
          }).getByTestId;
        });

        fireEvent.change(getByTestId('field-customerKey'), { target: { value: '123' } });
        fireEvent.change(getByTestId('field-clientId'), { target: { value: clientId } });
        fireEvent.change(getByTestId('field-clientSecret'), { target: { value: clientSecret } });
        fireEvent.change(getByTestId('field-currency'), { target: { value: 'AFN' } });
        fireEvent.click(getByTestId('settings-form-save-button'));

        expect(postUsageConsolidation).toHaveBeenCalled();
      });
    });

    describe('when credentials id is present', () => {
      it('should handle patchUsageConsolidation', async () => {
        const clientId = '111';
        const clientSecret = '222';
        let getByTestId;

        await act(async () => {
          getByTestId = await renderSettingsUsageConsolidationRoute({
            props: { patchUsageConsolidation },
            harnessProps: {
              storeInitialState: {
                data: {
                  currencies,
                  ucCredentials: {
                    ...ucCredentials,
                    isPresent: true,
                    isUpdated: true,
                    data: {
                      clientId,
                      clientSecret,
                    },
                  },
                  usageConsolidation: {
                    ...usageConsolidation,
                    data: {
                      credentialsId: 'id',
                      customerKey: '123',
                    },
                  },
                },
              },
            },
          }).getByTestId;
        });

        fireEvent.change(getByTestId('field-customerKey'), { target: { value: '123' } });
        fireEvent.change(getByTestId('field-clientId'), { target: { value: clientId } });
        fireEvent.change(getByTestId('field-clientSecret'), { target: { value: clientSecret } });
        fireEvent.change(getByTestId('field-currency'), { target: { value: 'AFN' } });
        fireEvent.click(getByTestId('settings-form-save-button'));

        expect(patchUsageConsolidation).toHaveBeenCalled();
      });
    });
  });
});
