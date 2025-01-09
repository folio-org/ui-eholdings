import { render } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { SearchSection } from './search-section';
import {
  searchableIndexes,
  searchTypes,
} from '../../constants';

const mockOnFilter = jest.fn();

const queryProp = {
  searchfield: 'title',
  count: 100,
  page: 1,
  filter: {
    'access-type': undefined,
    selected: undefined,
    tags: undefined,
    type: undefined,
  },
};

const accessTypes = {
  isLoading: false,
  items: {
    data: [],
    meta: {
      totalResults: 0
    },
    jsonapi: {
      version: '1.0',
    },
  },
  errors: [],
  isDeleted: false
};

const tagsModelOfAlreadyAddedTags = {
  isLoading: false,
};

const renderSearchSection = (props = {}) => render(
  <SearchSection
    searchType={searchTypes.TITLES}
    queryProp={queryProp}
    tagsModelOfAlreadyAddedTags={tagsModelOfAlreadyAddedTags}
    accessTypes={accessTypes}
    onFilter={mockOnFilter}
    {...props}
  />
);

describe('SearchSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render search box', () => {
    const { getByRole } = renderSearchSection();

    expect(getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' })).toBeInTheDocument();
  });

  describe('when search option changes', () => {
    it('should not fetch data', () => {
      const { getByRole } = renderSearchSection();

      userEvent.selectOptions(getByRole('combobox'), searchableIndexes.ISNX);

      expect(mockOnFilter).not.toHaveBeenCalled();
    });
  });

  describe('when search query changes', () => {
    it('should not fetch data', () => {
      const { getByRole } = renderSearchSection();

      userEvent.type(getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' }), 'Test query');

      expect(mockOnFilter).not.toHaveBeenCalled();
    });
  });

  describe('when search is submitted', () => {
    it('should fetch data', async () => {
      const { getByRole } = renderSearchSection();

      const searchBox = getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' });

      await userEvent.type(searchBox, 'Title name{enter}');

      expect(mockOnFilter).toHaveBeenCalledWith(expect.objectContaining({ q: 'Title name' }));
    });
  });

  describe('when hitting clear icon', () => {
    it('should clear search box', async () => {
      const { getByRole } = renderSearchSection();

      const searchBox = getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' });

      await userEvent.type(searchBox, 'Title name');
      await userEvent.click(getByRole('button', { name: 'stripes-components.clearThisField' }));

      expect(searchBox.value).toBe('');
    });
  });

  describe('when search by tags filter is enabled', () => {
    it('should disable search box', async () => {
      const { getByText, getByRole } = renderSearchSection();

      expect(getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' })).toBeEnabled();

      await userEvent.click(getByText('ui-eholdings.search.searchByTagsOnly'));

      expect(getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' })).toBeDisabled();
    });
  });
});
