import { MemoryRouter } from 'react-router-dom';
import noop from 'lodash/noop';

import {
  render,
  cleanup,
  act,
  fireEvent,
} from '@testing-library/react';

import SearchRoute from './search-route';
import Harness from '../../../test/jest/helpers/harness';
import {
  PAGE_SIZE,
  searchTypes,
} from '../../constants';

const mockGetAccessTypes = jest.fn();
const mockGetTags = jest.fn();

jest.mock('../../redux/actions', () => ({
  ...jest.requireActual('../../redux/actions'),
  getAccessTypes: mockGetAccessTypes,
  getTags: mockGetTags,
}));

const mockHistory = {
  replace: jest.fn(),
  push: jest.fn(),
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
  isExact: true,
  params: {},
  path: '/eholdings',
  url: '/eholdings',
};

const tagsModel = {
  request: {
    isResolved: true,
  },
};

const recordBySearchType = {
  [searchTypes.PROVIDERS]: {
    data: {
      id: '123355',
      isLoading: false,
      isLoaded: true,
      isSaving: false,
      attributes: {
        name: 'API DEV CORPORATE CUSTOMER',
        packagesTotal: 463,
        packagesSelected: 463,
        supportsCustomPackages: true,
      },
      relationships: {
        packages:{},
      },
    },
    id: '123355',
    name: 'API DEV CORPORATE CUSTOMER',
    packagesTotal: 463,
    packagesSelected: 463,
    providerToken: {},
    proxy: {},
  },
  [searchTypes.PACKAGES]: {
    id: 'package-id',
    name: 'package-name',
    providerName: 'package-provider-name',
    isSelected: true,
    selectedCount: 1,
    titleCount: 2,
    visibilityData: {
      isHidden: false,
    },
  },
  [searchTypes.TITLES]: {
    id: 'title-id',
    name: 'title-name',
    contributors: [
      {
        type: 'Author',
        contributor: 'Contributor Name',
      },
    ],
    publicationType: 'Book',
    publisherName: 'Publisher Name',
    identifiers: [
      {
        id: 'identifier-id',
        subtype: 'Online',
        type: 'ISBN',
      },
    ],
  },
};

const getCollection = (searchType, params) => {
  const page = {
    records: new Array(PAGE_SIZE).fill(recordBySearchType[searchType]),
    request: { isResolved: true },
  };

  const pages = new Array(3).fill(page);

  return {
    type: searchType,
    params: {
      q: 'test',
      offset: 1,
    },
    path: `/eholdings/${searchType}`,
    resolver: {
      state: {},
      models: {},
    },
    request: {
      errors: [],
      isRejected: false,
    },
    pages,
    pageSize: 100,
    isLoading: false,
    totalResults: 100,
    length: 100,
    currentPage: params.page,
    getPage: p => pages[p],
  };
};

const renderSearchRoute = (props = {}) => render(
  <MemoryRouter>
    <Harness>
      <SearchRoute
        accessTypes={accessTypes}
        getAccessTypes={noop}
        getTags={noop}
        history={mockHistory}
        location={location}
        match={match}
        resolver={{
          query: jest.fn(getCollection),
        }}
        searchPackages={noop}
        searchProviders={noop}
        searchTitles={noop}
        tagsModel={tagsModel}
        {...props}
      />
    </Harness>
  </MemoryRouter>
);

describe('Given SearchRoute', () => {
  beforeEach(() => {
    mockGetAccessTypes.mockClear();
    mockGetTags.mockClear();
  });

  afterEach(cleanup);

  it('should handle getAccessTypes', async () => {
    await act(async () => {
      await renderSearchRoute({
        getAccessTypes: mockGetAccessTypes,
      });
    });

    expect(mockGetAccessTypes).toHaveBeenCalled();
  });

  it('should handle getTags', async () => {
    await act(async () => {
      await renderSearchRoute({
        getTags: mockGetTags,
      });
    });

    expect(mockGetTags).toHaveBeenCalled();
  });

  describe('when search type is providers', () => {
    it('should render providers search filters', () => {
      const { getByTestId } = renderSearchRoute({
        location: {
          ...location,
          search: '?searchType=providers&sort=name',
        },
      });

      expect(getByTestId('providers-search-filters')).toBeDefined();
    });

    it('should render ProvidersSearchList', () => {
      const { getByTestId } = renderSearchRoute({
        location: {
          ...location,
          search: '?searchType=providers&q=a',
        },
      });

      expect(getByTestId('providers')).toBeDefined();
    });

    describe('when loaded more then 100 records and click on next button', () => {
      it('should handle searchProviders action', () => {
        const mockSearchProviders = jest.fn();
        const { getByTestId } = renderSearchRoute({
          searchProviders: mockSearchProviders,
          location: {
            ...location,
            search: '?searchType=providers&q=a',
          },
        });

        fireEvent.click(getByTestId('next-button'));

        expect(mockSearchProviders).toHaveBeenCalled();
      });
    });
  });

  describe('when search type is packages', () => {
    it('should render providers search filters', () => {
      const { getByTestId } = renderSearchRoute({
        location: {
          ...location,
          search: '?searchType=packages',
        },
      });

      expect(getByTestId('packages-search-filters')).toBeDefined();
    });

    it('should render PackagesSearchList', () => {
      const { getByTestId } = renderSearchRoute({
        location: {
          ...location,
          search: '?searchType=packages&q=a',
        },
      });

      expect(getByTestId('packages')).toBeDefined();
    });

    describe('when enter the value to search field and click on search', () => {
      it('should handle history push', () => {
        const {
          getByPlaceholderText,
          getByText,
        } = renderSearchRoute({
          location: {
            ...location,
            search: '?searchType=packages',
          },
        });

        fireEvent.change(getByPlaceholderText('ui-eholdings.search.searchType.packages'), {
          target: { value: 'package' },
        });
        fireEvent.click(getByText('ui-eholdings.label.search'));

        expect(mockHistory.push).toHaveBeenCalled();
      });
    });

    describe('when loaded more then 100 records and click on next button', () => {
      it('should handle searchPackages action', () => {
        const mockSearchPackages = jest.fn();
        const { getByTestId } = renderSearchRoute({
          searchPackages: mockSearchPackages,
          location: {
            ...location,
            search: '?searchType=packages&q=a',
          },
        });

        fireEvent.click(getByTestId('next-button'));

        expect(mockSearchPackages).toHaveBeenCalled();
      });
    });

    describe('when click on item from list', () => {
      it('should handle history.push action', () => {
        const { getAllByTestId } = renderSearchRoute({
          location: {
            ...location,
            search: '?searchType=packages&q=a',
          },
        });

        fireEvent.click(getAllByTestId('search-package-list-item-link')[0]);

        expect(mockHistory.push).toBeCalled();
      });
    });
  });

  describe('when search type is titles', () => {
    it('should render providers search filters', () => {
      const { getByTestId } = renderSearchRoute({
        location: {
          ...location,
          search: '?searchType=titles',
        },
      });

      expect(getByTestId('titles-search-filters')).toBeDefined();
    });

    it('should render TitlesSearchList', () => {
      const { getByTestId } = renderSearchRoute({
        location: {
          ...location,
          search: '?searchType=titles&q=a',
        },
      });

      expect(getByTestId('titles')).toBeDefined();
    });

    describe('when loaded more then 100 records and click on next button', () => {
      it('should handle searchTitles action', () => {
        const mockSearchTitles = jest.fn();
        const { getByTestId } = renderSearchRoute({
          searchTitles: mockSearchTitles,
          location: {
            ...location,
            search: '?searchType=titles&q=a',
          },
        });

        fireEvent.click(getByTestId('next-button'));

        expect(mockSearchTitles).toHaveBeenCalled();
      });
    });
  });

  describe('when form is loading', () => {
    it('should show spinner in search input', () => {
      const { container } = renderSearchRoute({
        resolver: {
          query: () => {
            const result = [];

            result.hasLoaded = false;

            return result;
          },
        },
      });

      expect(container.querySelector('[icon=spinner-ellipsis]')).toBeDefined();
    });
  });
});
