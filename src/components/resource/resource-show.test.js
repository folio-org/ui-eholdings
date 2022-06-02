import {
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react';
import noop from 'lodash/noop';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes-components';

import ResourceShow from './resource-show';
import Harness from '../../../test/jest/helpers/harness';
import wait from '../../../test/jest/helpers/wait';

const toggleSelectedMock = jest.fn();

const costPerUse = {
  data: {
    resourceCostPerUse: {
      attributes: {
        analysis: {
          cost: 0,
          costPerUse: 0,
          usage: 0,
        },
        usage: {
          platforms: [],
        },
      },
      id: 'cost-per-use-id',
      type: 'resourceCostPerUse',
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
  errors: [],
};
const usageConsolidation = {
  data: {
    credentialsId: 'credentials-id',
    currency: 'currency',
    customerKey: 'customer-key',
    platformType: 'platform-type',
    startMonth: 'January',
  },
  errors: [],
  isFailed: false,
  isKeyFailed: false,
  isKeyLoaded: false,
  isKeyLoading: false,
  isLoaded: true,
  isLoading: false,
};

const renderResourceShow = ({
  isSelected = true,
  ...props
} = {}) => render(
  <Harness
    storeInitialState={{
      data: {
        currencies,
        ucCredentials,
        usageConsolidation,
        agreements: {
          errors: [],
          isLoading: false,
          items: [],
        },
        customLabels: {
          errors: [],
          items: {
            data: [{
              type: 'customLabels',
              attributes: {
                id: 1,
                displayLabel: 'Label 1',
              },
            }],
          },
        },
      },
    }}
  >
    <CommandList commands={defaultKeyboardShortcuts}>
      <ResourceShow
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
        fetchResourceCostPerUse={noop}
        costPerUse={costPerUse}
        isFreshlySaved={false}
        onEdit={noop}
        proxyTypes={{}}
        tagsModel={{
          request: {
            isResolved: true,
          },
        }}
        toggleSelected={toggleSelectedMock}
        updateFolioTags={noop}
        model={{
          id: 'resource-id',
          name: 'resource-name',
          isSelected,
          isLoading: false,
          isLoaded: true,
          isTitleCustom: true,
          titleHasSelectedResources: true,
          title: {
            name: 'title-name',
            isTitleCustom: true,
            subjects: [],
            contributors: [],
            identifiers: [],
          },
          package: {
            name: 'package-name',
            titleCount: 2,
            visibilityData: {
              hidden: false,
              reason: '',
            },
          },
          visibilityData: {
            isHidden: false,
          },
          managedCoverages: [],
          customCoverages: [],
          destroy: {
            timestamp: 0,
            isRejected: false,
            errors: [],
          },
          update: {
            timestamp: 0,
            isRejected: false,
            errors: [],
          },
          request: {
            timestamp: 0,
            isRejected: false,
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
        }}
        {...props}
      />
    </CommandList>
  </Harness>
);

describe('Given ResourceShow', () => {
  beforeEach(() => {
    toggleSelectedMock.mockClear();
  });

  afterEach(cleanup);

  it('should show pane title', () => {
    const { getAllByText } = renderResourceShow();

    expect(getAllByText('title-name')).toBeDefined();
  });

  it('should show enabled Export title package (CSV) menu action', () => {
    const { getByTestId } = renderResourceShow();

    expect(getByTestId('export-to-csv-button')).toBeEnabled();
  });

  describe('when resource is selected', () => {
    describe('when clicking on remove from holdings', () => {
      it('should show confirmation modal', () => {
        const { getByTestId } = renderResourceShow();

        fireEvent.click(getByTestId('toggle-resource-holdings'));

        expect(getByTestId('selection-modal')).toBeDefined();
      });

      it('should confirm selection', () => {
        const { getByTestId } = renderResourceShow();

        fireEvent.click(getByTestId('toggle-resource-holdings'));
        fireEvent.click(getByTestId('resource-deselection-confirmation-yes'));

        expect(toggleSelectedMock.mock.calls.length).toEqual(1);
      });

      it('should cancel selection', async () => {
        const {
          getByTestId,
          queryByTestId,
        } = renderResourceShow();

        fireEvent.click(getByTestId('toggle-resource-holdings'));
        await wait(500);
        fireEvent.click(getByTestId('resource-deselection-confirmation-no'));
        await wait(500);

        expect(queryByTestId('selection-modal')).toBeNull();
      }, 2000);
    });
  });

  describe('when resource is not selected', () => {
    describe('when clicking on add to holdings', () => {
      it('should toggle selection', () => {
        const { getByTestId } = renderResourceShow({
          isSelected: false,
        });

        fireEvent.click(getByTestId('toggle-resource-holdings'));

        expect(toggleSelectedMock.mock.calls.length).toEqual(1);
      });
    });
  });

  describe('when resource is freshly saved', () => {
    it('should display notification toast', () => {
      const { getByText } = renderResourceShow({
        isFreshlySaved: true,
      });

      expect(getByText('ui-eholdings.resource.toast.isFreshlySaved')).toBeDefined();
    });
  });

  describe('when clicking on Export package', () => {
    it('should show Export modal', () => {
      const { getByText } = renderResourceShow();

      fireEvent.click(getByText('ui-eholdings.resource.actionMenu.exportToCSV'));

      expect(getByText('ui-eholdings.exportPackageResources.subtitle')).toBeDefined();
    });
  });
});
