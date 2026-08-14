import {
  MemoryRouter,
  useHistory,
  useLocation,
  useParams,
} from 'react-router';
import noop from 'lodash/noop';

import {
  render,
  act,
  fireEvent,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import PackageShowRoute from './package-show-route';
import {
  usePackageModel,
  useUpdatePackageTitlesSelection,
} from '../../hooks';
import Harness from '../../../test/jest/helpers/harness';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));

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
const mockClearPackageTitles = jest.fn();
const mockGetProxyTypes = jest.fn();
const mockGetTags = jest.fn();
const mockUpdatePackage = jest.fn();
const mockUpdateFolioTags = jest.fn();
const mockDestroyPackage = jest.fn();
const mockGetAccessTypes = jest.fn();
const mockGetCostPerUse = jest.fn();
const mockGetCostPerUsePackageTitles = jest.fn();
const mockClearCostPerUseData = jest.fn();
const mockUpdateTitles = jest.fn();

const mockHistoryReplace = jest.fn();
const history = {
  replace: mockHistoryReplace,
};

const mockLocation = {
  pathname: 'pathname',
  search: '',
  hash: '',
};
const providerId = 'providerId';
const packageId = `${providerId}-1234`;

const model = {
  id: packageId,
  name: 'Test package',
  description: '',
  edition: '',
  contributors: [],
  identifiers: [],
  resources: {
    length: 0,
    records: [],
  },
  isLoaded: true,
  isLoading: false,
  isCustom: true,
  isSelected: true,
  isPeerReviewed: false,
  allowKbToAddTitles: false,
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
  visibility: [
    { category: 'PF', hidden: false, reason: '' },
    { category: 'FTF', hidden: false, reason: '' },
    { category: 'MARC', hidden: false, reason: '' },
  ],
  proxy: {
    id: 'proxy-id',
    inherited: false,
  },
  tags: {
    tagList: [],
  },
  data: {
    relationships: {
      accessType: {
        data: {
          id: 'access-type-id',
        },
      },
    },
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

const tagsModel = {
  request: {
    isResolved: true,
  },
};

const tagsModelOfAlreadyAddedTags = {
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
      type: 'accessTypes',
      attributes: {
        name: 'access type',
      },
    }],
  },
};

const costPerUse = {
  data: {
    packageCostPerUse: {
      attributes: {
        analysis: {
          cost: 0,
          costPerUse: 0,
          usage: 0,
        },
      },
      id: 'cost-per-use-id',
      type: 'packageCostPerUse',
    },
  },
  errors: [],
  isFailed: false,
  isLoaded: false,
  isLoading: false,
  isPackageTitlesFailed: false,
  isPackageTitlesLoaded: false,
  isPackageTitlesLoading: false,
};

const resource = {
  attributes: {
    name: 'Title name 1',
    isSelected: false,
    managedCoverages: [{
      beginCoverage: '2005-01-01',
      endCoverage: '2005-12-31'
    }],
    customCoverages: [
      {
        beginCoverage: '2025-01-09',
        endCoverage: '2026-01-01'
      },
      {
        beginCoverage: '2025-01-07',
        endCoverage: '2025-01-08'
      },
    ],
    managedEmbargoPeriod: {
      embargoUnit: 'Days',
      embargoValue: 11,
    },
    publicationType: 'book',
    visibilityData: { isHidden: false },
    tags: {
      tagList: [],
    },
  },
  included: [],
  id: packageId,
  relationships: {},
  type: 'resources',
};

const packageTitles = {
  totalResults: 1,
  page: 1,
  isLoading: false,
  items: [resource],
  hasFailed: false,
  errors: [],
};

const getPackageShowRoute = (props = {}) => (
  <MemoryRouter>
    <Harness>
      <PackageShowRoute
        proxyTypes={proxyTypes}
        tagsModel={tagsModel}
        tagsModelOfAlreadyAddedTags={tagsModelOfAlreadyAddedTags}
        resolver={resolver}
        accessStatusTypes={accessStatusTypes}
        costPerUse={costPerUse}
        packageTitles={packageTitles}
        getPackageTitles={noop}
        clearPackageTitles={noop}
        getProxyTypes={noop}
        getTags={noop}
        updateFolioTags={noop}
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
    mockHistoryReplace.mockClear();
    useHistory.mockClear().mockReturnValue(history);
    useLocation.mockReturnValue(mockLocation);
    useParams.mockReturnValue({
      packageId,
    });
    usePackageModel.mockClear().mockImplementation(({ onDeleteSuccess }) => {
      return {
        model,
        updatePackage: mockUpdatePackage,
        deletePackage: mockDestroyPackage.mockImplementation(() => onDeleteSuccess()),
      };
    });
    useUpdatePackageTitlesSelection.mockClear().mockReturnValue({
      updateTitles: mockUpdateTitles,
    });
  });

  it('should render PackageShowRoute', () => {
    const { getByText } = renderPackageShowRoute();

    expect(getByText('PackageShowRoute component')).toBeDefined();
  });

  it('should handle getProxyTypes', () => {
    renderPackageShowRoute({
      getProxyTypes: mockGetProxyTypes,
    });

    expect(mockGetProxyTypes).toHaveBeenCalled();
  });

  it('should handle getTags', () => {
    renderPackageShowRoute({
      getTags: mockGetTags,
    });

    expect(mockGetTags).toHaveBeenCalled();
  });

  it('should handle getAccessTypes', () => {
    renderPackageShowRoute({
      getAccessTypes: mockGetAccessTypes,
    });

    expect(mockGetAccessTypes).toHaveBeenCalled();
  });

  it('should handle getPackageTitles after delay before update', () => {
    renderPackageShowRoute({
      getPackageTitles: mockGetPackageTitles,
    });

    expect(mockGetPackageTitles).toHaveBeenCalled();
  });

  describe('when package was reached based on search', () => {
    it('should redirect to /eholdings with location.search parameters', () => {
      const testSearch = '?searchType=packages&q=testQuery&offset=1';

      useLocation.mockClear().mockReturnValue({
        search: testSearch,
      });

      const { getAllByRole, getByRole } = renderPackageShowRoute();

      fireEvent.click(getAllByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' })[0]);
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.deletePackage' }));
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.modal.buttonConfirm.isCustom' }));

      expect(mockHistoryReplace).toHaveBeenCalledWith({
        pathname: '/eholdings',
        search: testSearch,
      }, { eholdings: true });
    });
  });

  describe('when package was reached directly from url, not by search', () => {
    it('should redirect to /eholdings with searchType equals packages', async () => {
      useLocation.mockClear().mockReturnValue({
        search: '',
      });

      const { getAllByRole, getByRole } = renderPackageShowRoute();

      fireEvent.click(getAllByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' })[0]);
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.deletePackage' }));
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.modal.buttonConfirm.isCustom' }));

      expect(mockHistoryReplace).toHaveBeenCalledWith('/eholdings?searchType=packages', { eholdings: true });
    });
  });

  describe('when package search params change', () => {
    it('should handle getPackageTitles', async () => {
      const {
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

      const searchBox = getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' });

      await userEvent.type(searchBox, 'Title name{enter}');

      expect(mockGetPackageTitles).toHaveBeenCalledWith({
        packageId,
        params: {
          count: 100,
          filter: {
            'access-type': undefined,
            name: 'Title name',
            selected: undefined,
            tags: undefined,
            type: undefined,
          },
          page: 1,
          searchfield: 'title',
          sort: undefined,
        },
      });
    });

    describe('when packages are being fetched', () => {
      it('should not clear old ones', async () => {
        const {
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

        const searchBox = getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' });

        await userEvent.type(searchBox, 'Title name{enter}');

        expect(mockClearPackageTitles).not.toHaveBeenCalled();
      });
    });
  });

  describe('when adding package to holdings', () => {
    beforeEach(() => {
      usePackageModel.mockClear().mockReturnValue({
        model: {
          ...model,
          isSelected: false,
        },
        updatePackage: mockUpdatePackage,
      });
    });

    it('should call updatePackage and updateTitles', () => {
      const { getByRole } = renderPackageShowRoute();

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.addPackageToHoldings' }));
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.selectPackage.confirmationModal.confirmationButtonText' }));

      expect(mockUpdatePackage).toHaveBeenCalled();
      expect(mockUpdateTitles).toHaveBeenCalledTimes(1);
    });
  });

  describe('when removing package from holdings', () => {
    describe('when model is not custom', () => {
      it('should handle updatePackage', () => {
        usePackageModel.mockClear().mockReturnValue({
          model: {
            ...model,
            isSelected: true,
            isCustom: false,
          },
          updatePackage: mockUpdatePackage,
        });

        const { getAllByRole, getByRole } = renderPackageShowRoute();

        fireEvent.click(getAllByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' })[0]);
        fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.removeFromHoldings' }));
        fireEvent.click(getByRole('button', { name: 'ui-eholdings.package.modal.buttonConfirm' }));

        expect(mockUpdatePackage).toHaveBeenCalled();
      });
    });

    describe('when model is custom', () => {
      it('should handle destroyPackage', () => {
        usePackageModel.mockClear().mockReturnValue({
          model: {
            ...model,
            isSelected: true,
            isCustom: true,
          },
          updatePackage: mockUpdatePackage,
          deletePackage: mockDestroyPackage,
        });

        const { getByRole, getAllByRole } = renderPackageShowRoute();

        fireEvent.click(getAllByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' })[0]);
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
      });

      fireEvent.click(getByText('Fetch cost per use package titles'));

      expect(mockGetCostPerUsePackageTitles).toHaveBeenCalled();
    });
  });

  describe('when load more cost per use package titles', () => {
    it('should handle getCostPerUsePackageTitles', () => {
      const { getByText } = renderPackageShowRoute({
        getCostPerUsePackageTitles: mockGetCostPerUsePackageTitles,
      });

      fireEvent.click(getByText('Load more cost per use package titles'));

      expect(mockGetCostPerUsePackageTitles).toHaveBeenCalled();
    });
  });

  describe('when click on Edit button', () => {
    it('should redirect to edit package page', () => {
      const { getByRole, getAllByRole } = renderPackageShowRoute();

      fireEvent.click(getAllByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' })[0]);
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.actionMenu.edit' }));

      expect(mockHistoryReplace).toHaveBeenCalledWith({
        pathname: `/eholdings/packages/${model.id}/edit`,
        search: mockLocation.search,
        state: {
          eholdings: true,
        },
      });
    });
  });

  describe('when component is unmounted', () => {
    it('should handle clearCostPerUseData', async () => {
      const { unmount } = await renderPackageShowRoute({
        clearCostPerUseData: mockClearCostPerUseData,
      });

      unmount();

      await act(() => waitFor(() => expect(mockClearCostPerUseData).toHaveBeenCalled()));
    });
  });
});
