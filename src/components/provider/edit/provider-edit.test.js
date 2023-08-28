import noop from 'lodash/noop';
import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes-components';

import ProviderEdit from './provider-edit';
import Harness from '../../../../test/jest/helpers/harness';

const model = {
  id: '123356',
  name: 'API DEV GOVERNMENT CUSTOMER',
  packagesSelected: 151,
  packagesTotal: 151,
  isLoaded: true,
  isLoading: false,
  destroy: {
    timestamp: 0,
    isRejected: false,
    errors: [],
  },
  update: {
    timestamp: 0,
    isPending: false,
    isRedolved: false,
    isRejected: false,
    errors: [],
  },
  request: {
    timestamp: 0,
    isRejected: false,
    errors: [],
  },
  proxy: {
    id: 'id',
  },
  providerToken: {
    prompt: 'prompt',
    value: 'value',
  }
};

const rootProxy = {
  data: {
    attributes: {
      proxyTypeId: 'proxyTypeId',
    },
  },
  request: {
    isResolved: true,
  },
};

jest.mock('../../proxy-select', () => () => <span>ProxySelectField</span>);

const renderProviderEdit = (props = {}) => render(
  <Harness>
    <CommandList commands={defaultKeyboardShortcuts}>
      <ProviderEdit
        onCancel={noop}
        onSubmit={noop}
        proxyTypes={{
          request: {
            isResolved: true,
          },
        }}
        rootProxy={rootProxy}
        model={model}
        {...props}
      />
    </CommandList>
  </Harness>
);

describe('Given ProviderEdit', () => {
  afterEach(cleanup);

  it('should show ProxySelectField', () => {
    const { getByText } = renderProviderEdit();

    expect(getByText('ProxySelectField')).toBeDefined();
  });

  describe('when root proxy request is not resolved', () => {
    it('should not show ProxySelectField', () => {
      const { queryByText } = renderProviderEdit({
        rootProxy: {
          request: {
            isResolved: false,
          },
        },
      });

      expect(queryByText('ProxySelectField')).toBeNull();
    });
  });

  describe('when no packages selected', () => {
    it('should show message', () => {
      const { getByText } = renderProviderEdit({
        model: {
          ...model,
          packagesSelected: 0,
        },
      });

      expect(getByText('ui-eholdings.provider.noPackagesSelected')).toBeDefined();
    });
  });

  describe('when no any provider token', () => {
    it('should not show token field', () => {
      const { queryByText } = renderProviderEdit({
        model: {
          ...model,
          providerToken: {},
        },
      });

      expect(queryByText('ui-eholdings.provider.token')).toBeNull();
    });
  });
});
