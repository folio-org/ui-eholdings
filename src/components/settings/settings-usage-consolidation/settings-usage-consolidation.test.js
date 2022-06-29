import { MemoryRouter } from 'react-router-dom';
import noop from 'lodash/noop';

import {
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react';

import SettingsUsageConsolidation from './settings-usage-consolidation';

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
  isClientIdFailed: false,
  isClientIdLoaded: false,
  isClientSecretLoading: false,
  isClientSecretFailed: false,
  isClientSecretLoaded: false,
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

const renderSettingsUsageConsolidation = (props = {}) => render(
  <MemoryRouter>
    <SettingsUsageConsolidation
      clearUsageConsolidationErrors={noop}
      currencies={currencies}
      ucCredentials={ucCredentials}
      usageConsolidation={usageConsolidation}
      onSubmit={noop}
      {...props}
    />
  </MemoryRouter>
);

describe('Given SettingsUsageConsolidationRoute', () => {
  afterEach(cleanup);

  it('should not fill clientId and clientSecret fields with any value', async () => {
    const { getByTestId } = renderSettingsUsageConsolidation();

    expect(getByTestId('field-clientId').value).toEqual('');
    expect(getByTestId('field-clientSecret').value).toEqual('');
  });

  describe('when usage consolidation settings was successfully saved', () => {
    it('should show toast message', () => {
      const { getByText } = renderSettingsUsageConsolidation({
        usageConsolidation: {
          ...usageConsolidation,
          hasSaved: true,
        },
      });

      expect(getByText('ui-eholdings.settings.usageConsolidation.saved')).toBeDefined();
    });
  });

  describe('when usage consolidation credentials were not saved', () => {
    describe('and it is a validation error', () => {
      it('should show toast message', () => {
        const { getByText } = renderSettingsUsageConsolidation({
          ucCredentials: {
            ...ucCredentials,
            isFailed: true,
            errors: [{ title: 'Invalid Usage Consolidation Credentials' }],
          },
        });

        expect(getByText('ui-eholdings.settings.usageConsolidation.credentials.validation.invalid')).toBeDefined();
      });
    });

    describe('and it is a system error', () => {
      it('should show toast message', () => {
        const { getByText } = renderSettingsUsageConsolidation({
          ucCredentials: {
            ...ucCredentials,
            isFailed: true,
            errors: [{ title: 'system error' }],
          },
        });

        expect(getByText('ui-eholdings.settings.usageConsolidation.credentials.systemError')).toBeDefined();
      });
    });

    describe('and it is a usageConsolidation error', () => {
      it('should show toast message', () => {
        const { getByText } = renderSettingsUsageConsolidation({
          usageConsolidation: {
            ...usageConsolidation,
            isFailed: true,
            errors: [{ title: 'usageConsolidation error' }],
          },
        });

        expect(getByText('ui-eholdings.settings.usageConsolidation.credentials.systemError')).toBeDefined();
      });
    });
  });

  describe('when customer key is empty', () => {
    it('should show error message', () => {
      const {
        getByText,
        getByTestId,
      } = renderSettingsUsageConsolidation();

      fireEvent.blur(getByTestId('field-customerKey'));

      expect(getByText('ui-eholdings.settings.usageConsolidation.id.validation.empty')).toBeDefined();
    });
  });

  describe('when currency was not choosed', () => {
    it('should show error message', () => {
      const {
        getByText,
        getByTestId,
      } = renderSettingsUsageConsolidation();

      fireEvent.blur(getByTestId('field-currency'));

      expect(getByText('ui-eholdings.settings.usageConsolidation.currency.validation')).toBeDefined();
    });
  });

  describe('when customer uc credentials is present', () => {
    it('should show asterisks in clientId and clientSecret fields', () => {
      const { getByTestId } = renderSettingsUsageConsolidation({
        ucCredentials: {
          ...ucCredentials,
          isPresent: true,
          data: {
            clientId: 'client-id',
            clientSecret: 'client-secret',
          }
        },
      });

      expect(getByTestId('field-clientId').value).toEqual('client-id');
      expect(getByTestId('field-clientSecret').value).toEqual('client-secret');
    });
  });
});
