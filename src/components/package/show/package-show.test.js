import {
  fireEvent,
  render,
  cleanup,
  waitFor,
} from '@testing-library/react';

import { createMemoryHistory } from 'history';

import Harness from '../../../../test/jest/helpers/harness';

import PackageShow from './package-show';

const history = createMemoryHistory();

jest.mock('../../../features/agreements-accordion', () => () => (<div>Agreements accordion</div>));
jest.mock('../../../features/usage-consolidation-accordion', () => () => (<div>UsageConsolidation accordion</div>));
jest.mock('@folio/stripes/smart-components', () => ({
  NotesSmartAccordion: jest.fn(() => <div>Notes accordion</div>),
}));

const testCostPerUse = {
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

const testModel = {
  id: '19-6581',
  isLoading: false,
  isLoaded: true,
  isSaving: false,
  contentType: 'Book',
  customCoverage: {
    beginCoverage: '01/01/2021',
    endCoverage: '01/21/2021',
  },
  isCustom: true,
  isSelected: true,
  name: 'Test name',
  packageId: 'package-id',
  packageType: 'Complete',
  providerId: 'provider-id',
  providerName: 'Provider name',
  selectedCount: 223,
  titleCount: 223,
  visibilityData: {},
  allowKbToAddTitles: true,
  isPartiallySelected: false,
  proxy: {},
  tags: {
    tagsList: [],
  },
  packageToken: {},
  accessTypeId: null,
  request: {
    isRejected: false,
    errors: [],
  },
  update: {
    isPending: false,
    isResolved: true,
    errors: [],
  },
  destroy: {
    isPending: false,
    errors: [],
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

const mockAddPackageToHoldings = jest.fn();
const mockFetchCostPerUsePackageTitles = jest.fn();
const mockFetchPackageCostPerUse = jest.fn();
const mockFetchPackageTitles = jest.fn();
const mockLoadMoreCostPerUsePackageTitles = jest.fn();
const mockOnEdit = jest.fn();
const mockOnToggleTitles = jest.fn();
const mockToggleSelected = jest.fn();
const mockUpdateFolioTags = jest.fn();

const renderPackageShow = (props = {}) => render(
  <Harness history={history}>
    <PackageShow
      accessStatusTypes={{
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
      }}
      addPackageToHoldings={mockAddPackageToHoldings}
      costPerUse={testCostPerUse}
      fetchCostPerUsePackageTitles={mockFetchCostPerUsePackageTitles}
      fetchPackageCostPerUse={mockFetchPackageCostPerUse}
      fetchPackageTitles={mockFetchPackageTitles}
      isDestroyed={false}
      isFreshlySaved={false}
      isNewRecord={false}
      isTitlesUpdating={false}
      loadMoreCostPerUsePackageTitles={mockLoadMoreCostPerUsePackageTitles}
      model={testModel}
      onEdit={mockOnEdit}
      onToggleTitles={mockOnToggleTitles}
      packageTitles={{
        totalResults: 5,
        items: [],
        hasFailed: false,
        errors: [],
        isLoading: false,
        page: 1,
      }}
      provider={{}}
      proxyTypes={{}}
      searchModal={<div>Search modal</div>}
      tagsModel={{
        request: {
          isResolved: true,
        },
      }}
      toggleSelected={mockToggleSelected}
      updateFolioTags={mockUpdateFolioTags}
      {...props}
    />
  </Harness>
);

describe('Given PackageShow', () => {
  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('should display package name in the pane and in the headline', () => {
    const { getAllByText } = renderPackageShow();

    expect(getAllByText('Test name')).toHaveLength(2);
  });

  it('should render HoldingStatus', () => {
    const { getByText } = renderPackageShow();

    expect(getByText('ui-eholdings.label.holdingStatus')).toBeDefined();
  });

  it('should render PackageInformation', () => {
    const { getByText } = renderPackageShow();

    expect(getByText('ui-eholdings.label.packageInformation')).toBeDefined();
  });

  it('should render Tags accordion', () => {
    const { getByText } = renderPackageShow();

    expect(getByText('ui-eholdings.tags')).toBeDefined();
  });

  it('should render PackageSettings', () => {
    const { getByText } = renderPackageShow();

    expect(getByText('ui-eholdings.package.packageSettings')).toBeDefined();
  });

  it('should render CoverageSettings', () => {
    const { getByText } = renderPackageShow();

    expect(getByText('ui-eholdings.package.coverageSettings')).toBeDefined();
  });

  it('should render Agreements accordion', () => {
    const { getByText } = renderPackageShow();

    expect(getByText('Agreements accordion')).toBeDefined();
  });

  it('should render Notes accordion', () => {
    const { getByText } = renderPackageShow();

    expect(getByText('Notes accordion')).toBeDefined();
  });

  it('should render UsageConsolidation accordion', () => {
    const { getByText } = renderPackageShow();

    expect(getByText('UsageConsolidation accordion')).toBeDefined();
  });

  it('should show enabled Export package (CSV) menu action', () => {
    const { getByTestId } = renderPackageShow();

    expect(getByTestId('export-to-csv-button')).toBeEnabled();
  });

  describe('when package is managed', () => {
    it('should render remove from holdings button', () => {
      const { getByText } = renderPackageShow({
        model: {
          ...testModel,
          isCustom: false,
        },
      });

      expect(getByText('ui-eholdings.package.removeFromHoldings')).toBeDefined();
    });

    describe('when clicking on remove from holdings button', () => {
      it('should show deselection modal', () => {
        const { getByText } = renderPackageShow({
          model: {
            ...testModel,
            isCustom: false,
          },
        });

        fireEvent.click(getByText('ui-eholdings.package.removeFromHoldings'));

        expect(getByText('ui-eholdings.package.modal.header')).toBeDefined();
      });
    });

    describe('when confirming package deselection', () => {
      it('should call toggleSelected', () => {
        const { getByText } = renderPackageShow({
          model: {
            ...testModel,
            isCustom: false,
          },
        });

        fireEvent.click(getByText('ui-eholdings.package.removeFromHoldings'));
        fireEvent.click(getByText('ui-eholdings.package.modal.buttonConfirm'));

        expect(mockToggleSelected).toBeCalledTimes(1);
      });
    });

    describe('when cancelling package deselection', () => {
      it('should deselection modal', async () => {
        const {
          getByText,
          queryByText,
        } = renderPackageShow({
          model: {
            ...testModel,
            isCustom: false,
          },
        });

        fireEvent.click(getByText('ui-eholdings.package.removeFromHoldings'));
        fireEvent.click(getByText('ui-eholdings.package.modal.buttonCancel'));

        await waitFor(() => {
          expect(queryByText('ui-eholdings.package.modal.header')).toBeNull();
        });
      });
    });
  });

  describe('titles accordion', () => {
    it('should be rendered', () => {
      const { getByText } = renderPackageShow();

      expect(getByText('ui-eholdings.listType.titles')).toBeDefined();
    });

    it('should display number of packages', () => {
      const { getAllByText } = renderPackageShow();

      expect(getAllByText('ui-eholdings.label.accordionList')).toBeDefined();
      expect(getAllByText('223')).toBeDefined();
    });

    describe('when opening', () => {
      describe('and the titles are loaded', () => {
        it('should not render the accordion list count', () => {
          const { queryByTestId } = renderPackageShow({
            isTitlesUpdating: false,
            packageTitles: {
              isLoading: true,
            },
          });

          expect(queryByTestId('accordion-list-count')).not.toBeInTheDocument();
        });
      });

      it('should call onToggleTitles', () => {
        const { getByTestId } = renderPackageShow();

        fireEvent.click(getByTestId('accordion-toggle-button-packageShowTitles'));
        fireEvent.click(getByTestId('accordion-toggle-button-packageShowTitles'));
        expect(mockOnToggleTitles).toHaveBeenCalled();
      });
    });

    describe('when closing', () => {
      it('should not invoke onToggleTitles', () => {
        const { getByTestId } = renderPackageShow();

        fireEvent.click(getByTestId('accordion-toggle-button-packageShowTitles'));
        expect(mockOnToggleTitles).not.toHaveBeenCalled();
      });
    });
  });

  describe('when package is not selected', () => {
    it('should display that on the page', () => {
      const { getByTestId } = renderPackageShow({
        model: {
          ...testModel,
          isSelected: false,
        },
      });

      expect(getByTestId('selection-status-message').textContent).toEqual('ui-eholdings.notSelected');
    });

    it('should render add to holdings button', () => {
      const { getByTestId } = renderPackageShow({
        model: {
          ...testModel,
          isSelected: false,
        },
      });

      expect(getByTestId('add-to-holdings-dropdown-button')).toBeDefined();
    });

    describe('when clicking add to holdings button', () => {
      it('should show selection modal', () => {
        const {
          getByTestId,
          getByText,
        } = renderPackageShow({
          model: {
            ...testModel,
            isSelected: false,
          },
        });

        fireEvent.click(getByTestId('add-to-holdings-dropdown-button'));

        expect(getByText('ui-eholdings.selectPackage.confirmationModal.label')).toBeDefined();
      });
    });

    describe('when canceling selection', () => {
      it('should still show package as not selected', () => {
        const {
          getByTestId,
        } = renderPackageShow({
          model: {
            ...testModel,
            isSelected: false,
          },
        });

        fireEvent.click(getByTestId('add-to-holdings-dropdown-button'));
        fireEvent.click(getByTestId('selection-modal-cancel-button'));

        expect(getByTestId('selection-status-message').textContent).toEqual('ui-eholdings.notSelected');
      });
    });

    describe('when confirming selection', () => {
      it('should call addPackageToHoldings', async () => {
        const {
          getByTestId,
        } = renderPackageShow({
          model: {
            ...testModel,
            isSelected: false,
          },
        });

        fireEvent.click(getByTestId('add-to-holdings-button'));
        fireEvent.click(getByTestId('selection-modal-confirm-button'));

        expect(mockAddPackageToHoldings).toBeCalledTimes(1);
      });
    });
  });

  describe('when coming from creating a new custom package', () => {
    it('should show a corresponding success toast', () => {
      const { getByText } = renderPackageShow({
        isNewRecord: true,
      });

      expect(getByText('ui-eholdings.package.toast.isNewRecord')).toBeDefined();
    });
  });

  describe('when coming from saving edits to the package', () => {
    it('should show a corresponding success toast', () => {
      const { getByText } = renderPackageShow({
        isFreshlySaved: true,
      });

      expect(getByText('ui-eholdings.package.toast.isFreshlySaved')).toBeDefined();
    });
  });

  describe('when titles are updating', () => {
    it('should show spinner', () => {
      const { container } = renderPackageShow({
        isTitlesUpdating: true,
      });

      expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
    });
  });

  describe('when model is not partially selected', () => {
    it('should show `Add package to holdings` button', () => {
      const { getByRole } = renderPackageShow({
        model: {
          ...testModel,
          isSelected: false,
        },
      });

      expect(getByRole('button', { name: 'ui-eholdings.addPackageToHoldings' })).toBeDefined();
    });
  });

  describe('when model is partially selected', () => {
    it('should show `Add all titles to holdings` button', () => {
      const { getByRole } = renderPackageShow({
        model: {
          ...testModel,
          isPartiallySelected: true,
        },
      });

      expect(getByRole('button', { name: 'ui-eholdings.addAllToHoldings' })).toBeDefined();
    });
  });

  describe('when clicking on Export package', () => {
    it('should show Export modal', () => {
      const { getByText } = renderPackageShow();

      fireEvent.click(getByText('ui-eholdings.package.actionMenu.exportToCSV'));

      expect(getByText('ui-eholdings.exportPackageResources.subtitle.package')).toBeDefined();
    });
  });
});
