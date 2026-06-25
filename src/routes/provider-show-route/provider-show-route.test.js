import { MemoryRouter } from 'react-router-dom';
import noop from 'lodash/noop';

import {
  render,
  cleanup,
  fireEvent,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import ProviderShowRoute from './provider-show-route';
import {
  clearProviderPackages,
  getAccessTypes,
  getProviderPackages,
} from '../../redux/actions';
import Harness from '../../../test/jest/helpers/harness';

const mockGetProvider = jest.fn();

jest.mock('../../redux/actions', () => ({
  ...jest.requireActual('../../redux/actions'),
  getAccessTypes: jest.fn(),
  getProviderPackages: jest.fn(),
  clearProviderPackages: jest.fn(),
}));

jest.mock('../../components/prev-next-buttons', () => () => (<div>PrevNextButtons component</div>));

const mockHistory = {
  replace: jest.fn(),
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

const location = {
  pathname: 'pathname',
  search: '',
  hash: '',
};

const match = {
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
  proxy: {
    id: 'ezproxy',
    inherited: true,
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
  data: {
    id: 'provider-id',
    attributes: {
      name: 'provider-name',
    },
    isLoaded: true,
    isLoading: false,
  },
};

const providerPackages = {
  errors: [],
  hasFailed: false,
  hasLoaded: true,
  isLoading: false,
  page: 1,
  items: [
    {
      id: 'package-id',
      attributes: {
        packageId: 'package-id',
        name: 'package-name',
        providerId: 'provider-id',
        providerName: 'provider-name',
        isSelected: true,
        selectedCount: 10,
        titleCount: 100,
        visibilityData: {
          isHidden: true,
        },
        tags: {
          tagList: [],
        },
      },
      type: 'packages',
    },
  ],
  totalResults: 151,
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

const renderProviderShowRoute = (props = {}) => render(
  <MemoryRouter>
    <Harness>
      <ProviderShowRoute
        accessTypes={accessTypes}
        providerPackages={providerPackages}
        proxyTypes={proxyTypes}
        rootProxy={rootProxy}
        tagsModel={tagsModel}
        tagsModelOfAlreadyAddedTags={tagsModelOfAlreadyAddedTags}
        model={model}
        history={mockHistory}
        location={location}
        match={match}
        clearProviderPackages={clearProviderPackages}
        getAccessTypes={getAccessTypes}
        getProviderPackages={getProviderPackages}
        getProvider={mockGetProvider}
        getProxyTypes={noop}
        getRootProxy={noop}
        getTags={noop}
        updateFolioTags={noop}
        {...props}
      />
    </Harness>
  </MemoryRouter>
);

describe('Given ProviderShowRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  it('should call getAccessTypes', async () => {
    await renderProviderShowRoute();

    expect(getAccessTypes).toHaveBeenCalled();
  });

  it('should call getProviderPackages', async () => {
    await renderProviderShowRoute();

    expect(getProviderPackages).toHaveBeenCalled();
  });

  it('should show search input and actions menu within packages accordion', () => {
    const { getByRole } = renderProviderShowRoute();

    expect(getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' })).toBeInTheDocument();
  });

  it('should call clearProviderPackages', async () => {
    await renderProviderShowRoute();

    await waitFor(() => expect(clearProviderPackages).toHaveBeenCalled());
  });

  it('should call getProvider', async () => {
    await renderProviderShowRoute({
      match: {
        ...match,
        params: { providerId: 'other-provider-id' },
      },
    });

    expect(mockGetProvider).toHaveBeenCalled();
  });

  it('should handle Edit', async () => {
    const { getByRole } = await renderProviderShowRoute();

    fireEvent.click(getByRole('button', { name: 'ui-eholdings.actionMenu.edit' }));

    expect(mockHistory.replace).toHaveBeenCalledWith({
      pathname: `/eholdings/providers/${model.id}/edit`,
      search: location.search,
      state: {
        eholdings: true,
      },
    });
  });
});
