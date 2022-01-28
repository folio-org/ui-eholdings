import { MemoryRouter } from 'react-router';

import {
  render,
  cleanup,
  act,
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
  isTitleCustom: true,
  isLoading: false,
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
const mockGetSearchType = jest.fn();

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
    mockGetProxyTypes.mockClear();
    mockGetRootProxy.mockClear();
    mockRemoveUpdateRequests.mockClear();
    mockUpdateProvider.mockClear();
    history.replace.mockClear();
  });

  afterEach(cleanup);

  it('should render page', () => {
    const { getByText } = renderProviderEditRoute({});

    expect(getByText('Page content')).toBeDefined();
  });

  it('should handle getProvider with providerId', async () => {
    await act(async () => {
      await renderProviderEditRoute();
    });

    expect(mockGetProvider).toHaveBeenCalledWith('provider-id');
  });

  it('should handle getProvider', async () => {
    await act(async () => {
      await renderProviderEditRoute({
        props: {
          getProvider: mockGetProvider,
          match: {
            ...match,
            params: { providerId: 'other-provider-id' },
          },
        },
      });
    });

    expect(mockGetProvider).toHaveBeenCalled();
  });

  it('should handle GetProxyTypes', async () => {
    await act(async () => {
      await renderProviderEditRoute({
        props: { proxyType : mockGetProxyTypes },
      });
    });

    expect(mockGetProxyTypes).toHaveBeenCalled();
  });

  it('should handle GetSearchType', async () => {
    await act(async () => {
      await renderProviderEditRoute();
    });

    expect(mockGetSearchType).toBeDefined();
  });

  it('should handle GetProxyTypes', async () => {
    await act(async () => {
      await renderProviderEditRoute({
        props: { proxyType : mockGetProxyTypes },
      });
    });

    expect(mockGetProxyTypes).toHaveBeenCalled();
  });

  it('should handle Cancel', async () => {
    let getByRole;

    await act(async () => {
      getByRole = await renderProviderEditRoute({}).getByRole;
    });

    fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.icon.closeX' }));

    expect(history.replace).toHaveBeenCalledWith({
      pathname: `/eholdings/providers/${model.id}`,
      search: location.search,
      state: {
        eholdings: true,
      },
    });
  });

  it('should handle onSubmit', async () => {
    let getByRole;

    await act(async () => {
      getByRole = await renderProviderEditRoute().getByRole;
    });

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
  describe('when component is unmounted', () => {
    it('should handle removeUpdateRequests', async () => {
      await act(async () => {
        const { unmount } = await renderProviderEditRoute();

        unmount();
      });

      expect(mockRemoveUpdateRequests).toHaveBeenCalled();
    });
  });
});

