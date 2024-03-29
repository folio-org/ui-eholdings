import {
  render,
  cleanup,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import noop from 'lodash/noop';

import Harness from '../../../test/jest/helpers/harness';
import {
  searchTypes,
  searchableIndexes,
} from '../../constants';
import SearchForm from './search-form';

const accessTypesStoreData = {
  isDeleted: false,
  isLoading: true,
  items: {
    data: [{
      attributes: {
        description: 'description',
        name: 'name',
      },
      id: 'id1',
      type: 'accessType',
    }],
  },
};

const tagsModelOfAlreadyAddedTags = {
  resolver: {
    state: {
      tags: {
        records: [{
          attributes: {
            label: 'tag1',
          },
        }, {
          attributes: {
            label: 'tag2',
          },
        }, {
          attributes: {
            value: 'already-added-tag-to-record',
          },
        }],
      },
    },
  },
  isLoading: false,
};

const renderSearchForm = (props = {}) => render(
  <Harness>
    <SearchForm
      accessTypesStoreData={accessTypesStoreData}
      onFilterChange={noop}
      onSearch={noop}
      onSearchChange={noop}
      onStandaloneFilterChange={noop}
      onStandaloneFilterToggle={noop}
      packagesFilterMap={{}}
      params={{}}
      results={{}}
      searchByAccessTypesEnabled={false}
      searchByTagsEnabled={false}
      searchType={searchTypes.PROVIDERS}
      searchTypeUrls={{
        providers: '/providers',
        packages: '/packages',
        titles: '/titles',
      }}
      tagsModelOfAlreadyAddedTags={tagsModelOfAlreadyAddedTags}
      titlesFacets={{}}
      {...props}
    />
  </Harness>
);

describe('Given SearchForm', () => {
  afterEach(() => {
    cleanup();
  });

  describe('when access types data is loading', () => {
    it('should show spinner', () => {
      const { container } = renderSearchForm();

      expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
    });
  });

  describe('when search type is titles', () => {
    it('should show field to search select', () => {
      const { getByTestId } = renderSearchForm({ searchType: searchTypes.TITLES });

      expect(getByTestId('field-to-search-select'));
    });

    describe('when change search select value', () => {
      it('should handle onSearchFieldChange action', () => {
        const mockOnSearchFieldChange = jest.fn();
        const { getByTestId } = renderSearchForm({
          searchType: searchTypes.TITLES,
          onSearchFieldChange: mockOnSearchFieldChange,
        });

        fireEvent.change(getByTestId('field-to-search-select'), {
          target: { value: searchableIndexes.ISNX, },
        });

        expect(mockOnSearchFieldChange).toHaveBeenCalled();
      });
    });
  });

  describe('when search by tags enabled', () => {
    it('should have search field disabled', () => {
      const { getByTestId } = renderSearchForm({
        searchByTagsEnabled: true,
      });

      expect(getByTestId('search-submit').disabled).toBeTruthy();
    });

    it('should only display tags already added to records in the tag options', () => {
      const { getByText, queryByText } = renderSearchForm({
        searchByTagsEnabled: true,
      });

      expect(getByText('already-added-tag-to-record')).toBeDefined();
      expect(queryByText('tag-not-added-to-any-record')).not.toBeInTheDocument();
    });

    describe('when no tags are provided', () => {
      it('should display an empty message instead of options', () => {
        const { getByText } = renderSearchForm({
          searchByTagsEnabled: true,
          tagsModelOfAlreadyAddedTags: {
            resolver: {
              state: {
                tags: {
                  records: [{
                    attributes: {
                      totalRecords: 0,
                    },
                  }],
                },
              },
            },
            isLoading: false,
          },
        });

        expect(getByText('stripes-components.multiSelection.defaultEmptyMessage')).toBeDefined();
      });
    });
  });

  describe('when search field filled with value', () => {
    it('should handle onSearchChange action', () => {
      const mockOnSearchChange = jest.fn();
      const { getByPlaceholderText } = renderSearchForm({
        onSearchChange: mockOnSearchChange,
        searchType: searchTypes.PACKAGES,
      });

      fireEvent.change(getByPlaceholderText('ui-eholdings.search.searchType.packages'), {
        target: { value: 'package' },
      });

      expect(mockOnSearchChange).toHaveBeenCalled();
    });

    describe('when click on submit', () => {
      it('should handle onSearch action', () => {
        const mockOnSearch = jest.fn();
        const { getByText } = renderSearchForm({
          onSearch: mockOnSearch,
          searchType: searchTypes.PACKAGES,
          searchString: 'package',
        });

        fireEvent.click(getByText('ui-eholdings.label.search'));

        expect(mockOnSearch).toHaveBeenCalled();
      });
    });
  });
});
