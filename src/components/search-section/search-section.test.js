import { act } from 'react';

import { render } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { SearchSection } from './search-section';
import {
  DEFAULT_SEARCH_MODE,
  packageSearchableIndexes,
  packageSearchModes,
  searchTypes,
  titleSearchableIndexes,
  titleSearchModes,
} from '../../constants';

const mockOnFilter = jest.fn();
const mockRenderFilters = jest.fn().mockReturnValue(<>Filters</>);

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
    renderFilters={mockRenderFilters}
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
    it('should not fetch data', async () => {
      const { getByTestId } = renderSearchSection();

      await userEvent.selectOptions(getByTestId('field-to-search-select'), titleSearchableIndexes.ISNX);

      expect(mockOnFilter).not.toHaveBeenCalled();
    });
  });

  describe('when search mode changes', () => {
    it('should not fetch data', async () => {
      const { getByTestId } = renderSearchSection();

      await userEvent.selectOptions(getByTestId('search-mode-select'), titleSearchModes.EXACT_MATCH);

      expect(mockOnFilter).not.toHaveBeenCalled();
    });

    it('should be included when search is submitted', async () => {
      const { getByRole, getByTestId } = renderSearchSection();

      await userEvent.selectOptions(getByTestId('search-mode-select'), titleSearchModes.EXACT_MATCH);
      await act(() => userEvent.type(
        getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' }),
        'Title name{enter}',
      ));

      expect(mockOnFilter).toHaveBeenCalledWith(expect.objectContaining({
        q: 'Title name',
        searchmode: titleSearchModes.EXACT_MATCH,
      }));
    });
  });

  describe('when search type is titles', () => {
    it('should render title fields and modes', () => {
      const { getByTestId } = renderSearchSection();

      const fields = Array.from(getByTestId('field-to-search-select').options).map(o => o.value);
      const modes = Array.from(getByTestId('search-mode-select').options).map(o => o.value);

      expect(fields).toEqual(Object.values(titleSearchableIndexes));
      expect(modes).toEqual(Object.values(titleSearchModes));
    });

    it('should select the default search mode when none is provided', () => {
      const { getByTestId } = renderSearchSection();

      expect(getByTestId('search-mode-select').value).toBe(DEFAULT_SEARCH_MODE);
    });

    it('should select the search mode from the query', () => {
      const { getByTestId } = renderSearchSection({
        queryProp: { ...queryProp, searchmode: titleSearchModes.BEGINS_WITH },
      });

      expect(getByTestId('search-mode-select').value).toBe(titleSearchModes.BEGINS_WITH);
    });
  });

  describe('when search type is packages', () => {
    const renderPackages = (props = {}) => renderSearchSection({
      searchType: searchTypes.PACKAGES,
      queryProp: { ...queryProp, searchfield: packageSearchableIndexes.NAME },
      ...props,
    });

    it('should render package fields and modes', () => {
      const { getByTestId } = renderPackages();

      const fields = Array.from(getByTestId('field-to-search-select').options).map(o => o.value);
      const modes = Array.from(getByTestId('search-mode-select').options).map(o => o.value);

      expect(fields).toEqual(Object.values(packageSearchableIndexes));
      expect(modes).toEqual(Object.values(packageSearchModes));
    });

    it('should select the default search mode when none is provided', () => {
      const { getByTestId } = renderPackages();

      expect(getByTestId('search-mode-select').value).toBe(DEFAULT_SEARCH_MODE);
    });

    it('should include field and mode when search is submitted', async () => {
      const { getByRole, getByTestId } = renderPackages();

      await userEvent.selectOptions(getByTestId('field-to-search-select'), packageSearchableIndexes.KEYWORD);
      await userEvent.selectOptions(getByTestId('search-mode-select'), packageSearchModes.ANY);
      await act(() => userEvent.type(
        getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' }),
        'Package name{enter}',
      ));

      expect(mockOnFilter).toHaveBeenCalledWith(expect.objectContaining({
        q: 'Package name',
        searchfield: packageSearchableIndexes.KEYWORD,
        searchmode: packageSearchModes.ANY,
      }));
    });
  });

  describe('when search type is providers', () => {
    it('should not render field and mode selects', () => {
      const { queryByTestId } = renderSearchSection({ searchType: searchTypes.PROVIDERS });

      expect(queryByTestId('field-to-search-select')).not.toBeInTheDocument();
      expect(queryByTestId('search-mode-select')).not.toBeInTheDocument();
    });
  });

  describe('when search query changes', () => {
    it('should not fetch data', async () => {
      const { getByRole } = renderSearchSection();

      await userEvent.type(getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' }), 'Test query');

      expect(mockOnFilter).not.toHaveBeenCalled();
    });
  });

  describe('when search is submitted', () => {
    it('should fetch data', async () => {
      const { getByRole } = renderSearchSection();

      const searchBox = getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' });

      await act(() => userEvent.type(searchBox, 'Title name{enter}'));

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

    it('should fetch data with empty query', async () => {
      const { getByRole } = renderSearchSection();

      const searchBox = getByRole('searchbox', { name: 'ui-eholdings.search.enterYourSearch' });

      await userEvent.type(searchBox, 'Title name');
      await userEvent.click(getByRole('button', { name: 'stripes-components.clearThisField' }));

      expect(mockOnFilter).toHaveBeenCalledWith(expect.objectContaining({ q: undefined }));
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

  describe('when "subject" search index is selected', () => {
    it('should be visible', async () => {
      const { getByRole } = renderSearchSection({
        queryProp: {
          ...queryProp,
          searchfield: titleSearchableIndexes.SUBJECT,
        },
      });

      expect(getByRole('option', { name: 'ui-eholdings.label.subject' }).selected).toBeTruthy();
    });
  });
});
