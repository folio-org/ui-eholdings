import { MemoryRouter } from 'react-router-dom';
import noop from 'lodash/noop';

import {
  render,
  cleanup,
  act,
  fireEvent,
} from '@testing-library/react';

import { createMemoryHistory } from 'history';

import ResourceShowRoute from './resource-show-route';
import Harness from '../../../test/jest/helpers/harness';

jest.mock('../../components/identifiers-list', () => () => (<div>IdentifiersList component</div>));
jest.mock('../../components/contributors-list', () => () => (<div>ContributorsList component</div>));
jest.mock('../../features/agreements-accordion', () => () => (<div>AgreementsAccordion component</div>));
jest.mock('../../features/custom-labels-accordion', () => () => (<div>CustomLabelsAccordion component</div>));
jest.mock('../../components/resource/components/holding-status', () => () => (<div>HoldingStatus component</div>));
jest.mock('../../components/resource/components/coverage-settings', () => () => (<div>CoverageSettings component</div>));

jest.mock('../../components/tags', () => ({ updateFolioTags }) => (
  <button
    type="button"
    onClick={updateFolioTags}
  >
    Update Folio tags
  </button>
));

jest.mock('../../features/usage-consolidation-accordion', () => ({ onFilterSubmit }) => (
  <button
    type="button"
    onClick={onFilterSubmit}
  >
    Fetch resource cost per use
  </button>
));

const mockGetResource = jest.fn();
const mockGetProxyTypes = jest.fn();
const mockUpdateResource = jest.fn();
const mockUpdateFolioTags = jest.fn();
const mockGetTags = jest.fn();
const mockDestroyResource = jest.fn();
const mockGetAccessTypes = jest.fn();
const mockRemoveUpdateRequests = jest.fn();
const mockGetCostPerUse = jest.fn();
const mockClearCostPerUseData = jest.fn();

const history = createMemoryHistory();
const historyReplaceSpy = jest.spyOn(history, 'replace');

const packageId = 'packageId';
const resourceId = 'resourceId';

const location = {
  pathname: 'pathname',
  search: '',
  hash: '',
};

const match = {
  params: { id: resourceId },
  path: 'path',
  url: 'url',
};

const model = {
  id: resourceId,
  name: 'Test resource',
  packageId,
  packageName: 'Test package',
  data: {
    isTokenNeeded: false,
  },
  description: '',
  edition: '',
  contributors: [],
  identifiers: [],
  package: {
    name: 'Test package',
    isCustom: false,
    visibilityData: {
      isHidden: false,
    },
  },
  title: {
    name: 'Test resource',
    subjects: [],
  },
  isSelected: false,
  isLoaded: true,
  isLoading: false,
  isSaving: false,
  publicationType: 'Unspecified',
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
    inherited: true,
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

const accessTypes = {
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
    attributes: {
      analysis: {
        cost: 0,
        costPerUse: 0,
        usage: 0,
      },
    },
    id: 'cost-per-use-id',
    type: 'resourceCostPerUse',
  },
  errors: [],
  isFailed: false,
  isLoaded: false,
  isLoading: false,
  isPackageTitlesFailed: false,
  isPackageTitlesLoaded: false,
  isPackageTitlesLoading: false,
};

const getResourceShowRoute = (props = {}) => (
  <MemoryRouter>
    <Harness>
      <ResourceShowRoute
        history={history}
        location={location}
        match={match}
        model={model}
        tagsModel={tagsModel}
        proxyTypes={proxyTypes}
        resolver={resolver}
        accessTypes={accessTypes}
        costPerUse={costPerUse}
        getResource={noop}
        getProxyTypes={noop}
        updateResource={noop}
        updateFolioTags={noop}
        getTags={noop}
        destroyResource={noop}
        getAccessTypes={noop}
        removeUpdateRequests={noop}
        getCostPerUse={noop}
        clearCostPerUseData={noop}
        {...props}
      />
      ResourceShowRoute component
    </Harness>
  </MemoryRouter>
);

const renderResourceShowRoute = (props = {}) => render(getResourceShowRoute(props));

describe('Given ResourceShowRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  it('should render ResourceShowRoute', () => {
    const { getByText } = renderResourceShowRoute();

    expect(getByText('ResourceShowRoute component')).toBeDefined();
  });

  it('should handle getResource', () => {
    renderResourceShowRoute({
      getResource: mockGetResource,
    });

    expect(mockGetResource).toHaveBeenCalledWith(resourceId);
  });

  it('should handle getProxyTypes', () => {
    renderResourceShowRoute({
      getProxyTypes: mockGetProxyTypes,
    });

    expect(mockGetProxyTypes).toHaveBeenCalled();
  });

  it('should handle getAccessTypes', () => {
    renderResourceShowRoute({
      getAccessTypes: mockGetAccessTypes,
    });

    expect(mockGetAccessTypes).toHaveBeenCalled();
  });

  it('should handle getTags', () => {
    renderResourceShowRoute({
      getTags: mockGetTags,
    });

    expect(mockGetTags).toHaveBeenCalled();
  });

  describe('when resource was destroyed', () => {
    it('should redirect to package show page', () => {
      const { rerender } = renderResourceShowRoute();

      rerender(getResourceShowRoute({
        model: {
          ...model,
          destroy: {
            ...model.destroy,
            isResolved: true,
          },
        },
      }));

      expect(historyReplaceSpy).toHaveBeenCalledWith(`/eholdings/packages/${packageId}?searchType=packages&q=${model.package.name}`,
        {
          eholdings: true,
          isDestroyed: true,
        });
    });
  });

  describe('when resource was updated', () => {
    describe('when isSelected was changed', () => {
      it('should handle removeUpdateRequests', () => {
        const { rerender } = renderResourceShowRoute({
          model: {
            ...model,
            update: {
              ...model.update,
              isPending: true,
            },
          },
        });

        rerender(getResourceShowRoute({
          removeUpdateRequests: mockRemoveUpdateRequests,
          model: {
            ...model,
            isSelected: true,
          },
        }));

        expect(mockRemoveUpdateRequests).toHaveBeenCalled();
      });
    });

    it('should redirect to show resource page', () => {
      const { rerender } = renderResourceShowRoute({
        model: {
          ...model,
          update: {
            ...model.update,
            isPending: true,
          },
        },
      });

      rerender(getResourceShowRoute());

      expect(historyReplaceSpy).toHaveBeenCalledWith({
        pathname: `/eholdings/resources/${resourceId}`,
        search: location.search,
        state: {
          eholdings: true,
          isFreshlySaved: true,
        },
      });
    });
  });

  describe('when resource id has changed', () => {
    it('should handle getResource', () => {
      const newResourceId = 'newResourceId';

      const { rerender } = renderResourceShowRoute();

      rerender(getResourceShowRoute({
        getResource: mockGetResource,
        match: {
          ...match,
          params: {
            ...match.params,
            id: newResourceId,
          },
        },
      }));

      expect(mockGetResource).toHaveBeenCalledWith(newResourceId);
    });
  });

  describe('when toggle selected status', () => {
    describe('when resource has been unselected', () => {
      it('should handle updateResource', () => {
        const { getByRole } = renderResourceShowRoute({
          updateResource: mockUpdateResource,
          model: {
            ...model,
            isSelected: true,
          },
        });

        fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
        fireEvent.click(getByRole('button', { name: 'ui-eholdings.resource.actionMenu.removeHolding' }));
        fireEvent.click(getByRole('button', { name: 'ui-eholdings.resource.modal.buttonConfirm' }));

        expect(mockUpdateResource).toHaveBeenCalled();
      });

      describe('when package is custom', () => {
        it('should handle destroyResource', () => {
          const { getByRole } = renderResourceShowRoute({
            destroyResource: mockDestroyResource,
            model: {
              ...model,
              isSelected: true,
              package: {
                ...model.package,
                isCustom: true,
              },
            },
          });

          fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
          fireEvent.click(getByRole('button', { name: 'ui-eholdings.resource.actionMenu.removeHolding' }));
          fireEvent.click(getByRole('button', { name: 'ui-eholdings.resource.modal.buttonConfirm' }));

          expect(mockDestroyResource).toHaveBeenCalled();
        });
      });
    });

    describe('when resource has been selected', () => {
      it('should handle updateResource', () => {
        const { getByRole } = renderResourceShowRoute({
          updateResource: mockUpdateResource,
        });

        fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
        fireEvent.click(getByRole('button', { name: 'ui-eholdings.resource.actionMenu.addHolding' }));

        expect(mockUpdateResource).toHaveBeenCalled();
      });
    });
  });

  describe('when click on Edit button', () => {
    it('should redirect to edit resource page', () => {
      const { getByRole } = renderResourceShowRoute({
        model: {
          ...model,
          isSelected: true,
        },
      });

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
      fireEvent.click(getByRole('button', { name: 'ui-eholdings.actionMenu.edit' }));

      expect(historyReplaceSpy).toHaveBeenCalledWith({
        pathname: `/eholdings/resources/${model.id}/edit`,
        state: { eholdings: true },
      });
    });
  });

  describe('when update Folio tags', () => {
    it('should handle UpdateFolioTags', () => {
      const { getByText } = renderResourceShowRoute({
        updateFolioTags: mockUpdateFolioTags,
      });

      fireEvent.click(getByText('Update Folio tags'));

      expect(mockUpdateFolioTags).toHaveBeenCalled();
    });
  });

  describe('when fetch package cost per use', () => {
    it('should handle getCostPerUse', () => {
      const { getByText } = renderResourceShowRoute({
        getCostPerUse: mockGetCostPerUse,
        model: {
          ...model,
          isSelected: true,
        },
      });

      fireEvent.click(getByText('Fetch resource cost per use'));

      expect(mockGetCostPerUse).toHaveBeenCalled();
    });
  });

  describe('when resource is loading', () => {
    it('should show spinner', () => {
      const { container } = renderResourceShowRoute({
        model: {
          ...model,
          isLoading: true,
        },
      });

      expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
    });
  });

  describe('when component is unmounted', () => {
    it('should handle clearCostPerUseData', async () => {
      await act(async () => {
        const { unmount } = await renderResourceShowRoute({
          clearCostPerUseData: mockClearCostPerUseData,
        });

        unmount();
      });

      expect(mockClearCostPerUseData).toHaveBeenCalled();
    });
  });
});
