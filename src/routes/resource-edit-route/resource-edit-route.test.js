import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import ResourceEditRoute from './resource-edit-route';
import Harness from '../../../test/jest/helpers/harness';

const history = {
  replace: jest.fn(),
};

const location = {
  pathname: 'pathname',
  search: '',
  hash: '',
};

const provider = {
  id: 'providerid',
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

const id = `${provider.id}-titleid`;

const match = {
  isExact: true,
  params: { id },
  path: '/eholdings/packages/:id/edit',
  url: `/eholdings/packages/${id}/edit`,
};

const model = {
  id: 'packageId',
  name: 'Resource name',
  isTitleCustom: false,
  managedCoverages: [{
    beginCoverage: '2021-01-01',
    endCoverage: '2021-01-31',
  }],
  publicationType: 'publication type',
  isLoaded: true,
  isLoading: false,
  titleHasSelectedResources: true,
  isCustom: true,
  isSelected: false,
  coverageStatement: 'coverage statement',
  customCoverages: [{
    beginCoverage: '2021-01-01',
    endCoverage: '2021-01-31',
  }],
  customEmbargoPeriod: {
    embargoUnit: 'month',
    embargoValue: '1',
  },
  title: {
    name: 'Title name',
    isTitleCustom: false,
  },
  visibilityData: {
    reason: '',
    isHidden: false,
  },
  package: {
    name: 'package-name',
    titleCount: 2,
    visibilityData: {
      isHidden: false,
    },
    customCoverage: {
      beginCoverage: '2021-01-01',
      endCoverage: '2021-01-31',
    },
  },
  proxy: {
    id: 'proxy-id',
  },
  destroy: {
    timestamp: 0,
    isRejected: false,
    errors: [],
  },
  update: {
    timestamp: 0,
    isPending: false,
    isResolved: false,
    isRejected: false,
    errors: [],
  },
  request: {
    timestamp: 0,
    isRejected: false,
    errors: [],
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

const accessStatusTypes = {
  isDeleted: false,
  isLoading: false,
  items: {
    data: [],
  },
};

const storeInitialState = {
  data: {
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
};

const mockDestroyResource = jest.fn();
const mockGetAccessTypes = jest.fn();
const mockGetProxyTypes = jest.fn();
const mockGetResource = jest.fn();
const mockUpdateResource = jest.fn();

const getResourceEditRoute = (props = {}) => (
  <MemoryRouter>
    <Harness storeInitialState={storeInitialState}>
      <ResourceEditRoute
        accessStatusTypes={accessStatusTypes}
        destroyResource={mockDestroyResource}
        getAccessTypes={mockGetAccessTypes}
        getProxyTypes={mockGetProxyTypes}
        getResource={mockGetResource}
        history={history}
        location={location}
        match={match}
        model={model}
        proxyTypes={proxyTypes}
        updateResource={mockUpdateResource}
        {...props}
      />
      Page content
    </Harness>
  </MemoryRouter>
);

const renderResourceEditRoute = (props) => render(getResourceEditRoute(props));

describe('Given ResourceEditRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  it('should render page', () => {
    const { getByText } = renderResourceEditRoute();

    expect(getByText('Page content')).toBeDefined();
  });

  it('should request all data', () => {
    renderResourceEditRoute();

    expect(mockGetResource).toHaveBeenCalledWith(id);
    expect(mockGetProxyTypes).toHaveBeenCalled();
    expect(mockGetAccessTypes).toHaveBeenCalled();
  });

  describe('when click on Close button', () => {
    it('should redirect to the view resource page', () => {
      const { getByRole } = renderResourceEditRoute();

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.icon.closeX' }));

      expect(history.replace).toHaveBeenCalledWith({
        pathname: `/eholdings/resources/${model.id}`,
        search: location.search,
        state: {
          eholdings: true,
        },
      });
    });
  });

  describe('when click on Save & close button', () => {
    it('should render Custom labels accordion and handle updateResource', () => {
      const { getByText, getByRole } = renderResourceEditRoute({
        model: {
          ...model,
          isSelected: true,
        },
      });

      fireEvent.submit(getByRole('button', { name: 'stripes-components.saveAndClose' }));

      expect(getByText('ui-eholdings.resource.customLabels')).toBeDefined();
      expect(mockUpdateResource).toHaveBeenCalled();
    });
  });

  describe('when update request resolves', () => {
    it('should redirect to the view title page', () => {
      const { rerender } = renderResourceEditRoute({
        model: {
          ...model,
          update: {
            ...model.update,
            isPending: true,
          },
        },
      });

      rerender(getResourceEditRoute());

      expect(history.replace).toHaveBeenCalled();
    });
  });

  describe('when id in url has changed', () => {
    it('should handle getResource', () => {
      const newId = 'new-test-id';

      const { rerender } = renderResourceEditRoute();

      rerender(getResourceEditRoute({
        match: {
          ...match,
          params: {
            id: newId,
          },
        },
      }));

      expect(mockGetResource).toHaveBeenCalledWith(newId);
    });
  });

  describe('when package is destroyed', () => {
    it('should redirect back to search page', () => {
      const { rerender } = renderResourceEditRoute();

      rerender(getResourceEditRoute({
        model: {
          ...model,
          destroy: {
            isResolved: true,
            errors: [],
          },
          isLoaded: true,
          isSelected: true,
        },
      }));

      expect(history.replace).toHaveBeenCalled();
    });
  });

  describe('when package is added to holdings', () => {
    it('should update resource', () => {
      const { getByText } = renderResourceEditRoute({
        model: {
          ...model,
          isSelected: false,
        },
      });

      fireEvent.click(getByText('ui-eholdings.addToHoldings'));

      expect(mockUpdateResource).toHaveBeenCalledWith({
        ...model,
        isSelected: true,
      });
    });
  });

  describe('when a managed package is deselected', () => {
    it('should handle mockUpdateResource', () => {
      const { getByText } = renderResourceEditRoute({
        model: {
          ...model,
          isCustom: false,
        },
      });

      fireEvent.click(getByText('ui-eholdings.resource.actionMenu.removeHolding'));
      fireEvent.click(getByText('ui-eholdings.resource.modal.buttonConfirm'));

      expect(mockUpdateResource).toHaveBeenCalled();
    });
  });

  describe('when user clicks on Save & close button', () => {
    it('should call updateResource with default embargo period', () => {
      const defaultEmbargoPeriod = { embargoValue: 0 };

      const { getByRole } = renderResourceEditRoute({
        model: {
          ...model,
          isSelected: true,
        },
      });

      const deleteEmbargoBtn = getByRole('button', { name: 'ui-eholdings.resource.embargoPeriod.clear' });
      fireEvent.click(deleteEmbargoBtn);

      fireEvent.submit(getByRole('button', { name: 'stripes-components.saveAndClose' }));

      expect(mockUpdateResource).toHaveBeenCalledWith(expect.objectContaining({
        customEmbargoPeriod: defaultEmbargoPeriod,
      }));
    });
  });
});
