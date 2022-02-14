import { MemoryRouter } from 'react-router-dom';
import noop from 'lodash/noop';

import {
  render,
  cleanup,
  act,
  fireEvent,
} from '@testing-library/react';

import { createMemoryHistory } from 'history';

import PackageShowRoute from './package-show-route';
import Harness from '../../../test/jest/helpers/harness';
import {
  DELAY_BEFORE_UPDATE,
  INTERVAL_BEFORE_CHECK_FOR_AN_UPDATE,
} from '../../constants';

jest.mock('../../features/agreements-accordion', () => () => (<div>AgreementsAccordion component</div>));
jest.mock('../../components/package/show/components/coverage-settings', () => () => (<div>CoverageSettings component</div>));

jest.mock('../../components/tags', () => ({ updateFolioTags }) => (
  <button
    type="button"
    onClick={updateFolioTags}
  >
    Update Folio tags
  </button>
));

jest.mock('../../features/usage-consolidation-accordion', () => ({
  onFilterSubmit,
  onViewTitles,
  onLoadMoreTitles,
}) => (
  <>
    <button
      type="button"
      onClick={onFilterSubmit}
    >
      Fetch package cost per use
    </button>

    <button
      type="button"
      onClick={onViewTitles}
    >
      Fetch cost per use package titles
    </button>

    <button
      type="button"
      onClick={onLoadMoreTitles}
    >
      Load more cost per use package titles
    </button>
  </>
));

const mockGetPackageTitles = jest.fn();
const mockGetPackage = jest.fn();
const mockClearPackageTitles = jest.fn();
const mockGetProxyTypes = jest.fn();
const mockGetTags = jest.fn();
const mockGetProvider = jest.fn();
const mockUnloadResources = jest.fn();
const mockUpdatePackage = jest.fn();
const mockUpdateFolioTags = jest.fn();
const mockDestroyPackage = jest.fn();
const mockRemoveUpdateRequests = jest.fn();
const mockGetAccessTypes = jest.fn();
const mockGetCostPerUse = jest.fn();
const mockGetCostPerUsePackageTitles = jest.fn();
const mockClearCostPerUseData = jest.fn();

const history = createMemoryHistory();
const historyReplaceSpy = jest.spyOn(history, 'replace');

const location = {
  pathname: 'pathname',
  search: '',
  hash: '',
};

const match = {
  params: { packageId: 'package-id' },
  path: 'path',
  url: 'url',
};

const model = {
  id: 'package-id',
  name: 'Test package',
  description: '',
  edition: '',
  contributors: [],
  identifiers: [],
  resources: {},
  isLoaded: true,
  isCustom: false,
  isSelected: false,
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
    isResolved: false,
  },
  request: {
    errors: [],
    isRejected: false,
  },
  destroy: {
    isPending: false,
    isResolved: false,
    errors: [],
  },
  visibilityData: {
    isHidden: false,
  },
  proxy: {
    id: 'proxy-id',
    inherited: false,
  },
  tags: {
    tagList: [],
  },
};

const proxyTypes = {
  resolver: {
    state: {
      proxyTypes: {
        records: {},
      },
    },
  },
  request: {
    isResolved: true,
  },
};

const provider = {
  data: {
    isLoaded: true,
    isLoading: false,
  },
  providerToken: {
    prompt: '',
  },
  proxy: {
    id: 'proxy-id',
  },
};

const tagsModel = {
  request: {
    isResolved: true,
  },
};

const resolver = {
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
};

const accessStatusTypes = {
  isDeleted: false,
  isLoading: false,
  items: {
    data: [{
      id: 'access-type-id',
      type: 'test type',
      attributes: {
        name: 'access type',
      },
    }],
  },
};

const costPerUse = {
  data: {},
  errors: [],
  isFailed: false,
  isLoaded: false,
  isLoading: false,
};

const packageTitles = {
  totalResults: 1,
  items: [{
    attributes: {
      name: 'Title name 1',
      isSelected: true,
      visibilityData: { isHidden: false },
      tags: {
        tagList: [],
      },
    },
    id: 'package-id',
    relationships: {},
    type: 'resources',
  }],
  hasFailed: false,
  errors: [],
};

const getPackageShowRoute = (props = {}) => (
  <MemoryRouter>
    <Harness>
      <PackageShowRoute
        history={history}
        location={location}
        match={match}
        model={model}
        proxyTypes={proxyTypes}
        provider={provider}
        tagsModel={tagsModel}
        resolver={resolver}
        accessStatusTypes={accessStatusTypes}
        costPerUse={costPerUse}
        packageTitles={packageTitles}
        getPackageTitles={noop}
        getPackage={noop}
        clearPackageTitles={noop}
        getProxyTypes={noop}
        getTags={noop}
        getProvider={noop}
        unloadResources={noop}
        updatePackage={noop}
        updateFolioTags={noop}
        destroyPackage={noop}
        removeUpdateRequests={noop}
        getAccessTypes={noop}
        getCostPerUse={noop}
        getCostPerUsePackageTitles={noop}
        clearCostPerUseData={noop}
        {...props}
      />
      PackageShowRoute component
    </Harness>
  </MemoryRouter>
);

const renderPackageShowRoute = (props = {}) => render(getPackageShowRoute(props));

describe('Given PackageShowRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  it('should render PackageShowRoute', async () => {
    const { getByText } = renderPackageShowRoute();

    expect(getByText('PackageShowRoute component')).toBeDefined();
  });

  it('should handle getPackage', async () => {
    renderPackageShowRoute({
      getPackage: mockGetPackage,
    });

    expect(mockGetPackage).toHaveBeenCalled();
  });

  it('should handle getProxyTypes', async () => {
    renderPackageShowRoute({
      getProxyTypes: mockGetProxyTypes,
    });

    expect(mockGetProxyTypes).toHaveBeenCalled();
  });

  it('should handle getProvider', async () => {
    renderPackageShowRoute({
      getProvider: mockGetProvider,
    });

    expect(mockGetProvider).toHaveBeenCalled();
  });

  it('should handle getTags', async () => {
    renderPackageShowRoute({
      getTags: mockGetTags,
    });

    expect(mockGetTags).toHaveBeenCalled();
  });

  it('should handle getAccessTypes', async () => {
    renderPackageShowRoute({
      getAccessTypes: mockGetAccessTypes,
    });

    expect(mockGetAccessTypes).toHaveBeenCalled();
  });

  it('should handle getPackageTitles after delay before update', () => {
    jest.useFakeTimers();

    renderPackageShowRoute({
      getPackageTitles: mockGetPackageTitles,
    });

    setTimeout(() => {
      expect(mockGetPackageTitles).toHaveBeenCalled();
    }, DELAY_BEFORE_UPDATE);

    jest.runAllTimers();
  });

  describe('when package was selected and is freshly saved', () => {
    it('should handle removeUpdateRequests', () => {
      const { rerender } = renderPackageShowRoute({
        model: {
          ...model,
          update: {
            ...model.update,
            isPending: true,
          },
        },
      });

      rerender(getPackageShowRoute({
        removeUpdateRequests: mockRemoveUpdateRequests,
        model: {
          ...model,
          isSelected: true,
        },
      }));

      expect(mockRemoveUpdateRequests).toHaveBeenCalled();
    });
  });

  describe('when package was unselected and is freshly saved', () => {
    it('should handle removeUpdateRequests', () => {
      const { rerender } = renderPackageShowRoute({
        model: {
          ...model,
          isSelected: true,
          update: {
            ...model.update,
            isPending: true,
          },
        },
      });

      rerender(getPackageShowRoute({
        removeUpdateRequests: mockRemoveUpdateRequests,
      }));

      expect(mockRemoveUpdateRequests).toHaveBeenCalled();
    });
  });

  describe('when package was reached based on search', () => {
    it('should redirect to /eholdings with location.search parameters', () => {
      const { rerender } = renderPackageShowRoute();

      const testSearch = '?searchType=packages&q=testQuery&offset=1';

      rerender(getPackageShowRoute({
        location: {
          ...location,
          search: testSearch,
        },
        model: {
          ...model,
          destroy: {
            ...model.destroy,
            isResolved: true,
          },
        },
      }));

      expect(historyReplaceSpy).toHaveBeenCalledWith({
        pathname: '/eholdings',
        search: testSearch,
      }, { eholdings: true });
    });
  });

  describe('when package was reached directly from url, not by search', () => {
    it('should redirect to /eholdings with searchType equals packages', () => {
      const { rerender } = renderPackageShowRoute();

      const testPathname = '/eholdings?searchType=packages';

      rerender(getPackageShowRoute({
        model: {
          ...model,
          destroy: {
            ...model.destroy,
            isResolved: true,
          },
        },
      }));

      expect(historyReplaceSpy).toHaveBeenCalledWith(testPathname, { eholdings: true });
    });
  });

  describe('when package id change between renders', () => {
    it('should handle getPackage', () => {
      const { rerender } = renderPackageShowRoute();

      rerender(getPackageShowRoute({
        getPackage: mockGetPackage,
        match: {
          ...match,
          params: {
            ...match.params,
            packageId: 'new-package-id',
          },
        },
      }));

      expect(mockGetPackage).toHaveBeenCalled();
    });
  });

  describe('when an update just resolved', () => {
    it('should handle unloadResources', () => {
      const { rerender } = renderPackageShowRoute({
        model: {
          ...model,
          update: {
            ...model.update,
            isPending: true,
          },
        },
      });

      rerender(getPackageShowRoute({
        unloadResources: mockUnloadResources,
        model: {
          ...model,
          update: {
            ...model.update,
            isResolved: true,
          },
        },
      }));

      expect(mockUnloadResources).toHaveBeenCalled();
    });
  });

  describe('when package search params change', () => {
    it('should handle getPackageTitles', () => {
      const {
        getAllByTestId,
        getByRole,
      } = renderPackageShowRoute({
        getPackageTitles: mockGetPackageTitles,
        model: {
          ...model,
          update: {
            ...model.update,
            isResolved: true,
          },
        },
      });

      fireEvent.click(getAllByTestId('search-badge')[0]);
      fireEvent.change(getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' }), {
        target: { value: 'Title name' },
      });
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.search' }));

      expect(mockGetPackageTitles).toHaveBeenCalled();
    });

    describe('when changed param is not single and it is not "page"', () => {
      it('should handle clearPackageTitles', () => {
        const {
          getAllByTestId,
          getByRole,
        } = renderPackageShowRoute({
          clearPackageTitles: mockClearPackageTitles,
          model: {
            ...model,
            update: {
              ...model.update,
              isResolved: true,
            },
          },
        });

        fireEvent.click(getAllByTestId('search-badge')[0]);
        fireEvent.change(getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' }), {
          target: { value: 'Title name' },
        });
        fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.search' }));

        expect(mockClearPackageTitles).toHaveBeenCalled();
      });
    });
  });

  describe('when add package to holdings', () => {
    it('should handle updatePackage', () => {
      const { getByRole } = renderPackageShowRoute({
        updatePackage: mockUpdatePackage,
        model: {
          ...model,
          update: {
            ...model.update,
            isResolved: true,
          },
        },
      });

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.addPackageToHoldings' }));
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.selectPackage.confirmationModal.confirmationButtonText' }));

      expect(mockUpdatePackage).toHaveBeenCalled();
    });

    describe('when package titles are updated', () => {
      it('should not handle getPackageTitles', () => {
        jest.useFakeTimers();

        const { getByRole } = renderPackageShowRoute({
          getPackageTitles: mockGetPackageTitles,
        });

        fireEvent.click(getByRole('button', { name: 'ui-eholdings.addPackageToHoldings' }));
        fireEvent.click(getByRole('button', { name: 'ui-eholdings.selectPackage.confirmationModal.confirmationButtonText' }));

        setTimeout(() => {
          expect(mockGetPackageTitles).not.toHaveBeenCalled();
        }, INTERVAL_BEFORE_CHECK_FOR_AN_UPDATE);

        jest.runAllTimers();
      });
    });
  });

  describe('when remove package from holdings', () => {
    describe('when model is not custom', () => {
      it('should handle updatePackage', () => {
        const { getByRole } = renderPackageShowRoute({
          updatePackage: mockUpdatePackage,
          model: {
            ...model,
            isSelected: true,
          },
        });

        fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
        fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.removeFromHoldings' }));
        fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.modal.buttonConfirm' }));

        expect(mockUpdatePackage).toHaveBeenCalled();
      });
    });

    describe('when model is custom', () => {
      it('should handle destroyPackage', () => {
        const { getByRole } = renderPackageShowRoute({
          destroyPackage: mockDestroyPackage,
          model: {
            ...model,
            isSelected: true,
            isCustom: true,
          },
        });

        fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
        fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.deletePackage' }));
        fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.modal.buttonConfirm.isCustom' }));

        expect(mockDestroyPackage).toHaveBeenCalled();
      });
    });
  });

  describe('when update Folio tags', () => {
    it('should handle UpdateFolioTags', () => {
      const { getByText } = renderPackageShowRoute({
        updateFolioTags: mockUpdateFolioTags,
      });

      fireEvent.click(getByText('Update Folio tags'));

      expect(mockUpdateFolioTags).toHaveBeenCalled();
    });
  });

  describe('when fetch package cost per use', () => {
    it('should handle getCostPerUse', () => {
      const { getByText } = renderPackageShowRoute({
        getCostPerUse: mockGetCostPerUse,
        model: {
          ...model,
          isSelected: true,
        },
      });

      fireEvent.click(getByText('Fetch package cost per use'));

      expect(mockGetCostPerUse).toHaveBeenCalled();
    });
  });

  describe('when fetch cost per use package titles', () => {
    it('should handle getCostPerUsePackageTitles', () => {
      const { getByText } = renderPackageShowRoute({
        getCostPerUsePackageTitles: mockGetCostPerUsePackageTitles,
        model: {
          ...model,
          isSelected: true,
        },
      });

      fireEvent.click(getByText('Fetch cost per use package titles'));

      expect(mockGetCostPerUsePackageTitles).toHaveBeenCalled();
    });
  });

  describe('when load more cost per use package titles', () => {
    it('should handle getCostPerUsePackageTitles', () => {
      const { getByText } = renderPackageShowRoute({
        getCostPerUsePackageTitles: mockGetCostPerUsePackageTitles,
        model: {
          ...model,
          isSelected: true,
        },
      });

      fireEvent.click(getByText('Load more cost per use package titles'));

      expect(mockGetCostPerUsePackageTitles).toHaveBeenCalled();
    });
  });

  describe('when click on Edit button', () => {
    it('should redirect to edit package page', () => {
      const { getByRole } = renderPackageShowRoute({
        model: {
          ...model,
          isSelected: true,
        },
      });

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.actionMenu.edit' }));

      expect(historyReplaceSpy).toHaveBeenCalledWith({
        pathname: `/eholdings/packages/${model.id}/edit`,
        search: location.search,
        state: {
          eholdings: true,
        },
      });
    });
  });

  describe('when component is unmounted', () => {
    it('should handle clearCostPerUseData', async () => {
      await act(async () => {
        const { unmount } = await renderPackageShowRoute({
          clearCostPerUseData: mockClearCostPerUseData,
        });

        unmount();
      });

      expect(mockClearCostPerUseData).toHaveBeenCalled();
    });
  });
});
