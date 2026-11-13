import { render } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { SearchModifiers } from './search-modifiers';
import {
  DEFAULT_SEARCH_MODE,
  packageSearchableIndexes,
  packageSearchModes,
  searchTypes,
  titleSearchableIndexes,
  titleSearchModes,
} from '../../constants';

const mockOnFieldChange = jest.fn();
const mockOnModeChange = jest.fn();

const renderSelects = (props = {}) => render(
  <SearchModifiers
    searchType={searchTypes.TITLES}
    onFieldChange={mockOnFieldChange}
    onModeChange={mockOnModeChange}
    {...props}
  />
);

const optionValues = select => Array.from(select.options).map(option => option.value);

describe('SearchModifiers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each([
    [searchTypes.TITLES, titleSearchableIndexes, titleSearchModes, titleSearchableIndexes.TITLE, 'ui-eholdings.label.isxn'],
    [searchTypes.PACKAGES, packageSearchableIndexes, packageSearchModes, packageSearchableIndexes.NAME, 'ui-eholdings.label.packageIndex.keyword'],
  ])('when search type is %s', (searchType, fields, modes, defaultField, sampleFieldLabel) => {
    it('should render the fields and modes for the resource', () => {
      const { getByTestId } = renderSelects({ searchType });

      expect(optionValues(getByTestId('field-to-search-select'))).toEqual(Object.values(fields));
      expect(optionValues(getByTestId('search-mode-select'))).toEqual(Object.values(modes));
    });

    it('should label field options for the resource', () => {
      const { getByRole } = renderSelects({ searchType });

      expect(getByRole('option', { name: sampleFieldLabel })).toBeInTheDocument();
    });

    it('should select the defaults when no values are given', () => {
      const { getByTestId } = renderSelects({ searchType });

      expect(getByTestId('field-to-search-select').value).toBe(defaultField);
      expect(getByTestId('search-mode-select').value).toBe(DEFAULT_SEARCH_MODE);
    });

    it('should select the given field and mode', () => {
      const { getByTestId } = renderSelects({
        searchType,
        searchField: Object.values(fields)[1],
        searchMode: modes.EXACT_MATCH,
      });

      expect(getByTestId('field-to-search-select').value).toBe(Object.values(fields)[1]);
      expect(getByTestId('search-mode-select').value).toBe(modes.EXACT_MATCH);
    });

    it('should call change handlers', async () => {
      const { getByTestId } = renderSelects({ searchType });

      await userEvent.selectOptions(getByTestId('field-to-search-select'), Object.values(fields)[1]);
      await userEvent.selectOptions(getByTestId('search-mode-select'), modes.EXACT_MATCH);

      expect(mockOnFieldChange).toHaveBeenCalled();
      expect(mockOnModeChange).toHaveBeenCalled();
    });
  });

  describe('when search type is packages', () => {
    it('should provide package name and keyword options', () => {
      const { getByTestId, getByRole } = renderSelects({ searchType: searchTypes.PACKAGES });

      expect(optionValues(getByTestId('field-to-search-select'))).toEqual(['name', 'keyword']);
      expect(getByRole('option', { name: 'ui-eholdings.label.packageIndex.name' })).toBeInTheDocument();
      expect(getByRole('option', { name: 'ui-eholdings.label.packageIndex.keyword' })).toBeInTheDocument();
    });
  });

  describe('when the search mode is hidden', () => {
    it('should render the field selector without the mode selector', () => {
      const { getByTestId, queryByTestId } = renderSelects({
        hideSearchMode: true,
        searchType: searchTypes.TITLES,
      });

      expect(getByTestId('field-to-search-select')).toBeInTheDocument();
      expect(queryByTestId('search-mode-select')).not.toBeInTheDocument();
    });
  });

  describe('when search type has no field or mode options', () => {
    it('should render nothing', () => {
      const { queryByTestId } = renderSelects({ searchType: searchTypes.PROVIDERS });

      expect(queryByTestId('field-to-search-select')).not.toBeInTheDocument();
      expect(queryByTestId('search-mode-select')).not.toBeInTheDocument();
    });
  });
});
