import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import PackageEditRoute from './package-edit-route';
import Harness from '../../../test/jest/helpers/harness';

const provider = {
  id: 'providerid',
  isLoading: false,
  providerToken: {
    value: 'provider-token',
    prompt: '',
  },
  data: {
    isLoaded: true,
    isLoading: false,
  },
  proxy: {
    id: 'proxy-id',
  },
};

const packageId = `${provider.id}-titleid`;

const history = {
  replace: jest.fn(),
};

const location = {
  pathname: 'pathname',
  search: '?searchType=packages&q=test&offset=1',
  hash: '',
};

const match = {
  isExact: true,
  params: {
    packageId,
  },
  path: '/eholdings/packages/:packageId/edit',
  url: `/eholdings/packages/${packageId}/edit`,
};

const model = {
  id: packageId,
  name: 'Test package',
  description: '',
  edition: '',
  contributors: [],
  identifiers: [],
  isLoaded: true,
  isLoading: false,
  isCustom: true,
  isSelected: true,
  isPeerReviewed: false,
  titleCount: 100,
  publicationType: 'Unspecified',
  packageToken: {
    value: 'token-value',
  },
  update: {
    errors: [],
    isPending: false,
    isRejected: false,
  },
  request: {
    errors: [],
    isRejected: false,
  },
  destroy: {
    isPending: false,
    errors: [],
  },
  visibilityData: {
    isHidden: false,
  },
  proxy: {
    id: 'proxy-id',
    inherited: false,
  },
};

const updateRequest = {
  errors: [],
  isResolved: true,
  isPending: false,
  timestamp: 0,
};

const accessStatusTypes = {
  isDeleted: false,
  isLoading: false,
  items: {
    data: [],
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

const mockGetPackage = jest.fn();
const mockDestroyPackage = jest.fn();
const mockGetAccessTypes = jest.fn();
const mockGetProvider = jest.fn();
const mockGetProxyTypes = jest.fn();
const mockUpdatePackage = jest.fn();
const mockRemoveUpdateRequests = jest.fn();
const mockUnloadResources = jest.fn();
const mockUpdateProvider = jest.fn();

const getPackageEditRoute = (props = {}) => (
  <MemoryRouter>
    <Harness>
      <PackageEditRoute
        accessStatusTypes={accessStatusTypes}
        history={history}
        location={location}
        match={match}
        model={model}
        updateRequest={updateRequest}
        updatePackage={mockUpdatePackage}
        proxyTypes={proxyTypes}
        provider={provider}
        removeUpdateRequests={mockRemoveUpdateRequests}
        unloadResources={mockUnloadResources}
        updateProvider={mockUpdateProvider}
        getPackage={mockGetPackage}
        destroyPackage={mockDestroyPackage}
        getAccessTypes={mockGetAccessTypes}
        getProvider={mockGetProvider}
        getProxyTypes={mockGetProxyTypes}
        {...props}
      />
    </Harness>
  </MemoryRouter>
);

const renderPackageEditRoute = (props) => render(getPackageEditRoute(props));

describe('Given PackageEditRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  it('should request all data', async () => {
    await renderPackageEditRoute();

    expect(mockGetPackage).toHaveBeenCalledWith(packageId);
    expect(mockGetProxyTypes).toHaveBeenCalled();
    expect(mockGetProvider).toHaveBeenCalledWith(provider.id);
    expect(mockGetAccessTypes).toHaveBeenCalled();
  });

  describe('when package is destroyed', () => {
    it('should redirect back to search page', async () => {
      const { rerender } = await renderPackageEditRoute();

      rerender(getPackageEditRoute({
        model: {
          ...model,
          destroy: {
            isResolved: true,
            errors: [],
          },
        },
      }));

      expect(history.replace).toHaveBeenCalledWith({
        pathname: '/eholdings',
        search: location.search,
      }, { eholdings: true });
    });
  });

  describe('when packageId in url has changed', () => {
    it('should handle getpackage', async () => {
      const newpackageId = 'new-test-package-id';

      const { rerender } = await renderPackageEditRoute();

      rerender(getPackageEditRoute({
        match: {
          ...match,
          params: {
            packageId: newpackageId,
          },
        },
      }));

      expect(mockGetPackage).toHaveBeenCalledWith(newpackageId);
    });
  });

  describe('when submit form with edited package', () => {
    it('should handle updatepackage', () => {
      const { getByRole } = renderPackageEditRoute();

      const packageNameInput = getByRole('textbox', { name: 'ui-eholdings.label.name' });

      fireEvent.change(packageNameInput, { target: { value: 'New package name' } });
      fireEvent.blur(packageNameInput);

      fireEvent.click(getByRole('button', { name: 'stripes-components.saveAndClose' }));

      expect(mockUpdatePackage).toHaveBeenCalled();
    });
  });

  describe('when click on close icon', () => {
    it('should redirect to the view package page', () => {
      const { getByRole } = renderPackageEditRoute();

      const packageNameInput = getByRole('textbox', { name: 'ui-eholdings.label.name' });

      fireEvent.change(packageNameInput, { target: { value: 'New package name' } });
      fireEvent.blur(packageNameInput);

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.icon.closeX' }));

      expect(history.replace).toHaveBeenCalled();
    });
  });

  describe('when package is not pending anymore and needs update', () => {
    it('should redirect to the view package page', () => {
      const { rerender } = renderPackageEditRoute({
        model: {
          ...model,
          update: {
            ...model.update,
            isPending: true,
          },
        },
      });

      rerender(getPackageEditRoute());

      expect(history.replace).toHaveBeenCalled();
    });
  });

  describe('when model is not loaded', () => {
    describe('when request is not rejected', () => {
      it('should show spinner', () => {
        const { container } = renderPackageEditRoute({
          model: {
            ...model,
            isLoaded: false,
          },
        });

        expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
      });
    });

    describe('when request is rejected', () => {
      it('should display an error', () => {
        const { getByText } = renderPackageEditRoute({
          model: {
            ...model,
            isLoaded: false,
            request: {
              ...model.request,
              errors: [{ title: 'Error title' }],
              isRejected: true,
            },
          },
        });

        expect(getByText('Error title')).toBeDefined();
      });
    });
  });

  describe('when package is added to holdings', () => {
    it('should update package', () => {
      const { getByText } = renderPackageEditRoute({
        model: {
          ...model,
          isSelected: false,
        },
      });

      fireEvent.click(getByText('ui-eholdings.addPackageToHoldings'));

      expect(mockUpdatePackage).toHaveBeenCalledWith({
        ...model,
        isSelected: true,
        selectedCount: model.titleCount,
        allowKbToAddTitles: true,
      });
    });
  });

  describe('when a custom package is deselected', () => {
    it('should call destroyPackage', () => {
      const { getByText } = renderPackageEditRoute();

      fireEvent.click(getByText('ui-eholdings.package.deletePackage'));
      fireEvent.click(getByText('ui-eholdings.package.modal.buttonConfirm.isCustom'));

      expect(mockDestroyPackage).toHaveBeenCalled();
    });
  });

  describe('when a managed package is deselected', () => {
    it('should call destroyPackage', () => {
      const { getByText } = renderPackageEditRoute({
        model: {
          ...model,
          isCustom: false,
        },
      });

      fireEvent.click(getByText('ui-eholdings.package.removeFromHoldings'));
      fireEvent.click(getByText('ui-eholdings.package.modal.buttonConfirm'));

      expect(mockUpdatePackage).toHaveBeenCalled();
    });
  });

  describe('when component is unmounted', () => {
    it('should handle removeUpdateRequests', async () => {
      const { unmount } = await renderPackageEditRoute();

      unmount();

      expect(mockRemoveUpdateRequests).toHaveBeenCalled();
    });
  });
});
