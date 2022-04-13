import { MemoryRouter } from 'react-router';

import {
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react';

import ProviderEditRoute from './provider-edit-route';
import Harness from '../../../test/jest/helpers/harness';

const history = {
  replace: jest.fn(),
};

const location = {
  pathname: 'pathname',
  search: '',
  hash: '',
};

const match = {
  isExact: true,
  params: { providerId: 'provider-id' },
  path: 'path',
  url: 'url',
};

const model = {
  id: 'provider-id',
  name: 'provider-name',
  packagesSelected: 10,
  packagesTotal: 100,
  isLoaded: true,
  isLoading: false,
  isTitleCustom: true,
  proxy: {
    id: 'proxy-id',
    inherited: false,
  },
  providerToken: {
    value: 'token-value',
  },
  update: {
    errors: [],
    isPending: false,
    isRejected: false,
    isResolved: false,
  },
  request: {
    errors: [],
    isPending: false,
    isRejected: false,
    isResolved: true,
  },
  destroy: {
    errors: [],
    isRejected: false,
  },
  visibilityData: {
    isHidden: false,
  },
};

const proxyTypes = {
  request: {
    isResolved: true,
  },
  resolver: {
    state: {
      proxyTypes: {
        records: {
          'proxy-id': {
            id: 'proxy-id',
            attributes: {
              name: 'Some Proxy',
            },
          },
          'proxy-id-2': {
            id: 'proxy-id-2',
            attributes: {
              name: 'Some Other Proxy',
            },
          },
        },
      },
    },
  },
};

const rootProxy = {
  data: {
    attributes: {
      proxyTypeId: 'ezproxy',
    },
  },
  request: {
    isResolved: true,
  },
};

const mockGetProvider = jest.fn();
const mockGetProxyTypes = jest.fn();
const mockGetRootProxy = jest.fn();
const mockRemoveUpdateRequests = jest.fn();
const mockUpdateProvider = jest.fn();

const getProviderEditRoute = (props = {}) => (
  <MemoryRouter>
    <Harness>
      <ProviderEditRoute
        getProvider={mockGetProvider}
        getProxyTypes={mockGetProxyTypes}
        getRootProxy={mockGetRootProxy}
        history={history}
        location={location}
        match={match}
        model={model}
        proxyTypes={proxyTypes}
        removeUpdateRequests={mockRemoveUpdateRequests}
        rootProxy={rootProxy}
        updateProvider={mockUpdateProvider}
        {...props}
      />
        Page content
    </Harness>
  </MemoryRouter>
);

const renderProviderEditRoute = (props) => render(getProviderEditRoute(props));

describe('Given ProviderEditRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  it('should render page', () => {
    const { getByText } = renderProviderEditRoute();

    expect(getByText('Page content')).toBeDefined();
  });

  it('should handle getProvider with providerId', () => {
    renderProviderEditRoute();

    expect(mockGetProvider).toHaveBeenCalledWith('provider-id');
  });

  it('should handle GetProxyTypes', () => {
    renderProviderEditRoute();

    expect(mockGetProxyTypes).toHaveBeenCalled();
  });

  it('should handle Cancel', () => {
    const { getByRole } = renderProviderEditRoute();

    fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.icon.closeX' }));

    expect(history.replace).toHaveBeenCalledWith({
      pathname: `/eholdings/providers/${model.id}`,
      search: location.search,
      state: {
        eholdings: true,
      },
    });
  });

  it('should handle onSubmit', () => {
    const { getByRole } = renderProviderEditRoute();

    fireEvent.submit(getByRole('button', { name: 'stripes-components.saveAndClose' }));

    expect(mockUpdateProvider).toHaveBeenCalled();
  });

  describe('when update request resolves', () => {
    it('should redirect to the view title page', () => {
      const { rerender } = renderProviderEditRoute({
        model: {
          ...model,
          update: {
            ...model.update,
            isPending: true,
          },
        },
      });

      rerender(getProviderEditRoute());

      expect(history.replace).toHaveBeenCalled();
    });
  });

  describe('when providerId is not prevProps.match.params.providerId', () => {
    it('should handle getProvider', () => {
      const newProviderId = 'provider-id';

      const { rerender } = renderProviderEditRoute();

      rerender(getProviderEditRoute({
        match: {
          ...match,
          params: {
            notProviderId: newProviderId,
          },
        },
      }));

      expect(mockGetProvider).toHaveBeenCalledWith(newProviderId);
    });
  });

  describe('when component is unmounted', () => {
    it('should handle removeUpdateRequests', () => {
      const { unmount } = renderProviderEditRoute();

      unmount();

      expect(mockRemoveUpdateRequests).toHaveBeenCalled();
    });
  });
});

