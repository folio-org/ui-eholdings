import { MemoryRouter } from 'react-router-dom';
import noop from 'lodash/noop';

import {
  render,
  cleanup,
  act,
  fireEvent,
} from '@testing-library/react';

import SettingsUsageConsolidationRoute from './settings-usage-consolidation-route';
import Harness from '../../test/jest/helpers/harness';

const mockGetUsageConsolidation = jest.fn();
const mockGetUsageConsolidationKey = jest.fn();
const mockPatchUsageConsolidation = jest.fn();
const mockPostUsageConsolidation = jest.fn();
const mockGetCurrencies = jest.fn();
const mockGetUcCredentials = jest.fn();
const mockGetUcCredentialsClientId = jest.fn();
const mockGetUcCredentialsClientSecret = jest.fn();
const mockUpdateUcCredentials = jest.fn();

jest.mock('../redux/actions', () => ({
  ...jest.requireActual('../redux/actions'),
  getUsageConsolidation: mockGetUsageConsolidation,
  getUsageConsolidationKey: mockGetUsageConsolidationKey,
  patchUsageConsolidation: mockPatchUsageConsolidation,
  postUsageConsolidation: mockPostUsageConsolidation,
  getCurrencies: mockGetCurrencies,
  getUcCredentials: mockGetUcCredentials,
  getUcCredentialsClientId: mockGetUcCredentialsClientId,
  getUcCredentialsClientSecret: mockGetUcCredentialsClientSecret,
  updateUcCredentials: mockUpdateUcCredentials,
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
    mockGetUsageConsolidation.mockClear();
    mockGetUsageConsolidationKey.mockClear();
    mockPatchUsageConsolidation.mockClear();
    mockPostUsageConsolidation.mockClear();
    mockGetCurrencies.mockClear();
    mockGetUcCredentials.mockClear();
    mockGetUcCredentialsClientId.mockClear();
    mockGetUcCredentialsClientSecret.mockClear();
    mockUpdateUcCredentials.mockClear();
  });

  afterEach(cleanup);

  it('should handle getCurrencies', async () => {
    await act(async () => {
      await renderSettingsUsageConsolidationRoute({
        props: { getCurrencies: mockGetCurrencies },
      });
    });

    expect(mockGetCurrencies).toHaveBeenCalled();
  });

  it('should handle getUcCredentials', async () => {
    await act(async () => {
      await renderSettingsUsageConsolidationRoute({
        props: { getUcCredentials: mockGetUcCredentials },
      });
    });

    expect(mockGetUcCredentials).toHaveBeenCalled();
  });

  it('should handle getUcCredentialsClientId', async () => {
    await act(async () => {
      await renderSettingsUsageConsolidationRoute({
        props: { getUcCredentialsClientId: mockGetUcCredentialsClientId },
      });
    });

    expect(mockGetUcCredentialsClientId).toHaveBeenCalled();
  });

  it('should handle getUcCredentialsClientSecret', async () => {
    await act(async () => {
      await renderSettingsUsageConsolidationRoute({
        props: { getUcCredentialsClientSecret: mockGetUcCredentialsClientSecret },
      });
    });

    expect(mockGetUcCredentialsClientSecret).toHaveBeenCalled();
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
          props: { getUsageConsolidationKey: mockGetUsageConsolidationKey },
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

      expect(mockGetUsageConsolidationKey).toHaveBeenCalled();
    });
  });

  describe('when the form was filled and click on save button', () => {
    describe('when ucCredentials is not present', () => {
      it('should handle updateUcCredentials', async () => {
        let getByTestId;

        await act(async () => {
          getByTestId = await renderSettingsUsageConsolidationRoute({
            props: { updateUcCredentials: mockUpdateUcCredentials },
          }).getByTestId;
        });

        fireEvent.change(getByTestId('field-clientId'), { target: { value: '***' } });
        fireEvent.change(getByTestId('field-clientSecret'), { target: { value: '***' } });
        fireEvent.change(getByTestId('field-customerKey'), { target: { value: '123' } });
        fireEvent.change(getByTestId('field-currency'), { target: { value: 'AFN' } });
        fireEvent.click(getByTestId('settings-form-save-button'));

        expect(mockUpdateUcCredentials).toHaveBeenCalledWith({
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
            props: { updateUcCredentials: mockUpdateUcCredentials },
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

        expect(mockUpdateUcCredentials).not.toHaveBeenCalled();
      });
    });

    describe('when credentials id is not present', () => {
      it('should handle postUsageConsolidation', async () => {
        let getByTestId;

        await act(async () => {
          getByTestId = await renderSettingsUsageConsolidationRoute({
            props: { postUsageConsolidation: mockPostUsageConsolidation },
            harnessProps: {
              storeInitialState: {
                data: {
                  currencies,
                  ucCredentials: {
                    ...ucCredentials,
                    isPresent: true,
                  },
                  usageConsolidation: {
                    ...usageConsolidation,
                    data: { customerKey: '321' },
                  },
                },
              },
            },
          }).getByTestId;
        });

        fireEvent.change(getByTestId('field-customerKey'), { target: { value: '123' } });
        fireEvent.change(getByTestId('field-currency'), { target: { value: 'AFN' } });
        fireEvent.click(getByTestId('settings-form-save-button'));

        expect(mockPostUsageConsolidation).toHaveBeenCalled();
      });
    });

    describe('when credentials id is present', () => {
      it('should handle patchUsageConsolidation', async () => {
        const clientId = '111';
        const clientSecret = '222';
        let getByTestId;

        await act(async () => {
          getByTestId = await renderSettingsUsageConsolidationRoute({
            props: { patchUsageConsolidation: mockPatchUsageConsolidation },
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

        expect(mockPatchUsageConsolidation).toHaveBeenCalled();
      });
    });
  });
});
